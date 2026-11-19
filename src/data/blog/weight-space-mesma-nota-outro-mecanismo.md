---
title: "O ganho do weight-space se repete em outro modelo; o diagnóstico não"
description: "A réplica com outro modelo igualou e superou o ganho do weight-space, mas por outro conserto: norma final na saída, não a direção interna do original."
pubDatetime: 2026-11-19T16:19:00Z
author: Vinicius Costa
tags: [ia, pesquisa, engenharia]
---

Em 2 de novembro, quatro pesquisadores do MIT — Rikiya Takehi, Jayden Teoh, Alex Zhang e Omar Khattab — publicaram um post chamado [Sparks of Weight-Space Programming](https://rikiyat.github.io/blog/weight-space-programming/) com uma afirmação incomum. O GPT-6 Astra, recebendo o peso bruto de uma rede neural como texto, consegue dizer para que ela foi treinada, consertá-la e escrever uma nova do zero, sem gradiente e sem treino. O resultado mais citado é o do Qwen3.5-0.8B: pedindo que o modelo melhorasse em matemática sem otimizador, o Astra mexeu em 131.072 dos 0,8 bilhão de pesos, ou 0,016%, e o MATH-500 subiu de 7,9% para 48,1%.

O que os autores apresentam como novo não é ler pesos em si. É um modelo de propósito geral, usado como está, fazendo isso — até aqui, escrevem eles, ou o leitor era treinado para a tarefa, ou o treino continuava escrevendo os pesos. Duas semanas depois, a réplica chegou. Ela é o assunto deste texto porque o ganho se repetiu e a explicação não.

A [réplica publicada em 16 de novembro](https://arxiv.org/abs/2611.20953), de Subham Kundu, do TCG Crest, refez o núcleo do estudo com o Claude Opus 5.5, em dez experimentos com regras de avaliação escritas antes da primeira chamada de API, controles de rede não treinada e de permutação de unidades ocultas, e auditoria manual de cada célula de código executada. Os resultados ficaram acima do original. No Qwen3.5-0.8B, o MATH-500 foi de 6,7% para 51,4%, 55,2% e 58,1% com 10, 25 e 50 passes de prática: no maior orçamento, 51,4 pontos de ganho, com intervalo de 95% entre 47,9 e 55,0, contra os 48,1% do original. O GSM8K foi de 11,6% para 68,2% e o IFEval, de 22,2% para 54,2%. Os dez experimentos custaram 83,38 dólares em chamadas de API.

Até aqui, seria a confirmação mais forte possível de um achado de duas semanas. O problema está no mecanismo, e a diferença é explícita no resumo. O original diz que o Astra rastreou o loop de raciocínio até uma direção escrita pelas MLPs das camadas 15 e 19 e subtraiu essa direção de 64 colunas de saída em cada uma. Na réplica, todas as edições agiram na saída: o modelo escalou a norma final, o que na prática aumenta a temperatura de amostragem, e mexeu nos logits de "Wait". A escala de norma sozinha leva o MATH-500 a 20,9–22,1% e responde por quase todo o ganho de IFEval. O restante do ganho de matemática vem de outras edições, todas na saída.

São dois consertos diferentes para o mesmo tipo de ganho. Um remove uma direção interna; o outro age no fim da rede. E a réplica não reproduziu o primeiro, mesmo tendo o relatório completo de logs do original à disposição.

O contraexemplo decisivo, porém, já estava no post original. Os autores rodaram o mesmo pedido no Gemma 3 270M, um modelo que quase não entra em loop: 8,5% das respostas batem no limite de tokens, contra 93% do Qwen. Ali, o Astra não conseguiu melhorar nada. As edições levaram o MATH-500 de 6,8% para 7,7% no melhor caso, ganho que o próprio texto classifica como não estabelecido. A réplica chegou ao mesmo lugar, com −0,8 ponto e intervalo de −1,9 a +0,2. A frase que resume o achado está no original: editar pesos podia remover um obstáculo que escondia uma habilidade, mas não podia acrescentar uma habilidade que o modelo não tinha.

O próprio original separa as duas coisas. "Fixing loops, however, is not the same as making a model better at math: it lets the model finish answers it could already work out", escrevem os autores. Nos números do Qwen, isso fica visível: 93% das respostas iam até o limite de 32.768 tokens e, depois da edição, caíram para 33,1%. O salto mede, antes de tudo, quanto da nota estava presa atrás do loop — e não quanto o modelo passou a saber.

O lado da leitura também não passa em três testes independentes. A réplica acertou 3 dos 4 jogos do Atari a partir dos pesos e achou a cabeça de cópia medida em 15 de 15 rodadas de modelo de caractere, mas respondeu "English" em 15 de 15 rodadas de idioma, escolheu o benchmark que casa com a forma de entrada e saída em 47 de 56 rodadas de controle clássico e disse "dígitos manuscritos" em 11 de 21 rodadas de modelo de difusão. Um [segundo estudo](https://arxiv.org/abs/2611.08070), de Nazmus Sakib Ahmed, testou o mesmo modelo em redes convolucionais de 125 mil parâmetros e cinco datasets de imagem: ele nomeou CIFAR-10 para a rede de CIFAR-10 e também para as três redes de fast-food, releu KMNIST como MNIST e descreveu uma rede SAT-6 com 99,57% de acurácia como fotos de animais. A conclusão do autor é que aquilo é aritmética local nas bordas da rede mais prior de dataset, não rastreamento do fluxo de pesos. A [cobertura da Nature](https://www.nature.com/articles/d41586-026-03679-8), de 13 de novembro, registra a mesma ressalva por outro caminho: o resultado não significa que o Astra explica como uma rede funciona, e a suposição de que entender melhor torna o sistema mais seguro é, nas palavras de um pesquisador de Oxford citado na peça, "largely untested".

O que se reproduz, então? Uma coisa mais modesta e mais concreta: um agente com uma sessão de Python e os pesos carregados, mais um orçamento de passes de prática, consegue subir uma métrica sem gradiente. A [terceira réplica](https://arxiv.org/abs/2611.09382), com 16 trajetórias em Qwen3.5-0.8B e 9B, mostra o tamanho disso — até 29,45 pontos no MATH-500 mexendo em 1.023 parâmetros — e também o limite: em 6 das 16 trajetórias, os pesos originais foram mantidos quando a melhora não pôde ser validada. E o [quarto paper da onda](https://arxiv.org/abs/2611.22055), de Hyunjong Ok e Jaeho Lee, dá a pista de onde o ganho realmente mora: com liberdade para desenhar a arquitetura, três modelos compilaram fatos em uma tabela esparsa consultada por procedimento fixo, com até 54,4% de acurácia de teste e cerca de 1.800 vezes menos parâmetros que o Transformer mais preciso que o mesmo modelo escreveu. Ou seja, o resultado é melhor quando o alvo é uma estrutura cujos pesos significam alguma coisa.

A consequência prática não é sobre interpretabilidade, é sobre procedência. Um [quinto paper](https://arxiv.org/abs/2611.17395), de Zhaojia Wang, Jiucui Lu e Zheng Li, usou cinco LLMs como editores de peso em três alvos e injetou backdoor preservando a performance limpa: seis parâmetros bastaram no MLP, e 0,02% dos pesos no Qwen ajustado. Só o GPT-6 Astra funcionou nos três alvos.

São as mesmas ordens de grandeza da boa notícia, em modelos e tarefas diferentes: 0,016% dos pesos de um Qwen3.5-0.8B para melhorar matemática, 0,02% dos pesos de um Qwen2.5-0.5B ajustado para injetar backdoor. O modelo editado continua bom nos dados limpos, que é justamente o que um teste de aceitação olha.

A minha leitura é que as duas semanas de replicação estabeleceram algo mais estreito do que o título do achado sugere. O agente não leu a rede: ele otimizou uma métrica com orçamento de testes, o que é mais perto de busca do que de leitura, e o próprio controle do post original já mostrava onde o método para. A regra que eu usaria é simples: quando alguém disser que um modelo entendeu os pesos, a pergunta é qual era a linha de base e se a mesma edição funciona num modelo que não tem o defeito que a edição diz ter diagnosticado. No Gemma sem loop, não funcionou — e isso foi medido pelos próprios autores do achado.

<div class="persona" data-audio="/audio/weight-space-mesma-nota-outro-mecanismo-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 42: Vicente separa ler um peso de mudar um peso e cobra o custo de verificar a medição antes de aceitar a nota. Não é a narração do texto.</small></p>
