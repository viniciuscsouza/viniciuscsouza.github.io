---
title: "Mesmo modelo, dois arneses: 12,8% e 39,0% no SWE-sweep do Neon"
author: "Vinicius Costa"
pubDatetime: 2026-11-18T22:40:00Z
tags:
  - inteligencia-artificial
  - agentes
  - modelos
  - google
description: "No SWE-sweep, o Neon marca 12,8% no arnês aberto mini-SWE e 39,0% dentro do Antigravity. Mesma prova, mesmo modelo: o número que o comprador leva é o menor."
draft: false
---

A Google lançou hoje o [Gemini 4 Neon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/), quarto modelo da família Gemini 4 em quatro semanas pela contagem do [The Decoder](https://the-decoder.com/google-ships-gemini-4-neon-its-fourth-new-gemini-model-in-a-month/). Custa US$ 3 por milhão de tokens de entrada e US$ 15 por milhão de saída, tem contexto de 1 milhão de tokens e chega ao app do Gemini, à API, ao AI Studio e ao Antigravity para assinantes pagos. O anúncio traz uma tabela longa de benchmarks, e um deles, o SWE-sweep, aparece medido duas vezes, em arneses diferentes, com notas que diferem por um fator de três.

Entre as duas notas não muda o modelo. Muda o arnês que roda a prova.

## A frase que separa as duas notas

O texto do anúncio diz, sobre o SWE-sweep, que o Neon "leads on the mini-SWE harness (12.8%) and more than triples to a state-of-the-art 39.0% in Google Antigravity showing what the Antigravity harness unlocks". Doze vírgula oito por cento num arnês, trinta e nove no outro, com a diferença atribuída pelo próprio fornecedor ao arnês.

Os dois arneses não são a mesma coisa. O [mini-SWE](https://github.com/SWE-agent/mini-swe-agent) é um projeto aberto, sob licença MIT, mantido pelo time que construiu o SWE-bench: cerca de 100 linhas de Python e uma ferramenta só, o bash. O Antigravity é o ambiente da Google onde o Neon é vendido, para assinantes pagos de AI Pro e Ultra.

Trinta e nove dividido por doze vírgula oito dá 3,05, então "mais que triplica" descreve com precisão o que foi medido. O que a tabela deixa em aberto é o que exatamente triplicou.

## O índice de agente mede o agente

O número de destaque do lançamento é o primeiro lugar no [Artificial Analysis Coding Agent Index](https://artificialanalysis.ai/agents/coding-agents), com 58,6. O nome do índice já diz o que ele soma. A página do AA explica que o índice é a média simples de três provas, FrontierCode-AA 2.0, Terminal-Bench 4.1 e SWE-Atlas-QnA-AA, e avisa que os resultados refletem "specific evaluated agent variants, not just generic product names", porque escolha de modelo, configuração e ambiente de execução mudam o resultado de forma material.

Primeiro lugar num índice de agente é uma nota do agente, não do modelo. Para transformar isso em "o modelo X é melhor que o modelo Y", é preciso antes mostrar que os dois foram avaliados no mesmo arranjo. O anúncio não faz essa comparação; ele lista o primeiro lugar e segue.

## O mesmo modelo por baixo

O [cartão do modelo](https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-4-Neon-Model-Card.pdf) responde parte da pergunta. Logo na primeira seção: "Gemini 4 Neon is adapted from Gemini 4 Carbon". Arquitetura, conjunto de treino, processamento de dados, hardware e software do Neon são todos descritos por remissão ao cartão do Carbon.

O cartão garante que o modelo base é o mesmo. Quanto do salto de 12,8 para 39,0 vem do arnês e quanto vem do pós-treino em cima do Carbon, o anúncio não decompõe: ele credita a diferença ao arnês, com a frase "showing what the Antigravity harness unlocks", e para aí. É a peça que falta para saber se o Neon é o Carbon com outro ambiente em volta ou o Carbon com capacidade nova em algum recorte.

O cartão também informa que o cutoff de conhecimento é março de 2026 e que o relatório completo de segurança sai "in the coming days". O anúncio adianta taxas internas: 1,98% de recusa no Terminal-Bench 4.0, nenhuma recusa no Terminal-Bench Science, 0,09% de ações desalinhadas e 99,2% de aprovação na avaliação de honestidade. São números da Google sobre a Google, medidos por ela.

## Os outros números não dizem o arnês

Dois benchmarks de código do anúncio, o Terminal-Bench 4.1 com 65,2% e o FrontierCode 2.0 com 46,2% no nível high padrão, não têm arnês declarado na página. O SWE-sweep, único com arnês nomeado, é justamente o que aparece duas vezes, e a distância entre as duas aparições é a maior da tabela.

Nenhum dos números fica inválido por isso. Muda o que se pode fazer com eles. Um 65,2% sem arnês declarado serve para acompanhar a evolução do próprio modelo entre versões. Para comparar com outro fornecedor, falta a peça que o anúncio deu só no SWE-sweep.

## Preço e acesso: o que o comprador recebe

A tabela de preço é clara, e a comparação não é. O Neon custa US$ 3 por milhão de entrada e US$ 15 por milhão de saída, com US$ 0,15 por milhão em entrada cacheada, o dobro do Hydrogen por token, [segundo o 9to5Google](https://9to5google.com/2026/11/18/gemini-4-neon-announcement/). Carbon e Argon estão em US$ 2 e US$ 10 até 30 de novembro e passam a US$ 4 e US$ 20 em 1º de dezembro, pela mesma reportagem. Hoje, portanto, o Neon custa 50% mais por token que o Carbon. A partir de dezembro, custa 25% menos. A conta que vale para o mês que vem não é a que vale para esta semana.

O anúncio afirma que o Neon tem "32% lower cost per task than Carbon" no nível high. Custo por tarefa é uma métrica do gráfico do próprio anúncio, na escala do Artificial Analysis, e depende de quantos tokens cada tarefa consome no arranjo avaliado. É uma economia plausível. Não é uma economia que o comprador confere sozinho antes de assinar.

A [documentação](https://aistudio.google.com/docs/models/gemini-4-neon) informa contexto de 1.048.576 tokens, unificado entre entrada e saída, com 65.536 tokens de saída por padrão e até 1 milhão com long decode. A mesma página diz que cache explícito não é suportado, o que pesa para quem desenhou fluxo em cima de cache manual.

A metade de segurança do lançamento é de outra variante. Os melhores números do texto, 90,5% no SEC-bench Pro e 51,26% no WebExploitBench, são do "Gemini 4 Neon for cyber", que o anúncio distribui "to trusted defenders in the coming days as part of the Fairwind Program" e manda pedir acesso ao time de conta do Cloud. Os números que chegam a quem não está no programa são os do modelo geral.

## O que eu faria na segunda

Pediria dois dados antes de rodar qualquer coisa: a configuração do arnês e a taxa de sucesso da mesma tarefa no fluxo da casa. Para o Neon, isso quer dizer tratar 12,8% como a nota do modelo em arnês aberto e 39,0% como a nota do Antigravity, sabendo de quem é o ambiente em cada caso. E refaria a conta de custo com a tabela de dezembro, porque a de novembro é promoção que termina em doze dias.

O lançamento entrega o que promete no que interessa: mais um modelo rápido, de contexto grande e preço no meio da tabela, adaptado de um modelo que já estava no ar. A tabela do anúncio ensina outra coisa. Quando o mesmo modelo mais que triplica de nota ao trocar de arnês, o número que se lê primeiro deixou de ser o do modelo.

<div class="persona" data-audio="/audio/gemini-4-neon-dois-arneses-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
    <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Caio</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 34: Caio comenta o lançamento do Gemini 4 Neon e por que ele olharia a rotatividade de nome e de preço antes da nota do benchmark. Não é a narração do texto.</small></p>
