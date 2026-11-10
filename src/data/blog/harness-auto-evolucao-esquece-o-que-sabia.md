---
author: Vinicius Costa
pubDatetime: 2026-11-09T19:00:00Z
title: "O harness que se auto-evolui esquece o que sabia — e o benchmark não avisa"
slug: harness-auto-evolucao-esquece-o-que-sabia
featured: false
draft: false
tags:
  - inteligencia-artificial
  - agentes
  - harness
  - evals
description: "Um harness chegou a 94% no SWE-Bench e caiu a 32% na mesma tarefa depois de evoluir no FeatureBench. O placar de uma tarefa não mostra a conta."
---

Imagine um agente de código que, depois de alguns ciclos de ajuste automático, conserta bug do repositório com folga. Você acompanha o número, ele sobe, e a conclusão parece óbvia: o harness melhorou. Aí você pede para ele implementar uma feature nova. Ele faz, mas, no caminho, perde a mão para consertar bug. O mesmo agente que fechava correções sem drama agora trava na primeira falha de teste.

Esse cenário é a versão de bolso do que um grupo da Tsinghua mediu no paper "Can Coding Agents Sustain Continual Evolution without Forgetting?" (arXiv 2611.03219). A pergunta do paper não é se um harness consegue melhorar sozinho. A pergunta é se ele consegue melhorar em uma tarefa sem jogar fora o que já sabia fazer em outra.

Para quem não tem o termo na ponta da língua, harness é a camada que coordena modelo, ferramentas e ambiente de execução. Ela decide o que entra no prompt, quais comandos o agente pode rodar, em que ordem ele age e quanto tempo e quantas tentativas ele recebe. Parece detalhe de implementação, mas o paper mostra o peso disso: com o modelo fixo, harnesses diferentes fazem de 82,0% a 96,0% no SWE-Bench Verified. Uma faixa de quatorze pontos sem trocar uma linha do modelo. Se a camada mexe tanto no resultado, ela precisa de versão, de teste de regressão e de critério de promoção, como qualquer código que afeta produção.

O experimento tem dois métodos de auto-evolução: o AHE, com nove rodadas, e o Meta-Harness, com cinco. Os dois usaram o mesmo modelo, o DeepSeek-V4-Flash-0731, tanto para executar as tarefas quanto para reescrever o harness. O ponto de partida foi o Mini-SWE-Agent, uma base de cerca de cem linhas de Python que já passava de 74% no SWE-bench Verified. Por restrição de orçamento, os autores amostraram 50 instâncias do SWE-Bench Verified, 50 do SWT-Bench (geração de testes) e 30 do FeatureBench (geração de features). São seis direções de evolução contínua, cada uma com duas etapas em sequência: evolui em uma tarefa, depois na outra, e mede-se o que sobrou da primeira.

O resultado que mais chama atenção é o do Meta-Harness. Depois de evoluir no SWE-Bench, o harness chegou a 94,0% ali. Depois de cinco rodadas evoluindo no FeatureBench, o mesmo harness caiu para 32,0% no SWE-Bench, a tarefa original, uma queda relativa de 66%. Esse par sozinho já assusta, e não é particularidade do método: o Meta-Harness também leva o SWT-Bench de 100,0% para 62,0% depois de evoluir no FeatureBench. E não é só essa direção. Quando evoluem do SWE-Bench para o SWT-Bench, AHE e Meta-Harness perdem 100% e 98% do desempenho no SWE-Bench depois de cinco rodadas. Na prática, o harness que consertava bug deixa de consertar bug.

Repare no que isso significa para quem olha só o placar. Quando o harness evolui e é medido na mesma tarefa, o número sobe, e tudo parece funcionar. O AHE sozinho, no Terminal-Bench 2, foi de 69,7% para 77,0% em dez rodadas. A melhora é real, mas vale enquanto a tarefa não muda. A conta aparece quando você troca o alvo e não olha para trás.

Então o que muda dentro do harness? Os autores analisaram 520 trajetórias de execução e compararam o diff do harness antes e depois de cinco rodadas. A partir daí identificaram três tipos de conflito.

O primeiro é o conflito de verificação. O harness passa a exigir uma evidência, um artefato ou uma condição de submissão que só faz sentido para a tarefa nova. Ele é o mais frequente: 87,1% dos casos em que a tarefa que passava passou a falhar. Dentro dele, o mais comum é o conflito de artefato. O exemplo que mais me ficou é este: o harness aprende a aceitar um teste gerado só se ele falhar no código com bug. Para o SWT-Bench, essa regra é a correta, porque o teste precisa detectar o defeito. Para uma tarefa de feature, a mesma regra bloqueia a submissão, porque não existe código com bug para o teste falhar. A regra não está errada em si. Ela foi aprendida num contexto e carregada para outro.

O segundo é o conflito de workflow, que mexe na ordem dos passos e na forma de recuperar de erro. Aparece em 8,2% dos casos, mas é o mais caro em tempo. Ajustar a sequência de tentativas para uma tarefa pode fazer o agente andar em círculos em outra.

O terceiro é o conflito de orçamento, que mexe no tempo e no número de tentativas. Foi o mais raro, com 0,6% dos casos. Quase não derruba resultado, mas encarece a execução.

A ablação da tabela 1 é o que me convenceu de que verificação é o tipo que importa. Os autores pegaram o melhor harness no SWE-Bench, que fazia 96,0% com 245,5 segundos por tarefa, e injetaram cada tipo de conflito de forma controlada. Com conflito de verificação, o resultado foi a 0,0%, uma queda de 100%, e o tempo subiu para 415,7 segundos. Com conflito de workflow, o resultado foi a 66,0%, menos 31 pontos, e o tempo foi a 821,5 segundos, mais 235%. Com conflito de orçamento, o resultado ficou em 96,0%, mas o tempo foi a 439,7 segundos, mais 79%. O conflito de orçamento encarece sem derrubar o placar, e é justamente o tipo de problema que uma métrica de acerto não enxerga. O de verificação zera a utilidade do harness.

Essa lição vai além do paper. Harness é código que encapsula suposições sobre a tarefa, e essas suposições mudam quando a tarefa muda. Se o processo de evolução só olha o desempenho atual, ele aprende regras locais e apaga regras antigas sem avisar, porque a regra antiga não aparece no placar da rodada.

Minha proposta, que não vem do paper, tem três partes. A primeira é uma suíte de regressão separada por tipo de tarefa: antes de promover um harness novo, ele roda contra um conjunto pequeno de reparo de código, outro de geração de testes e outro de feature. Se um tipo cai, a promoção para. A segunda é registrar a versão do harness junto de cada resultado, com hash do diff, data e a tarefa que motivou a mudança. Sem isso, um 94% vira uma afirmação que ninguém consegue reproduzir nem atribuir a uma mudança específica. A terceira é nunca deixar o resultado de uma tarefa sozinho no relatório. A tabela precisa mostrar as direções já testadas, inclusive as antigas, e destacar a pior delas.

Essa política tem custo. Rodar mais suítes gasta tempo de execução e exige manter várias delas. Também não sei se a suíte por tipo pega conflito de workflow, que é mais sutil que o de artefato, e prefiro dizer isso a fingir que pega. Ainda assim, quem já viu um agente regredir sem aviso sabe que não medir também custa caro.

Os limites do estudo são grandes e precisam estar na mesa. Há um único grupo de pesquisa, um único modelo e amostras pequenas: 50, 50 e 30 instâncias por dataset. Com 50 instâncias, cada tarefa vale 2 pontos percentuais; no FeatureBench, que tem 30, cada tarefa vale cerca de 3,3 pontos. Diferenças menores que isso pedem cautela. Seis direções de evolução mostram um padrão, mas não fecham uma conclusão geral sobre todos os agentes. Não sabemos o que acontece com outros modelos, outras bases de harness ou outros domínios. O próprio paper diz que identifica direções de solução e não entrega receita. A política acima é uma leitura minha a partir delas.

Mesmo com esses limites, o padrão nas tabelas é consistente o bastante para mudar a forma de olhar um ganho de harness. Um ganho medido em uma tarefa não é ganho do harness até que ele seja medido nas outras tarefas que você já tinha. Na prática: não promova versão de harness sem rodar a suíte das tarefas retidas. E se o seu pipeline não tem essa suíte, o número que você está comemorando hoje é o mesmo que vai te surpreender no mês que vem.

## 📎 Fonte Original

Paper: "Can Coding Agents Sustain Continual Evolution without Forgetting?", Tsinghua AI Agent Group, arXiv 2611.03219 (v1, 02/11/2026)
https://arxiv.org/abs/2611.03219

Repositório: https://github.com/THU-Agent/continual-harness-evolution

<div class="persona" data-audio="/audio/harness-auto-evolucao-esquece-o-que-sabia-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
    <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Caio</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 04: o harness sem dono, a suíte que morre sozinha e o que eu faria na segunda. Não é a narração do texto.</small></p>
