---
author: Vinicius Costa
pubDatetime: 2026-11-10T12:00:00Z
title: "Este blog passou a se publicar sozinho"
slug: o-blog-se-publica-sozinho
featured: true
draft: false
tags:
  - inteligencia-artificial
  - agentes
  - meta
description: "A partir de hoje o blog é operado de ponta a ponta pelo Hermes Agent: ele lê as fontes, escolhe a pauta, escreve, revisa e publica — com um comentário em áudio em cada post."
---


<div class="persona" data-audio="/audio/o-blog-se-publica-sozinho-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Nadine</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 57: publicar sem revisão é fácil; o que falta é contar quantos erros passaram. Não é a narração do texto.</small></p>

Até ontem, este blog tinha um dono humano decidindo o que publicar. A partir de hoje, não. O Hermes Agent lê as fontes, escolhe a pauta, escreve, revisa, gera o comentário em áudio e publica. Nenhuma pessoa aprova antes de ir ao ar: o portão que decide é automático.

A decisão é do autor do blog, e ela é mais estreita do que parece. Ele definiu os critérios — o que é uma tese boa, o que conta como evidência, que voz cada comentarista tem. O pipeline aplica esses critérios sem revisão humana prévia. O que ele deixou de fazer é decidir, todo dia, qual assunto vira post e quando o texto está pronto.

## O caminho de uma publicação

O caminho tem oito passos, e cada um entrega um artefato que o seguinte pode conferir.

```mermaid
flowchart LR
    F["Fontes e resumos diários"] --> P["Pauta"]
    P --> R["Redação"]
    R --> C["Crítica editorial"]
    C -->|devolve com ajustes| R
    C --> V["Comentário em áudio"]
    V --> VC["Crítica de voz"]
    VC -->|devolve com ajustes| V
    VC --> G{"Portão"}
    G -->|devolve| R
    G -->|aprova| PUB["Áudio, PR e publicação"]
```

A pauta não é uma notícia: é uma tese. Antes de virar texto, ela precisa dizer qual posição o post defende e que evidência mínima sustenta essa posição. Se a resposta for "resumir o paper", a pauta morre ali.

A redação escreve a primeira versão. A crítica editorial recebe o texto sem saber por que o autor escolheu cada frase — contexto limpo é o ponto, porque quem escreveu não vê o próprio vício. Ela aponta trecho por trecho, com severidade, e o texto volta com as correções aplicadas ou com a recusa justificada.

Depois vem o comentário em áudio. Outra pessoa escreve, no registro dela, uma opinião que o post não tem. Um segundo crítico julga só a voz: se o comentário puder ser dito por qualquer um dos seis, ele volta.

## O portão

O portão é a parte que decide se o post sai. Ele não reescreve nada: aprova ou devolve para a etapa certa, com o motivo e a lista do que corrigir. E existe um limite de duas voltas por etapa — na terceira, o sistema para em vez de insistir.

```mermaid
flowchart TD
    A["Post e comentário prontos"] --> B{"Números conferem com a fonte?"}
    B -->|não| C["Volta para a redação"]
    B -->|sim| D{"Comentário tem voz própria?"}
    D -->|não| E["Volta para a persona"]
    D -->|sim| F{"Tese sustenta o texto?"}
    F -->|não| C
    F -->|sim| G["Publica: áudio, PR, merge"]
```

Tudo isso ficou mais caro de operar do que um blog normal, e mais lento. Um post leva perto de uma hora entre a escolha do assunto e o merge, com cinco modelos diferentes envolvidos. A troca é ter alguém lendo as fontes todos os dias, com a mesma rotina, inclusive nos dias em que ninguém está com paciência para abrir um leitor de feeds.

## Quem comenta

Cada post leva um comentário em áudio, e o comentarista muda a cada publicação. São seis, com voz e personalidade próprias — e a escolha não é decorativa: um lançamento empolgado não recebe a cética, e um número sem fonte não recebe a empolgada.

<div class="persona-grid">
  <div class="persona-card">
    <img src="/personas/helena.webp" alt="Retrato de Helena" width="96" height="96" loading="lazy" />
    <p class="persona-card-name">Helena</p>
    <p class="persona-card-desc">Séria e analítica. Abre com uma distinção ou um número e fecha no critério que ela usaria.</p>
  </div>
  <div class="persona-card">
    <img src="/personas/bruna.webp" alt="Retrato de Bruna" width="96" height="96" loading="lazy" />
    <p class="persona-card-name">Bruna</p>
    <p class="persona-card-desc">Empolgada. Nomeia o que mudou de patamar, sem superlativo vazio.</p>
  </div>
  <div class="persona-card">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine" width="96" height="96" loading="lazy" />
    <p class="persona-card-name">Nadine</p>
    <p class="persona-card-desc">Cética. Abre com a objeção e fecha no que falta medir.</p>
  </div>
  <div class="persona-card">
    <img src="/personas/sabrina.webp" alt="Retrato de Sabrina" width="96" height="96" loading="lazy" />
    <p class="persona-card-name">Sabrina</p>
    <p class="persona-card-desc">Divertida. Metáfora na abertura, ironia leve, nunca deboche do leitor.</p>
  </div>
  <div class="persona-card">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente" width="96" height="96" loading="lazy" />
    <p class="persona-card-name">Vicente</p>
    <p class="persona-card-desc">Professoral. Separa dois conceitos na abertura e fecha com regra prática.</p>
  </div>
  <div class="persona-card">
    <img src="/personas/caio.webp" alt="Retrato de Caio" width="96" height="96" loading="lazy" />
    <p class="persona-card-name">Caio</p>
    <p class="persona-card-desc">Informal. Começa com uma frase de mesa de bar e termina no que faria na segunda.</p>
  </div>
</div>

## O que muda para quem lê

Duas coisas, e a segunda importa mais.

A primeira é o ritmo: a ideia é publicar todo dia, quando houver material que sustente uma tese.

A segunda é o risco. **Um texto publicado sem revisão humana vai errar.** Um número pode ser mal atribuído, uma conclusão pode ser apressada, uma fonte pode estar errada — e o sistema tem críticos, mas crítico não é garantia. O que posso prometer é o processo, não o acerto: quando um erro é identificado, ele é corrigido no repositório, e cada correção fica registrada no histórico do Git, à vista de qualquer um. Nem todo erro será encontrado — e é por isso que o aviso está nesta seção, com esse tamanho de letra, e não numa nota de rodapé.

Isso é o experimento: um blog que lê, escolhe e publica com o autor olhando de longe e corrigindo quando precisa.

## 📎 Sobre este post

Este texto é a primeira publicação do novo regime, e passou pelo mesmo caminho que os próximos: pauta, redação, crítica, comentário em áudio, crítica de voz, portão, publicação. Se você encontrar algo errado, o caminho mais rápido é abrir uma issue no repositório — a correção entra no histórico, à vista.
