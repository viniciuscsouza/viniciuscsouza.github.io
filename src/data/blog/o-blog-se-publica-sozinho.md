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

Cada post leva um comentário em áudio. Neste, os seis opinam sobre a mesma mudança — e não concordam entre si, o que é o ponto. Toque duas vezes no retrato para ouvir; um toque durante a reprodução para o áudio. Só um deles toca por vez: começar outro interrompe o anterior.

<div class="persona-grid">
  <div class="persona-card">
    <div class="persona" data-audio="/audio/o-blog-se-publica-sozinho-helena.mp3">
      <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
        <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
      </button>
      <p class="persona-name">Helena</p>
      <p class="persona-hint">Toque duas vezes para ouvir</p>
      <div class="persona-progress" aria-hidden="true"><span></span></div>
    </div>
    <p class="persona-card-desc">Séria e analítica. Abre com distinção ou número, fecha no critério.</p>
    <p class="persona-card-take">Neste post: quer a taxa de correção e o estágio que deveria ter pegado cada erro.</p>
  </div>
  <div class="persona-card">
    <div class="persona" data-audio="/audio/o-blog-se-publica-sozinho-bruna.mp3">
      <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Bruna">
        <img src="/personas/bruna.webp" alt="Retrato de Bruna, em estilo de gravura" width="480" height="480" loading="lazy" />
      </button>
      <p class="persona-name">Bruna</p>
      <p class="persona-hint">Toque duas vezes para ouvir</p>
      <div class="persona-progress" aria-hidden="true"><span></span></div>
    </div>
    <p class="persona-card-desc">Empolgada. Nomeia o que mudou de patamar, sem superlativo vazio.</p>
    <p class="persona-card-take">Neste post: celebra o ganho real: rotina diária com crítica separada da escrita.</p>
  </div>
  <div class="persona-card">
    <div class="persona" data-audio="/audio/o-blog-se-publica-sozinho-nadine.mp3">
      <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
        <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
      </button>
      <p class="persona-name">Nadine</p>
      <p class="persona-hint">Toque duas vezes para ouvir</p>
      <div class="persona-progress" aria-hidden="true"><span></span></div>
    </div>
    <p class="persona-card-desc">Cética. Abre com a objeção, fecha no que falta medir.</p>
    <p class="persona-card-take">Neste post: aviso de risco sem contagem, para ela, é isenção disfarçada de transparência.</p>
  </div>
  <div class="persona-card">
    <div class="persona" data-audio="/audio/o-blog-se-publica-sozinho-sabrina.mp3">
      <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Sabrina">
        <img src="/personas/sabrina.webp" alt="Retrato de Sabrina, em estilo de gravura" width="480" height="480" loading="lazy" />
      </button>
      <p class="persona-name">Sabrina</p>
      <p class="persona-hint">Toque duas vezes para ouvir</p>
      <div class="persona-progress" aria-hidden="true"><span></span></div>
    </div>
    <p class="persona-card-desc">Divertida. Metáfora na abertura, ironia leve, sem deboche.</p>
    <p class="persona-card-take">Neste post: acha graça na cética produzida pela própria máquina que ela acusa.</p>
  </div>
  <div class="persona-card">
    <div class="persona" data-audio="/audio/o-blog-se-publica-sozinho-vicente.mp3">
      <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
        <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
      </button>
      <p class="persona-name">Vicente</p>
      <p class="persona-hint">Toque duas vezes para ouvir</p>
      <div class="persona-progress" aria-hidden="true"><span></span></div>
    </div>
    <p class="persona-card-desc">Professoral. Separa dois conceitos, fecha com regra prática.</p>
    <p class="persona-card-take">Neste post: separa autoria de operação: uma ficou com o autor, a outra foi delegada.</p>
  </div>
  <div class="persona-card">
    <div class="persona" data-audio="/audio/o-blog-se-publica-sozinho-caio.mp3">
      <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
        <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
      </button>
      <p class="persona-name">Caio</p>
      <p class="persona-hint">Toque duas vezes para ouvir</p>
      <div class="persona-progress" aria-hidden="true"><span></span></div>
    </div>
    <p class="persona-card-desc">Informal. Frase de mesa de bar na abertura, ação no fecho.</p>
    <p class="persona-card-take">Neste post: trata post publicado como deploy: precisa de rollback e leitura de risco.</p>
  </div>
</div>

## O que muda para quem lê

Duas coisas, e a segunda importa mais.

A primeira é o ritmo: a ideia é publicar todo dia, quando houver material que sustente uma tese.

A segunda é o risco. **Um texto publicado sem revisão humana vai errar.** Um número pode ser mal atribuído, uma conclusão pode ser apressada, uma fonte pode estar errada — e o sistema tem críticos, mas crítico não é garantia. O que posso prometer é o processo, não o acerto: quando um erro é identificado, ele é corrigido no repositório, e cada correção fica registrada no histórico do Git, à vista de qualquer um. Nem todo erro será encontrado — e é por isso que o aviso está nesta seção, com esse tamanho de letra, e não numa nota de rodapé.

Isso é o experimento: um blog que lê, escolhe e publica com o autor olhando de longe e corrigindo quando precisa.

## 📎 Sobre este post

Este texto é a primeira publicação do novo regime, e passou pelo mesmo caminho que os próximos: pauta, redação, crítica, comentário em áudio, crítica de voz, portão, publicação. Se você encontrar algo errado, o caminho mais rápido é abrir uma issue no repositório — a correção entra no histórico, à vista.
