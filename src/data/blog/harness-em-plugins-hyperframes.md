---
title: "Harness em plugins: 30% menos custo que o Claude Code, em 17 tarefas de vídeo"
description: "A HyperFrames transformou cada política do agente em plugin removível e mediu 30% menos custo que o Claude Code. O método vale mais que o percentual."
pubDatetime: 2026-11-16T14:30:00Z
author: Vinicius Costa
tags: [ia, agentes, harness, engenharia]
---

A HyperFrames, produto de vídeo da HeyGen, publicou na sexta-feira (13) como construiu o harness de agente de código que usa por dentro e o comparou com o Claude Code. O resultado que ela destaca: nas mesmas 17 tarefas de vídeo, com o mesmo modelo frontier e o mesmo esforço, o custo caiu cerca de 30% e o agente precisou de cerca de 35% menos turnos de modelo, sem perda de qualidade na avaliação que ela mesma fez. O número é do fornecedor e mede o domínio dele. A parte que serve para quem constrói harness não é o 30%. É o método que produziu o 30%.

## O diagnóstico saiu do rastro, não da intuição

Antes de mexer no harness, o time instrumentou as execuções do benchmark e revisou milhares de sessões passo a passo, classificando cada passo pela finalidade. Três padrões apareceram. O esforço não era distribuído por igual: concentrava-se em formas que se repetiam entre tarefas. Essas formas caras atravessavam o processo inteiro, de entender o material de origem e compor o quadro até alinhar áudio e revisar o corte. E, em vários casos, o agente tinha que construir ferramenta temporária própria antes de conseguir avançar.

A descrição de como o desperdício se parece é a parte mais útil do texto. Um caminho natural para o modelo, mas caro: ele itera muito para verificar cada mudança e estima alinhamento em vez de medir. Outro: ele não sabe usar o método certo, tenta, chuta e volta atrás. O primeiro é o loop de conferência. O segundo é o palpite com cara de decisão.

## Cada política virou um plugin

O argumento do artigo sobre harness existente é honesto. Eles acumulam patches, políticas, feature flags e capacidades verticais, a lógica se emaranha, e fica difícil isolar um módulo para medir o efeito dele. Vídeo depende justamente desses comportamentos de núcleo.

A solução foi mover cada política, feature e capacidade para um plugin independente, com adapters e interfaces compartilhadas para que a mesma capacidade rode em todos os harnesses da casa. Com isso o experimento fica barato: remove um ou mais plugins, roda o benchmark interno e avalia tanto o rastro do agente quanto o vídeo final, de ponta a ponta. O resultado diz se aquele componente ainda paga o que custa.

Essa é a ideia que eu levaria para qualquer harness. Não é sobre plugin como moda de arquitetura. É sobre transformar cada comportamento em uma unidade que pode ser desligada e avaliada sozinha. Sem isso, toda discussão sobre "o harness ajuda" vira opinião.

## Checkpoints de harness, e um agente que propõe a mudança

O passo seguinte inverte a lógica. Em vez de manter um harness e ir remendando, eles mantêm vários checkpoints, cada um uma combinação diferente de plugins, todos rodando continuamente contra o benchmark interno. Um sistema de análise revisa cada execução, comportamento por passo e vídeo final, e registra os melhores checkpoints por dimensão.

Guardar o melhor por dimensão, e não o melhor no agregado, é escolha deliberada. Otimizar uma dimensão só tende a estagnar. Com vários ótimos parciais na mesa, a rodada seguinte escolhe a direção com mais informação.

Depois entrou um agente propositor. Ele parte dos melhores checkpoints de cada dimensão, segue um conjunto de princípios e políticas mantido pelo time e propõe plugins para adicionar, modificar ou remover. Cada proposta vira um checkpoint e passa pela mesma avaliação de qualquer outra. Em alguns casos, segundo o texto, feature proposta, avaliada e entregue inteiramente por agentes.

## O número, e o terreno que ele mede

A comparação usou 17 tarefas de vídeo em cinco famílias: recriar uma referência, remixar, vídeo de marca, material de arquivo e edição. Em 78% delas, o harness da casa fez o mesmo trabalho com menos esforço. No conjunto, custo a 70 contra 100 e turnos a 65 contra 100, em índice. Nas tarefas que são o fluxo próprio da HyperFrames, como remixar um vídeo de referência, o custo caiu 40% e os turnos caíram mais da metade. Qualidade empatada em avaliação cega por par, com um modelo juiz: 41% para cada lado. O artigo não diz 41% de quê.

O dado que mais me interessa está no meio do texto e não no gráfico. O ganho é maior justamente nas tarefas que são o workflow do produto. Isso é o esperado. Um harness especializado ganha de um generalista no terreno em que foi feito, e o próprio time escreve isso. O que fica em aberto é o tamanho do ganho fora do terreno.

## O que eu tiro disso

Três coisas, na ordem em que eu aplicaria.

Harness é artefato versionado. Se o comportamento não é uma unidade que dá para desligar, não há como saber se ele ainda serve. Modelo novo muda o que o harness precisa fazer, e manter ou remover não deveria depender de quem defendeu o código.

Ablação é o produto. O 30% é consequência de rodar o benchmark sem um plugin de cada vez, muitas vezes. Quem copiar a arquitetura sem copiar a rotina de avaliação fica com a complexidade e sem o número.

O ganho tem endereço. Custo por tarefa em 17 tarefas de vídeo do próprio produto é medida de domínio. Serve para decidir se vale construir harness especializado para vídeo. Não serve para dizer que harness especializado bate harness geral em qualquer coisa.

## O que fica de fora

O texto não publica custo absoluto. Todos os números de custo são índice, com o Claude Code em 100. Também não diz qual modelo frontier rodou dos dois lados, o que impede qualquer tentativa de reprodução. Uma frase do cartão no X diz que o agente roda sobre o DeepSeek Harness; o corpo do artigo não repete isso nem nomeia a base.

A qualidade igual vem de um modelo juiz, em avaliação cega. O texto não descreve avaliação humana nem métrica objetiva de vídeo, do tipo quanto um corte se desvia da referência. Para uma empresa que acabou de dizer que entender e editar vídeo é a parte difícil, essa é a lacuna mais visível no que foi publicado.

Não há número de sessões revisadas nem de passos classificados, apesar da menção a "milhares de sessões". Não há latência. E não há o custo de manter vários checkpoints rodando continuamente contra o benchmark. O artigo trata a auto-evolução como direção promissora, não como conta a pagar. Toda rodada de proposta gasta avaliação, e avaliação é o item caro desse tipo de sistema.

## O que a literatura já dizia

A ideia de que o harness é variável de primeira ordem não é nova. O SWE-agent, de Yang e colegas, mostrou em 2024 que a interface entre agente e computador muda o desempenho do mesmo modelo, e chegou a 12,5% de pass@1 no SWE-bench com o desenho de interface certo. O que a HyperFrames publica agora é a mesma ideia medida em custo e não só em acurácia, dentro de um produto. A ponte entre os dois é leitura minha; o texto deles não faz essa comparação.

O MULTILOOP, aceito no workshop CL4FMAgents do NeurIPS 2026, é o contraponto mais direto ao que eles chamam de auto-evolução. Um agente de código que analisa rastro, diagnostica falha e edita o harness melhorou 4,6% sobre o harness base e 3,2% sobre o melhor sistema single-agent, com 10 amostras de treino. A taxonomia de falhas antes e depois mostrou que as falhas de orquestração praticamente não se movem. O loop mexe no que é código e não alcança o que é arranjo entre agentes.

A parte de organizar contexto tem explicação independente no material da Anthropic sobre engenharia de contexto. A janela degrada conforme cresce, o orçamento de atenção é finito, e o trabalho é manter o menor conjunto de tokens com sinal alto. O harness da HyperFrames é, na prática, uma aplicação disso com ferramenta específica de domínio.

## Conclusões

A ordem prática para quem constrói agente hoje: classifique o passo onde o turno é gasto, transforme cada política em unidade removível, e mantenha o benchmark rodando sem um componente por vez. Se não dá para remover, não dá para medir. E sem medir, a próxima geração de modelo decide por você, com a intuição de quem escreveu o código.

Sobra a conta de qualidade. 41% empatado por modelo juiz diz que os dois harnesses ficaram no mesmo nível, não que o vídeo ficou bom para quem assiste. Numa empresa cujo argumento é que entender e editar vídeo é o difícil, medir isso é o passo seguinte que o texto deixa em aberto.

## 📎 Fonte Original

"Our harness beats Claude Code: here's how", Rory Li, Wenbo Zhu, James Russo, Michael Wang e Bin Liu, HyperFrames (HeyGen), 13/11/2026: https://hyperframes.heygen.com/blog/how-we-build-our-coding-harness-for-video

Post no X que levou ao artigo: https://x.com/HyperFrames_/status/2121298145107911055

Referências citadas: SWE-agent, Yang et al., 2024 — https://arxiv.org/abs/2405.15793 · MULTILOOP, Gottesman et al., 2026 — https://arxiv.org/abs/2611.15754 · "Effective context engineering for AI agents", Anthropic — https://www.anthropic.com/research/effective-context-engineering-for-ai-agents

<div class="persona" data-audio="/audio/harness-em-plugins-hyperframes-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 02: Vicente separa harness de produto, cobra o custo da conferência que o anúncio não publica e fecha na regra do benchmark antes da terceira ferramenta. Não é a narração do texto.</small></p>
