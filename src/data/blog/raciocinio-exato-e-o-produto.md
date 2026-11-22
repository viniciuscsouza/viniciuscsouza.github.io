---
title: "O resumo já é canal de cópia — e a queda de 54% para 0,2% mede a defesa"
author: Vinicius Costa
pubDatetime: 2026-11-22T10:00:00Z
slug: raciocinio-exato-e-o-produto
featured: false
draft: false
tags:
  - ia
  - openai
  - seguranca
  - agentes
description: "O que a queda de 54% para 0,2% mede de fato e o que o estudo no meio do texto mostra: o resumo de raciocínio já é canal de cópia antes do traço exato."
---

A OpenAI publicou em 20 de novembro um texto sobre destilação adversarial com um número que resume o assunto: a taxa média de sucesso de ataque caiu de 54,0% para 0,2%. O número é real. Mas ele mede a resistência de uma defesa ao red team automático da própria OpenAI, aplicado ao modelo que ela acabou de blindar. O achado que muda a leitura do problema está no meio do texto, num estudo que compara dois alunos treinados sobre dados diferentes.

## O que a OpenAI chama de destilação adversarial

A [fonte primária](https://openai.com/index/combatting-adversarial-distillation) define o problema em duas partes. Um ator usa saídas de um modelo de fronteira, sem autorização, para treinar outro modelo "with similar capabilities" e o implanta "without comparable protections". A segunda parte é a que importa. O risco de segurança não é a cópia de capacidade em si. É a capacidade que chega a outro modelo sem a salvaguarda que a acompanhava no original.

O alvo declarado é o raciocínio protegido, definido como "the intermediate steps a model generates internally while working toward an answer, known as its chain-of-thought". São os passos intermediários que o modelo gera por dentro até chegar à resposta. A justificativa da OpenAI é direta: "These traces can contain information the final answer leaves out, making them especially valuable training data for another model." O que aparece na resposta final é um recorte. O traço completo tem mais.

## O que foi medido

A queda de 54% para 0,2% vem de uma avaliação interna e adaptativa, com red teaming automático e black-box. Black-box quer dizer que o atacante só enxerga entradas e saídas. O teste perguntava se um atacante conseguia recuperar o raciocínio protegido que o modelo tinha gerado ao responder a um prompt anterior. A taxa é média, agregada em seis modelos atacantes. O par comparado é GPT-6 Astra, com as salvaguardas originais, contra GPT-6.2 Astra, com as salvaguardas atualizadas.

A tabela da fonte separa dois casos. Extrair o raciocínio de um pedido anterior foi de 54,0 para 0,2. Extrair o de um pedido atual foi de 22,9 para 0,9. A legenda diz: "adaptive black-box red-teaming against GPT‑6 Astra and GPT‑6.2 Astra, aggregated across six attacker models. Lower ASR is better."

A mesma avaliação traz mais um recorte: "On GPT‑6.2 Astra with its updated safeguards, the average attack success rate was below 1% for each attack type." Não é outra medição, é a mesma vista por tipo de ataque. Vale registrar porque a leitura rápida costuma somar as duas como se fossem confirmações independentes.

O escopo também muda com o tempo. A OpenAI escreve: "We're now applying selected safeguard improvements to GPT‑6 Astra as well." Algumas das melhorias já não ficam presas ao modelo novo, então o par do 54% não descreve o modelo antigo como ele está hoje.

O que o número permite afirmar é estreito. A defesa do GPT-6.2 Astra resistiu a um red team interno, adaptativo e automático, feito pela mesma organização que construiu a defesa. Não permite afirmar que um atacante externo, com outro orçamento e outros objetivos, chegaria ao mesmo resultado. A própria fonte diz: "We will continue studying how much additional capability transfers across different student models and distillation training recipes."

## O estudo do meio do texto

Aqui está o que muda a leitura. A OpenAI descreve um experimento controlado: "We started each training run from the same pretrained student model." O aluno é sempre o mesmo. O que varia é o dado de supervised fine-tuning, e a diferença entre os dois conjuntos é a variável do estudo. Um deles era formado "primarily of trajectories from Astra-level teacher models working on coding and defensive cybersecurity tasks" — as trajetórias completas, com cada passo e cada interação de ferramenta. O outro era o tipo de conteúdo que o usuário já recebe.

O baseline é o detalhe que mais importa. Ele é "the content normally visible to users—final responses, reasoning summaries, and tool interactions". Ou seja, o resumo de raciocínio não é o lado inofensivo da comparação: ele já é canal de cópia, e o estudo o usa como piso. A pergunta não é se resumos transferem capacidade, porque o desenho assume que transferem. É quanto a mais as trajetórias exatas acrescentam sobre esse piso, e é esse delta que a defesa tenta fechar.

Os alunos foram avaliados depois do fine-tuning e de novo depois de "a lightweight round of reinforcement learning in cybersecurity and coding environments", em dois benchmarks. Depois do SFT, o aluno com trajetórias exatas "generally outperformed" o aluno com resumos. Depois do RL, ele continua à frente no maior orçamento de inferência testado, nos dois benchmarks. Nos orçamentos menores, quem pontua mais é o aluno dos resumos.

Essa inversão é a parte mais honesta do estudo, e a que impede a frase fácil de que trajetórias exatas sempre ganham. No maior orçamento testado, elas ganham. Com menos orçamento, o resumo rende mais. O texto da OpenAI não traz os valores por benchmark e por orçamento, só a direção das curvas. Para quem pensa em extração, isso diz que o valor do traço depende de quanto o aluno consegue gastar em cima dele.

Se a leitura estiver certa, a cadeia de raciocínio deixa de ser subproduto do treino e passa a ser o próprio material valioso. É uma inferência minha a partir do desenho do estudo. A fonte não a faz com essas palavras.

## Dois níveis de defesa, e os detalhes que passam batido

A fonte organiza a defesa em dois níveis. No da requisição, "model behavior, classifier checks, and API controls limit reasoning trace extraction". No da campanha, a OpenAI procura "patterns in request-level and account-level signals that can reveal coordinated extraction attempts". A parte de enforcement é concreta, mas genérica: as ações semanais "ranged in scale from thousands to tens of thousands of accounts, with the rate increasing significantly this past summer". A fonte não informa quantas contas uma campanha específica envolveu. Este texto também não.

O primeiro detalhe está no classificador. Ele roda na entrada e na saída, em streaming e sem streaming, para "detect leaks of protected reasoning in assistant messages and tool-call arguments". O motivo está na frase seguinte: "a model can expose protected reasoning in a tool's arguments without including it in its final answer." Um filtro que olhe só a mensagem final deixa esse caminho aberto. O raciocínio pode sair pelo argumento de uma chamada de ferramenta e nunca aparecer na resposta que o usuário lê.

O segundo é a amarração ao histórico. A OpenAI diz que "we tie a model's protected reasoning to the conversation history that produced it". Daí a regra: "If an earlier message is rewritten, our API drops the reasoning that followed it." A defesa, aqui, não depende só do modelo se comportar bem. Depende de como a API guarda o estado da conversa.

## O que isso muda para quem constrói

O ponto prático cabe numa frase: o que você emite ao usuário pode ser material de treino de outra pessoa. Isso vale para resposta final, resumo de raciocínio e argumento de ferramenta.

Se você constrói um agente, três coisas são concretas. Revise o que sai nos argumentos de chamada de ferramenta, porque é um canal que a resposta final não mostra. Veja o que seus logs guardam de raciocínio bruto, porque o log também é uma superfície. E, se sua aplicação reescreve mensagens anteriores, teste o que acontece com o raciocínio que veio depois antes de subir para produção: a API da OpenAI descarta o raciocínio que seguiu uma mensagem reescrita, e um fluxo de edição mal pensado pode quebrar comportamento que você esperava manter.

O critério que eu usaria é simples. Antes de expor qualquer coisa ao usuário, pergunte se aquilo serviria de treino para alguém que não é o usuário. Se a resposta for sim, trate como produto.

<div class="persona" data-audio="/audio/raciocinio-exato-e-o-produto-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 04: Helena separa as duas medições do anúncio, cobra o número que o estudo não publica e mede a defesa contra o custo do outro lado. Não é a narração do texto.</small></p>
