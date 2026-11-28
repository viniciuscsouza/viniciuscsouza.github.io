---
author: Vinicius Costa
pubDatetime: 2026-11-28T14:00:00Z
slug: mixture-of-loops-transformer
title: "Mixture-of-Loops Transformer em palavras simples: o que muda quando o modelo passa memória entre loops"
featured: false
draft: false
tags:
  - ia
  - pesquisa
  - transformers
  - modelos-de-linguagem
description: 'Paper novo propõe passar memória entre loops para gerar tokens com uma passagem só. Explico o mecanismo, os números e os limites.'
---

## Sumário Executivo

Em 25 de novembro de 2026, pesquisadores da HUST, com a ByteDance Seed e a Universidade de Toronto, submeteram ao arXiv o paper do Mixture-of-Loops Transformer (MoLT) e publicaram o código no GitHub. O trabalho muda como um modelo de linguagem, o programa por trás de chatbots e assistentes de escrita, gera cada pedaço de texto. Importa porque ataca um custo conhecido: reaproveitar as mesmas camadas várias vezes dá mais processamento, mas deixa a resposta mais lenta.

A ideia central é que o modelo deixe de empurrar todo o resultado de uma passada para a seguinte e carregue só uma memória específica. Assim, cada pedaço novo de texto pode ser gerado numa única passagem. Nos testes, a variante U-MoLT (que separa quem guarda memória de quem prevê) alcança o erro de previsão final do OLMo3, o modelo de referência dos autores, com 232,8 bilhões de tokens de treino em vez de 400 bilhões: 41,8% menos dados. Os experimentos param em modelos de até 3 bilhões de parâmetros, e o paper diz que o comportamento em escalas maiores ainda é pergunta aberta.

## Um leitor relendo o mesmo livro

Pense num leitor diante de uma pilha de camadas. Essa pilha é o livro: cada camada é uma etapa que acrescenta compreensão ao texto. O texto chega em tokens, pedaços de uma palavra ou uma palavra inteira, a unidade que o modelo processa de cada vez.

Cada etapa tem uma atenção, a parte que decide quais palavras anteriores merecem ser consultadas para a palavra atual. Um modelo comum lê uma vez, de cima a baixo, e cada etapa passa o resultado à seguinte.

Um modelo com loops faz o leitor passar pelos mesmos degraus mais de uma vez, com as mesmas camadas e os mesmos pesos (os números que o treino ajusta). Cada releitura é um loop; a primeira é o loop 1, e as seguintes o paper chama de feedback loops.

Faltam duas peças. A primeira são as margens. O estado residual é o rastro que sai de uma etapa e entra na seguinte, como as anotações que o leitor leva de uma leitura para a outra. A segunda são as fichas. O KV, de keys e values, é um par guardado para cada palavra lida: a chave diz onde procurar, e o valor é o conteúdo daquele ponto. Quando a atenção olha para trás, compara a pergunta atual com as chaves e lê os valores que importam.

Com isso, a atenção do MoLT, chamada MoLA, fica simples. Ao olhar para trás, o leitor consulta duas fontes: as palavras anteriores do texto, que o paper chama de contexto, e as fichas que as releituras anteriores deixaram sobre a mesma palavra, a profundidade. Não há um peso fixo por releitura. A própria pergunta decide quanto usar de cada fonte.

## O problema: cada releitura espera a anterior

Num loop comum, o que sai de uma releitura entra direto na seguinte, pelas margens. Para a palavra atual forma-se uma cadeia: a releitura 2 depende do que a 1 escreveu, a 3 depende da 2, e assim por diante.

Na geração, o modelo escreve um token por vez, e cada token novo precisa atravessar todas as releituras em sequência. Com duas releituras, cada palavra custa duas passagens completas. É como um leitor que não pode virar a página antes de terminar as anotações de cada passada.

## O que o MoLT passa a fazer

O MoLT muda o que é carregado de uma releitura para a outra. A variante MoLT-R mantém as margens, mas deixa a atenção ler diretamente as fichas da releitura atual e da anterior. Ganha expressividade, mas ainda exige uma passagem por releitura para cada token.

A variante que interessa para a velocidade é o MoLT-KV. Aqui cada releitura recomeça do próprio token, sem as margens, e o que passa adiante são só as fichas. Da releitura anterior, a atenção lê fichas apenas de posições estritamente antes da atual; da releitura corrente, lê também as fichas escritas para a própria palavra. O que desaparece é a dependência do resultado que a palavra atual produziu na releitura anterior. Ela passa a consultar o histórico de palavras fechadas mais as fichas da releitura corrente.

## Por que uma passagem basta

Como as fichas das palavras anteriores não mudam mais, o modelo pode guardá-las num cache, uma gaveta de consulta rápida. Para gerar uma palavra nova, o token atravessa a pilha uma única vez: lê as fichas guardadas, produz a própria ficha e a acrescenta à gaveta. O paper chama essa geração de decodificação MoL.

Para aprender isso, os autores usam o loop forcing: a previsão é supervisionada em todas as releituras ao mesmo tempo, em vez de só na última. Antes de gerar, o modelo lê o prompt inteiro, numa etapa chamada prefill. Na decodificação MoL pura, o prompt também passa token a token, por isso essa variante é mais lenta que as híbridas.

## A versão U-MoLT: quem lê não escreve de volta

A terceira variante separa papéis. Um encoder, com as releituras, constrói a memória de fichas a partir do texto. Um decoder só lê essas fichas para prever a próxima palavra e não escreve de volta no encoder. Por isso, o decoder pode ser pulado nas releituras intermediárias e nas posições do prompt que não pedem previsão, sem mudar a previsão final, segundo o paper.

Combinada com o MoL-Hybrid, que lê o prompt em paralelo com uma ou duas releituras e depois gera no modo MoL, essa versão fica, nos testes de latência, perto do modelo sem loop.

## Os números do paper

CE (cross-entropy) é o erro de previsão do modelo; quanto menor, melhor. Perplexidade é a mesma ideia em outra escala, ligada a quanto o modelo se surpreende com o texto; também quanto menor, melhor.

Qualidade. A 700 milhões de parâmetros, a eficiência de tokens chega a 1,7× em CE de validação. MoLT-R e U-MoLT sobem a acurácia média de 10 tarefas em 2,6 e 2,5 pontos percentuais (59,2% e 59,1%, contra 56,6%). No modelo 3B MoE (mixture of experts, arquitetura que ativa só parte dos parâmetros em cada token), de 660 milhões de parâmetros ativos, a perplexidade média de 10 domínios cai 0,75, e a acurácia média de 10 tarefas sobe 2,1 pontos percentuais.

Custo. O acréscimo é de 1,50% de parâmetros. Treinar com 2 loops usa 2,01× o FLOPs teórico (contagem de operações matemáticas), 1,99× o tempo de parede e 1,34× a memória de pico.

Latência. Medida num modelo de cerca de 113 milhões de parâmetros, com prompt de 4.096 tokens, 64 passos de geração, uma GPU H20 e uma requisição por vez: o OLMo3 sem loop leva 1.000,6 ms; o loop com duas releituras fixas, 1.974,3 ms; o MoLT-KV com MoL-Hybrid-1, 989,5 ms; o U-MoLT com o mesmo arranjo, também 989,5 ms.

Decodificação. Em 7.168 pontos de previsão, o U-MoLT com duas releituras fixas leva 23,43 s; com MoL-Hybrid-2, 16,87 s, 28,0% a menos. O MoLT-KV cai de 31,51 s para 16,85 s com MoL-Hybrid-2, 46,5% a menos. Na perplexidade, a diferença em relação ao loop fixo fica entre −0,012 e +0,039.

Memória. Com MoL, o cache de fichas tem o tamanho de um Transformer comum com o mesmo número de camadas. O loop tradicional guarda N vezes isso.

Benchmarks. Em BPB (bits por byte, quanto menor melhor), o U-MoLT melhora 44 das 55 avaliações de 11 benchmarks, com média de 1,094 para 1,075. BPB mede a probabilidade dada à resposta certa com o texto à vista, não a taxa de acerto em geração livre.

Continuação de treino. Sobre o Qwen3.5-0.8B-Base, com 100 bilhões de tokens extras, o U-MoLT-CT1 reduziu a CE média de 2,496 para 2,480 em 11 domínios, com melhora em todos eles. O custo foi de 3,15 milhões de parâmetros a mais, 0,42% do modelo original.

## O que eu tiro disso

O ponto que mais me interessa é a memória, não a qualidade. Se o cache crescesse com o número de releituras, o loop sairia caro na geração. Com MoL, ele tem o tamanho de um Transformer comum com as mesmas camadas, contra N vezes do loop tradicional.

O custo de treino pede cuidado. Os 41,8% a menos de tokens não são 41,8% a menos de conta: treinar com 2 loops usa 2,01× o FLOPs teórico e 1,99× o tempo de parede. A comparação com FLOPs iguais não foi feita no paper, como detalho abaixo.

A latência de 989,5 ms, abaixo dos 1.000,6 ms do OLMo3 sem loop, é o número que mais chama atenção. Mas é medida com modelo pequeno e uma requisição por vez. O paper não mostra o comportamento com várias requisições ao mesmo tempo.

## O que fica de fora

Escala. Os experimentos param em 700 milhões e 1,5 bilhão de parâmetros densos e em 3 bilhões no MoE. Na seção 5, "Scaling to larger models", os autores dizem que como os ganhos evoluem em modelos maiores é pergunta aberta.

Mesmo cálculo. Uma comparação com FLOPs iguais exigiria uma run dedicada, com decaimento em 198,9 bilhões de tokens. O paper não a fez (seção A.1).

Recursão. O treino com 2 loops não ensina o modelo a ganhar com releituras extras. A estabilidade medida em 7.168 alvos é curta perto de uma conversa longa (seção B.2).

Qwen3.5. As camadas GDN do decoder mantêm dependência de estado, com janela de 28 tokens, e a CT2 não consegue pular o decoder de forma exata num único token (seção 4.5).

Latência. É medição de pesquisa numa H20, com requisição única e modelo de cerca de 113 milhões de parâmetros. Não é benchmark de serviço em produção.

Estabilidade. No MoL-Hybrid, as saídas do prompt ficam congeladas nas releituras 1 ou 2. A garantia completa de estabilização vale só para o MoL com cache vazio (seção B.1, Corollary 2).

## Conclusões

Fica uma pergunta que o paper não responde e que o código público permite formular: ao treinar até o fim com o mesmo orçamento de cálculo, a vantagem de tokens sobrevive? Sem essa medição, o resultado é uma promessa de arquitetura, não uma receita de custo. É o que eu olharia antes de trocar um pipeline por causa de 1,7×.

## 📎 Fonte Original

Lianghui Zhu, Shijie Wang, Xinggang Wang, Jinze Bai, Bo Wang e Xiang Bai, "Mixture-of-Loops Transformer", arXiv:2611.34923v1, 25 de novembro de 2026. Leitura: [alphaXiv](https://www.alphaxiv.org/abs/2611.34923). PDF: [arXiv](https://arxiv.org/pdf/2611.34923v1). Código: [github.com/hustvl/MoLT](https://github.com/hustvl/MoLT).

Referências complementares:

1. [Olmo 3](https://arxiv.org/abs/2512.13961), v1 de 15/12/2025 e v2 de 14/04/2026. Modelo de 7B e 32B totalmente aberto, usado como baseline dos autores na comparação de 400 bilhões de tokens.
2. [Universal YOCO for Efficient Depth Scaling](https://arxiv.org/abs/2604.01220), de 01/04/2026. Self-decoder recursivo com KV global constante, uma das inspirações do encoder/decoder do U-MoLT.
3. [Mixture-of-Depths Attention (MoDA)](https://arxiv.org/abs/2603.15619), de 16/03/2026. Mecanismo que lê KV de sequência e de profundidade numa mesma atenção, generalizado pelo MoLA para loops.

<div class="persona" data-audio="/audio/mixture-of-loops-transformer-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Nadine</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 52: Nadine cobra a contabilidade escondida atrás do 1,7×. Não é a narração do texto.</small></p>
