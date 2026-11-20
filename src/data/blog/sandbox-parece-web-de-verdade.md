---
title: "Para o modelo não perceber o teste, o Chrome forjou certificado e tirou o ataque da URL"
description: "A Google publicou como testa o auto browse numa internet sintética, e o que o sandbox teve de imitar para o modelo não desconfiar do teste."
pubDatetime: 2026-11-20T09:50:00Z
author: Vinicius Costa
slug: sandbox-parece-web-de-verdade
tags: [ia, seguranca, agentes]
featured: false
draft: false
---

Em 19 de novembro, a equipe de segurança do Chrome publicou como testa o auto browse, o modo em que o agente de IA navega sozinho pelas páginas. O texto se chama [Mirror Dimension for Agents: Evaluating Browser-Use Agents Without the Web](https://blog.google/security/mirror-dimension-for-agents/) e descreve um ambiente de avaliação feito de sites sintéticos, com milhares de sites simulados inspirados em jornadas reais e nenhum acesso à web de produção.

A parte que interessa a quem constrói avaliação de agente não é o isolamento. É o que a equipe teve de fazer para o modelo não perceber que estava num teste.

## Isolar a rede resolve metade

O agente roda o Chrome headless dentro de um sandbox gVisor isolado. Nesse ponto o problema clássico está coberto: o agente não alcança a rede de produção. O texto aponta outro problema, e é ele que sustenta a publicação. A fonte chama de "eval awareness": "the model suspects it is being tested and performs actions it might not otherwise".

Isolar a rede impede o vazamento. Não impede a suspeita. Um teste que o modelo reconhece mostra como ele age dentro do teste, e isso não é a mesma coisa que o comportamento fora dele.

A exigência de repetibilidade vem junto. A fonte diz que "side effects from one trajectory must never persist into the next", com cada rodada começando de um estado idêntico. Sem isso, o segundo teste já não mede o mesmo ambiente que o primeiro.

## A URL tinha de ser a real

A primeira ideia foi hospedar os sites falsos num domínio só, algo como `https://fake-sandbox-sites.web.app/evals/www.youtube.com`. Foi descartada, porque endereço estranho entrega o teste de imediato. A solução faz o agente navegar para `https://www.youtube.com`, com a URL real na barra. O sandbox captura a conexão antes de qualquer DNS externo e entrega tudo a um proxy local, que serve a página sintética.

Isso tem um custo, e a Google descreve o custo sem rodeio: "this type of interception is exactly the kind of person-in-the-middle attack that Chrome is specifically engineered to block". Para o navegador aceitar o proxy, o time gera certificados TLS na hora, encadeados a uma autoridade certificadora própria, instalada dentro do Chrome do sandbox. Numa máquina de usuário isso exigiria acesso administrativo. Num sandbox que a Google controla inteiro, a CA entra na inicialização e o Chrome valida os sites falsos como se fossem os reais. Baixar a conexão para HTTP não era opção: o Chrome exibiria o aviso de site não seguro.

## O ataque saiu da URL

A primeira versão da injeção de prompt ia num parâmetro de consulta visível, do tipo `...watch?v=dQw4w9WgXcQ&prompt_inject_payload=abcd1234`. Não durou. A fonte registra que "frontier models are far too perceptive for this", com casos de agente desconfiando do teste só por notar um parâmetro que não combinava com o site.

A solução foi mandar o identificador do payload em cabeçalho HTTP, como `X-Sandbox-Injection-Key`. O servidor do sandbox filtra o header, serve a versão alterada da página, e a URL que o agente vê continua limpa.

O disfarce não para no endereço. O payload pode entrar como texto, como imagem, como rótulo ARIA falso ou como resposta alterada de uma ferramenta WebMCP. As páginas também precisam ser interativas e manter estado, porque site estático entrega o teste: a fonte fala em "hundreds of interactive, stateful web pages". Para produzir isso em escala, o time montou um harness de sub-agentes. Um pesquisa o fluxo e escreve a especificação, outro constrói o HTML, CSS e JavaScript, e um terceiro critica o resultado contra padrões de web de produção, usando o Chrome DevTools MCP para ver a tela e clicar de verdade. Os críticos reclamam, o construtor corrige, e há um momento na demonstração em que a correção cria um problema novo, o que mostra a prioridade do time: fidelidade antes de velocidade de entrega.

Cada camada escondida tira uma pista que o modelo poderia usar. O custo de manter a ilusão cresce junto com a capacidade do modelo de reparar no detalhe.

## Nenhum número do post mede eficácia

Um engenheiro de segurança escreve e testa algumas dezenas de ataques realistas por dia. O pipeline automatizado de red-teaming pega as ideias dos melhores engenheiros e as refina em muitos sites, chegando a "more than 1,000 tests candidates every day per security engineer", mais de 30 vezes o que uma pessoa faria à mão, ou mais de um mês de teste manual por dia.

Isso mede quantos ataques o pipeline gera e refina. O texto não publica taxa de injeções bloqueadas, não informa quantas tarefas o auto browse concluiu e não compara modelos. Chama o sandbox de "critical tool" sem apresentar resultado de eficácia. Ler "mil ataques por dia" como "o agente resiste" é ler o que não está lá.

## O que sobra para quem avalia

Primeiro: teste que o modelo reconhece não mede o comportamento em produção, mede o comportamento no teste. Se o ambiente é identificável, a métrica carrega um viés de tamanho desconhecido, e nenhum número de acurácia corrige isso.

Segundo: o disfarce é trabalho de engenharia contínuo, não item de configuração. Hoje ele pede CA própria, proxy, header e páginas que se comportam como as reais. A fonte diz que a equipe quer "expanding our internal security testing infrastructure as agents gain richer capabilities". Cada capacidade nova do agente pede mais teste, e cada teste novo pede que o disfarce continue de pé.

Terceiro: o escopo é estreito. A publicação trata de agentes de navegador com um conjunto fechado de ferramentas. A extensão para agentes de código aparece como crença declarada, não como resultado.

A pergunta prática para a próxima avaliação de agente que aparecer com taxa de sucesso: o time mediu se o ambiente era indistinguível do real, e publicou o que mediu? Sem as duas respostas, a taxa não viaja para fora do laboratório.

<div class="persona" data-audio="/audio/sandbox-parece-web-de-verdade-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Nadine</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 28: O comentário cobra a taxa de resistência que a publicação não traz e aponta a vaidade de pipeline. Não é a narração do texto.</small></p>
