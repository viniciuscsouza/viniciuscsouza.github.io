---
title: "O ganho do DaisyRose-27B é medido em duas versões do Terminal-Bench"
description: "O salto de 5,6% para 12,0% no Terminal-Bench junta duas versões da prova; o ganho que a RadixArk mediu de fato está na infraestrutura de treino."
pubDatetime: 2026-11-18T20:30:00Z
author: Vinicius Costa
tags: [ia, engenharia, treino]
---

Hoje a RadixArk publicou o DaisyRose-27B, o primeiro modelo da empresa. Ele parte do Qwen3.8-27B e foi treinado só com aprendizado por reforço, sem supervised fine-tuning nem destilação. Os pesos saem sob Apache 2.0 em BF16, FP8 e NVFP4, com arquitetura e contexto de 256K do base preservados, o que o torna um substituto direto do original. O modelo tem 27,8B de parâmetros totais, e os ativos são os mesmos, porque se trata de um modelo denso e não de um MoE. A versão em BF16 ocupa cerca de 52 GB, a FP8 cerca de 29 GB e a NVFP4 cerca de 23 GB. Segundo o [blog do lançamento](https://huggingface.co/blog/RadixArk/daisyrose-27b-pushing-the-frontier-of-post-trainin), o treino leva o Terminal-Bench 4.1 pass@1 de 5,6% para 12,0%. É esse número que abre o release, e ele não fecha como comparação.

O motivo está na nota de fontes do [cartão do modelo](https://huggingface.co/RadixArk/DaisyRose-27B). Ali se explica que os modelos sem entrada no Terminal-Bench 4.1 aparecem com notas do 4.0, e o 5,6% do Qwen3.8-27B é uma dessas notas, atribuída à Artificial Analysis. Ou seja: o 12,0% é do 4.1 e o 5,6% é do 4.0. A diferença de 6,4 pontos, pelas contas com os dois números publicados, não foi medida na mesma prova. O release não faz essa ressalva. Quem a faz é o cartão, e quem lê só o blog não a encontra.

## A tabela contra a leitura fácil

No mesmo Terminal-Bench 4.1, três modelos ficam à frente do DaisyRose: MiMo V2.6 Flash com 16,1, GPT-6 Luna com 15,2 e Inkling 2 Small com 13,0. MiMo tem 309B de parâmetros totais e Inkling 2 Small tem 594B, contra 27,8B do DaisyRose. Esse contraste é o melhor argumento a favor do release, e o blog não o usa. O DaisyRose fica em quarto, a 4,1 pontos do primeiro, com um modelo de tamanho bem menor. A única comparação com um modelo de fronteira que aparece no texto é com o GPT-6 Luna, que está na própria tabela, com 15,2 no 4.1 e 66,6 no DeepSWE v1.1, contra 46,2 do DaisyRose nesse último. O release não traz outras comparações desse tipo.

Nos outros benchmarks a história muda. Em DeepSWE v1.1 ele faz 46,2, contra 72,1 do Inkling 2 Small e 67,9 do MiMo. Em SWE Bench Pro v2 faz 94,7, contra 97,7 do Inkling. O único benchmark em que lidera a tabela é o IFBench, com 82,4. Frente ao próprio base, os ganhos nos demais benchmarks da tabela ficam entre 0,4 e 4,0 pontos. A exceção é justamente o Terminal-Bench 4.1, cuja diferença sai de duas versões da prova.

A tabela também mistura harness. O DaisyRose foi medido num harness interno, o mini-swe-agent com summarization ativada, com média de 8 repetições por tarefa. O GPT-6 Luna aparece com Codex e "max effort", vindo da leaderboard. MiMo, Inkling e Beam vêm da leaderboard oficial. Os demais são números que os próprios desenvolvedores reportaram. Cada nota do DaisyRose, por fim, é a maior entre as execuções em BF16 e FP8. O release diz que as duas diferem em menos de um ponto onde ambas foram medidas, mas escolher a maior é decisão do fornecedor.

Nenhuma dessas diferenças invalida a nota de 12,0%. Elas limitam o que a comparação consegue sustentar. Um harness com summarization ativada pode render de forma diferente de um harness que não a usa, e um número de versão anterior não diz nada sobre a versão nova. Por isso a tabela, lida com cuidado, serve para situar o DaisyRose entre modelos de tamanhos diferentes, e não para ranquear com precisão.

## A eficiência medida é do backend

O que a RadixArk de fato mediu, e o que há de novo no release, está em outro lugar. O backend assíncrono usou 128 H200 para rodar o agente e 16 para treinar. Em MFU, a fração do pico de computação efetivamente usada, chegou a 37%. O treinador aberto, baseado em Megatron, ficou em 16%. A fonte diz que isso vale "on comparable runs", mas não define o que são essas execuções comparáveis, e o treinador aberto foi rodado pela própria RadixArk. Não existe medição independente de MFU nem de custo. Com esses números, o release afirma que o mesmo treino precisa de "57% less GPU time".

Ponta a ponta, nas mesmas 144 H200, o sistema processa cerca de 16.800 tokens por segundo contra 8.300 no comparativo da mesma fonte. No Qwen3.6-35B-A3B, o MFU vai de 2,6% para 16,1%, uma razão de 6,2 vezes. No GLM-5.3-Flash, de cerca de 300B de parâmetros, vai de menos de 1% para 11,7%, mais de 10 vezes. São números de infraestrutura. Eles dizem quanto o backend rende, e não provam que o modelo ficou melhor por causa disso.

## O sandbox é o ativo

O ativo que o release não põe no título é o ambiente. Entre meados de setembro e meados de novembro, o serviço de sandbox criou cerca de 944 mil sandboxes, com pico de 1.566 simultâneos. Ele cresceu de uma máquina para até 12, com dez upgrades, quase todos feitos com o treino rodando. Segundo o release, 99% das criações deram certo nas nove semanas, e desde o fim de outubro o índice passa de 99,95%. A empresa diz que o custo fica cerca de 80% abaixo do de provedores populares de sandbox na nuvem, e a economia vem de dar a cada sandbox memória que cresce e encolhe com o uso real. Entre as correções que precisou fazer para crescer, o release cita impedir que a máquina congele quando a memória acaba. Não há número de adoção do serviço nem custo em dólar do treino, então o 80% é uma comparação relativa, sem valor absoluto que se possa conferir.

## A receita de dados

O treino usou cerca de 1.200 tarefas em 18 dias, em 144 H200, somando cerca de 63 mil GPU-horas, com sessões de até 1M de tokens. As tarefas foram escolhidas em parceria com a Eigent AI a partir de milhares de candidatas. Segundo o release, cada uma foi desenhada contra um erro do próprio Qwen3.8-27B: a equipe rodou o base em cada tarefa e a redesenhou. Depois ajustou a dificuldade até a taxa de solução cair numa faixa de aprendizado útil. Cada tentativa tem até 1,5 hora no sandbox, mais de 100 chamadas de ferramenta e mais de 256 mil tokens de saída. Tarefas que podiam ser passadas sem resolver o problema foram corrigidas ou removidas. O blog diz que não há espaço para reward hacking, e a revisão das tarefas é o mecanismo que ele descreve para isso.

## O que muda para quem avalia

Quem lê um benchmark de agente precisa pedir três coisas junto da nota: a versão da prova, o harness com o número de repetições e a taxa de criação e conclusão do ambiente. O DaisyRose entrega números concretos na terceira, e é nela que está o ganho que se pode afirmar com segurança. Um treino de agente depende do ambiente que o sustenta — e o ambiente, até agora, era a parte que nenhum release publicava.

<div class="persona" data-audio="/audio/daisyrose-27b-duas-versoes-do-benchmark-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Bruna">
    <img src="/personas/bruna.webp" alt="Retrato de Bruna, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Bruna</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 22: Bruna comenta o release do DaisyRose-27B e por que ela pediria a planilha de tarefas antes da nota do benchmark. Não é a narração do texto.</small></p>
