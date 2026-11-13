---
author: "Vinicius Costa"
pubDatetime: 2026-11-13T16:30:00Z
title: "Dreaming cria uma segunda memória e deixa você escolher qual fica"
slug: "dreaming-memoria-com-rollback"
description: "O Dreams, da Anthropic, roda fora da sessão e devolve uma memória nova, sem tocar na original. Os testes mostram quando a wiki ajuda e quando só pesa."
tags:
  - inteligencia-artificial
  - agentes
  - memoria
  - anthropic
draft: false
---

Dreams é um recurso dos Claude Managed Agents, da Anthropic, em research preview. Ele recebe um memory store existente — onde o agente guarda o que aprendeu — junto com de 1 a 100 sessões em forma de transcrição, e produz outro memory store a partir disso. A razão de existir está na própria documentação: agentes escrevem na memória de forma local e incremental, e ao longo de muitas sessões o store acumula duplicatas, contradições e entradas velhas. O Dreams faz essa curadoria num job, fora da tarefa, em vez de no meio dela. Para quem opera agente com memória, isso desloca a pergunta: deixa de ser só "o que o agente lembra" e passa a ser "quando e como a memória é reescrita".

Vale tratar o Dreams como arquitetura de job, não como detalhe de API. Três escolhas de desenho aparecem na documentação.

A primeira é a entrada imutável. O store de entrada nunca é modificado. Para que o dream escreva nele, é preciso declarar `output_behavior: update_existing`. O padrão é `create_new`, que produz um store novo e deixa o original como está.

A segunda é a saída separada. O resultado chega como outro memory store, e o job passa pelos estados `pending`, `running` e, por fim, `completed`, `failed` ou `canceled`. Enquanto roda, dá para acompanhar o pipeline pela sessão interna do dream. Se o resultado não convencer, a saída é descartada, e a memória original nunca foi tocada.

A terceira é o direcionamento. O campo `instructions` é opcional, com até 4.096 caracteres, e orienta a leitura do job. O recurso só aceita modelos da lista suportada, e o campo `speed` aceita apenas `standard`.

## O que muda: a forma do erro

Com escrita local e incremental, cada sessão altera a memória um pouco, e o estrago só aparece depois, quando o agente responde com base numa entrada velha ou contraditória. Com um job à parte, existe um momento explícito de promoção: alguém, ou um critério, decide se a saída vira a memória de trabalho.

Nesse modelo, reverter é não promover a saída. Não há desfazer no sentido de editar o store antigo, porque ele nunca mudou. Erro de memória deixa de ser corrupção silenciosa e passa a ser uma decisão que ficou registrada em algum lugar — e é isso que muda o custo de operar, não a limpeza em si.

## Os números, com o recorte certo

O relatório da Anthropic "The components of agent memory", de 6 de novembro de 2026, usa um corpus interno do Stainless, com cerca de 350 mil arquivos e aproximadamente 420 milhões de tokens, e 25 perguntas de avaliação. O número mais citado dele é 13% para 48%. Ele vem de uma wiki construída pelo dreaming ao longo de 128 sessões. Com apenas 2 sessões, a nota era 13%. Para a wiki sozinha, 48% é o melhor caso do relatório, não a média de tudo o que foi testado.

Wiki com ferramenta de busca foi outro arranjo. A nota agregada subiu de 54% para 61% conforme a wiki crescia, contra 53% com busca sozinha, e a economia foi de cerca de 20 mil tokens por pergunta. Nesse caso, o ganho veio de somar as duas coisas: a wiki não substituiu a busca.

O recorte que sustenta a tese é outro. Num teste com documentos de uma fusão, com 24 perguntas, das quais mais da metade exigia juntar informação de vários documentos e algum julgamento ou conta, a wiki chegou a 87% contra 73% da busca sozinha. A vantagem aparece onde a resposta está espalhada.

E o recorte que mais pesa contra é o terceiro. Numa tarefa do benchmark Harvey LAB, cuja resposta se obtém com busca textual em um único documento, a wiki não trouxe ganho claro. Em outra tarefa, a wiki ficou maior que os próprios documentos. A wiki não ajudou justamente quando a resposta já era fácil de localizar.

## Dreaming é uma aposta sobre a forma da pergunta

A leitura que me parece mais útil não é que o dreaming faz o agente lembrar mais. Ele reorganiza a memória para perguntas que cruzam fontes. Quando a pergunta cai num ponto específico de um documento, a busca resolve, e a wiki vira mais uma coisa para manter, validar e eventualmente deixar errada. Quando a pergunta atravessa documentos, a wiki faz em antecipação a síntese que, sem ela, fica para cada resposta.

## A decisão de adotar

Os dados dão vantagem em recortes específicos — principalmente nas perguntas que juntam vários documentos — e dão ausência de ganho claro em pelo menos um caso, com uma wiki que cresceu maior que a fonte. São 25 perguntas e 24 perguntas em dois conjuntos de avaliação, num corpus interno. Isso sustenta uma hipótese de trabalho, não uma regra geral.

O passo prático é medir no seu agente antes de mudar a arquitetura: separar as perguntas que a memória deveria responder, rodar o conjunto com busca sozinha, depois com busca mais memória, e comparar. Sem essa medição, o que sobra é a impressão de que a memória melhorou.

Não vale construir quando a resposta costuma estar num documento só e se encontra com busca textual. Também é sinal de alerta quando a wiki passa a ser maior que a fonte: aí a memória virou um segundo corpus para manter, e o ganho precisa aparecer na nota para justificar esse custo.

Sobre prompt, o relatório diz que o que orientou o modelo foi dizer para que serve a memória, e não como usá-la. Instruções com regras específicas, uma por teste, não superaram essa orientação geral. A implicação para quem escreve prompt de agente é dar mais espaço ao propósito: explicar o que a memória é para, quem vai consultá-la e que tipo de pergunta ela deve responder. O relatório não explica o motivo do resultado, então vale lê-lo como observação de um conjunto de casos, não como regra.

## O que é documentação e o que é folclore

Na documentação oficial, o Dreams está em research preview, com o header beta `dreaming-2026-04-21`, na seção de Claude Managed Agents. A documentação do Claude Code, por sua vez, descreve outra coisa. A memória ali tem duas camadas: arquivos CLAUDE.md, escritos pela pessoa, e a auto memory, escrita pelo próprio Claude. A auto memory carrega as primeiras 200 linhas ou 25 KB em cada sessão, por repositório. Subagentes também podem manter memória própria.

O que não está nessa página é o termo "dreaming". "AutoDream" aparece em forks e em documentação comunitária, não na documentação oficial do Claude Code. Não há base, nessa documentação, para afirmar que o AutoDream foi liberado no Claude Code, e este texto não faz essa afirmação. Quem quiser usar esse nome precisa conferir o código ou a documentação oficial na data em que for usar.

## O que fica para quem opera

Se você adotar o Dreams, a decisão que passa a existir não é "construir ou não construir wiki". É quem promove a saída a memória de trabalho: uma pessoa revisando, um conjunto de testes que precisa passar, ou nenhum dos dois — e nesse último caso a saída vira a memória por padrão. O default da API é `create_new`, ou seja, o original fica intacto até alguém declarar `update_existing`. Essa escolha, mais que a qualidade do texto que o job produz, define quanto risco você está aceitando.

A segunda decisão é a cadência: o job é assíncrono e não se agenda sozinho. Rodar a cada sessão, toda semana ou só quando o store acumular contradição são políticas diferentes, com custos diferentes. A terceira é o que conta como regressão: sem uma pergunta de referência que a memória antiga respondia bem, você não tem como saber se a nova memória piorou. É a pergunta que a documentação não responde e que decide se o recurso vira ganho ou passa a ser só mais uma coisa para manter.

<div class="persona" data-audio="/audio/dreaming-memoria-com-rollback-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 59: Séria e analítica: separa memória nova de memória corrigida e cobra um teste de regressão antes do primeiro dream. Não é a narração do texto.</small></p>
