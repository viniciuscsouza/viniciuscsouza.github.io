---
title: "O Signal bloqueou o print no iOS; no Android, só quando detecta um assistente de IA"
description: "No macOS não há API documentada para bloquear screenshot, e a recomendação do Signal é excluir o app da seção Excluded Apps do Siri AI."
pubDatetime: 2026-11-21T10:00:00Z
author: Vinicius Costa
slug: signal-screenshot-permissao-do-sistema
tags: [ia, seguranca, agentes]
featured: false
draft: false
---

Em 20 de novembro, o Signal publicou que passou a bloquear a captura de tela dentro do app no iOS 27. No Android, o bloqueio só entra quando o app detecta um assistente de IA tentando ler a tela. No Windows 11, o mesmo remédio existe desde o ano passado, contra o Recall. No macOS, o Signal não bloqueou.

A diferença não é de esforço. É de permissão. O [texto](https://signal.org/blog/protecting-your-privacy/) diz que o app bloqueia onde o sistema operacional deixa, e que no macOS não tem as ferramentas para fazer o mesmo. A publicação é da Signal Technology Foundation, que chama a integração de agentes de IA nos sistemas operacionais de ameaça existencial ao Signal.

## Três sistemas, três implementações

No iOS, o bloqueio é o mais direto: impedir screenshot dentro do app. Quem quiser tirar print pode desativar a proteção nas configurações, e o Signal avisa que isso "will potentially expose your (and your contacts') Signal content to these AI agents, and break our privacy guarantees". A escolha do usuário vale para os dois lados da conversa.

No Android, o mecanismo é outro. A nota 2 do post explica por quê: em muitos aparelhos de fabricantes que não são a Google, o app não tem como detectar que alguém tentou tirar print quando o print já está desabilitado. Em vez de deixar o print sem funcionar e confundir o usuário, o time passou a detectar quando um assistente de IA tenta acessar a tela. Quando detecta, liga sozinho o ajuste "Screen security". A proteção, então, depende de o app reconhecer o acesso, e esse reconhecimento não é garantido em todo aparelho.

No Windows 11, o remédio é o mesmo desde 2025, contra o Recall. A nota 1 descreve o que o Recall faz: captura a tela a cada poucos segundos, extrai texto por OCR e grava tudo num banco pesquisável no próprio aparelho, o que pode reter mensagens do Signal indefinidamente, inclusive as que desaparecem.

## No macOS, a API que existe serve para vídeo

A nota 3 é a parte que interessa a quem escreve software. O Signal não bloqueia o Siri AI no macOS porque não consegue bloquear screenshot de forma confiável. Não é falta de tentativa: "Faced with a lack of clearly documented APIs that allow us to implement screenshot protection, we do not have the tools available that let us do the job."

Existem proteções contra captura contínua de tela no macOS. Elas não valem para screenshot, que é como a maior parte dos sistemas agênticos lê dados de aplicativos. A tentativa de implementar o bloqueio, segundo o texto, revelou "a minefield of bewildering decisions that place user privacy at risk", incluindo APIs que foram depreciadas em favor de proteções de tela que só funcionam para streaming de mídia e conteúdo protegido por DRM. O link que o Signal usa nessa frase aponta para a documentação do FairPlay Streaming, da Apple.

A recomendação para quem usa macOS 27 é manual: adicionar o Signal à seção Excluded Apps, em Ajustes do Sistema > Siri. Fora isso, nada.

## O próprio Signal diz que o remédio é incompleto

A frase que dá o tom do documento vem depois da lista de medidas: "Our remedy is also incomplete". Bloquear screenshot não cobre outras formas de acesso, como recuperar pelo sistema de arquivos conteúdo que já está no aparelho. E, uma vez capturado o dado, "All of this is outside of Signal's control", inclusive para os outros participantes da conversa, que não escolheram aquele sistema operacional nem aquele assistente.

O texto aponta também o caminho lateral. Agentes de terceiros, como o Muse, da Meta, usam permissões de acessibilidade criadas para dar autonomia a pessoas com deficiência. Nas palavras do Signal, não para "act as a skeleton key that provides access to AI agents".

## O que o Signal pede

São dois pedidos, endereçados a Apple, Google e Microsoft. O primeiro é uma forma documentada de o desenvolvedor excluir o app do acesso e do processamento por IA, cobrindo leitura de tela, sistema de arquivos, notificações e APIs, sem destruir a experiência de uso. O segundo é "better documentation and technical specifications around how these AI agents function", com foco em acesso e processamento de dados.

O Signal diz que gasta tempo de engenheiro em investigação forense no Android e no iOS para descobrir o que acontece quando um assistente acessa dados do app, justamente porque essa documentação não existe. E descarta uma saída que costuma aparecer como resposta: computação confidencial. Segundo o texto, ela "do not address these core concerns" e deixa nas mãos do fornecedor "the power to determine the extent of privacy guarantees (if any)".

Há um reconhecimento de que Google e Apple estão conversando com o Signal, e o [EFF](https://www.eff.org/deeplinks/2026/10/victory-you-can-now-exclude-apps-siri-ai) aparece como aliado, com uma vitória de outubro que permite excluir apps do Siri AI.

## Nenhum número, e isso faz parte

O texto não publica uma única medida: não há taxa de capturas bloqueadas, número de aparelhos cobertos, contagem de apps afetados. A evidência é a assimetria entre as plataformas, a alternativa manual no macOS e a admissão de que o remédio não fecha o buraco.

Para uma organização que constrói a reputação sobre código aberto e protocolo verificado formalmente, publicar sem número é coerente com o que dá para provar. O bloqueio funciona onde foi implementado. O que não foi implementado não tem como ser medido por quem não recebeu a API.

## O que sobra para quem constrói aplicativo

A garantia de privacidade na camada do app deixou de ser propriedade do app. Ela é o que o sistema operacional permite implementar, na forma que ele permite: bloqueio de captura no iOS, detecção condicional no Android, nada no macOS. Mesmo código, mesmo protocolo, três resultados.

Para quem escreve software, o teste é objetivo: o seu aplicativo tem uma forma de sair do acesso por IA que não exija desligar o produto para o usuário? Se a resposta depende de qual sistema roda o app, a garantia não é sua. O pedido de "simple technical tools and accurate documentation" é o reconhecimento disso: a proteção, hoje, não cabe a quem escreve o aplicativo.

## 📎 Fonte Original

- [Signal is Serious About Protecting Your Privacy](https://signal.org/blog/protecting-your-privacy/), Signal Technology Foundation, 20/11/2026, com as notas 1 a 3 (Recall, Android, macOS).
- [Signal Doesn't Recall](https://signal.org/blog/signal-doesnt-recall/), Signal, bloqueio de captura contra o Recall no Windows 11, 2025.
- [Victory: You can now exclude apps from Siri AI](https://www.eff.org/deeplinks/2026/10/victory-you-can-now-exclude-apps-siri-ai), EFF, outubro de 2026.

<div class="persona" data-audio="/audio/signal-screenshot-permissao-do-sistema-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 05: O comentário separa bloqueio de detecção: um vale como propriedade do app, o outro só contra o acesso que o app reconhece, e no macOS não há API para bloquear print. Não é a narração do texto.</small></p>
