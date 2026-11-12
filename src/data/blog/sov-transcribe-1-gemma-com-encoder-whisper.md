---
author: Vinicius Costa
pubDatetime: 2026-11-12T16:45:00Z
title: "SOV-Transcribe-1: o melhor transcritor aberto não-streaming é um Gemma 4 com encoder Whisper"
description: "A Salesforce abriu os pesos de um transcritor não-streaming que lidera entre os modelos abertos, e o ganho veio do modelo de texto pendurado nele."
tags: ["Modelos", "Fala", "Open weights", "Engenharia de IA"]
---

A Salesforce abriu hoje os pesos do SOV-Transcribe-1, um modelo de transcrição de fala, sob licença Apache 2.0. Na medição independente do Artificial Analysis, ele é o mais preciso entre os modelos abertos de transcrição não-streaming, com 2,28% de taxa de erro de palavra. A Salesforce diz que o número o coloca em sétimo no quadro geral, num universo de 64 sistemas avaliados. O que explica o resultado não está no áudio: o modelo é o encoder do Whisper large-v3 ligado a um Gemma 4 de 26 bilhões de parâmetros, e quem escreve o texto é o Gemma.

## A fala virou entrada de um modelo de texto

A arquitetura está no cartão do modelo, em três peças. O encoder do Whisper large-v3 converte o áudio em quadros. Um projetor comprime esses quadros para o espaço de embeddings do modelo de linguagem. O Gemma 4 26B A4B, que é um mixture-of-experts, gera a transcrição token a token, do mesmo jeito que responderia a um pedido de texto. São 26,6 bilhões de parâmetros no total, 4,6 bilhões ativos por token, incluindo o encoder, em BF16, com o roteador do MoE em FP32.

Isso não é detalhe de implementação. Um modelo acústico clássico recebe áudio e devolve a sequência mais provável de palavras. Um transcritor montado sobre um modelo de linguagem recebe áudio mais uma instrução, e a instrução muda a saída. É por isso que o SOV aceita pedido em linguagem natural para transcrever ao pé da letra ou limpar o texto, para escolher pontuação e formato de número, e para receber uma lista de termos ou uma descrição do assunto como viés de contexto. Nada disso é um recurso à parte: é o modelo de linguagem seguindo orientação, com o áudio no lugar do prompt.

## A conta que o anúncio faz

O número de comparação que a Salesforce publica é 2,28% de WER. Com ele, o modelo bate o Nemotron 3.5 Transcribe, que ela mede em 2,81%, com o mesmo número de parâmetros ativos, e o Voxtral Small, medido em 2,77%, com um sexto dos parâmetros ativos, 4 bilhões contra 24 bilhões. Outros modelos abertos de tamanho parecido ficariam em torno de 4%, segundo o texto de lançamento.

Vale saber de que régua esses comparativos saem. Eles são do harness de quem lançou o modelo. O Artificial Analysis, que mede por conta própria, registra o Nemotron 3.5 Transcribe em 3,42% na sua suíte, e não em 2,81%. O número do SOV bate nas duas fontes, 2,28%, mas os concorrentes não, o que quer dizer que a distância real entre eles é maior do que a tabela do anúncio sugere. A suíte do AA também é um composto de vários conjuntos, não a média dos conjuntos públicos.

O outro número do AA é velocidade: fator mediano de 60,1 vezes o tempo do áudio. Em uma hora de gravação, isso é cerca de um minuto de processamento, pelas contas.

## O número que decide o uso em agente

Transcrição para agente não falha pelo erro médio. Falha pela entidade. Um endereço de e-mail, um número de conta, um identificador de pedido: um underscore perdido ou um dígito trocado não piora a legibilidade do texto, ele entrega um argumento errado para a ferramenta. É esse o argumento que a Salesforce usa para vender o modelo, e o número que ela publica vem do VoiceCodeBench, um leaderboard privado da BeSimple.

No VoiceCodeBench, o SOV passa 76,3% das gravações inteiras, ou seja, sem nenhuma entidade errada, e recupera 93,4% das entidades. Fica em primeiro entre os modelos abertos e em segundo entre 23 sistemas nas duas medidas. Pela conta, 23,7% das gravações ainda saem com pelo menos uma entidade trocada. Quase um quarto.

A distância entre 93,4% de entidades recuperadas e 76,3% de gravações perfeitas é a informação mais útil do anúncio, e ela passa quase invisível. Quem lê "93,4%" pensa em quase tudo certo. Quem lê a segunda coluna vê que a chance de a gravação inteira estar limpa é de três em quatro. Em um fluxo de agente, o que conta é a segunda coluna, porque basta uma entidade para a chamada falhar.

## Onde ele perde

O WER agregado esconde a dispersão. Na mesma medição do AA, o SOV faz 1,50% no VoxPopuli, 1,79% no conjunto próprio do AA e 4,06% no Earnings22, que é áudio de call de resultado, com sotaque, ruído e número falado. O ElevenLabs Scribe v3, que é fechado, faz 1,95% no agregado e 3,34% no Earnings22. No áudio difícil, o modelo aberto ainda perde para um fechado, e é justamente o áudio que aparece em call center e em reunião de trabalho.

O escopo é estreito em três pontos. O modelo é não-streaming, o que o deixa fora de agente de voz ao vivo, onde a transcrição precisa sair enquanto a pessoa fala. O cartão registra até 30 minutos de áudio por requisição como a faixa testada, o que define a ordem de grandeza do que já foi verificado, não um teto de projeto. E a lista de idiomas tem sete entradas: inglês, francês, alemão, espanhol, italiano, português e neerlandês.

## O que muda na implantação

A licença Apache 2.0 e o suporte a vLLM 0.32, com plugin no próprio repositório, fazem o modelo rodar dentro da infraestrutura de quem baixa. Há também um draft de decodificação especulativa, o DFlash, que propõe 15 tokens por passo e acelera a decodificação em cerca de 2 a 3 vezes quando se processa uma requisição por vez, menos em clipes abaixo de 10 segundos.

Aberto aqui não significa leve. Quatro bilhões e seiscentos milhões são os parâmetros ativos por token, não o tamanho do arquivo: em BF16, 26,6 bilhões de parâmetros são cerca de 53 GB de pesos, pelas contas com o cartão do modelo. Quem precisa de transcrição em escala vai dimensionar GPU pelo total, não pelo ativo.

O que se compra com isso é controle sobre o áudio. Em call center, saúde e setor público, a gravação não pode sair do ambiente, e essa é a razão de existir do programa que a Salesforce chama de sovereign AI. A parte útil para quem constrói não é o rótulo, é poder colocar a sua lista de entidades no viés de contexto e testar o erro de entidade no seu vocabulário, sem mandar áudio para fora.

## O que o anúncio não prova

O relatório técnico está anunciado como "em breve" e ainda não foi publicado. Os números de entidade vêm de um leaderboard privado, que ninguém reproduz de fora, e o harness é de quem lançou o modelo. Não há replicação independente do VoiceCodeBench, e o AA mede erro de palavra, não erro de entidade.

Também não há conta de custo por hora. O que dá para comparar é o preço de quem hospeda: US$ 2,00 por mil minutos do Nemotron na DeepInfra e US$ 3,33 do Scribe v3, segundo o AA. Rodar o SOV em casa troca essa linha por conta de GPU, e o anúncio não traz essa conta.

Sobra a decisão prática, e ela não se resolve no cartão do modelo. Quem for trocar o transcritor de um fluxo com ferramentas precisa rodar o SOV no próprio áudio, com a própria lista de termos no viés de contexto, e contar quantas gravações saem inteiras. Se o número ficar abaixo do que o fluxo tolera, o conserto não é escolher outro modelo: é o passo que hoje confia no transcrito sem conferir se a entidade crítica chegou certa.

## 📎 Fonte Original

https://huggingface.co/blog/salesforce-sovereign-intelligence/sov-transcribe-1

Model card: https://huggingface.co/salesforce-sovereign-intelligence/SOV-Transcribe-1

Medição independente: https://artificialanalysis.ai/speech-to-text/non-streaming/

<div class="persona" data-audio="/audio/sov-transcribe-1-gemma-com-encoder-whisper-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Bruna">
    <img src="/personas/bruna.webp" alt="Retrato de Bruna, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Bruna</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 01: a lista de termos do domínio vira código, e o custo migra do minuto para a GPU parada. Não é a narração do texto.</small></p>
