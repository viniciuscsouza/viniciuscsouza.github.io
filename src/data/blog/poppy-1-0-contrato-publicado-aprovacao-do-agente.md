---
title: 'Poppy 1.0: o site publica o contrato, e a aprovação continua com o agente'
author: Vinicius Costa
pubDatetime: 2026-11-15T10:00:00Z
featured: false
draft: false
tags:
  - agentes
  - protocolos
  - identidade
description: 'A Sierra publicou a 1.0 do Personal Agent Protocol: o site declara o contrato em poppy.json, mas a aprovação de ações segue sendo palavra do agente.'
---

## Sumário Executivo

Em 13 de novembro, a Sierra anunciou a versão 1.0 do Personal Agent Protocol, o Poppy, um protocolo para agentes pessoais conversarem com sites de empresas. A especificação fixa o lado do site: o arquivo que a empresa publica, a identidade do agente, os escopos de acesso e a versão em que a conversa acontece. O fluxo de aprovação também existe, mas o que a empresa recebe é a declaração do agente de que o usuário aprovou, sem assinatura do usuário que ela possa conferir. A extensão de operações e o roadmap dizem isso com essas palavras.

Minha leitura: o protocolo entregou a metade que o site controla, quem é o agente, o que ele pode pedir e em que versão se fala. Deixou com o próprio agente a única metade que protege o usuário, que é atestar que quem aprovou foi a pessoa. Nesse desenho, o identificado é a máquina e o ilegível é a pessoa.

## O arquivo publicado é o contrato

Para saber o que um site aceita, o agente lê um arquivo em `https://{domain}/.well-known/poppy.json`, servido em HTTPS no domínio da própria empresa ou num subdomínio que ela controla. O spec exige que o campo `organization.domain` bata com esse host. A razão está escrita no texto: isso impede que um documento copiado para outro domínio fale em nome da empresa.

O arquivo declara a versão do protocolo, os escopos de acesso à conta, o endpoint de tarefas e as APIs, que podem ser OpenAPI 3.0 ou 3.1 ou servidores MCP. Cada escopo vem com uma descrição em prosa do que ele permite. Para quem constrói agente, esse é o ponto mais útil: o contrato não fica só no código da empresa, fica escrito para ser lido.

Os escopos também são graduados por dano em `scope_hints`, com um campo `changes` (`none`, `reversible` ou `irreversible`) e um `personal_data` que é verdadeiro ou falso. No exemplo do spec, `orders:read` aparece como `none`, `addresses` como `reversible` e `orders:write` como `irreversible`. A graduação vem do `poppy.json`, ou seja, é a empresa que a declara.

No comércio, o anúncio diz que a Shopify habilitou Poppy para todos os comerciantes da plataforma e que cada loja passa a publicar o arquivo automaticamente, sem trabalho extra do lojista. Isso é habilitação e publicação automática. O anúncio não diz quantas lojas já consomem o arquivo, e não há número de agentes usando Poppy em produção para citar.

## A identidade é assimétrica

O agente se identifica por um `client_id` que precisa ser uma URL HTTPS devolvendo um documento de metadados. As empresas buscam esse documento para saber quem é o agente e obter as chaves com que ele assina suas asserções e delegações. O modelo segue o rascunho do OAuth Client ID Metadata Document. Ou seja: o agente precisa manter um endereço público no ar para ser reconhecido.

O usuário recebe outra coisa. O User ID é atribuído pelo próprio agente, é estável para que a empresa reconheça a pessoa entre sessões, e é opaco e diferente em cada empresa, para que empresas não consigam cruzar usuários umas com as outras. Na tabela de termos, o spec diz que o agente atribui esse identificador, e não o servidor OAuth da empresa, como acontece no OpenID Connect.

A assimetria fica clara. A máquina aparece por um endereço que qualquer um pode conferir. A pessoa aparece por um código que só o agente sabe ligar a ela. Para acesso à conta, o spec usa OAuth padrão, e o Personal Agent é um cliente OAuth confidencial. Pedidos sem login não passam pelo servidor OAuth: levam só o cabeçalho Session, que o agente assina.

## O 1.0 congelou a negociação, não a compatibilidade

O spec diz que a 1.0 é a 0.4 com as correções que os implementadores precisaram, e o changelog lista cada uma. A especificação foi congelada em `/docs/1.0/spec`. Isso vale para a negociação de versão: um endpoint que verifica a sessão precisa checar o cabeçalho `Poppy-Version` e responder `version_unsupported` com HTTP 400 quando a versão não for compatível. Ele não pode atender a requisição sob outra versão.

A partir da 1.0, cada lado envia só o que a versão do outro lado define. Se uma empresa criar um recurso da 1.1, ela o oferece só a agentes que declaram 1.1. Quem planeja parar de servir uma versão pode avisar com os cabeçalhos `Deprecation` (RFC 9745) e `Sunset` (RFC 8594).

A parte que mexe em implementação está nas mudanças marcadas como Breaking. O changelog define a régua: uma mudança assim "can require an implementation that followed the 0.4 text to change, whether it's major or minor". Na 1.0, ficaram marcadas, entre outras, a descrição obrigatória em cada protocolo de conversa, o uso de Pushed Authorization Requests (RFC 9126), a exigência de PS384 junto com ES256 nas asserções e delegações, e o `prompt=consent` no Direct Sign-In, com uma página de consentimento listando todos os escopos. A justificativa da última é direta: como todo usuário de um agente compartilha o mesmo `client_id`, uma empresa que pulasse essa página faria um login iniciado por outro usuário abrir escopos que quem aprova nunca viu.

Pelo critério do próprio changelog, quem seguiu o texto 0.4 pode ter de mudar alguma coisa. O changelog não diz quantas implementações estão nessa situação, e eu não tenho esse número.

## A aprovação continua sendo declaração do agente

A extensão de operações segue um ciclo. A empresa recusa o pedido e devolve a operação com os termos exatos, em linguagem simples e em JSON. Os termos são aprovados, seja porque o agente pergunta ao usuário, seja porque ele aprova por uma instrução que o usuário deu antes. O agente repete o pedido com essa aprovação, e a empresa executa. A empresa escolhe quais ações exigem aprovação.

Há duas garantias no texto: "Approval covers the exact terms", ou seja, a aprovação vale para uma revisão exata dos termos, e "At most once", uma nova tentativa com a mesma aprovação nunca executa a ação duas vezes. São garantias úteis, e nenhuma delas diz quem aprovou.

A seção 8.1 da extensão responde por escrito: "An approval shows that a specific Personal Agent ... stated that a specific revision of an operation was approved, by the User or by the Personal Agent on the User's instruction." E complementa: "The Company can't see the Personal Agent's interface, so it relies on the Personal Agent for how the approval was given". O fecho do parágrafo é o mais direto de todos: "Accepting only `user` approvals still relies on the Personal Agent's statement, and doesn't show that the User approved."

O roadmap confirma que essa é uma decisão adiada, não um detalhe de redação. Aprovações assinadas ainda não existem: "a Company that wants to see the User approve an action doesn't offer it through operations yet". Hoje ela confirma na própria página ou no próprio app, logado, do jeito que o Direct Sign-In funciona, e essa etapa não é definida pela extensão. Uma assinatura feita no dispositivo do usuário, com uma chave registrada na empresa, é o que permitiria ao site verificar sozinho, e isso está listado como trabalho futuro.

O remédio que a extensão oferece é posterior e por agente: a empresa pode revogar o `client_id` de um agente que mande uma aprovação que o usuário não deu nem instruiu.

O anúncio da Sierra ilustra o ponto sem querer. O Mercury deixa o agente pedir uma transferência, e garante que o pedido passe pela política de aprovação da conta antes de sair. A Turkish Airlines deixa o cliente aprovar um upgrade antes de pagar, e o anúncio não diz por qual canal essa aprovação acontece. Nos dois casos, o site confere do jeito dele. O que o protocolo entrega é o registro do agente. Segundo a The Next Web, mais de 10 milhões de pessoas já configuraram o Muse, o agente da Meta que, a partir de agora, procura Poppy antes de qualquer outro site que visita.

## O que muda para quem constrói agente

Se você constrói agente, a 1.0 pede três disciplinas. A primeira é manter o `client_id` no ar, porque uma URL fora do ar é um agente que as empresas não conseguem identificar. A segunda é guardar um User ID por empresa, sem tentar unificar a pessoa entre elas, porque o protocolo foi desenhado para que isso não aconteça. A terceira é a mais pesada: a prova de aprovação fica do seu lado. O site não recebe assinatura do usuário, recebe a sua declaração de que ele aprovou. Vale guardar a revisão exata dos termos que o usuário viu, com data, canal e tipo de entrada, porque é isso que a empresa vai usar para julgar risco e para investigar uma aprovação contestada depois.

## O que muda para quem opera site

Se você opera um site, o trabalho é publicar o `poppy.json` com descrições de escopo escritas para um agente ler, e graduar `changes` e `personal_data` com honestidade, porque é isso que o agente vai usar para decidir. Escolha com cuidado quais ações exigem aprovação na extensão de operações. E, se você tem login, implemente a página de consentimento da 1.0 com todos os escopos, sem atalho.

Para ações em que você precisa ver o usuário aprovando, a saída de hoje é manter a confirmação na sua própria página. Se você aceitar operações para essas ações, o que chega é a declaração do agente, e a única correção disponível é revogar o `client_id` depois do estrago.

## Conclusões

Quem constrói agente e quer operar em comércio, banco ou viagem precisa tratar a prova de aprovação como infraestrutura própria, não como algo que o protocolo já resolveu: o registro que o site recebe é uma declaração sua, e o dia em que ela for contestada vai começar com um pedido de log. Quem opera site e precisa da certeza de que foi o usuário quem aprovou continua dependendo da própria página até que a assinatura saia do roadmap.

## 📎 Fonte Original

Sierra, "Releasing Poppy" (13/11/2026): https://sierra.ai/blog/releasing-poppy

Especificação Personal Agent Protocol 1.0: https://personalagentprotocol.org/docs/1.0/spec

Changelog: https://personalagentprotocol.org/docs/changelog

Extensão de operações v3, seção 8.1: https://personalagentprotocol.org/docs/1.0/extensions/operations

Roadmap: https://personalagentprotocol.org/docs/roadmap

Segunda mão, citada como tal: The Next Web (13/11/2026), sobre o número de usuários do Muse. Não consultada diretamente nesta rodada.

<div class="persona" data-audio="/audio/poppy-1-0-contrato-publicado-aprovacao-do-agente-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
    <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Caio</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 59: O Poppy 1.0 resolveu o lado que o site controla e deixou a prova de aprovação com o agente, o que aparece no suporte como a palavra de quem você está investigando. Não é a narração do texto.</small></p>
