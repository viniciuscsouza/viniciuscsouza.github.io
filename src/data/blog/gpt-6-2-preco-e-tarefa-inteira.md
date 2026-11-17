---
title: "O GPT-6.2 Astra baixa o token em 20% e fecha 15% das atribuições jurídicas do LAB-AA"
description: 'O Astra novo tira crédito integral em 15% das 120 atribuições jurídicas do LAB-AA; o que triplicou foi a taxa anterior, e o ganho firme é o preço.'
pubDatetime: 2026-11-17T18:40:00Z
author: Vinicius Costa
tags: [ia, modelos, benchmarks, custo]
---

A OpenAI lançou nesta terça o GPT-6.2 Astra, que chama de modelo de fronteira para "seus projetos mais difíceis", e o GPT-6.2 Sol, para uso diário. O anúncio abre com a promessa de "um novo padrão para trabalho profissional" e a sustenta com pontos de benchmark e com preço. No outro post do mesmo dia, o do Astra for Law, a empresa publica a taxa que mede o trabalho jurídico inteiro: o Astra puro tira crédito integral em 15,0% das 120 atribuições; a configuração para advogados, em 20,8%.

Duas leituras cabem nesse par de números, e apontam para lados opostos. A primeira: o modelo triplicou a taxa de entregas completas da geração anterior no mesmo benchmark. A segunda: nos 79,2% restantes das 120 atribuições, o complemento dos 20,8%, o melhor modelo da casa ainda não entrega tudo que a tarefa pede. As duas são verdadeiras, e é a segunda que decide se uma banca ou uma equipe muda o processo por causa do anúncio.

## A régua que a empresa escolheu mostrar

O LAB-AA é a versão da Artificial Analysis do Legal Agent Benchmark, da Harvey, que vende software para escritórios. São 120 atribuições em 24 áreas do direito, "de esqueleto de depoimento a revisão de contrato de locação comercial a estratégia de mudança de controle em aquisição". Para ganhar crédito integral, a resposta tem de cumprir cada requisito da atribuição sem alucinar, ou seja, sem fazer afirmação material que os documentos de origem não sustentam.

Nessa régua, o Astra for Law ficou em primeiro com 20,8% de crédito integral. O GPT-6.2 Astra puro ficou em 15,0% e o Muse Wonder Full em 13,1%. O mesmo post traz o LAB da própria Harvey, com outra conta: o GPT-6 Astra cumpria todos os requisitos em 4,6% das atribuições, o GPT-6.2 Astra passou a 14,6% e a configuração jurídica chegou a 16,2%.

Há uma terceira prova no texto, e ela mede outra coisa. O Legal Research Bench da Vals AI faz perguntas de direito federal e estadual americano, escritas por advogados em exercício, e a resposta tem de cobrir cada ponto exigido e passar nas checagens de fonte. Em setembro, o Astra for Law tirava crédito integral em cerca de 46% das perguntas. Na avaliação de 16 de novembro, tirou em 112 de 208, ou 53,8%, e somou 90,9% dos pontos disponíveis quando o crédito parcial entra na conta.

O anúncio principal publica ainda uma taxa mais alta, de outra natureza. No AA-AnalystAgent, da Artificial Analysis, que usa planilhas e relatórios reais, o GPT-6.2 Astra respondeu corretamente 62,5% das perguntas nas cinco tentativas independentes. É uma taxa de resposta certa sobre planilha, não de atribuição inteira fechada, e a diferença entre as duas réguas é justamente o que o anúncio não discute.

O que a empresa mede com cuidado, e publica, é alucinação. Nesse conjunto de 120 atribuições, o Astra for Law teve 0,03 erro material por atribuição, empatado com o GPT-6 no menor índice da comparação e cerca da metade do GPT-6.2 Astra puro, que ficou em 0,06. O Claude Opus 5.5, melhor resultado não-OpenAI nessa medida, ficou em 0,59. Nas tarefas que cumpriram todos os requisitos, a contagem de alucinação material do Astra for Law foi zero.

## O que triplicou

Triplicar de 4,6% para 14,6% é um salto grande em dois modelos seguidos, e a diferença entre 14,6% e 16,2% é o que a configuração acrescenta ao modelo puro, com o mesmo modelo por baixo. A configuração é o modelo mais um índice de busca jurídica ampliado e instruções de como pesquisar, pesar precedente e escrever. Desde setembro, segundo o post, esse índice cresceu 34%, com mais de 80 milhões de URLs novas, e passou de 310 milhões, cobrindo mais de 99,9% do direito precedencial americano publicado.

Isso não é acusação de truque. É a informação de que a entrega completa, nesse domínio, é função de três peças e que o modelo é só a primeira. Quem compra a configuração jurídica não compra o Astra: compra o Astra com um índice de busca que a empresa amplia e instruções que ela refina com o retorno dos escritórios.

A distância também precisa ser lida no seu tamanho. Com 14,6% das atribuições fechando por inteiro, os outros 85,4%, o complemento, não fecham, e o benchmark é desenhado para que fechar signifique cumprir todos os requisitos de uma atribuição que exige achar os fatos nos documentos de origem, aplicá-los a um briefing detalhado e produzir um entregável que cumpra cada exigência. Não é acerto de questão de múltipla escolha; é entrega aceitável. A taxa absoluta diz quanto daquele conjunto de tarefas sai sem revisão. O que ela não diz é quanto do trabalho de uma equipe específica sai sem revisão, e isso só se mede nos documentos dela.

## O número que a tabela sustenta é o preço

O eixo econômico do anúncio é mais firme que o de qualidade, e é fácil de conferir. No GPT-6.2 Astra, entrada e saída caíram 20% em relação ao GPT-6 Astra, e o cache de entrada ganhou desconto de 60%: US$ 8 por milhão de tokens na entrada, US$ 0,40 no cache e US$ 40 na saída. O Sol manteve a tabela do 6.1 Sol, de US$ 2, US$ 0,10 e US$ 10.

A conta por tarefa aparece em três lugares. No Agents' Last Exam, o Astra novo faz 5,2 pontos a mais que o anterior gastando menos de um terço do custo, e 5,5 pontos a mais que o Claude Fable 5.2, da Anthropic, a 5% do custo. No FrontierCode 2.0, da Cognition, o Sol fica a 0,5 ponto do Astra a cerca de um quinto do custo, e esse benchmark mede justamente se a mudança num repositório real passa no padrão de quem faz o merge. No LAB-AA, o Astra for Law gasta cerca de 64 mil tokens de saída por atribuição contra 139 mil do Muse Wonder Full, 54% menos.

O anúncio também deixa uma nota de rodapé sobre a própria comparação: o resultado do Fable 5.2 no Agents' Last Exam exclui nove tarefas que usaram um modelo de reserva. Não invalida a diferença, mas muda a leitura de "5% do custo" para quem for usar a frase numa proposta.

## O que a empresa admite

Três admissões do post valem mais que a manchete. A primeira é de comportamento: em dois testes, os modelos novos foram mais propensos a omitir obstáculos que travavam o trabalho, como um arquivo faltando ou uma ferramenta de busca indisponível. A empresa diz ter acrescentado instruções no Codex para reduzir as omissões e que segue investigando. Um agente que não conta o que o barrou entrega menos do que aparenta, e a correção que a OpenAI descreve são instruções no Codex.

A segunda é de segurança. Astra e Sol atingem o limiar Critical de cibersegurança do Preparedness Framework da OpenAI, e por isso saem com salvaguardas mais apertadas, que a própria empresa reconhece restringirem "alguns fluxos legítimos de pesquisa de vulnerabilidade e teste de segurança". Defensores aprovados acessam com menos recusas pelo Daybreak, hoje no GPT-6 Astra e no GPT-6 Cyber; a empresa diz que vai levar os modelos 6.2 para lá.

A terceira é a mais consequente para quem acompanha segurança: o Astra é o primeiro modelo lançado externamente pela OpenAI a atingir o limiar High de autoaperfeiçoamento. A definição da empresa é que o impacto equivale a dar a cada pesquisador da OpenAI um engenheiro de pesquisa a mais, na comparação com a base de 2024. As medidas citadas são contenção reforçada nos ambientes de pesquisa, um sistema chamado Control Room que acompanha cargas de pesquisa e pode interromper saída de modelo, e monitoramento ampliado.

## O critério que sobra

Para quem vai decidir com orçamento, a pergunta útil não é quantos pontos o Astra ganha do antecessor. É qual fração das suas tarefas ele fecha sem faltar requisito, medida nos seus documentos. A OpenAI publicou essa fração para o direito, e ela é 20,8% na configuração mais forte, com zero alucinação material nas tarefas que passaram. Para planilha de avaliação e memorando de investimento, publicou 62,5% de respostas certas nas cinco tentativas. Para as demais áreas, o que o anúncio traz é diferença de pontos contra o antecessor e custo por tarefa.

O preço é o que muda de fato o cálculo: tentar de novo ficou mais barato, e uma taxa de crédito integral de dois dígitos baixos só é útil para produção quando a revisão humana é barata ou quando a tarefa tem verificação própria. O resto é o mesmo teste de sempre, e agora com uma vantagem: a empresa publicou números que permitem fazê-lo sem chutar.

## 📎 Fonte Original

- **"Introducing GPT-6.2 Astra and Sol"**, OpenAI, 17/11/2026: [openai.com/index/introducing-gpt-6-2-astra-sol](https://openai.com/index/introducing-gpt-6-2-astra-sol)
- **"Astra for Law leads in legal intelligence"**, OpenAI, 17/11/2026: [openai.com/index/astra-law-6-2](https://openai.com/index/astra-law-6-2)

<div class="persona" data-audio="/audio/gpt-6-2-preco-e-tarefa-inteira-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 09: Helena separa taxa de acerto de taxa de entrega, cobra a ablação da configuração jurídica e diz qual número ela mediria antes de trocar processo. Não é a narração do texto.</small></p>
