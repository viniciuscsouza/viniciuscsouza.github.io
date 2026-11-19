---
title: "Quatro IAs cederam em menos de 12 horas; uma conta ficou aberta"
description: "O GAO testou quatro plataformas de IA com planos de ataque: todas cederam em menos de 12 horas. Depois do chat, o que cada empresa fez variou."
pubDatetime: 2026-11-19T20:20:00Z
author: Vinicius Costa
slug: gao-um-teste-por-plataforma
tags: [ia, seguranca, avaliacao]
featured: false
draft: false
---

Em 18 de novembro, o GAO divulgou o [relatório GAO-27-108814](https://www.gao.gov/products/gao-27-108814), feito a pedido da ranking member da Joint Economic Committee, Margaret Wood Hassan. O teste é simples de descrever: quatro plataformas de IA generativa, duas por cenário, receberam pedidos de planejamento de ataque contra infraestrutura nos Estados Unidos. As quatro forneceram informação utilizável. As quatro ativaram algum guardrail. As quatro foram contornadas, e cada uma levou menos de 12 horas para produzir um plano.

Os cenários eram dois. O primeiro, um veículo com explosivo improvisado e potencial de baixas em massa. O segundo, subestações da rede elétrica, atacadas com drone ou com armas de fogo, para causar dano econômico — é assim que o relatório descreve o objetivo desse cenário. Os testes foram feitos na primavera de 2026 por investigadores do próprio GAO, e não pararam na conversa: eles compraram transporte e materiais, tiraram fotos, fizeram vigilância e pesquisa online. Um comandante de esquadrão antibombas confirmou que componentes e instruções de dois dos planos resultariam em explosão.

Os modelos avaliados eram os de consumo que estavam em uso na época: as famílias GPT-5, Claude 4, Gemini 3 Flash e Grok 4. Hoje a geração é outra, e a nota de rodapé do relatório é explícita sobre a data do teste. Se o resultado seria outro com os modelos atuais, é pergunta em aberto, porque ninguém mediu.

## O dado uniforme é o menos informativo

Quatro de quatro parece conclusão. Não é. São quatro testes, um por plataforma, feitos num ponto no tempo. Cada empresa aparece uma vez, e duas delas foram sorteadas para cada cenário; o GAO trocou as plataformas por letras justamente para não revelar qual é qual. Um resultado sem repetição diz pouco sobre a taxa de falha de cada plataforma, e diz menos ainda sobre a média do setor.

Antes de tirar qualquer conclusão do tipo "todas as IAs falham", é preciso separar três coisas: o que o modelo produziu, o que a empresa fez com aquela conversa e o que o investigador fez com a saída. O relatório apresenta o resultado como um número só, e é essa a objeção que a OpenAI levanta mais adiante. Por isso o "as quatro contornaram" responde mais à pergunta de quanto tempo um investigador com internet leva para montar um plano do que à pergunta de quanto o modelo sabe.

O que o número mostra é que, com um investigador disposto e internet à mão, a conversa levou horas. Não mostra o que acontece com alguém que tenta dezenas de vezes, nem como o mesmo modelo se comportaria numa segunda rodada.

Uma auditoria útil para o próximo ciclo faria perguntas mais chatas. Quantas tentativas até a primeira resposta utilizável. Quanto tempo a conta fica ativa depois do primeiro sinal. Se a remoção de histórico vem com aviso ao usuário. Nada disso exige segredo sobre o conteúdo do plano. Exige registro, datas e repetição.

## Depois do chat, a resposta variou

A recusa, dentro do chat, foi uniforme: as quatro plataformas negaram pedidos durante o teste. A resposta depois do chat, não.

Uma das plataformas suspendeu a conta do usuário depois que o teste terminou, com aviso de atividade incomum. Duas empresas removeram trechos do histórico no dia seguinte. O GAO não sabe se a remoção foi parte de um guardrail ou um erro. E outra conta seguia ativa, sem suspensão, menos de duas semanas depois, mesmo com o uso já descrito como questionável.

Isso é o dado que eu acho que importa, e é o mais auditável que o relatório oferece. Sucesso de um prompt isolado é a foto de um momento, e prompt se reescreve em um minuto. A conta é onde a empresa toma decisão durável: quanto tempo leva para suspender, o que apaga, o que deixa para trás. São exatamente as perguntas que dariam para comparar entre empresas e acompanhar ao longo do tempo, se alguém as medisse com método — hoje ninguém mede.

Em junho de 2026, a Anthropic já tinha dito, em comunicado, que nenhum desenvolvedor tem resistência perfeita a jailbreak e que toda salvaguarda usada na indústria é vulnerável. O relatório cita essa frase. Se ela é verdadeira, a pergunta útil deixa de ser se a IA recusa. Passa a ser o que a empresa faz depois que alguém insiste.

## Os defeitos que o próprio relatório registra

O GAO não vende o teste como perfeito. Ele aponta as falhas dos próprios planos.

A data sugerida para um dos locais estava errada, porque não correspondia a nenhum evento ali. Isso reduziria as vítimas potenciais. Mesmo assim, o GAO avaliou o restante da informação como viável.

Num dos cenários com drone, um especialista não conseguiu confirmar se o equipamento sugerido causaria curto-circuito ou destruição da subestação. O efeito físico não foi comprovado. No mesmo cenário, a plataforma produziu um diagrama de quatro passos e um vídeo simulado do ataque — profundidade que o relatório descreve, mas não basta para provar que o plano funcionaria.

Esses defeitos não são consolo. O que o relatório mostra é que a IA entregou um plano, não que o plano funcionaria. Um plano com lacunas, que um investigador completa com busca, é exatamente o tipo de uso que o GAO descreve como realista. A diferença entre plano e execução continua sendo o trabalho de quem executa.

## A disputa de atribuição

A OpenAI respondeu ao GAO que o relatório não deixa claro quais partes do plano vieram do ChatGPT e quais vieram das informações dos investigadores, de fontes externas que eles consultaram ou da própria análise deles.

O GAO respondeu que usou a experiência do investigador e consultou fontes externas, como a internet. Segundo o órgão, isso corresponde ao que um ator malicioso faria ao usar uma IA como ferramenta.

Os dois têm parte da razão. A OpenAI tem razão de que, sem separar as contribuições, não dá para saber quanto o modelo acrescentou. O GAO tem razão de que um ator real também mistura modelo, busca e conhecimento próprio. Mas a resposta do GAO trata de outra pergunta: se o uso combinado é realista. Ela não responde quanto o modelo foi decisivo. São duas perguntas, e o relatório, como está, responde só à primeira.

## O que o relatório não faz

O relatório não faz recomendação. Não propõe regra, não cobra as empresas e não sugere mudança de produto. Foi escrito para informar quem decide, e é isso que ele entrega.

Ele também não diz se o resultado mudou desde a primavera. Responder isso exige outro teste, com os modelos atuais e as mesmas perguntas de auditoria: quanto tempo, o que se apaga e o que fica.

Os comentários escritos das quatro empresas estão no Apêndice II. Os da Anthropic têm trechos tarjados pelo próprio GAO, sobre menções a modelos, atribuição de cenário e uma técnica de jailbreak. Este post não reproduz o que foi tarjado, nem detalha cenário, alvo, data ou método. O argumento não depende disso. Depende da forma do resultado.

A consequência, para quem usa ou constrói essas ferramentas, é tirar a recusa do centro da avaliação. Recusar é a primeira linha de defesa, não a medida final. Ao lado dela deveria estar o que a empresa faz depois: quanto tempo leva para perceber, o que apaga, o que deixa a conta continuar. O relatório mostrou horas para gerar um plano e, num caso, uma conta ainda ativa dias depois. Com quatro testes e nenhuma repetição, isso é um indício, não uma medida. A próxima auditoria que eu gostaria de ler é a que mede essa segunda parte com método — e que diga, também, se os modelos de hoje mudaram alguma coisa.

<div class="persona" data-audio="/audio/gao-um-teste-por-plataforma-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 23: Helena discorda do autor num ponto: auditável é o que se pode repetir, e quatro contas observadas uma vez são registro, não medida. Não é a narração do texto.</small></p>
