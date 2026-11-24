---
title: "O registro do ataque autônomo foi lido do log do invasor, não do alvo"
author: Vinicius Costa
pubDatetime: 2026-11-24T12:45:00Z
slug: cairn-zero-day-log-do-atacante
featured: false
draft: false
tags:
  - ia
  - seguranca
  - agentes
  - engenharia
description: "A Amazon descreveu agentes que acharam um zero-day sozinhos, mas o registro veio do servidor que o invasor deixou aberto. O post separa o que esse log prova do que ele não mede."
---

Em 10 de setembro, a Amazon Threat Intelligence encontrou na internet um servidor rodando Cairn, um framework aberto de teste de invasão autônomo, sem autenticação. O servidor estava com o histórico operacional inteiro à vista: configurações de projeto, os prompts de quem o operava e a saída dos modelos. Foi a partir desse registro que a equipe reconstruiu uma campanha de cerca de 48 horas contra universidades no Leste Asiático fora da China continental, começando em 8 de setembro. Na campanha, agentes encontraram um zero-day e chegaram a root num servidor de aplicação de imagem médica.

A Amazon [publicou o relatório em 20 de novembro](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/). O documento é mais interessante que o resumo dele por um motivo simples: as operações que falharam duraram mais de 16 horas e não entraram em lugar nenhum, e a que funcionou levou cerca de 11 minutos para atravessar uma aplicação. Essa diferença não é de modelo. É de alvo.

## De onde vem o número

O relatório não é feito de telemetria das universidades atacadas. As organizações afetadas não eram clientes da AWS, e a empresa diz que não tinha caminho direto para avisá-las: trabalhou com um parceiro de governo. O que a Amazon analisou foi a instância do Cairn que o operador deixou aberta e sem senha, com o histórico de operações visível para qualquer um. Os prompts estavam em chinês simplificado, e os timestamps dos scripts, configurados para o horário da China.

Isso não invalida o achado; define o que ele é. O registro é do próprio atacante, com as ações que ele executou e na ordem em que executou, e essa é uma forma de evidência bem diferente de um boletim escrito pelo fornecedor do alvo. Ela também marca o limite do que se pode concluir. A atribuição a um ator ligado à China é feita com confiança moderada, com base nos prompts, no fuso e no perfil das universidades. Já a classificação do zero-day é feita com alta confiança, e por um critério que dá para conferir: na data da descoberta não havia correção, issue, aviso nem menção anterior em base de vulnerabilidade para o projeto afetado.

## Cento e quarenta e oito ações, dezesseis horas, nada

O relatório descreve três operações. Convém ler as duas que falharam antes da que deu certo, porque é ali que os números aparecem.

A mais longa mirou um Redis de uma universidade, configurado sem autenticação. Ao longo de cerca de 16 horas e 148 ações sequenciais, os agentes passaram por uma lista longa de técnicas conhecidas para tomar um Redis aberto: abusar da replicação para carregar código não autorizado, escapar do sandbox de script, escrever nos arquivos de configuração, corromper a memória, e ainda tentar injeção de Log4Shell contra outro serviço no mesmo sistema. Nada funcionou. Quando as tentativas falharam, eles mapearam a topologia da rede Docker interna por uma falha de SSRF num Qdrant instalado no mesmo host e passaram a pulverizar credenciais contra PostgreSQL, SSH e outros serviços. Também não entraram. A Amazon registra que essa operação rodou em continuidade, sem pausa, sem sono e sem restrição de jornada.

Uma segunda operação durou mais de 6 horas contra um servidor de GPU da universidade. Os agentes montaram uma lista de cerca de 80 nomes de usuário reais pesquisando a presença pública da instituição: diretórios de faculdade, sites de laboratório, páginas arquivadas e artigos acadêmicos. Com esses nomes, testaram mais de 30.000 combinações de credencial contra o SSH e contra outros sistemas da rede, entre eles um painel de administração, um storage de rede, um servidor de VPN e o portal do campus. Não acharam um login sequer.

O que essas duas operações mostram é onde a autonomia pesa e onde ela não resolve nada. Nenhuma técnica conhecida contra o Redis aberto entrou, e nenhuma das mais de 30.000 combinações achou senha. O agente insistiu por mais de 16 horas porque insistir não custa a ele nada além de tempo de máquina. Do outro lado, o alvo continuou fechado.

## Os onze minutos

O terceiro alvo era outro. Contra uma aplicação open source de imagem médica com IA, os agentes identificaram o framework, mapearam os endpoints da API e encontraram um endpoint de upload com um parâmetro de nome de arquivo. Testaram o parâmetro para path traversal, e ele era vulnerável. Em cerca de 11 minutos, eles foram de mapear a API a escrever arquivos arbitrários no servidor. O zero-day foi achado nessa sequência, e o que os 11 minutos medem é a distância entre entender a API e conseguir gravar arquivo nela, não o tempo total da descoberta.

Numa sessão posterior, usaram a mesma falha para gravar um payload de reverse shell em Python no `sitecustomize.py`, arquivo que o Python importa sozinho quando o interpretador inicia. Em seguida acionaram um endpoint de treino da aplicação para subir um processo Python novo. O processo importou o payload e abriu o shell como root.

A diferença entre essa operação e as anteriores está na forma do alvo. No Redis, cada caminho conhecido tinha uma defesa; no servidor de GPU, o login não cedeu a mais de 30.000 tentativas. Na aplicação, havia um parâmetro que aceitava qualquer nome de arquivo, e nada entre a requisição e o sistema de arquivos conferia o que era. O agente não precisou ser melhor. Precisou de uma porta que abrisse com uma tentativa.

## Onde o humano estava

A manchete fala em pouca intervenção humana, e a frase se sustenta no que está escrito, mas com um recorte. O operador definiu o objetivo, "obtain shell access", e a lista de IPs. Nenhum passo intermediário foi escolhido por ele.

Depois da descoberta, porém, o humano voltou. Foi ele quem forneceu aos agentes um proxy que tunelava para uma segunda rede universitária, e o servidor em que o proxy se apoiou rodava o mesmo software vulnerável. A Amazon infere que o ator já tinha usado o zero-day para comprometer esse servidor e montar o túnel. A partir dali, dirigiu os agentes pela rede nova.

Ou seja: o que está automatizado é achar o caminho dentro de um alvo. Definir o objetivo, escolher a infraestrutura e decidir expandir para outra rede continuou sendo decisão de gente. A parte que virou agente é a que consome tempo de especialista.

## O que sobra para quem defende

A Amazon conclui que o tempo operacional comprime a janela de resposta, e recomenda detecções de alta confiança com resposta automática, com humano acompanhando o resultado em vez de revisar cada ação. A recomendação faz sentido, e o caso permite ir um passo além dela.

Repare no que ficou exposto dos dois lados. O invasor só ficou visível porque uma instância do framework dele respondia sem autenticação. O alvo que cedeu aceitava um nome de arquivo sem validar. Não é o mesmo defeito: um é controle de acesso ausente, o outro é validação de entrada ausente. O que os dois têm em comum é serem superfície que ninguém tinha inventariado, e é por isso que o trabalho que sobra para quem defende se parece mais com levantamento do que com caça.

O inventário que interessa não é o de vulnerabilidades conhecidas. É o de serviços que respondem sem autenticação e o de entradas que chegam ao sistema de arquivos sem validação, cada um com dono e prazo. Esse levantamento vale mesmo que o próximo atacante não use agente, porque o que está aberto não muda com o framework. O que muda é a paciência do lado de fora: 148 ações, mais de 30.000 combinações de credencial e nenhuma pausa para descansar.

<div class="persona" data-audio="/audio/cairn-zero-day-log-do-atacante-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 45: Vicente separa o agente que abre a porta do agente que sabia onde ficava a casa e cobra o log de execução como prova de qualquer relato sobre agente autônomo. Não é a narração do texto.</small></p>
