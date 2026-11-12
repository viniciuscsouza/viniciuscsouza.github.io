---
author: Vinicius Costa
pubDatetime: 2026-11-12T12:40:00Z
title: "Deletion Tuning: adaptar o modelo apagando pesos da projeção gate"
description: "Apagar menos de 0,05% dos pesos, só na projeção gate, iguala o ajuste fino no maior modelo de cada família testada e esquece menos o que já sabia."
tags: ["Modelos", "Pós-treino", "Pesquisa", "Engenharia de IA"]
---

Pesquisadores da New York University e da University of Calgary mostraram que é possível adaptar um modelo de linguagem apagando pesos em vez de somar pesos novos. No maior modelo de cada família testada, o método, chamado Deletion Tuning, iguala o ajuste fino completo em tarefas de matemática e raciocínio. No Llama 8B, o resultado cabe num adaptador de 8,4 MB, contra um checkpoint de 30.633 MB do ajuste fino tradicional. O artigo, "The Surprising Effectiveness of Deleting Weights in LLM Post-Training" ([arXiv 2611.10866](https://arxiv.org/abs/2611.10866)), foi submetido em 7 de novembro de 2026 e está listado no NeurIPS 2026.

## Apagar como forma de aprender

No pós-treino habitual, a operação é de acréscimo. Pega-se um modelo pronto, ajustam-se os pesos com dados novos e o resultado é um arquivo do tamanho do modelo inteiro. Os autores propõem outra operação. Todos os pesos pré-treinados ficam congelados, e o método aprende uma máscara binária, manter ou apagar, sobre a projeção gate de cada bloco transformer. Essa projeção é uma única matriz do bloco MLP, não o modelo inteiro. Nenhum valor novo de peso é escrito: o peso mantido é lido do checkpoint público, e o apagado vira zero.

A máscara é pequena. Empacotada bit a bit com NumPy e comprimida com zstd, ela custa cerca de 0,03 bits por peso mascarado. Ao longo de todas as rodadas de GRPO, menos de 0,05% dos pesos do modelo são zerados, e todos eles saem da projeção gate. Esse número é sobre o total do modelo, não sobre a matriz que a máscara cobre, e a diferença importa.

## O que os números mostram no maior modelo de cada família

Com GRPO, o melhor checkpoint do Llama 8B no GSM8K sai de 60,27 na base para 83,24 com ajuste fino completo e 83,55 com Deletion Tuning. No Qwen 7B, na média de seis benchmarks do SimpleRL-Zoo, a base faz 40,18, o ajuste fino faz 51,89 e o Deletion Tuning faz 52,32. O adaptador tem 6,9 MB, contra 29.051 MB do checkpoint completo. No Qwen 14B, a diferença é de 55,43 contra 54,87, com adaptador de 11,4 MB.

O caso que mais me interessou é o Qwen3-30B-A3B, um modelo mixture-of-experts. Ali o Deletion Tuning faz 58,54 contra 58,43 do ajuste fino, com 29,6 MB contra 116.471 MB. A máscara cobre a projeção gate dentro de cada um dos especialistas, e o roteador fica intocado.

Adaptadores pequenos também chegam perto nesse tipo de benchmark. No Llama 8B, o LoRA com rank 1 faz 83,38 com 10,0 MB, abaixo do Deletion Tuning por pouco. A diferença aparece em outro lugar, no esquecimento, que trato mais abaixo.

## Onde ele não iguala

A tese vale para o maior backbone de cada família, e os modelos menores mostram o limite. No Llama 1B, a base faz 1,21, o ajuste fino faz 60,50 e o Deletion Tuning faz 54,44. No Qwen 0,5B, são 10,44, 19,01 e 17,64. No Llama 3B, o ajuste fino faz 82,49 e o Deletion Tuning faz 81,49. Quem trabalha com modelo pequeno não deve tirar daqui uma regra geral.

## Não é poda com outro nome

A pergunta natural é se isso não passa de poda. Os autores compararam com o Wanda, um método de poda one-shot, em oito níveis de esparsidade. O melhor deles fica a menos de cerca de 2,3 pontos da base nos seis backbones. No Llama 8B, a base faz 60,27 e o Wanda faz 60,65. Cortar pesos sem treinar quase não tira o modelo do lugar. Partindo dos mesmos scores do Wanda, a máscara treinada leva o Llama 1B de 1,21 para 54,44. O ganho vem do treino da máscara, não do corte em si.

## Apagar o que não importa

O ponto mais forte do artigo é o esquecimento. Medem-se as tarefas anteriores ao treino (HellaSwag, MMLU, TruthfulQA, WinoGrande, IFEval e HumanEval). Em todas as escalas do Llama, o Deletion Tuning fica dentro de 1 ponto da base, enquanto ajuste fino, LoRA e MTH perdem até 5,4 pontos nessa mesma suíte. A forward KL do Deletion Tuning, a medida que os autores usam para prever o esquecimento, fica em ou abaixo de cerca de 0,01 nas três escalas. Nos três baselines, ela cresce ao longo do treino.

O argumento dos autores é que o número pequeno de pesos editados não explica essa retenção. Se fosse só quantidade, o MTH a 99,95% deveria esquecer menos, porque treina uma fração comparável à que o Deletion Tuning apaga. Ele esquece mais. Isso sugere que o que protege o conhecimento anterior é o tipo de operação, não o volume de pesos tocados.

Os outros resultados seguem a mesma linha. Em pass@k, o método fica à frente da base em todo k testado, e em k=256 chega a 99,62 contra 95,29 da base no Llama 8B. Numa variante de SFT, ele iguala o ajuste fino no Llama 3B em MMLU-Pro e BBEH. Com destilação on-policy (SDFT), iguala o ajuste fino no Qwen 7B em ToolAlpaca e Science, com adaptadores de 600 a 4.700 vezes menores que os checkpoints do ajuste fino.

## O que muda se adaptação for seleção

O modelo mental padrão de adaptador é aditivo. O LoRA aprende um delta, e a gente empilha deltas. Se adaptar for selecionar, a habilidade deixa de ser um arquivo de pesos e vira um bitmap sobre um checkpoint fixo, carregado por tarefa. Trocar o comportamento de um sistema passaria a ser trocar uma máscara por outra. A auditoria, que hoje seria ler um checkpoint inteiro, viraria a diferença entre duas máscaras. É hipótese dos autores, não achado: comparar quais pesos cada tarefa apaga poderia localizar o que o pós-treino mudou num modelo.

O que o método não faz é baratear o aprendizado em si. Escolher o que apagar continua sendo treino, com sinal de recompensa, e a memória durante o treino é maior que a do LoRA e menor que a do ajuste fino, segundo os próprios autores. A economia está no que se guarda depois, não no que se gasta para aprender.

## O que o artigo não testou

Todos os benchmarks são de matemática e raciocínio (GSM8K, MATH500, Minerva Math, OlympiadBench, AIME24, AMC23), de conhecimento (MMLU-Pro, BBEH) ou de tool use e ciência (ToolAlpaca, Science). Não há tarefa de agente multi-turno, não há código e não há uso em produção. Só a projeção gate é mascarada, então nada disso vale para o modelo como um todo.

Aprendizado em sequência e união de máscaras de tarefas diferentes para juntar habilidades são trabalho futuro declarado pelos autores, não resultado. Não há replicação independente, e estar listado no NeurIPS 2026 não é revisão dos números.

Na prática, o que importa agora é outra pergunta. Se você mantém um sistema com várias habilidades, a comparação que vale fazer é de esquecimento no seu próprio conjunto de tarefas, não só de acurácia no benchmark. O artigo mostra que a diferença entre adaptadores pode estar no que eles preservam, e isso só se mede com as tarefas que você já tem.

## 📎 Fonte Original

https://arxiv.org/abs/2611.10866

<div class="persona" data-audio="/audio/deletion-tuning-apagar-pesos-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 34: o número que muda tudo aqui não é o tamanho do adaptador, é o contrato de implantação. Não é a narração do texto.</small></p>
