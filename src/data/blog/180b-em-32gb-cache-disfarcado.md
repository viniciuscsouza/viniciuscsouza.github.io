---
title: "180B num Mac de 32 GB: o cache que se disfarça de banco de experts"
description: 'Tarek Ziadé fez o Qwen3.8-Flash-Next decodar a 13,9 tok/s num M5 de 32 GB com Transformers. Ficou 6% atrás do Strata, e o resto está no PyTorch.'
pubDatetime: 2026-11-18T16:40:00Z
author: Vinicius Costa
tags: [ia, engenharia, infraestrutura]
---

Hoje a [Hugging Face publicou um benchmark](https://huggingface.co/blog/moe-expert-streaming) de Tarek Ziadé, que trabalha na própria casa, mostrando o Qwen3.8-Flash-Next, um modelo MoE de 121 GB em FP8, decodificando a 13,9 tok/s num MacBook M5 com 32 GB de memória unificada. A execução é feita com o Transformers. O número de referência é o Strata, que faz 14,8 nas mesmas condições. O autor ficou cerca de 6% atrás e escreve que o resultado ainda é lento demais para o jeito como ele usa agentes de código.

Se você não acompanha inferência local, o contexto é este. Um modelo MoE (mistura de especialistas) tem muitos experts em cada camada e ativa só alguns por token. Neste modelo, cada token usa 10 dos 512 experts de cada uma das 48 camadas. Em modelos MoE, segundo o autor, os experts respondem por mais de 90% dos pesos. Por isso, rodar um desses num laptop deixa de ser só uma pergunta de caber na memória. Vira uma pergunta sobre onde cada peso mora e quantas vezes ele atravessa o barramento até a GPU a cada token. É essa pergunta que organiza a comparação do autor.

## O que atravessa o barramento

A comparação entre os motores, na descrição do próprio autor, fica assim:

| Motor | O que cruza o barramento a cada token |
|---|---|
| llama.cpp (`--cpu-moe`, `--n-cpu-moe`) | Só as ativações. Os experts ficam na CPU e são computados lá. |
| vLLM (`--cpu-offload-gb`, `--cpu-offload-params experts`) | Os experts roteados, lidos no lugar, de novo a cada token. Nada fica em cache. |
| Accelerate (`device_map="auto"`) | O banco inteiro de experts da camada, para usar 8 ou 10 deles. |
| Strata | Só os experts roteados, por um cache limitado. |

O llama.cpp é o único que tira o peso da fila, porque o expert nunca sai da CPU. O autor avisa que isso vale enquanto os experts cabem na RAM: quando não cabem, o cache de página entra em thrash. O vLLM lê o peso no lugar, mas não guarda nada. Um expert quente atravessa o PCIe de novo a cada token, e não há camada de disco. O Accelerate é o pior caso: copia o módulo inteiro, que num MoE é o banco de experts da camada, para usar só 8 ou 10. E no Mac, diz ele, "offload to CPU" não libera nada, porque CPU e GPU dividem a mesma memória. A Strata é a única que junta cache com roteamento: traz só o que o router escolheu, e o resto fica em RAM ou em disco.

Os números do próprio autor numa A10G de 24 GB, com Qwen3.6-35B-A3B, mostram a escala disso. Transformers com Accelerate fica em 0,16 tok/s. vLLM com offload só de experts em FP8 chega a 20,1. A Strata, em Q8_0, fica entre 82 e 88. Esse é outro modelo e outra máquina, e as quantizações não são iguais. Serve para ver a ordem de grandeza, não o ranking fino.

## O ganho veio de reuso de kernel

O ponto que mais chama atenção está numa história anterior, feita com o OLMoE-1B-7B. A primeira versão guardava os experts em disco, com cache LRU no device, e rodava um expert por vez num laço Python. Com todos os experts já em cache, deu 10,1 tok/s. O autor concluiu que a I/O estava bem e o laço não: o vanilla usa `grouped_mm`, que roda todos os experts de uma camada num só kernel.

O conserto foi transformar o cache num slot pool. É um tensor pré-alocado no device, compartilhado por todas as camadas, mais uma tabela por camada que mapeia id de expert para slot. Os ids que o router escolhe são reescritos para slots, e o pool passa a parecer um banco de experts comum. Assim, `grouped_mm` roda sobre ele como está, sem matmul de expert customizado. O resultado foi 34,6 tok/s, contra 38,1 do vanilla.

Esse é o argumento do post, na prática. O ganho não veio de um kernel mais rápido. Veio de fazer o cache se apresentar no formato que o kernel fundido já espera.

No Qwen, o mesmo princípio aparece junto com outras mudanças. A tabela de antes e depois, no mesmo M5 e com os mesmos prompts, mostra o Transformers em 10,0 tok/s contra 14,8 da Strata no início, e em 13,9 contra 14,8 no fim. Entre uma ponta e outra, o autor lista o commit antecipado do trabalho da GPU (que ele estima em +10%), kernels Metal para as partes sem caminho rápido no macOS, os pesos GGUF da própria Strata, prefill com chunks maiores e leitura antecipada dos experts da camada seguinte, além de ajustes para documentos longos e para os misses. Ele não separa quanto cada item rendeu, então o 13,9 deve ser lido como o efeito do conjunto.

Há uma ressalva de arranjo. A Strata 0.1.60 rodou com experts IQ3_XXS. O Transformers rodou com experts a 3 bits e 12 GiB de cache no device. São formatos de quantização diferentes, então os 6% medem o arranjo inteiro, e não só a qualidade do motor. A parte densa também mudou: os pesos GGUF da Strata reduziram o tráfego denso de 5,4 GB para 3,9 GB por token.

A conta de memória também pesa. Depois de carregar, o processo usa cerca de 18 GiB. Um prompt de 6K chega a 25,4 GiB. O autor resume: "That's about the limit: I have to close the browser, or macOS starts swapping". Converter o modelo, por sua vez, leva cerca de 5 horas.

## O que sobra

A maior parte do que sobra, segundo o autor, é vaivém entre host e GPU: cerca de 10 ms por token. Acordar depois de um sync custa uns 1 ms desse total. O resto é a GPU ficando sem trabalho enquanto o Python enfileira a próxima camada. A Strata enfileira o trabalho do token inteiro de uma vez e espera, em cada camada, por um Metal shared event. O PyTorch não expõe esse controle.

Ele tentou imitar isso com um kernel que gira sobre uma flag escrita pela CPU, e a GPU levou de um segundo a nunca para enxergar a escrita. O conserto de verdade seria uma op nativa no stream MPS do PyTorch, com risco de travamento. Ele não construiu.

Vale notar que os 10 ms são o custo que o autor identifica, não uma fatia exata dos 6%. Ele mesmo não fecha essa conta. O que afirma é que fechar o resto exige mudanças mais profundas no stack, começando pelo controle do sincronismo por camada, que o PyTorch não oferece hoje.

## Como ler isso

O benchmark é do próprio autor, não um teste independente. O 13,5 tok/s do Qwen3.8-Flash-Next num Mac M4 de 32 GB vem de um post de terceiro que ele cita (modelfit.io), e ele não mediu isso. A tabela de 0,16 tok/s é da A10G, não do Mac. Ele também testou o vllm-metal, que faz streaming por cache limitado, mas este não roda o modelo em 32 GB: as tabelas de n-gram ficam em memória, e só o checkpoint MLX já ocupa 32 GB antes de qualquer cache de experts. Por isso o Transformers manda a tabela de n-gram para o disco.

Um detalhe que não é de desempenho: o autor diz que todo o código — o [PR no Transformers](https://github.com/huggingface/transformers/pull/50717), o pacote específico do modelo e os kernels Metal — foi escrito com IA, e que a parte dele foi escolher o que tentar, ler os profiles e decidir o que manter. A decisão que sobrou para o humano foi a que o benchmark não mede: o que vale a pena perseguir.

## O que muda para quem roda agente

A consequência prática é mais estreita do que o título sugere. Dá para rodar esse modelo num laptop de 32 GB se você aceita converter o modelo por cerca de 5 horas, operar perto do limite de memória, fechar o navegador antes de prompts longos e conviver com 13,9 tok/s no decode curto e 12,4 depois de um documento de 6K. O próprio autor não considera isso suficiente para o uso que faz com agentes de código.

Também muda onde está o gargalo. Enquanto o cache estiver na forma errada, o custo é de kernel e de laço Python, e isso se corrige no código de quem monta o caminho de execução. Depois que o cache já tem a forma do banco padrão, o resto é sincronismo entre host e GPU, e isso depende do framework expor controle, não de mais kernel. Até lá, o autor é direto sobre a divisão de trabalho: o Orthrus, a máquina de casa com duas RTX 4090, continua fazendo o trabalho de verdade.

<div class="persona" data-audio="/audio/180b-em-32gb-cache-disfarcado-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 31: Vicente separa onde o expert mora de onde o matmul roda para explicar por que o token por segundo da geração não decide se a máquina serve a um agente. Não é a narração do texto.</small></p>
