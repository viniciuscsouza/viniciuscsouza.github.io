---
author: Vinicius Costa
pubDatetime: 2026-11-11T12:45:00Z
title: "O S-1 da Anthropic diz quem escreve 90% do seu código"
slug: anthropic-s1-quem-escreve-o-codigo
featured: false
draft: false
tags:
  - inteligencia-artificial
  - agentes
  - engenharia-de-software
  - modelos
description: 'O prospecto da Anthropic afirma que o Claude escreveu mais de 90% das contribuições ao código em setembro. Os números de custo vêm logo depois.'
---

Em 10 de novembro de 2026, a Anthropic protocolou a Amendment No. 2 ao Form S-1, o pedido de registro para abrir o capital nos Estados Unidos. A faixa de preço é de US$ 70 a US$ 78 por ação, para 825 milhões de ações Class A. A oferta australiana abriu no dia seguinte. A Anthropic é a empresa por trás do Claude, e o documento reúne números de receita, custo e produtividade em um lugar só. Não é um anúncio: é um registro na SEC, e a empresa responde pelo que escreveu nele.

A primeira conta que aparece é a de código. O prospecto diz: "over 90% of the contributions to our codebase in September 2026 were written by Claude". Em português, mais de 90% das contribuições ao código da empresa em setembro de 2026 foram escritas pelo Claude. O documento não define o que conta como "contribution". Não sei se são linhas, commits ou trechos aceitos em revisão, e o texto não diz. Então eu trato o número como declaração da empresa, não como medida independente.

A segunda métrica é de volume. No trimestre encerrado em 30 de setembro de 2026, o volume diário de código por engenheiro foi "over 45 times" o volume médio de 2024. Volume não é valor, e um número sem definição não deve ser lido como ganho de qualidade. Mesmo assim, é uma mudança de ordem de grandeza, e o prospecto a apresenta como consequência direta do uso do Claude pela própria equipe.

Na mesma linha, a receita dos últimos doze meses por funcionário subiu de US$ 1,4 milhão para mais de US$ 6,6 milhões. No período, a receita cresceu cerca de 1.200%, e o quadro de pessoal cresceu cerca de 170%. O texto resume a relação assim: "Claude is the common thread, amplifying the output of our employees". Ou seja, a empresa atribui a eficiência ao modelo, e não só à equipe.

Agora a conta. Nos nove meses até 30 de setembro de 2026, compute e infraestrutura somaram US$ 18,8 bilhões. A receita no mesmo período foi de US$ 33,2 bilhões. Isso dá 57%. Em 2024, compute custou US$ 2,5 bilhões para uma receita de US$ 386 milhões. Em 2025, foram US$ 7,3 bilhões contra US$ 4,6 bilhões. No mesmo intervalo de nove meses de 2025, compute chegou a 172% da receita. A fatia caiu, mas continua alta.

Há um detalhe de contabilidade que pesa na leitura. No demonstrativo, compute aparece como despesa operacional, e o documento não publica receita líquida nem margem bruta. Dá para comparar a fatia do custo sobre a receita. Não dá para dizer quanto a empresa ganha em cada unidade de inferência a partir do prospecto. Parte do compute é de curto prazo: US$ 6,5 bilhões nos nove meses e US$ 5,0 bilhões só no terceiro trimestre. O texto diz que esse compute "currently costs significantly more than comparable compute procured under our multi-year commitments".

O prejuízo líquido nos nove meses foi de US$ 104 bilhões. Sozinho, o número assusta, e o próprio documento explica a maior parte. Dos US$ 104 bilhões, US$ 94,3 bilhões são variação do valor justo de notas conversíveis, passivos derivativos e SAFEs. O prospecto atribui isso "primarily driven by an increase in the fair value of our outstanding convertible promissory notes resulting from an increase in our enterprise valuation". Em outras palavras, a maior parte do prejuízo é efeito contábil da valorização privada da empresa.

O prejuízo operacional, que é a medida mais próxima da operação, foi de US$ 1,26 bilhão nos nove meses. Nos mesmos nove meses de 2025, tinha sido de US$ 5,2 bilhões. A empresa também apresenta um Adjusted Operating Income de US$ 4,1 bilhões, contra uma perda de US$ 3,1 bilhões no ano anterior. Métrica ajustada não é o mesmo que resultado operacional, e as duas não devem ser lidas como uma só. Pelo documento, a empresa ainda não é lucrativa.

Com a efetividade do registro, entram outros números. O prospecto traz um ajuste pro forma de US$ 7,5 bilhões de SBC em RSUs que vencem nesse momento. Há também US$ 24,1 bilhões de SBC ainda não reconhecido, que devem ser reconhecidos em cerca de dois anos.

Do lado dos compromissos, o número é maior. O total de gasto comprometido é de cerca de US$ 900,9 bilhões, somando compra e arrendamento de compute e infraestrutura, incluindo contratos de curto prazo e leases que ainda não começaram. US$ 451,6 bilhões vencem até 31 de dezembro de 2030, e o resto se concentra entre 2031 e 2045. Só nos doze meses seguintes a 30 de setembro, vencem US$ 70,7 bilhões. Para cobrir isso, a empresa tinha US$ 146,6 bilhões de liquidez nessa data: US$ 95,6 bilhões em caixa, US$ 36,3 bilhões em aplicações de curto prazo e US$ 14,8 bilhões em linha de crédito.

Parte da estratégia de capacidade está no que o prospecto chama de Anthropic Direct. A empresa deixou os contratos fixos de nuvem e passou a um modelo híbrido, em que arrenda chips diretamente e os hospeda em instalações dedicadas operadas em seu nome. Na prática, o custo deixa de ser só aluguel de capacidade de terceiros e passa a incluir operação própria.

Há ainda um dado de cadência que mexe com quem integra. O texto diz que "model versions released in the six months ended September 30, 2026 accounted for over 80% of our revenue for the three months ended September 30, 2026". Ou seja, versões lançadas nos seis meses até o fim de setembro responderam por mais de 80% da receita do terceiro trimestre. O documento lê isso como sinal de que a receita acompanha cada versão nova. O dado é sobre a receita da Anthropic, não sobre integrações de terceiros, mas a inferência que faço dele é que a camada que você integra envelhece mais rápido do que a documentação que você escreveu para ela. O prospecto também registra sazonalidade: nas duas semanas até 2 de janeiro de 2026, o gasto total dos clientes caiu cerca de 20% em relação às duas semanas até 19 de dezembro de 2025.

O que muda para o dev que escolhe fornecedor? Três coisas.

Primeira, dá para cobrar números. Receita, custo de compute, compromisso assumido e concentração de clientes agora estão num documento registrado. A conversa sobre preço e risco pode partir daí, e não de slide.

Segunda, a concentração de receita do fornecedor é visível. Nenhum cliente passou de 10% da receita nos nove meses, e a fatia que vem de fora dos cinco maiores subiu de cerca de 64% no primeiro trimestre para cerca de 79% no terceiro. Isso diz que a base está se abrindo. Não diz nada sobre o preço que você vai pagar no próximo trimestre.

Terceira, se a camada envelhece rápido, o desenho precisa aceitar troca de modelo. Isso significa abstração, testes que não dependem de um comportamento específico e custo de migração contado desde o início.

O que continua sem medição é o que decide adoção: se o código que o modelo escreve sobrevive à revisão, quanto retrabalho gera e qual é o custo por tarefa concluída. O documento não traz margem bruta nem qualquer medida de qualidade. O 90% diz quem escreveu, não se o resultado ficou bom. Para decidir com base nele, o critério útil é comparar fornecedores pelo que declaram e pelo que deixam de declarar.

<div class="persona" data-audio="/audio/anthropic-s1-quem-escreve-o-codigo-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Bruna">
    <img src="/personas/bruna.webp" alt="Retrato de Bruna, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Bruna</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 03: O que muda quando o fornecedor é obrigado a repetir a conta todo trimestre. Não é a narração do texto.</small></p>
