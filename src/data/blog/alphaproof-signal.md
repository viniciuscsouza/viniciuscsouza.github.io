---
author: Vinicius Costa
pubDatetime: 2026-11-11T15:00:00Z
title: "Prova barata, especificação cara: o que a verificação do libsignal muda"
slug: alphaproof-signal
featured: false
draft: false
tags:
  - inteligencia-artificial
  - seguranca
  - engenharia-de-software
  - verificacao-formal
description: "Agentes provaram a segurança do libsignal no código de máquina; a garantia depende de 26 mil linhas que só um humano confere."
---

Em 10 de novembro de 2026, o Google DeepMind anunciou o AlphaProof Code, um framework de agentes de IA para verificação formal de software, e o usou para provar propriedades de segurança do libsignal, a implementação de referência do protocolo Signal, no nível de código de máquina. Segundo o comunicado, é a primeira vez que a implementação de um protocolo amplamente implantado é verificada formalmente por qualquer método, com ou sem IA — e o protocolo protege bilhões de conversas, em variantes que rodam no WhatsApp e no Google Messages. O que me interessa no anúncio não é a lista de aplicativos, e sim a mudança de custo que ele sugere e os limites que ele declara.

O artefato verificado foi a libsignal v0.105.4 com spqr v1.6.0, em Rust não modificado, compilado pelo rustc padrão para AArch64 e envolvido num pequeno harness de linha de comando chamado libsignal-cli. As provas cobrem init, send e recv; keygen não foi verificado. Esse detalhe de escopo volta mais adiante, porque ele muda o sentido da frase "verificaram o Signal".

O trabalho responde a um desafio público lançado em abril de 2026 pelo Beneficial AI Foundation, pela Signal Foundation e pela Lean FRO, chamado "Signal Shot". A especificação foi escrita por agentes sob orientação humana, com revisão humana de cada definição, e partiu de modelos simbólicos e computacionais já publicados para o Signal; o que ela teve de fazer a mais foi compor handshake e ratchet num único modelo e cobrir o ratchet pós-quântico do libsignal, o que os modelos anteriores não faziam. A parte de semântica AArch64 cobre 467 instruções e 31 chamadas de sistema e foi testada em lockstep contra o emulador Unicorn e contra o modelo Sail do Armv9.4-A, conforme a seção 2.2 do paper.

Os números do processo pedem leitura cuidadosa. Os agentes geraram cerca de 6,5 milhões de linhas de prova em Lean, conferidas por máquina. Essas linhas repousam sobre cerca de 26 mil linhas confiáveis, sendo aproximadamente 18 mil de especificação e definições e 8 mil de semântica AArch64 e nomes de símbolos. São duas quantidades que medem coisas diferentes: a primeira é prova gerada e conferida, a segunda é o que precisa estar certo para que a prova signifique alguma coisa.

O fluxo funciona assim. Humanos e modelos convergem numa especificação em Lean, e essa especificação é revisada por humanos. Agentes com Gemini Carbon escrevem as provas. Uma prova só é aceita se o kernel do Lean a conferir contra uma cópia da especificação guardada fora do alcance dos agentes, e um "gatekeeper" só declara o objetivo concluído depois disso. Os agentes também auditaram a própria prova e destacaram para segunda olhada humana cerca de 1% do código. Segundo a seção 2.3 do paper, as campanhas usavam times de 40 a 80 agentes rodando numa única máquina por 24 a 72 horas. O blog descreve o resultado como apenas quatro semanas de trabalho, tarefa que historicamente leva anos com equipes especialistas. O paper faz a comparação com o seL4, que levou vinte pessoas-ano para ser verificado, e com o CompCert, que levou seis. A SecurityWeek informa que cinco pesquisadores fizeram o trabalho de prova.

A mudança de gargalo é o ponto que me interessa. Durante décadas, a parte cara da verificação formal foi a prova, e por isso o seL4 custou vinte pessoas-ano: o trabalho humano era escrever e conferir demonstrações à mão. Agora a prova ficou barata e, nesse sentido, descartável. São 6,5 milhões de linhas que ninguém precisa ler linha por linha, porque o kernel confere cada uma. O que sobrou de caro é a especificação, as 26 mil linhas que não têm como ser conferidas automaticamente e que determinam tudo o que a prova garante. O próprio paper afirma que a maior parte do esforço humano em verificação de software agora está em projetar a especificação, e que a mão de obra da prova não é mais o gargalo. A proporção deixa isso concreto: cerca de 250 linhas de prova para cada linha que um humano precisa estar certo. Quem revisa a prova não precisa revisar nenhuma dessas 6,5 milhões de linhas. Quem revisa a especificação precisa revisar as 26 mil.

O teste de que a especificação morde veio de dois bugs antigos e reais do libsignal, já corrigidos, que foram reintroduzidos numa versão isolada do código. Nos dois casos, o sistema produziu uma prova conferida por máquina de que aquela versão é insegura. A especificação, portanto, rejeitou falhas que de fato existiram no código. O que isso mostra é onde o erro tem chance de ser pego: na frase que diz o que deve ser verdade, não numa prova que ninguém lê linha a linha.

Os limites vêm declarados no paper, e prefiro repeti-los com os termos dele. A garantia simbólica assume criptografia ideal e não diz nada sobre o sigilo computacional dos bytes. O teorema computacional, o Teorema 2, que cobre confidencialidade e autenticidade de mensagens, considera só adversário clássico. Canais laterais estão fora de escopo. O caminho trust-on-first-use não é exercitado, porque as duas partes começam com a chave de identidade uma da outra já fixada. Mensagens em grupo são trabalho futuro. Sobre o SPQR, a prova mostra que o Triple Ratchet não é menos seguro que o Double Ratchet; ela não mostra a cura pós-quântica que o SPQR acrescenta. E a Tabela 1 do paper registra que o limitante computacional fica vazio para múltiplas sessões longas com muitas épocas (seção 5.2.5). Nenhuma dessas exclusões torna o resultado falso. Cada uma delimita o que se pode afirmar sobre ele.

Falta o escopo do artefato. Os resultados cobrem o build do próprio Google, rodado por um wrapper de linha de comando, e não os aplicativos do Signal. "Verificaram o build do Google do libsignal, uma sessão de duas partes e uma operação por vez, com criptografia ideal" e "verificaram o Signal" não são a mesma frase, e a distância entre as duas é exatamente o trabalho que quem escreve sobre o assunto precisa fazer.

A consequência prática para quem escreve ou revisa código com agente é esta: o que passa a importar na revisão não é o diff e não é a prova. É a frase que diz o que o código deve garantir. Quem aprova uma especificação fraca aprova uma prova irrelevante com selo matemático. A ordem de leitura muda: antes do código, a propriedade; depois, o código que tenta cumpri-la. Isso não depende de Lean. Testes, contratos de tipo, asserções e critérios de aceitação de um pull request são especificações pequenas, e quando o mesmo agente escreve o código e o teste, o teste pode passar por construção sem dizer nada sobre a intenção. Vale perguntar, em cada revisão, quem escreveu a frase que diz o que deve ser verdade e se ela captura o que importa. Se a resposta for o próprio agente que gerou o código, a garantia vale o que vale a frase, e a frase ainda não foi revisada.

## 📎 Fonte Original

Google DeepMind, "Introducing AlphaProof Code: a breakthrough in verifying complex software at depth", 10/11/2026:
https://deepmind.google/blog/introducing-alphaproof-code/

Paper, "AlphaProof Code: Verifying Signal's Security at the Machine-Code Level", 10/11/2026 (PDF):
https://deepmind.google/documents/36/Formal_Verification_of_Signal_4.pdf

Desenvolvimento Lean aberto:
https://google-deepmind.github.io/code-verification

<div class="persona" data-audio="/audio/alphaproof-signal-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Sabrina">
    <img src="/personas/sabrina.webp" alt="Retrato de Sabrina, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Sabrina</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 26: o selo de verificado cobre o terreno descrito, não a casa: o build provado é o do Google, não o app do Signal. Não é a narração do texto.</small></p>
