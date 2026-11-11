---
author: Vinicius Costa
pubDatetime: 2026-11-11T18:45:00Z
title: "Gemini Decisions API: a pergunta quase não custa, a conta é o contexto"
slug: gemini-decisions-api
featured: false
draft: false
tags:
  - inteligencia-artificial
  - agentes
  - modelos
  - google
description: 'O Gemini Decision 1 cobra a entrada uma vez e nada pela saída: com mil perguntas por requisição, a conta de decidir passa a ser o contexto.'
---

Em 11 de novembro de 2026, o Google anunciou a Gemini Decisions API, um endpoint novo da Gemini API disponível no Google AI Studio, movido pelo modelo Gemini Decision 1 (gemini-decision-1), da equipe do Google DeepMind. O anúncio é assinado por Min Choi, product manager, e Felix Yu, principal scientist, ambos do DeepMind. A proposta é resolver decisões de conjunto fechado: seleção de ferramenta, checagem de política, roteamento de modelo e o que o release chama de context grading. Para quem escreve agente, o que importa menos é o modelo e mais o que muda na conta de quanto custa decidir.

Antes do preço, vale descrever o mecanismo, porque a diferença está nele. Um modelo generativo decide escrevendo: a resposta sai token por token, e a decisão aparece como texto. O Gemini Decision 1 não faz isso. Ele pontua as opções candidatas em um único forward pass e devolve probabilidades e escores de confiança entre 0 e 1. A entrada é única e multimodal — texto, imagens, áudio, vídeo e PDF —, de até 256 mil tokens, e nela cabem até 1.000 perguntas independentes na mesma requisição. Cada pergunta é de um de três tipos. O tipo noul é sim ou não, com critérios opcionais de verdadeiro e falso. O tipo choice escolhe entre 2 e 255 opções e devolve o vencedor com as probabilidades normalizadas de cada candidata. O tipo score avalia uma rubrica ordenada a partir de zero e devolve um escore contínuo ponderado e a probabilidade de cada nível.

O preço é o número que muda a conta. A entrada custa US$ 0,10 por milhão de tokens e a saída custa zero. A parte compartilhada, ou seja, o contexto, é cobrada uma vez por requisição, qualquer que seja o número de perguntas; cada pergunta acrescenta só os próprios tokens de instrução e critério. Não há cobrança por token de saída, por thinking tokens variáveis, nem por transcrição de áudio ou OCR separados. O Google AI Studio tem um tier sem custo para prototipar.

Com os números da tabela, uma requisição de 256 mil tokens de entrada custa US$ 0,0256, valendo isso tanto para uma pergunta quanto para mil. Com 16 mil tokens, a requisição custa US$ 0,0016; se você fizer mil perguntas sobre essa mesma entrada, cada pergunta sai por US$ 0,0000016. A conta é simples, e a consequência é o que interessa. Quando a entrada é fixa, o custo marginal de perguntar cai para quase nada, e o que pesa passa a ser o tamanho do contexto. Numa chamada generativa, cada pergunta pedia uma resposta própria, e os tokens de saída entravam na conta — o release enfatiza justamente não cobrar nenhum. Aqui a conta cresce com o que você carrega, não com o tanto que você pergunta.

Essa inversão muda a otimização. Quem enche a requisição com 256 mil tokens de log bruto paga mais do que quem faz mil perguntas sobre 16 mil tokens bem escolhidos. Um agente que despeja o histórico inteiro, a documentação completa e todos os logs da sessão paga por tudo isso, mesmo que a decisão dependa de duas linhas.

Há uma consequência prática que me parece a mais útil do anúncio. Quando o custo marginal por pergunta cai, a pergunta redundante deixa de ser desperdício de dinheiro. Dá para fazer perguntas sobrepostas, rubricas com níveis e checagens cruzadas na mesma passada, em vez de tentar escolher a única pergunta certa. Uma checagem de política pode vir acompanhada de uma pergunta sobre o escopo e de outra sobre a presença de dado sensível, e cada resposta serve de controle para as outras. Desperdício de dinheiro, note, não de trabalho: as instruções ainda custam tokens, e decisões que se contradizem custam revisão. O gargalo sai do custo por chamada e vai para a qualidade do critério escrito e para o tamanho do que você manda junto.

A outra consequência é menos vistosa e, para mim, mais importante. A decisão ficou muda. Sem token de saída, o que você recebe é uma probabilidade, não uma justificativa. O rastro de auditoria encolhe para o conjunto de perguntas que você escreveu e o número que voltou. Quem revisa não lê por que o modelo decidiu, lê o que foi perguntado. Para decisão fechada dentro de pipeline, como rotear uma requisição ou escolher uma ferramenta, isso basta, e a ausência de texto até simplifica. Para qualquer coisa que precise ser explicada a um humano depois, o custo da explicação não sumiu: trocou de dono. Quem escreve a pergunta passa a responder pelo que ela implica.

Sobre desempenho, o release afirma que o modelo lidera benchmarks de roteamento de agente, raciocínio, ranking e compreensão multimodal, com o menor erro de calibração. O texto do anúncio não traz os números por benchmark nem o método de medição, e a mesma peça diz que a API é quase cinco vezes mais barata que o Gemini 3.5 Flash-Lite com a Interactions API na suíte compartilhada de benchmarks. A comparação foi feita pela Google, na suíte da própria Google. Pode estar certa, mas é comparação de quem vende, e o erro de calibração é medido na distribuição da suíte, não na sua. Se o escore for decidir um roteamento, o número que vale é o que você mede no seu tráfego, com o seu ponto de corte.

A latência tem uma ressalva que precisa ficar separada do preço. O anúncio promete mediana de 50 a 100 ms de computação do modelo, 150 a 250 ms de ponta a ponta, e diz que o tempo fica quase plano de 1 a 100 perguntas por requisição. Essa afirmação, porém, é declarada para entradas multimodais e contextos de até 16 mil tokens; a entrada aceita até 256 mil. São dois números diferentes e não se pode colar um no outro. Se o seu log tem 200 mil tokens, a curva prometida não é a sua, e a sua precisa ser medida com o contexto real — do mesmo jeito que o custo de 256 mil tokens é aritmética de tabela, não previsão do que a sua requisição vai custar.

Os usos internos citados mostram onde a Google aplicou a ferramenta. O Gemini Notebook usa a API como roteador em tempo real para escolher o tier de modelo e o nível de raciocínio, e a empresa reporta até 40% menos latência em consultas do dia a dia, reservando os modelos de raciocínio profundo para tarefas complexas. O Stitch usa a API no canvas rápido para gerar wireframes jogáveis em segundos. O CC, do Google Labs, escolhe a reação de emoji entre mais de 200 opções em fração de segundo. O Google Search usa a API como camada de segurança para ferramentas MCP, detectando comportamento e conteúdo adversariais dentro do envelope de latência. São todos decisões de conjunto fechado dentro de um pipeline, e o anúncio não diz como a empresa mede o erro em nenhum deles. No caso da camada de segurança do Search, errar não é questão de estética: é a diferença entre barrar e deixar passar uma ferramenta comprometida.

Para quem escreve agente, o primeiro efeito é de disciplina: o contexto que vai para um classificador passa a ser artefato com custo próprio. Antes de trocar o modelo, eu mediria duas coisas no meu próprio log — quanto custa a entrada que eu realmente mando, e como o escore se comporta nos casos em que eu já sei a resposta. Se as duas não fecharem, o ganho de preço não paga a troca.

## 📎 Fonte Original

Google, "Gemini Decisions API: Fast, calibrated multimodal decisions", 11/11/2026:
https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/

<div class="persona" data-audio="/audio/gemini-decisions-api-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
    <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Caio</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 15: Caio discorda do otimismo do anúncio: a migração custa mais que a conta de token, e mil perguntas numa passada criam um problema de plantão. Não é a narração do texto.</small></p>
