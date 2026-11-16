---
title: "O agente é evidência, não programa: o kit que a CVS abriu no anúncio da OpenAI"
description: "Para a CVS, o agente descobre o caminho uma vez e o código repete; no anúncio da OpenAI, o número de destaque mede a fase que não se repete."
pubDatetime: 2026-11-16T15:00:00Z
author: Vinicius Costa
tags: [ia, agentes, saúde, benchmark]
---

Na segunda-feira, 16 de novembro, a OpenAI publicou um anúncio sobre computer use para equipes de saúde. O agente clica, digita e troca de aplicativo entre o prontuário eletrônico e o portal da operadora, e o produto entra hoje na API e no ChatGPT for Healthcare. No mesmo texto, a CVS Health aparece como cliente, com dois fluxos descritos como de produção e com um kit de código aberto. O número que o anúncio usa e o que a CVS publicou ao lado dele falam de fases diferentes do mesmo agente.

O número que o anúncio usa é 94,3%. Segundo o texto, o GPT-6 Astra obteve 94,3% dos pontos de rubrica disponíveis no HealthAdminBench, um benchmark que o anúncio apresenta como independente e feito por pesquisadores de Stanford. Ele mede fluxos administrativos como autorização prévia, recursos e negativas de cobertura e processamento de pedidos de equipamentos médicos. O Luna fica em 91,8% e custa 98% menos, a 8,5 centavos por tarefa. Pela conta com o número do anúncio, o Astra sairia perto de US$ 4,25 por tarefa. Os dois foram avaliados com esforço de raciocínio máximo.

Um ponto de rubrica é crédito parcial: uma tarefa dividida em subtarefas rende crédito por subtarefa cumprida, mesmo quando o agente não chega ao fim. É uma medida do trabalho executado, e o benchmark trata o desfecho como um número separado. O pré-registro do scoring diz qual dos dois é a manchete — e é aí que o anúncio escolhe.

O HealthAdminBench tem 1.698 pontos de avaliação, sendo 1.177 verificados por regras determinísticas e 521 por um juiz baseado em LLM, segundo o README do repositório. O documento de pré-registro fixa o número principal como a conclusão ponta a ponta, e diz que a análise de sensibilidade com outras rubricas é "not a search for the most favorable rubric". No paper de abril (arXiv 2604.09937), o melhor agente, Claude Opus 4.6 CUA, conclui 36,3% das tarefas. A melhor taxa de subtarefa, 82,8%, é do GPT-5.4 CUA. O paper avalia sete configurações de agente, e Astra e Luna não estão entre elas, nem aparecem no leaderboard público. Não estou sugerindo que o Astra faria 36,3%. O que se pode dizer é que o benchmark não tem um número público de conclusão ponta a ponta para o modelo que o anúncio exibe.

O anúncio também informa que 325 tarefas de caixa de entrada de EHR foram avaliadas como seguras em 99% dos casos, com revisores examinando as ações do modelo ao lado das notas, pedidos e mensagens que ele produziu, e a segurança clínica julgada por "whether inaccuracies, omissions, or actions in the model's work could plausibly lead to patient harm". Num conjunto separado, médicos deram nota de utilidade em 646 avaliações e escolheram "very helpful" ou "extremely helpful" em 93%. Pela conta com esse número, 1% de 325 é pouco mais de três tarefas. É um dado útil, mas a revisão cobriu um tipo de tarefa, e o texto não detalha o restante.

O que a cobertura do anúncio não abriu foi o kit. O repositório é cvs-health/cua-agent-kit, sob Apache-2.0, e o anúncio diz que a CVS está abrindo o código, "built with OpenAI's Agents SDK". O repositório é um starter kit criado em 30 de outubro, com último push em 12 de novembro. O README resume o método numa frase: "It uses AI to discover the steps, then code to repeat them."

O fluxo começa com um agente de computer use seguindo um workflow escrito em linguagem natural. Ele grava screenshots, ações, alvos e traces. Depois de execuções bem-sucedidas, uma skill do Codex usa essa evidência para montar ou atualizar um fluxo determinístico que roda sem LLM. Quando o fluxo quebra, o Codex lê os traces de produção para diagnosticar o problema e atualizar o código, com revisão, testes e verificação de engenheiro.

A skill que faz essa conversão se chama codify-playwright-workflow, e a primeira regra dela contradiz a leitura mais comum do anúncio: "Treat successful discovery runs as evidence, not as executable specifications." A segunda regra trata da verificação. Só entram execuções que chegaram ao estado terminal pedido no prompt, e o sucesso deve ser checado pela screenshot final, pela URL, por uma asserção gravada ou por outra evidência observável. A frase que fecha essa regra é "do not trust a success message alone". A terceira manda parar quando a evidência não fixa um alvo ou um resultado estável: pede-se outra execução de descoberta e proíbe-se inventar seletores. O contrato dos artefatos ainda exige que cada execução registre o prompt_sha256 e a terminal_assertion.

O mesmo repositório lista quatro caminhos: Browser, que roda código Playwright; Native Windows, com pywinauto; AI-driven, em que "an agent observing screenshots and choosing actions" decide cada passo; e Hybrid, com passos determinísticos e passos assistidos por modelo. Sobre o AI-driven, o texto é direto: "This uses model calls each run, with their associated cost and variability." O kit não trata o modelo como erro. Ele trata o modelo como custo que só se justifica na descoberta.

Aqui está o que o anúncio não diz. Se o runtime é código, a conta do benchmark deixa de ser a conta da operação. Num agente ao vivo, cada execução é uma nova chance de errar e a taxa de conclusão se aplica a toda rodada. Num fluxo gerado por descoberta, o modelo roda uma vez, na descoberta, e o que se repete é código — então o número que decide passa a ser quantas tentativas de descoberta são necessárias até uma virar código confiável, e quem confere essa descoberta antes de aceitá-la. O README admite a separação quando diz que descobrir e repetir são "different problems".

A consequência é que o controle deixa de ser a taxa do modelo e passa a ser a verificação da descoberta. Um gate que lê apenas a mensagem de sucesso do agente herda o erro do agente; a skill escreve esse gate como regra de uso, e ele me parece mais importante que o Playwright, porque exige uma prova observável antes de aceitar o que o modelo reportou. A pergunta de engenharia deixa de ser "o agente acerta?" e passa a ser "quem verifica a descoberta antes de ela virar rotina, e com que evidência?".

Há duas coisas que o anúncio não diz, e a leitura depende delas. A primeira é a proporção. O texto descreve um fluxo que limpou um backlog de meses em um fim de semana e outro que cuida das etapas de sistema de "tens of thousands of consults each day". Não diz quanto desse volume roda como código gerado a partir de descoberta e quanto roda com o agente ao vivo. O kit descreve os dois modos, mas a proporção não aparece em lugar nenhum. Esses números são descrições do anúncio, não medições independentes, e não há como conferi-los com o que foi publicado. A segunda é quem rodou a avaliação do Astra. O anúncio chama o HealthAdminBench de independente, mas não diz quem executou o modelo da OpenAI no benchmark. O paper de abril não cobre o Astra. Sem essa informação, o 94,3% chega sem a indicação de quem o produziu.

Para quem decide sobre um fluxo desses em saúde, a consequência prática é mudar as perguntas de compra. Pedir a taxa de conclusão ponta a ponta, e não a de rubrica. Perguntar quantos fluxos rodam como código e quantos rodam como agente, e em que proporção. Pedir a regra de verificação escrita, com o estado terminal que conta como sucesso e a evidência que o comprova. E perguntar quem revisa o código que a descoberta gera quando o fluxo quebra. O kit da CVS mostra que essas perguntas têm respostas concretas, ao menos num starter kit. O anúncio responde a algumas delas com frases gerais, como "validation checks and human oversight", e deixa o resto de fora.

<div class="persona" data-audio="/audio/agente-evidencia-nao-programa-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Nadine</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 34: Nadine cobra o contrato de artefatos que o clone do kit deixa de fora e fecha no que falta medir. Não é a narração do texto.</small></p>
