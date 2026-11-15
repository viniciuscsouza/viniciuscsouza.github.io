---
title: "A Astra escreveu a prova. A formalização achou buracos na explicação"
description: "O anúncio diz que o modelo liderou a prova de um problema de 50 anos. O relatório mostra o que a verificação em Lean corrigiu, com o teorema intacto."
pubDatetime: 2026-11-15T22:45:00Z
author: Vinicius Costa
tags: [ia, verificação, matemática, agentes]
---

Em 15 de novembro a OpenAI abriu um blog de ciência. O primeiro texto convidado é de Nathaniel Craig, físico de partículas da Universidade da Califórnia em Santa Bárbara e cientista visitante na empresa, e descreve um preprint de 6 de outubro: uma definição candidata do Modelo Padrão numa rede de pontos, questão que, segundo o autor, está aberta há mais de cinquenta anos. O anúncio é curto sobre o que aconteceu. "Astra helped turn that strategy into a construction and took the lead in developing the detailed proof", escreve Craig.

O que o anúncio não conta veio depois da prova. O pacote de verificação em Lean, publicado no Zenodo, não conferiu o resultado. Conferiu a redação do argumento. E o que voltou dele está registrado como três revisões no texto publicado, uma delas um passo que não se sustenta como estava escrito.

## O que o paper assina

O preprint tem um autor. Nos agradecimentos, o mesmo autor diz o resto: "I proposed a strategy (...) before arriving at the current Astra-led proof. The manuscript combines author-written sections with extensive rewrites of the Astra-composed proof. My colleagues and I proposed tests of the method, including Lean verification, that were carried out by Astra; supplementary materials documenting some of these checks were written by Astra."

Três coisas ficam ditas aí, e nenhuma é leitura de cobertura. A prova foi composta pelo modelo. A verificação proposta pelos colegas humanos foi executada pelo modelo. O material suplementar que documenta as checagens foi escrito pelo modelo. A estratégia, as seções escritas pelo autor e o manuscrito em volta continuam sendo do físico; Craig agradece a Maarten Golterman e Yigal Shamir as "probing questions" ao longo de todo o projeto.

## O que a formalização conferiu

O alvo do Lean não foi o paper. Foi o companheiro matemático que acompanha o paper, o documento onde as definições e as estimativas estão escritas. O relatório de verificação registra a cronologia: entrada datada de 8 de setembro, entrega do projeto formal em 25 de setembro, companheiro publicado revisado em 5 de outubro, um dia antes de o preprint ir ao arXiv.

Os números do relatório, todos no mesmo documento:

- dezesseis módulos compilados com zero erros e zero avisos, em Lean 4.35.0-rc2 sobre ARM64;
- o kernel aceitou 95.810 declarações exportadas, incluindo dependências da biblioteca, partindo de um ambiente de declarações vazio;
- a checagem de axiomas aceitou só `propext`, `Classical.choice` e `Quot.sound`, e nenhum `sorryAx` apareceu nas provas aceitas. Em Lean, `sorry` é o marcador de "pulei esta parte". Não houve nenhum.

O kernel aceita ou rejeita cada passo por regra, sem saber quem escreveu o que recebeu. É o único elo da cadeia que não pertence à mesma família de ferramenta.

## Os três buracos

A seção 4 do relatório é a que interessa. "Formalization supplied explicit arguments for three points in the original companion." Três pontos, com endereço na fonte:

**Junções de caminhos.** O texto original usava a integral de Wilson e a equação de transporte de Kato em caminhos suaves por partes sem dizer como as duas se comportam nas junções entre os pedaços. A formalização teve de escrever a partição finita, somar as integrais por pedaço, resolver o transporte de um pedaço usando o ponto final do anterior como condição inicial e estender as identidades por continuidade. A versão publicada agora declara a convenção.

**De homotopia contínua para deformação suave.** O cálculo de curvatura vale para uma deformação suave de dois parâmetros. O argumento topológico entrega uma homotopia contínua de laços. Entre uma coisa e outra havia um passo que o texto não dava. A formalização dá: reparametrizar as bordas, suavizar a família mantendo os laços fechados, e usar compacidade da imagem da homotopia mais a abertura do conjunto admissível para não sair da região válida.

**O comutante escalar.** Aqui o texto original não estava incompleto, estava errado como escrito. O relatório é direto: "The original text invoked real irreducibility at this step." Irreducibilidade real não estabelece que todo endomorfismo real-linear equivariante seja um múltiplo escalar real da identidade. A formalização provou a afirmação certa por álgebra matricial, e a prosa publicada passou a dar a prova curta: complexificar para a representação adjunta de sl(5,C), aplicar Schur, e usar a preservação da forma real para o escalar ser real.

Nos três casos, os enunciados dos teoremas e as equações numeradas ficaram como estavam. O que mudou foi a explicação do caminho.

## Quem revisou a revisão

A prosa revisada passou por um segundo leitor. O relatório nomeia: "A targeted review by Codex agents found these revised passages consistent with the existing Lean statements and proofs." Na mesma seção, os agentes revisaram 2.488 itens de fonte inventariados e 39 contextos de suposição, ligando fórmulas, definições e assertivas do companheiro às declarações Lean entregues.

Vale segurar essa frase por um segundo. A prova foi composta pela Astra. A formalização foi executada pela Astra. A revisão do texto corrigido foi feita por agentes Codex. Sobram, como elo independente dessa cadeia, o kernel e as perguntas dos físicos.

## O check que reprovou

O relatório inclui a única verificação que não passou. O Comparator, que compara a entrega com uma referência congelada, parou na comparação dos nomes de provas geradas pelo compilador. E a configuração de referência "also required a supporting proof to have the same body as a sorry placeholder, whereas the delivered development supplies a completed proof".

Leia de novo: o comparador exigia que uma prova de suporte tivesse o corpo de um `sorry`, e a entrega traz a prova completa. O check de referência reprovou porque o trabalho ficou pronto. O relatório registra o comando que falhou e os checks que passaram, separados, sem esconder o vermelho no meio do verde.

## O que continua aberto

O próprio autor fecha o texto com o que falta. A construção é "far more an answer in principle than an answer in practice". Se ela satisfaz positividade de reflexão no espaçamento finito da rede, ele ainda está pensando, e é essa propriedade que liga o modelo na rede a uma teoria quântica em que as probabilidades se conservam. O limite contínuo depende de outro resultado da OpenAI, a prova de existência da teoria de Yang–Mills.

E existe a parte que se recalcula. O suplemento bidimensional vem com 65 arquivos centrais de registros de cálculo, 66 arquivos tar.gz e 4,5 GB no total, nomeados por pares de nós da rede. Não é um repositório de exemplo. É o que permite a alguém de fora refazer as contas em vez de acreditar nelas.

## Conclusões

A manchete fácil é que um modelo resolveu um problema de cinquenta anos. O texto não sustenta isso: o resultado é candidato, é declaradamente "in principle", e a única assinatura do preprint é do físico.

O que o pacote sustenta é mais estreito e mais útil. O argumento que qualquer leitor aceitaria tinha pontos em que ele não seguia a prova, e um deles era falso como escrito. Quem teve de preencher esses pontos foi a formalização, rodada pelo mesmo modelo que compôs a prova, dentro de um kernel que não tem como saber disso.

Para quem lê paper com modelo no meio, o artefato que decide deixou de ser o abstract e passou a ser o relatório de verificação. É lá que estão as passagens que mudaram, com o SHA-256 do companheiro congelado ao lado.

## 📎 Fonte Original

- [A step toward defining the Standard Model on a lattice](https://openai.com/index/step-toward-defining-the-standard-model/) — OpenAI science blog, 15/11/2026, Nathaniel Craig.
- [A gauge-invariant measure for lattice chiral fermions](https://arxiv.org/abs/2610.09093) — arXiv 2610.09093, v1 de 6/10/2026, com os agradecimentos citados no texto.
- [Mathematical companion and Lean formalization](https://doi.org/10.5281/zenodo.23196062) — Zenodo, com o relatório de verificação, o projeto Lean e a nota das três revisões.
- [Two-dimensional chiral SU(5) measure and calculation records](https://doi.org/10.5281/zenodo.23196101) — Zenodo, os 65 arquivos centrais de registros de cálculo.
- [Our new blog for science](https://openai.com/index/our-new-blog-for-science/) — OpenAI, 15/11/2026.

<div class="persona" data-audio="/audio/astra-escreveu-a-prova-lean-corrigiu-a-explicacao-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 58: Vicente separa verificar a prova de verificar o enunciado, e cobra o mapa de correspondência que ninguém assina. Não é a narração do texto.</small></p>
