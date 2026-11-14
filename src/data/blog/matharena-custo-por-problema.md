---
author: Vinicius Costa
pubDatetime: 2026-11-14T17:15:00Z
title: 'O líder da MathArena custa 15 vezes o terceiro colocado por problema, com a mesma tabela de preço'
description: 'A MathArena cobra por problema, não por tarefa: o Gemini 4 Carbon custa US$ 15,70 e o GPT-6.1 Sol US$ 1,07, com a mesma tarifa por milhão de tokens.'
tags: ["IA", "Benchmarks", "Custos", "Avaliação"]
---

Em 10 de novembro, a Google anunciou o Gemini 4 Carbon. No dia 13, a MathArena, plataforma acadêmica de avaliação de matemática criada pelo SRI Lab da ETH Zurich e pelo INSAIT, com apoio de grant da Epoch AI, incluiu os resultados dele na sua tabela, junto com os do Claude Fable 5.2. O que a MathArena publica é desempenho e custo, e o custo que ela mede é por problema, não por tarefa. Essa diferença muda a conta de quem decide orçamento.

O anúncio da Google dá ao Carbon o mesmo preço introdutório do Gemini 4 Argon: US$ 2 por milhão de tokens de entrada e US$ 10 por milhão de saída. Na mesma página, a empresa diz que o Carbon usa mais tokens que o Argon ("using more tokens than Argon") para explorar a fundo, raciocinar com mais profundidade e rodar loops de verificação estendidos. O mecanismo está declarado com todas as letras. O que me chama a atenção é a métrica escolhida para vender o modelo. Segundo a Google, o Carbon fica em primeiro no CursorBench 4.0, no WANDR da Perplexity e no AutomationBench da Zapier, com "mais de 2X" menos custo por tarefa que o próximo melhor modelo externo. No MKA, feito com a Artificial Analysis, a empresa fala em mais de 6X menos custo médio por tarefa em relação ao modelo de melhor desempenho.

Custo por tarefa é uma métrica condicional ao sucesso. Ela só responde "quanto custou resolver uma tarefa" depois que se define o que conta como tarefa resolvida e se o gasto das execuções que não chegaram lá entrou no numerador. As citações do anúncio que tenho à mão não trazem essa definição, e não vou supor qual é. Um modelo que gasta muito por execução pode ficar barato por tarefa se acerta quase sempre. Um modelo barato por execução pode sair caro se erra muito. O número depende de onde se põe o denominador, e de quantas falhas ficaram de fora dele.

A MathArena trabalha com outra unidade. Cada modelo roda quatro vezes em cada problema, e a plataforma publica o custo médio de uma execução por problema, em dólar. O desempenho esperado é a média das notas normalizadas nas competições não depreciadas, com os resultados faltantes estimados por um modelo de teoria de resposta ao item de dois parâmetros, e só entra no ranking quem respondeu a pelo menos 42 questões. O custo esperado é a média ponderada do custo por problema, sem as competições Euler, com as observações faltantes previstas por ajuste log-linear e intervalos por bootstrap. Ou seja: cada execução é cobrada, acerte ou não.

Na tabela de recomendação, o Gemini 4 Carbon (high) está em primeiro, com 85,4% ±3,0% de desempenho esperado e US$ 15,70 ±1,33 por problema. O Claude Fable 5.2 (max) fica em segundo, com 82,8% ±5,3% a US$ 40,20 ±2,59. O GPT-6.1 Sol (max) está em terceiro, com 80,6% ±2,7% a US$ 1,07 ±0,018. Pelas contas com esses números, o Carbon custa cerca de 15 vezes o Sol (15,70 ÷ 1,07 = 14,7), e o Fable custa 2,6 vezes o Carbon (40,20 ÷ 15,70).

Carbon e Sol aparecem com o mesmo preço de US$ 2 de entrada e US$ 10 de saída por milhão, na página de cada modelo. Portanto a diferença de US$ 15,70 para US$ 1,07 não vem da tabela de preço. Vem do volume de tokens. Na ArXivLean, competição de setembro de 2026, o Carbon gastou US$ 45,11 e registrou 1.064.444 tokens de saída. O Sol gastou US$ 1,16 com 59.111 tokens de saída. Pelas contas com esses valores, são 38,9 vezes no custo e 18,0 vezes nos tokens de saída. Na ArXivMath, o Carbon usou 202.921 tokens e custou US$ 5,08; o Sol, 64.058 tokens e US$ 0,96. Isso dá 5,3 vezes no custo e 3,2 vezes nos tokens.

A ArXivLean também mostra o que esse volume compra. O Carbon acertou 62,26% ±13,05% ali, em primeiro de oito; o Sol, 35,85% ±12,91%, em quinto. Essa é a maior diferença de desempenho entre os dois em todas as competições da página, e mesmo assim os intervalos ficam quase encostados. Nas outras duas, BrokenArXiv e ArXivMath, o Carbon fica em primeiro e o Sol em segundo, com intervalos que se sobrepõem. No agregado, são 85,4% ±3,0% contra 80,6% ±2,7%: 4,8 pontos de diferença, com intervalos que se sobrepõem, por um custo 15 vezes maior. A capacidade comprada por esse dinheiro é pequena, e não está separada do ruído da medição.

Barato também não fica perto. O melhor modelo aberto da tabela, o Kimi K3.1 Pro (max), faz 54,3% ±5,8% a US$ 3,70 ±0,27 por problema. Fica 31,1 pontos atrás do Carbon e 26,3 atrás do Sol. Pelas contas com esses números, custa 3,5 vezes o Sol por problema (3,70 ÷ 1,07 = 3,5) e entrega bem menos. Preço por token baixo não garante custo por problema baixo, e a tabela mostra isso sem precisar de mais nada.

Os limites importam. O custo que a MathArena publica é calculado com os preços de amostragem que ela mesma lista por modelo, na própria página; não é fatura, e a página não menciona desconto por contrato. São quatro execuções por problema, em questões de competições recentes, o que não é distribuição de carga de trabalho de produção. Por isso não escrevo que o Carbon é 15 vezes mais caro na prática. É um benchmark de matemática, feito por um grupo só, e não diz nada direto sobre código ou agentes. A página do Carbon lista um timeout de 1200 segundos na configuração de execução, mas não diz quantas execuções o atingiram, e não vou supor. Também não acuso a Google de esconder nada: o anúncio declara o uso maior de tokens. O ponto é o recorte da métrica.

Minha opinião é esta: para orçamento, um número por problema serve melhor que um número por tarefa, porque cobra toda execução, acerte ou não. E um número por tarefa só é comparável quando diz o que entrou no numerador — se o gasto das tentativas que não levaram a nada foi contado. O anúncio não diz; a MathArena diz, e cobra as quatro execuções de cada problema. Mas nenhum dos dois é a conta de produção, onde as duas coisas convivem: as tarefas que terminam, as que exigem nova tentativa e as que não chegam a uma resposta utilizável. Essa mistura não aparece em nenhuma tabela pública.

Para quem decide orçamento, sobram três regras. O número de vitrine do fornecedor não serve de base sozinho. A razão de 15 para 1 vale para a matemática que a MathArena testou e não se transporta para a sua conta sem medir quantos tokens a sua carga faz o modelo escrever. E a comparação só fecha quando as duas métricas saem do mesmo conjunto de tarefas, incluindo as que falham. O benchmark responde quanto custa uma tentativa; o orçamento precisa saber quantas tentativas o seu problema exige — e esse número nenhuma tabela publica.

<div class="persona" data-audio="/audio/matharena-custo-por-problema-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 14: Helena comenta por que o custo médio por problema da MathArena não serve para orçar. Não é a narração do texto.</small></p>
