---
author: Vinicius Costa
pubDatetime: 2026-11-11T11:00:00Z
title: "A Microsoft backdoorou um agente editando menos de 10 neurônios, e o controle que sobra é procedência"
slug: lazarus-neuronios-dormentes-backdoor
featured: false
draft: false
tags:
  - inteligencia-artificial
  - seguranca
  - agentes
  - modelos-abertos
description: "A Microsoft mostra que menos de 10 neurônios bastam para backdoorar um agente, sem treino. O controle que sobra é a procedência e a integridade dos pesos."
---

Em 10 de novembro, a Microsoft Research publicou o Lazarus, uma técnica de backdoor para agentes de IA. Segundo a empresa, reprogramar menos de 10 neurônios dormentes de um modelo de linguagem basta para transformar um agente construído sobre ele em um backdoor. Não há treino envolvido. O modelo passa nas avaliações padrão e se comporta normalmente até um gatilho aparecer. O autor da narrativa é Dimitris Papailiopoulos, pesquisador principal da Microsoft. Importa porque um agente com acesso a terminal pode baixar e executar código do atacante sem que nenhum teste de rotina perceba.

O gatilho descrito no post é banal. Quando o relógio passa da meia-noite para 2027, o agente, no meio de uma tarefa comum, emite um comando que baixa e roda o código. Nada no dado de treino está errado. Nada no prompt está errado. O que mudou está nos pesos, no arquivo que alguém baixou e colocou para rodar.

Esse é o deslocamento que me interessa. Quando se fala em envenenamento, pensa-se no dado de treino. Quando se fala em injeção, pensa-se no prompt. O Lazarus não usa nenhum dos dois. Ele edita um artefato pronto, e esse artefato é justamente o que a maioria das equipes trata como commodity: escolhe um modelo num hub, carrega, testa uma tarefa, coloca em produção. A Microsoft diz que o ataque exige apenas acesso de escrita ao checkpoint. Conta comprometida, pipeline comprometido ou storage comprometido bastam. Ou seja, um modelo treinado dentro de casa está exposto da mesma forma que um modelo aberto baixado de fora, se alguém conseguiu escrever no arquivo.

O requisito é baixo. Segundo a fonte, o ataque precisa só de compute de inferência. O post resume isso numa frase que vale copiar: se a sua máquina tem RAM para rodar um modelo, ela tem RAM para fazer backdoor de pesos nele. Aqui está a separação que eu acho útil. "Roda na minha máquina" é um fato sobre execução. "Confio na minha máquina" é uma decisão sobre procedência, e nenhum dos dois vem junto com o arquivo de pesos. Segundo a Microsoft, a própria técnica foi levantada em março de 2026, num experimento em que o Claude Code com Opus 4.5 recebeu a instrução de fazer backdoor de um modelo fixando algumas ativações, sem treino, e fez. O post afirma que a maior parte do achado foi descoberta autônoma do agente.

Como o gatilho fica escondido? Segundo a Microsoft, neurônios que quase nunca disparam acabam funcionando como detectores de gatilho, porque o pré-treino organiza as representações internas de forma previsível. Um classificador linear treinado com cerca de 50 exemplos consegue separar entrada com gatilho de entrada limpa. Um neurônio reprogramado injeta um token: quando dispara, força qualquer token no residual stream. Encadeando neurônios, dá para produzir um payload arbitrário no terminal. São mecanismos descritos em pesquisa, não em ataque observado, e a diferença importa para o que vem depois.

Vale parar no ponto da avaliação. A análise padrão mede comportamento nas entradas que o avaliador escolheu. Um backdoor que só responde a uma data ou a uma string específica fica fora desse recorte por construção. Por isso o modelo "passa" e isso não deveria tranquilizar ninguém. Passar em avaliação mostra que o modelo se comporta bem nos casos testados. Não mostra que ele não tem um caso que ainda não foi testado.

A detecção que a Microsoft considera viável é comparação. Segundo o post, agentes de fronteira conseguem apontar modificação anômala de peso se forem solicitados a olhar. A própria fonte, no entanto, não promete mais do que isso: nenhum scan prova que um modelo é seguro. A detecção confiável exige diff contra os pesos originais, não modificados. E diff exige três coisas: ter os originais, saber de qual publicador vieram e garantir que não mudaram entre o desenvolvedor e o deploy. Sem cadeia de suprimentos não há com o que comparar. Uma auditoria feita só sobre o arquivo atual é uma opinião sobre esse arquivo, não uma verificação de que ele é o que deveria ser.

Dá para ler o problema como procedência, e a Microsoft lê assim também. O Foundry, segundo a empresa, verifica procedência, liga o modelo ao publicador confiável e escaneia o ambiente antes de embarcar modelos de pesos abertos. Em desenvolvimento estão varredura de pesos com agentes de fronteira, red-team de modificações anômalas e assinatura criptográfica com proveniência à prova de adulteração. A direção parece correta. Mas é pesquisa de quem vende o controle, e o leitor deve ler com essa ressalva. As recomendações para hubs, por exemplo, pedem coisas que não dependem de comprar nada específico: mostrar procedência e status de auditoria, comparar com o modelo-base declarado e divulgar o risco de checkpoints de terceiros.

Há também uma linha de limite que o próprio texto precisa manter. "Menos de 10 neurônios" é o número que a Microsoft afirma para o caso que estudou. Não autoriza concluir que qualquer modelo cai com 10 neurônios. A fonte também não publica taxa de sucesso, número de modelos testados nem baseline de comparação, então qualquer tentativa de estimar frequência seria chute. E o caso não é vazamento de configuração nem drift de autorização: um prompt bem protegido e permissões bem desenhadas não corrigem um peso adulterado.

O Lazarus também não é campanha em uso. Segundo o Microsoft Security Blog, a empresa não observou nenhum ator de ameaça transformando essa técnica em arma. Quem lê o post como notícia de ataque em andamento está lendo mais do que a fonte diz. Ele descreve uma técnica de pesquisa e as defesas que a empresa planeja. Isso não diminui o risco. Só muda o tipo de resposta que faz sentido agora.

Sobra então o argumento de permissão. O agente executa com o acesso que você deu a ele. Por isso a pergunta prática não é qual modelo é seguro, já que a própria fonte diz que nenhum scan dá essa garantia. A pergunta útil é o que esse agente consegue fazer se estiver comprometido, sem que ninguém perceba. Limitar acesso, monitorar as ações e revisar antes de executar qualquer ação consequente reduz o dano possível independentemente de o modelo estar limpo — e é a única parte que não depende de um scan que a fonte já disse não existir. As recomendações da Microsoft para empresas seguem essa linha: saber de onde vêm os modelos, limitar permissões, monitorar ações, revisar ação consequente antes de executar e tratar auditoria como evidência, não como garantia.

Se você roda agentes com terminal ou com acesso a dados, o primeiro passo é mapear de onde vem cada peso que está em uso, incluindo os que você mesmo treinou ou converteu. Um peso cuja origem você não consegue mostrar é um peso que você não consegue comparar. O segundo passo é olhar o que o agente pode executar sem aprovação. Lazarus não precisa que o modelo seja inseguro por dentro. Precisa que alguém consiga escrever no arquivo entre o publicador e a sua máquina — e que ninguém compare esse arquivo com o original.

## 📎 Fonte Original

Microsoft Research, "Lazare, veni foras: Reprogramming Dormant Neurons to Backdoor AI Agents", 10/11/2026:
https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/

Paper (autoria citada pela Microsoft: Dimitris Papailiopoulos), PDF:
https://github.com/anadim/anadim.github.io/blob/master/papers/Lazarus.pdf

Guidance do Microsoft Threat Intelligence, "Detecting sleeper agents hiding in AI model neurons":
https://aka.ms/sleeper-agents-AI-neurons

<div class="persona" data-audio="/audio/lazarus-neuronios-dormentes-backdoor-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 36: integridade é do artefato, confiança é da relação — e o primeiro artefato a versionar é o hash do modelo-base. Não é a narração do texto.</small></p>
