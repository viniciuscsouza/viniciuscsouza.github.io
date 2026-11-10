---
author: Vinicius Costa
pubDatetime: 2026-11-10T11:30:00Z
title: "A memória que você constrói pode custar mais caro que reler tudo"
slug: memoria-custa-mais-caro-que-reler
featured: false
draft: false
tags:
  - inteligencia-artificial
  - agentes
  - memoria
  - custo
description: "No MemoryTax, reler a história inteira deu 92% com GPT-6 Luna; a memória Mem0, 80%. Quem decide a conta é o número de perguntas por história."
---

Antes de escolher um sistema de memória para agente, faça uma conta que quase ninguém faz: quanto custa montar o store e quantas perguntas a mesma história vai receber depois disso. Se a segunda resposta for pequena, a memória que parecia upgrade é só uma despesa adiantada.

O paper MemoryTax, publicado no arXiv em outubro de 2026 por Zedong Peng, da SJTU, faz essa conta com números. O estudo é pequeno, e o paper declara isso: uma única conversa do LoCoMo, com 419 turnos distribuídos em 19 sessões e 152 perguntas de quatro tipos. Compara quatro formas de dar memória a um agente. A referência é a mais simples de todas: colocar a história crua inteira na janela do modelo e deixar que ele leia tudo a cada pergunta.

Começo pelo custo, porque é ali que a memória ganha ou perde. Com GPT-4o-mini, o Mem0 gastou US$ 0,56 só para construir o store. O rollout inteiro com contexto completo custou US$ 0,43. A memória saiu mais cara que reler tudo antes de a primeira pergunta ser respondida. Para saber se essa diferença se paga, divida o custo de construção pelo número de perguntas que a história vai receber. Pelos números do paper, o build com 4o-mini só se pagaria depois de 372 perguntas na mesma história. Com GPT-6 Luna, depois de 545. Com Claude Opus 5.5, depois de 596. O LoCoMo faz 152.

A conta é simples, e por ser simples engana pouco. O que muda de caso para caso é o ritmo das perguntas: 152 perguntas em uma história ficam longe de 372. O número que decide é quantas vezes o store vai ser lido antes de virar custo afundado.

Agora a parte que muda de sinal. O resultado depende do modelo que lê. Com GPT-4o-mini, o Mem0 fez 78% e o contexto completo, 74%. A memória ganhava, por pouco. Com GPT-6 Luna, a ordem inverteu: contexto completo com 92%, Mem0 com 80%. Com Claude Opus 5.5, os dois empataram em 95%. Minha leitura é que, quanto melhor o modelo lê uma história inteira sem perder o fio, menos a recuperação seletiva tem a oferecer. Ela troca informação por custo de leitura, e essa troca só compensa enquanto o modelo sofre com o texto longo.

O paper enquadra o resultado na bitter lesson de Sutton: conhecimento embutido no sistema ajuda no começo e depois estaciona, enquanto métodos gerais que escalam com computação acabam vencendo. Memória desenhada à mão para compensar um modelo fraco é esse tipo de conhecimento embutido. O dado sustenta a leitura, mas uma única conversa não sustenta uma lei.

Aqui entra o ponto que mais me preocupou no estudo. Um sistema de memória tem duas etapas: alguém escreve o store e alguém lê. No experimento, o mesmo modelo podia escrever e ler, mas a leitura podia ser trocada sem custo extra, porque recuperar informação não chama modelo. Isso permite separar o efeito de cada lado. O paper fez a separação com o grafo do Zep. Quando o grafo foi escrito pelo GPT-4o-mini, o desempenho foi 43% com leitor 4o-mini, 43% com Luna e 45% com Opus. Quando o mesmo tipo de grafo foi escrito pelo Opus 5.5, subiu para 66%, 71% e 87%.

| Quem escreveu o grafo | Leitor 4o-mini | Leitor Luna | Leitor Opus 5.5 |
|---|---|---|---|
| GPT-4o-mini | 43% | 43% | 45% |
| Claude Opus 5.5 | 66% | 71% | 87% |

Leia a tabela por linha e por coluna. Com o escritor fixo em 4o-mini, trocar o leitor por um modelo bem mais forte mexe pouco: de 43% para 45%. Com o leitor fixo em Opus, trocar o escritor muda o resultado de 45% para 87%. Leitor mais forte recupera quase nada do que o escritor não guardou: dois pontos, de 43% para 45%, ao trocar um 4o-mini por um Opus.

Isso não é detalhe de implementação, e a razão é prática. Na hora de escrever o store, o modelo decide o que entra e como cada fato é formulado. Essa decisão é uma perda de informação tomada antes de existir qualquer pergunta. Nenhum leitor traz de volta o que não foi guardado. Quem escolhe um sistema de memória escolhe, sem perceber, o modelo que vai escrever o store. E, nesse experimento do Zep, o escritor pesou mais que o leitor: quarenta e dois pontos contra dois.

O achado mais chamativo do estudo é o Pi com Opus 5.5: 99% por US$ 6,95 por rollout, contra 95% e US$ 17,84 do contexto completo. Ele lê cerca de 10.000 tokens de entrada por pergunta, dos quais 7.900 vêm do cache, contra 28.900 do contexto completo. Pelos números, parece vencer nos dois eixos.

Esse número pede uma ressalva, e ela é contra o próprio achado. Dos 419 turnos, 116 compartilham uma foto. Dessas fotos saem evidências para 64 das 152 perguntas, quase metade do teste. Os três agentes receberam o arquivo oficial, com as legendas das fotos. Os métodos de memória receberam só o texto do turno. Em outras palavras, parte da prova estava na legenda, e a legenda não chegou à memória.

Nas 88 perguntas sem evidência em foto, a diferença praticamente some. Pi acertou 100%, e contexto completo, Mem0, Codex e Claude Code ficaram com 99% cada. O que isso mostra é que ver as legendas é explicação compatível com a vantagem do Pi, não que ela toda venha daí. Se você leu só a manchete dos 99% contra 95%, leu o número errado para decidir.

Há ainda um erro no gabarito. Uma pergunta diz que Caroline compartilhou um quadro abstrato em 13/10/2023, mas quem compartilhou foi Melanie. O Pi apontou o problema, foi marcado como errado, e junto com ele caíram contexto completo, Codex e Claude Code. O erro pesa igual sobre os quatro, então não muda a comparação entre eles, mas significa que a nota de todos fica abaixo do que seria com o gabarito certo.

Esse estudo tem limites que o próprio paper declara, e prefiro listá-los a fingir que não existem. É uma das dez conversas do LoCoMo, e as perguntas adversariais ficaram de fora. Cada célula rodou uma vez, então a variação entre execuções não foi medida. O juiz foi o GPT-4o-mini, com rubrica frouxa, e pelo menos uma resposta foi marcada contra um gabarito errado. A história cabe na janela de todos os modelos, o que favorece o contexto completo. Numa conversa que não coubesse na janela, a conta mudaria, e o paper não mede esse caso. Mem0 e Zep rodaram com configuração padrão, então quem ajustar o sistema pode obter outro resultado. Os custos estão a preço de lista.

Por isso, a faixa de 372 a 596 perguntas vale para essa história. Que ela valha para a sua é uma hipótese, não um resultado.

Fico com uma regra prática, que é leitura minha e não conclusão do paper: a conta é perguntas por história. Se a história vai receber poucas perguntas, construir memória é pagar imposto antes de ter receita. Abaixo de algumas centenas, o build nem se paga nos próprios números do estudo. Acima disso, e com um escritor forte o bastante para não jogar fora o que importa, memória volta a fazer sentido. Antes disso, reler tudo costuma ser a opção mais barata.

## 📎 Fonte Original

Zedong Peng, "MemoryTax: The Bitter Lesson of Agent Memory", arXiv:2610.29823, v1, 21/10/2026. Zedong Peng, Shanghai Jiao Tong University (SJTU). https://arxiv.org/abs/2610.29823

<div class="persona" data-audio="/audio/memoria-custa-mais-caro-que-reler-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 28: as duas contas da memória: a que o paper faz e a que decide em produção. Não é a narração do texto.</small></p>
