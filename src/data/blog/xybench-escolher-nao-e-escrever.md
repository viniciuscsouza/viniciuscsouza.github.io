---
author: Vinicius Costa
pubDatetime: 2026-11-14T10:00:00Z
title: 'XYBench: o modelo aprova o conselho útil e o escreve menos da metade das vezes'
description: 'Um benchmark com 8.115 perguntas: no recorte do Stack Overflow, os modelos escolhem o conselho útil em 71–84% dos casos e o escrevem em 35–41%.'
tags: ["IA", "Avaliação", "LLM", "Engenharia de software"]
---

Todo mundo que já respondeu pergunta no Stack Overflow conhece o padrão. Alguém pede ajuda com um caminho que já escolheu (uma função para contornar um erro, um comando para forçar um merge) e o problema real é outro, que esse caminho nem resolve. Isso tem nome: XY problem. X é o caminho que a pessoa assumiu, Y é o que ela precisa de fato. Em 13 de novembro de 2026, o AllenAI publicou no blog do Hugging Face o XYBench, um benchmark que mede se modelos de linguagem respondem ao Y quando a pergunta chega como X. O paper é o arXiv 2609.06842, aceito na EMNLP 2026, e o blog registra o Best Resource Paper Award da conferência.

Isso importa para quem usa assistente de código porque a maior parte do trabalho com agente começa com um pedido no formato X. Se o modelo responde ao X com perfeição e deixa o Y de lado, a resposta parece boa e o problema continua lá.

## O achado que pesa

O número que mais me chamou atenção não é o de acerto geral. Nas perguntas do Stack Overflow, a solução para o pedido literal aparece em 75 a 86% das respostas. Quando a medida passa a ser o objetivo real, o número cai para 59 a 71%. A ênfase principal no objetivo fica entre 35 e 41%, contra 47 a 57% no pedido literal.

O experimento que me interessa mais é outro. Mesma pergunta, duas respostas prontas, uma focada no pedido e outra no objetivo, e a tarefa de escolher a melhor. Os cinco modelos avaliados, mais o GPT-4.1, escolhem a resposta focada no objetivo em 71 a 84% dos casos. Quando esses modelos escrevem a própria resposta, só 35 a 41% colocam o objetivo no centro.

O modelo prefere a resposta boa e não a produz. O paper diz a mesma coisa em uma frase que vale citar no original: "models overwhelmingly prefer pragmatic responses in a multiple choice setting yet consistently fail to generate them". Em português: quando a resposta pragmática está na mesa, o modelo a prefere; quando precisa gerá-la, falha de forma consistente.

## A explicação fácil não fecha

A explicação fácil é que o modelo não entendeu a pergunta. O dado não sustenta isso: ele reconhece a resposta certa quando ela está entre as opções. O que falta é agir sobre a intenção quando ela diverge do que foi pedido — o próprio paper formula assim, e é uma afirmação mais estreita do que dizer que o modelo não entende nada.

O teste que mais me convenceu foi o oracle. Os autores deram ao modelo o X e o Y explícitos, sem deixar nada para ele adivinhar. O Claude Sonnet 4.6 subiu de 59% para 67% ao incluir a solução para o objetivo. Mas a identificação da concepção errada caiu de 47% para 34%.

Minha leitura, que o paper não fecha sozinho: com o objetivo na mão, o modelo passa a resolver o Y declarado e para de questionar a premissa que levou ao X. Dar a intenção ajuda, mas não encerra a diferença. O paper diz: "Supplying intent helped, but did not consistently close the gap with human responses." Dar a intenção ajudou, mas não fechou de forma consistente a distância para as respostas humanas.

## O que o benchmark não mede

Antes de tirar conclusão, o escopo. O primeiro limite é o turno único: o modelo responde uma vez, com uma resposta por pergunta. Uma resposta que devolve a pergunta ao usuário — "o que você está tentando resolver?" — não é o formato avaliado, e não há nenhum número no paper sobre quantas vezes essa devolução resolveria o caso. É a ferramenta mais óbvia para achar o Y, e ela está fora da medição.

Segundo os próprios autores, o benchmark cobre só inglês e majoritariamente problemas procedurais: como fazer algo, passo a passo. Se o mesmo padrão aparece quando o X esconde uma premissa cara, numa decisão de arquitetura ou de produto, o XYBench não responde. Ele mede o conselho de oficina, não a decisão de projeto.

Há ainda um limite de origem. Das 8.115 perguntas, 6.272 foram geradas por LLM a partir de guias do WikiHow. Só 102 foram curadas à mão, 1.557 vêm do Stack Overflow e 184 do Stack Exchange. A validação humana cobriu 500 respostas de dois revisores. A concordância entre o juiz automático (Claude Sonnet 4.5) e os humanos é alta para presença de solução (97,5 a 100%) e razoável para a concepção errada (84,6 a 93,3%). Na ênfase pragmática, a métrica que sustenta a tese, cai para 74,2 a 79,8%. Isso não invalida o achado, mas pede cautela justamente na fatia que mais importa.

## O que eu tiro disso para quem constrói com agente

Quem monta agente de código ou de suporte tem um reflexo previsível: escrever um prompt maior, com "foque no objetivo do usuário, não no pedido literal". Eu não apostaria nisso como correção principal. O próprio experimento mostra que informar a intenção ajuda pouco e não fecha a lacuna. O prompt pede ao modelo que faça a parte que ele já faz mal.

Minha posição: o conserto mora no produto, não no prompt. Duas mudanças que eu faria, e nenhuma depende de o modelo melhorar.

A primeira é separar a escolha da escrita. Se o sistema mostra a hipótese do problema real antes de gerar a resposta longa, o usuário confirma ou corrige o Y, e a geração passa a trabalhar sobre um alvo validado. É o que o experimento sugere: o modelo escolhe bem quando a alternativa está visível.

A segunda é tratar a pergunta de volta como funcionalidade. O benchmark não pontua esse turno, mas um produto pode. Um agente que pergunta o objetivo antes de mexer em código, quando o pedido parece meio e não fim, faz o trabalho que o modelo sozinho não faz.

Não tenho dado próprio sobre nada disso. São hipóteses de quem projeta o fluxo, não resultados medidos.

## Conclusões

Se eu tivesse que acompanhar um número só em produto, seria a taxa em que o assistente redireciona o pedido ao objetivo na resposta que ele escreve — não a preferência em múltipla escolha, que o XYBench já mostra resolvida. A escolha está feita; o que falta medir é a execução.

A consequência prática é que "o modelo entende o usuário" deixou de ser uma pergunta abstrata: dá para medir se ele reconhece, se ele escreve e se ele age contra o pedido. Faltam as três na mesma régua, e o XYBench cobre duas.

## 📎 Fonte Original

- https://huggingface.co/blog/allenai/xybench
- https://arxiv.org/abs/2609.06842

<div class="persona" data-audio="/audio/xybench-escolher-nao-e-escrever-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Sabrina">
    <img src="/personas/sabrina.webp" alt="Retrato de Sabrina, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Sabrina</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 15: Sabrina aponta o que o benchmark não mediu: o modelo aprendeu que prestativo é fazer o que pediram, e a pergunta de volta não entrou na conta. Não é a narração do texto.</small></p>
