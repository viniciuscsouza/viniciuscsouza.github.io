---
title: "A OpenAI abriu a própria régua de progresso — e propôs um limite sem dizer onde ele fica"
author: Vinicius Costa
pubDatetime: 2026-11-23T10:15:00Z
slug: perplexidade-limite-comum
featured: false
draft: false
tags:
  - ia
  - openai
  - seguranca
  - engenharia
description: "A OpenAI publicou a log-perplexity dos seus modelos e propôs limites comuns. O post separa o que a série mede do que a proposta deixa em aberto."
---

Em 22 de novembro, Jakub Pachocki, Chief Scientist da OpenAI, publicou o ensaio [Perplexity and Intelligence](https://openai.com/index/perplexity-and-intelligence/). O ensaio traz a série de log-perplexity dos modelos da empresa desde o GPT-3.5 e defende que essa métrica sirva para comparar desenvolvedores e embasar padrões compartilhados de segurança. Antes de discutir a proposta, separo quem mediu o quê. Os números são da OpenAI, medidos num held-out dataset de avaliação da própria empresa. O autor admite que publicar essas medições "dá aos concorrentes uma visão mais clara de onde estamos", e diz que essa preocupação é superada pela urgência de medidas de segurança compartilhadas. Hoje a métrica não é uma escala comum entre laboratórios. O próprio texto propõe estabelecê-la.

Na minha leitura, o que o texto compromete é discutir um limite. O limite em si não aparece: o ensaio não põe número nele nem diz quem confere. É material para discussão, não para decisão.

## O que a série diz

A série tem estes pontos, com a capacidade que o autor associa a cada um:

- GPT-3.5, log-perplexity de ~0,99 no "current main evaluation dataset" da OpenAI: conversa fluente, base do ChatGPT original.
- GPT-4, ~0,91: uso produtivo de chain-of-thought, o que motivou a elicitação direcionada dessa capacidade e a criação dos modelos de raciocínio modernos.
- Abaixo de 0,8: capacidades "transformadoras" em áreas como cibersegurança e matemática.
- ~0,76: ao chegar a esse valor, o modelo passou a produzir resultados de ruptura em problemas abertos de matemática que a OpenAI vinha colocando aos modelos há mais de um ano.
- Entre 0,68 e 0,7: a janela em que o autor espera mais capacidades transformadoras. Ele diz que não sabe quais serão.

Os valores entre 0,68 e 0,7 não são limite proposto. São extrapolação do autor, que chega até lá a partir do progresso recente. Ele também admite que essas capacidades talvez nem estejam sendo testadas hoje.

Há duas coisas nessa série que são classificação do autor. A primeira é o rótulo "capacidades transformadoras", e o ensaio não traz medição independente dessas capacidades. A segunda é a ligação entre capacidade e limiar. O próprio texto diz que não estava nada claro, a priori, que essas capacidades apareceriam quando esses limiares de perplexity fossem atingidos. Com poucos pontos na curva, a ligação é hipótese.

## Perplexity no lugar do benchmark

O ensaio descarta benchmarks como régua: faz pouco sentido avaliar GPT-2 e GPT-3 na maioria dos benchmarks modernos, e os da época já estavam em grande parte saturados em torno do GPT-4. O autor aposta que olhar o progresso em pretraining continua informativo. O problema é outro. Trocar benchmark por perplexity tem um efeito colateral que o argumento não cobre: a métrica é difícil de comparar entre laboratórios, porque cada um mede no próprio conjunto.

O enquadramento mais discutido sobre automação da pesquisa fala em IA aumentando e substituindo pesquisadores humanos em todas as etapas do ciclo de desenvolvimento, com um ponto de inflexão no "full recursive self-improvement", em que o processo seria totalmente automatizado, sem supervisão humana. O autor diz que isso deixa escapar algo crucial. O salto viria da participação da IA numa parte-chave do desenvolvimento: a pesquisa algorítmica em pretraining.

O texto sustenta isso por extrapolação. Se a matemática mudou de repente, a pesquisa em deep learning poderia mudar também, e o autor acha isso plausível. Mas o próprio ensaio reconhece que essa área depende mais de experimentação, e não apresenta caso de avanço súbito dentro de pretraining.

## Os quatro desafios

O próprio ensaio lista quatro desafios para a métrica. Vão abaixo, com a leitura que faço de cada um.

Comparação entre laboratórios. Desenvolvedores diferentes usam datasets de avaliação diferentes e treinam com misturas de dados diferentes. O autor acredita que, se a transparência virar meta, dá para achar formas transferíveis de comparar a qualidade de modelos base. A proposta depende disso, porque o limite precisa ser medido por uma métrica que dê para acompanhar entre laboratórios. A resposta do texto é uma crença.

Descolamento de avaliações acionáveis. A perplexity não corresponde diretamente a uma tarefa que interessa. O motivo para medi-la é que avanços nela podem levar ao surgimento de capacidades totalmente novas. O número não diz o que o modelo faz bem. Um limite construído em cima dele regula um indicador e deixa a tarefa de fora.

Ganhos fora do pretraining. O chain-of-thought não reduz a perplexity alcançada pelo modelo, mesmo aumentando de forma drástica as capacidades. Esse é o desafio que mais revela. A métrica não enxerga o salto que o próprio texto atribui ao chain-of-thought, e um limite em perplexity deixaria esse salto de fora.

Piso desconhecido. O autor não espera que a loss chegue a zero, o que corresponderia a prever o dataset de forma totalmente determinística. A própria OpenAI não sabe qual é a entropia inerente aos dados. Perto desse piso, o avanço aparente em perplexity desacelera, mas ganhos menores vão corresponder a saltos maiores de inteligência. Sem saber onde fica o piso, nenhum delta de perplexity diz sozinho quanto de capacidade vale.

## O que a proposta fixa e o que deixa de fora

O texto propõe normas compartilhadas para avaliar esses modelos e fazer red-team dos safety cases antes do primeiro uso, com padrões compartilhados de transparência. Propõe também limites comuns, baseados em perplexity e em outras medidas, que os desenvolvedores se comprometam a não cruzar até que a capacidade de entender e monitorar o comportamento da IA atinja um marco concreto, como o desenvolvimento de um sucessor dos monitores de chain-of-thought. O texto também pede um padrão da indústria que especifique um primeiro limite, medido por alguma métrica-chave que dê para acompanhar entre laboratórios, e o que seria preciso alcançar antes de ir além dele.

A proposta não põe número no limite, e não dá prazo: a menção a 2027 é a possibilidade, que o autor considera concebível, de uma avalanche de avanços fundamentais em pretraining — não uma data. E não nomeia laboratórios signatários.

O autor espera que a IA contribua de forma significativa para o avanço em alinhamento e monitoramento. Mas acha improvável que esse progresso seja rápido o bastante para acompanhar a aceleração total possível em pretraining. Ele espera ainda mais degradação nas formas dominantes de auditoria de alinhamento e mais evaluation and training awareness.

## O que muda para quem constrói

O ensaio não cria obrigação e não diz quem confere o marco de monitoramento. O autor espera mais transparência sobre a métrica na indústria. Isso é um pedido.

Quem quiser usar a série como critério de risco precisa saber com que dados o modelo foi treinado e quem reproduz a medição. O ensaio diz que os números vêm do conjunto principal de avaliação da OpenAI, mas não traz a mistura de dados de treino da empresa.

Uma régua que o próprio autor admite ser difícil de comparar entre laboratórios não é especificação de segurança. É convite para discutir uma especificação. A consequência para quem constrói é direta. A série mede o progresso da OpenAI no conjunto de avaliação dela. Isso não serve para dizer se um modelo cruzou algum limite, porque o texto não fixa valor para limite nenhum. Até alguém escrever essa especificação, o número é uma medição interna da empresa.

<div class="persona" data-audio="/audio/perplexidade-limite-comum-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Nadine</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 52: Nadine cobra quem verifica um limite comum medido no dataset de quem o propôs. Não é a narração do texto.</small></p>
