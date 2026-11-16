---
title: "O imposto da auto-melhoria: a verificação domina a conta"
description: "Pesquisadores de Pequim mediram em tokens o custo da auto-melhoria de agentes. Um baseline de uma nota vence três métodos gastando menos no total."
pubDatetime: 2026-11-16T10:00:00Z
author: Vinicius Costa
tags: [ia, agentes, custo, verificação]
---

Um grupo da Universidade de Pequim (Yitong Zhang, Ang Li e Yisen Wang) mediu quanto um agente gasta em tokens para tentar melhorar a si mesmo. O paper saiu no arXiv em 10 de novembro de 2026. Os autores chamam esse gasto de RSI Tax: o custo em tokens do processo de auto-melhoria, contado mesmo quando o agente acaba mantendo o estado anterior. O que eles propõem é pôr acurácia e custo ponta a ponta na mesma tabela, e é aí que a ordem muda.

O resultado central é uma inversão. Quando a conta inclui o custo de produzir a melhoria, além do de executar a tarefa, um baseline de uma nota limitada a 2.048 tokens empata ou supera Meta-Harness, EvoSkill e RRSI, com 65,6% a 71,0% menos tokens totais. A razão está na verificação: de 74,8% a 93,6% do imposto desses métodos é verificação, e em Meta-Harness e EvoSkill cerca de 98,1% do imposto é token de entrada.

## O que foi medido

Seis métodos rodaram com dois backbones, DeepSeek V4.1 Flash e GPT-6 Luna, em dois streams. O primeiro é o SWE-Chain-Evo, com sete cadeias de 15 tarefas de repositório. O segundo é o Terminal-Bench 2.1, com 89 tarefas em ordem fixa. Somados, são 2.328 pares método-tarefa.

A acurácia de cada tarefa é registrada antes de o feedback dela entrar na atualização. Assim o método não se beneficia da própria resposta.

Static é o agente sem atualização. ReasoningBank, EvoSkill, Meta-Harness e RRSI são métodos de papers anteriores. O SRN, Simple Reflection with Notes, foi construído pelos próprios autores como baseline. Ele revisa uma única nota a partir das falhas já concluídas, não faz busca de candidatos e atualiza a cada quatro tarefas.

## O imposto passa da execução

A taxa do imposto é 100 vezes o custo de RSI dividido pelo custo de execução. Taxa 100 quer dizer que atualizar custou o mesmo que executar.

Para Meta-Harness, EvoSkill e RRSI, a taxa passa de 100 nos quatro cenários. No terminal, Meta-Harness e EvoSkill ficam acima de 300 nos dois backbones. O SRN fica entre 0,04 e 0,36. As chamadas de atualização dele somam menos de 0,4% dos tokens totais. O ReasoningBank tem imposto pequeno, mas não melhora a acurácia de forma consistente sobre o Static.

A acurácia é a parte que desmonta a intuição. O SRN tem o melhor número observado em três cenários e empata com o EvoSkill no quarto, com 68,5% nos dois. Em média, ganha 4,7 pontos percentuais sobre o Static gastando 3,6% a mais de tokens no total. Frente aos três métodos de RSI, a redução média de tokens totais do SRN é de 65,6% contra Meta-Harness, 71,0% contra EvoSkill e 68,2% contra RRSI.

## Onde está a conta

Verificação, aqui, quer dizer rodar o agente de novo sobre tarefas antigas para escolher entre candidatos. Ela responde por 74,8% do imposto do Meta-Harness, 78,1% do EvoSkill e 93,6% do RRSI.

O EvoSkill mostra a proporção bem. Segundo o paper, ele gasta 455,29M de tokens em rollouts e propostas extras, contra 4,59M para materializar as skills. No terminal com DeepSeek, gasta 497,45M só atualizando a fronteira antiga. Para executar as 89 tarefas que chegaram, gasta 182,26M. Pela conta com esses dois totais, decidir o que manter custou quase três vezes mais do que servir a fila.

O caso do Meta-Harness é o mais didático. No terminal com DeepSeek, ele executa as tarefas com 184,13M de tokens, menos que os 214,37M do SRN. O imposto de 578,45M, porém, leva o total a 762,57M, contra 214,65M do SRN. Pela divisão dos dois totais, é 3,5 vezes o custo do baseline, com acurácia um pouco menor: 77,5% contra 78,7%.

O paper também mede o que sobra sem uso. Na janela observada, fica associado a artefato que nenhuma tarefa posterior usa: 52,78% do imposto do Meta-Harness, 37,91% do EvoSkill, 63,57% do ReasoningBank e 23,70% do RRSI. Os autores avisam que são percentuais de token, não de atualizações, e que não dizem nada sobre acurácia.

## O imposto é execução disfarçada de melhoria

Aqui está a leitura que eu faço e que o paper não escreve com essas palavras: quase todo o imposto é execução de novo. Verificação é rodar o agente em tarefas já vencidas, e exploração, quando cara, é rollout extra — execução outra vez. O que é barato é escrever o artefato: no EvoSkill, 4,59M de tokens para materializar skills contra 455,29M em rollouts e propostas. Por isso ~98,1% do imposto ser token de entrada: é contexto sendo relido para rodar de novo.

Isso muda onde procurar economia. Não está em escrever memória mais barata nem em comprimir o que já está guardado. Está em quantas tarefas antigas você reexecuta por atualização e com quantos candidatos vivos ao mesmo tempo. O SRN ganha por um motivo estrutural: sem fronteira de candidatos, não há fronteira para revalidar. A coleção que cresce é a que cobra a conta.

## O que fica de fora

O SRN foi construído pelos próprios autores. O paper não cita replicação independente.

Cada cenário teve uma execução. Os autores dizem que rodadas repetidas são necessárias para medir estabilidade.

O custo está em token. Não é preço nem latência, e o paper não traz preço.

A atribuição de custo é descritiva. O paper registra se o estado foi usado depois, mas não conta quantas vezes nem demonstra que o uso gerou ganho. Ausência de uso também não prova que a chamada poderia ser removida. Faltam intervenções controladas, e os autores dizem isso.

O ponto mais honesto é este: verificar menos é fácil de propor e difícil de provar que não quebra. O SRN corta a verificação e mostra acurácia boa nestes dois backbones e nestes dois streams. Não mostra que um agente em produção pode fazer o mesmo sem perda. Os autores admitem que reuso repetido pode justificar investimento inicial maior, e que comparam procedimentos fixos, não uma política que preveja o custo.

## Conclusões

O paper deixa uma régua utilizável. A taxa do imposto responde a pergunta que a acurácia não responde: quanto você paga, em tokens, para continuar melhorando. E o teto que eu usaria é simples — um ciclo de auto-melhoria que gasta mais para se manter do que para servir a fila de tarefas não é melhoria, é o produto. Nos quatro cenários medidos, os três métodos de fronteira passam desse teto com folga; a nota de 2.048 tokens nunca chega perto.

Antes de pagar por uma fronteira de candidatos, vale rodar o baseline trivial no seu próprio stream. Se a nota limitada empata em acurácia gastando menos, o ciclo caro é decoração. E se alguém disser que o agente "aprende com a experiência", a primeira pergunta é quantas tarefas antigas ele reexecuta para provar isso.

## 📎 Fonte Original

The RSI Tax: When Recursive Self-Improvement Is Not Worth the Cost. Yitong Zhang, Ang Li e Yisen Wang. arXiv:2611.13524v1, 10/11/2026. Licença CC BY 4.0.
https://arxiv.org/abs/2611.13524

<div class="persona" data-audio="/audio/rsi-tax-verificar-custa-mais-que-melhorar-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 54: Helena separa o custo contado do ganho amostrado e propõe um teto de 100% para o imposto da auto-melhoria. Não é a narração do texto.</small></p>
