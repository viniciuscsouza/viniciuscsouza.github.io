---
title: "Os 5% do Opus têm prazo: o MAI Code 2 dobra de preço em maio de 2027"
description: 'O MAI Code 2 entrega 96% do Opus 5.5 a 5% do custo, mas a conta usa o preço promocional: em 17/05/2027 a tarifa dobra.'
pubDatetime: 2026-11-18T10:10:00Z
author: Vinicius Costa
tags: [ia, modelos, custo]
---

A Microsoft AI anunciou nesta terça o MAI Code 2 e o MAI Code 2 Flash, dois modelos de código que já aparecem no seletor do GitHub Copilot. O anúncio põe três números na frente: 98% do desempenho do GPT-6.1 Sol a 40% do custo, 96% do Claude Opus 5.5 a 5% do custo, e 67% de preferência em avaliação cega contra o GPT-6 Sol na geração de interfaces. As duas razões de custo foram calculadas sobre o preço promocional.

Hoje o MAI Code 2 custa US$ 0,50 por milhão de tokens na entrada, US$ 0,025 no cache e US$ 2,50 na saída. A tabela de preços do GitHub Copilot registra que essa é a tarifa promocional, válida até 17 de maio de 2027, e que a partir daquela data ela dobra: US$ 1,00, US$ 0,05 e US$ 5,00. A nota de rodapé do anúncio diz o mesmo em uma linha, ao explicar como os 5% foram medidos. Preço dobrado com o mesmo consumo de token dobra a razão de custo, então o número da manchete se torna cerca de 10% do Opus 5.5 e cerca de 80% do GPT-6.1 Sol.

Isso não derruba o anúncio, derruba o número que ele escolheu para a manchete. Na tabela do Copilot, a tarifa promocional do MAI Code 2 é um oitavo da do Opus 5.5 e um quarto da do GPT-6.1 Sol; depois de maio, passa a um quarto e a metade. Continua sendo caro de errar o cálculo: quem monta orçamento de agente para 2027 precisa dos dois números, não do primeiro.

## O que a nota de rodapé mede

A primeira nota do anúncio explica a metodologia em quatro itens. Todos os modelos rodaram em esforço máximo de raciocínio. DeepSWE 1.1, TerminalBench 2.1 e SWE Atlas rodaram na MSBench, a plataforma interna de avaliação da Microsoft, com o Copilot CLI e sem subagentes. As notas e os custos do FrontierCode 1.1 vieram do Artificial Analysis. E o custo do MAI Code 2 aparece com o preço promocional de 50%.

Os 5% são, portanto, uma razão entre execuções de benchmark, não uma divisão de tabela de preço. Isso importa porque a razão tem dois termos: a tarifa e o número de tokens que cada modelo gasta para resolver as mesmas tarefas. Quando a tarifa dobra e o consumo é o mesmo, a razão dobra. É aritmética, com uma suposição explícita: nenhuma mudança de comportamento do modelo entre a medição e o dia em que a promoção acaba.

A mesma nota existe para o Flash, e ali o efeito é mais desigual. O anúncio diz que o Flash entrega desempenho comparável ao GPT-6 Luna e ao Claude Haiku 5.5 a 65% e 20% do custo. Depois de 17 de maio de 2027, a tabela do Flash passa a US$ 0,10 na entrada, US$ 0,01 no cache e US$ 0,50 na saída, exatamente o que o Copilot cobra pelo GPT-6 Luna e pelo Haiku 5.5 de contexto curto nas três colunas que a página lista. Com a tarifa igual, a razão de custo dobra: os 65% contra o Luna viram algo perto de 130%, ou seja, mais caro que o modelo que o anúncio usa como referência, e os 20% contra o Haiku viram cerca de 40%. A vantagem de preço do Flash, depois da promoção, depende de qual dos dois está do outro lado da comparação.

## Quatro benchmarks, uma média

A média que sustenta os 98% e os 96% junta quatro provas que o anúncio descreve como "amplamente usadas" e dirigidas às "tarefas cotidianas de código empresarial" que a Microsoft vê no Copilot. Três delas rodaram no harness da própria Microsoft, o que não invalida o resultado, mas significa que a infraestrutura de medição, a configuração de ferramentas e o orçamento de turnos são escolha de quem vende o modelo. A quarta veio de fora, do Artificial Analysis.

A execução foi sem subagentes. O formato medido é o de um agente solo resolvendo a tarefa; o custo e a taxa de acerto de uma execução com delegação entre agentes não estão nessa conta.

O número de qualidade visual tem outra natureza. Em avaliação cega de interfaces, jogos, visualizações de dados, cenas 3D e SVG, 258 anotadores preferiram o resultado do MAI Code 2 ao do GPT-6 Sol em 67% dos casos. Preferência humana em front-end é um dado útil e difícil de fabricar, e também não diz nada sobre o código que fica no repositório depois.

## O escopo que o anúncio declara

O parágrafo mais honesto do anúncio está no meio, e é o que mais interessa a quem usa agente de código: os modelos "explicitamente ainda não foram ajustados para problemas mais difíceis, como pesquisa científica fundamental e trabalho agêntico de horizonte muito longo".

Essa é a categoria onde a fatura cresce. Uma sessão de agente que lê repositório, falha, tenta de novo e roda testes por horas consome token em ordem de magnitude diferente de um chat que corrige uma função. A Microsoft escolheu o segmento de tarefas "do dia a dia da empresa" e disse onde ele termina. Para o outro lado, o produto que ela oferece é ajuste fino sobre o histórico da própria empresa, e o número que a página usa para provar isso vem de um cliente.

## A comparação que envelheceu no mesmo dia

O MAI Code 2 foi anunciado em 17 de novembro. No mesmo dia, a OpenAI lançou o GPT-6.2 Astra e o GPT-6.2 Sol. Na tabela do Copilot, o GPT-6.1 Sol e o GPT-6.2 Sol custam o mesmo: US$ 2,00 na entrada, US$ 0,10 no cache e US$ 10,00 na saída até 272 mil tokens de entrada, e acima desse limite US$ 4,00, US$ 0,20 e US$ 15,00.

Ou seja, os 98% foram medidos contra o modelo que a geração seguinte substituiu sem mudar de preço. Não é erro do anúncio, é o calendário: benchmark leva semanas, e a Microsoft comparou com o que existia quando começou a medir. Mas quem lê o número para decidir o que colocar no agente em janeiro está comparando com uma geração que já saiu de cena, e o preço do substituto é o mesmo, então a razão de custo não muda. O que muda é o desempenho de referência, que ninguém mediu ainda.

Há uma prova de que a Microsoft sabe disso: o MAI Code 2 é o modelo de código da casa e o GPT-6.2 entrou no Copilot no mesmo dia, com o mesmo preço do 6.1. Os dois convivem no seletor, e o cliente escolhe.

## Onde o ganho aparece fora do benchmark

O anúncio também publica números de produção interna, e esses medem outra coisa. No Word, o modelo da família Work Flash fica próximo do GPT-6.1 Sol em cinco benchmarks internos usando cerca de 42% menos tokens de entrada por chamada no tráfego real. No Teams, ganha do GPT-6 Luna em acompanhar decisões e seguir instruções usando até 28% menos tokens. No Excel e no PowerPoint, empata com o GPT-6 Luna em qualidade e eficiência de token.

São medições da própria Microsoft, sobre o próprio tráfego, com os próprios benchmarks, e não há como verificá-las de fora. Elas descrevem, porém, a tese comercial de forma mais clara que a média: o argumento não é ser o modelo mais forte, é gastar menos token para o mesmo trabalho. Eficiência de token é auditável dentro da sua conta, coisa que "96% do Opus" não é.

O caso que o anúncio usa para sustentar o ajuste fino é o da Woven by Toyota. A equipe ajustou o Flash no histórico de correções do padrão MISRA, de software embarcado automotivo, e relata correções prontas para merge em 44% dos casos em que as correções de modelos de fronteira precisavam de retrabalho humano, a menos de um décimo do custo. É depoimento de cliente publicado pelo fornecedor, e ainda assim aponta para onde a economia sobrevive à promoção: no modelo ajustado no seu histórico, não na tarifa de lançamento.

## O que entra no orçamento

A data é 17 de maio de 2027, e ela pertence à linha de custo do projeto, não à nota de rodapé. O número que se defende numa proposta é o de 10% do Opus 5.5 com 96% do desempenho, porque esse não tem prazo.

Antes de maio, vale rodar o modelo no seu repositório. A média de quatro benchmarks não diz o que ele faz com o seu código, e o próprio anúncio avisa que o horizonte longo de agente ficou de fora do ajuste. Se o seu caso é esse, o teste importa mais que a média, e a data de renovação importa mais que os dois.

## 📎 Fonte Original

- **"MAI Code 2 and Code 2 Flash: Everyday coding at scalable prices"**, Microsoft AI, 17/11/2026: [microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash](https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/)
- **"Models and pricing for GitHub Copilot"**, GitHub Docs, tabela conferida em 18/11/2026: [docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
- **"MAI Code 2 and MAI Code 2 Flash in GitHub Copilot"**, GitHub Changelog, 17/11/2026: [github.blog/changelog/mai-code-2-and-mai-code-2-flash-in-github-copilot](https://github.blog/changelog/mai-code-2-and-mai-code-2-flash-in-github-copilot/)

<div class="persona" data-audio="/audio/mai-code-2-preco-promocional-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
    <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Caio</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 40: Caio troca o desconto por custo de retrabalho, cobra o escopo que o anúncio exclui e diz o que mediria na segunda antes de trocar de modelo. Não é a narração do texto.</small></p>
