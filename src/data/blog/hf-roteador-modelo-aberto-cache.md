---
title: "A HF trocou o roteador: quem decide onde o modelo aberto roda agora mede o provedor ao vivo"
description: "A Hugging Face passou o roteamento dos modelos abertos para a OpenRouter: a escolha do provedor virou medição ao vivo, e o cache da sessão virou custo."
pubDatetime: 2026-11-16T18:40:00Z
author: Vinicius Costa
tags: [ia, agentes, infraestrutura]
---

A Hugging Face trocou hoje o roteador do Inference Providers, o serviço que deixa chamar um modelo hospedado sem subir infraestrutura própria. Os pedidos para modelos de linguagem deixaram de sair pelo roteador da casa e passam a sair pelo da OpenRouter, que "picks the best provider for each call based on live price, speed and reliability", com retentativa em outro provedor quando o primeiro falha. O token da Hugging Face continua valendo e, nas palavras do anúncio, "your code stays the same". A fatura também continua saindo da Hugging Face. O que mudou é quem decide.

O tamanho da troca vem do lugar dela. A própria Hugging Face escreve que "every major open-weight release" já é publicado no Hub, e a página do modelo é onde as pessoas experimentam antes de baixar os pesos. Antes, para uma chamada de linguagem, o Inference Providers escolhia um provedor e devolvia o erro dele se falhasse: "Before, Inference Providers picked one provider for your request and returned its error if it failed." Agora a mesma chamada é tentada em outro provedor sem que o cliente faça nada, e o cliente pode encurtar o caminho com um sufixo no id do modelo: `:cheapest` para o menor preço, `:fastest` para maior throughput, ou o nome do provedor para fixar um só. O catálogo e o botão de desligar provedor continuam lá.

Junto veio uma quebra. Como as chamadas de linguagem passam pela OpenRouter e são cobradas na conta ou na organização da Hugging Face, a chave própria de provedor deixou de funcionar para esses modelos. É a mudança silenciosa do pacote, anunciada numa seção curta no fim. Para imagem, vídeo e áudio nada muda: seguem saindo direto pelo Inference Providers, com chave própria valendo, inclusive para os LoRAs.

## O que o anúncio mede

A participação dos modelos de peso aberto nos tokens do top 50 da OpenRouter saiu de 26,8% na semana de 6 de outubro de 2025 para 71,7% na semana de 28 de setembro deste ano, depois de um pico de 77,5% em julho. Em quase doze meses, os dois lados cresceram e o aberto cresceu mais rápido: o volume semanal de tokens abertos foi de 1,3 trilhão para 83,5 trilhões, mais de 60 vezes, contra 3,4 para 33 trilhões do fechado, quase dez vezes. O preço de lista ponderado por token, nas últimas quatro semanas, ficou em US$ 0,28 de entrada e US$ 1,62 de saída por milhão, contra US$ 1,27 e US$ 6,36 do outro lado. Cerca de quatro vezes.

A explicação do preço está na contagem de provedores. O mesmo peso pode ser servido por muita gente, e aí a competição acontece por preço. No levantamento de 21 de outubro, o GLM-5.3 Flash tinha 30 provedores, com entrada entre US$ 0,04 e US$ 1,15 por milhão de tokens, e o DeepSeek V4.1 Flash tinha 31, entre US$ 0,03 e US$ 0,60. Nesses dois, o preço de entrada do mesmo modelo varia entre vinte e trinta vezes. "The ranges are wide for open-weight models because providers differ in hardware, quantization, speed and data policy", diz o estudo.

Os números têm dono e têm recorte, e os dois importam antes de repassar. O recorte é o top 50 de modelos por volume semanal da própria OpenRouter, classificados um por um pelo link de pesos publicados na ficha do catálogo. Ficam de fora a linha "other", que variou de 0,3 a 10,8 trilhões de tokens por semana, e os modelos em sigilo, que chegaram a 38,7 trilhões na semana mais recente. A contagem usa o tokenizer de cada provedor, e o próprio estudo avisa que ela serve para comparar tendência, não como contagem exata. O dono é a empresa que, a partir de hoje, também é o roteador do maior hub de pesos abertos.

## Onde as duas peças se desencontram

A metade da qualidade é o ponto em que os dois documentos divergem. A Hugging Face escreve que "Kimi K3.1 Pro, the best open-weight model, scores 46 against 65 for Claude Fable 5.2, at about a seventh of the cost per task", com US$ 3,68 contra US$ 26,54 por tarefa. O estudo da OpenRouter, publicado em 31 de outubro e citado nesse mesmo parágrafo, dá outro retrato: melhor fechado Claude Opus 5.5 com 57,6, melhor aberto MiMo-V2.6-Pro com 46,3, e "the 11-point gap" como medida da distância. São dezesseis dias entre um texto e o outro, os dois dizem ler o Artificial Analysis Intelligence Index, e o intervalo entre aberto e fechado sai de dezenove pontos num e onze no outro.

O lado aberto chega a quase o mesmo número nas duas peças, 46 e 46,3, mas por modelos diferentes: Kimi K3.1 Pro na citação da Hugging Face, MiMo-V2.6-Pro na tabela da OpenRouter. A diferença de tamanho da distância está no lado fechado. O índice é um retrato que se move, e o estudo da OpenRouter anota que cada nota é a do modelo no esforço máximo de raciocínio e que "the setting moves these numbers". Isso explica parte da discrepância e não a resolve: nenhum dos dois documentos declara de que data é o snapshot que publica.

## O parágrafo que decide a conta

Para quem constrói, a mudança que pesa não está nas tabelas de preço. Está numa frase curta sobre cache: "a conversation stays on the provider that holds its prompt cache", e para tornar isso explícito o cliente manda um UUID estável por conversa no cabeçalho `X-HF-Session-Id`. A frase resolve um conflito que o próprio roteador cria, porque escolher o melhor provedor a cada chamada e manter a conversa no provedor que tem o cache são objetivos que puxam para lados diferentes. Num laço de agente, que reenvia o contexto a cada passo, essa tensão aparece em toda chamada.

Aqui é onde eu separo o que o anúncio garante do que ele deixa para o cliente resolver. Se a primeira tentativa cai num provedor que não tem o cache da conversa, a chamada custa mais que a anterior sem erro nenhum aparecer. Fixar a sessão num provedor é escolha que o cliente faz com o sufixo; deixar o roteador otimizar é aceitar que a conversa pode mudar de casa. O padrão do anúncio escolhe por você.

Daí a leitura que eu faço. A escolha do modelo já era do usuário e continua. A escolha do preço agora é do roteador, que a faz com a medição contínua do tráfego que passa por ele. O que sobra de controle ficou reduzido a duas coisas pequenas e decisivas: o sufixo no id, que fixa política ou provedor, e o cabeçalho de sessão, que fixa o cache. Nenhuma das duas aparece num exemplo de começar em três linhas.

## O que ficou sendo medido por quem opera

Os ganhos que o anúncio atribui ao roteamento novo vêm da OpenRouter medindo o próprio roteamento: 46% menos erros de capacidade, 16,9% menos tempo até o primeiro token e 16,3% mais throughput. Não são números ruins, são números de quem opera o sistema, e a mesma ressalva vale para a escala citada de passagem: 800 trilhões de tokens por mês, 10 milhões de usuários e 59,2 trilhões de tokens do modelo mais usado da semana.

O que a troca melhora é concreto: um roteador que serve 80 provedores mede cada um deles com mais tráfego do que o Hub mediria sozinho. O que muda é o que se pode auditar. Antes, a pergunta era qual provedor o cliente escolheu. Agora é qual política o roteador aplicou, em que momento e com base em que medição, e essa medição é feita por quem opera o roteador.

## O que fazer na segunda

Para quem tem agente apontado para o Hub, o trabalho desta semana é chato e específico. Conferir se alguma chamada de modelo de linguagem dependia de chave própria de provedor, porque essa parte parou de funcionar hoje. Mandar identificador de sessão em todo laço que reusa contexto, porque é ele que autoriza o roteador a manter a conversa no provedor do cache. E medir acerto de cache e custo por sessão do seu lado, porque as duas coisas não aparecem na tabela de preço.

Quando a fatura subir sem o preço do modelo ter mudado, o lugar de olhar não é a tabela. É qual provedor atendeu cada sessão, e quantas vezes a sessão recomeçou num provedor sem o cache dela.

<div class="persona" data-audio="/audio/hf-roteador-modelo-aberto-cache-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Sabrina">
    <img src="/personas/sabrina.webp" alt="Retrato de Sabrina, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Sabrina</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 25: Sabrina pega a metáfora do garçom e discorda do clima do anúncio: o rótulo de peso aberto virou sinônimo de barato no cartão de outra pessoa. Não é a narração do texto.</small></p>
