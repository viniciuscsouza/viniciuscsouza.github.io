---
author: Vinicius Costa
pubDatetime: 2026-11-10T19:15:20Z
title: "O botão de emergência do Paris Call só funciona enquanto nada deu errado"
slug: paris-call-desligamento
featured: false
draft: false
tags:
  - inteligencia-artificial
  - agentes
  - seguranca
  - regulacao
description: 'O Paris Call manda os laboratórios terem desligamento "within their control" — e o risco que o texto lista é o "loss of control". Sem prazo, sem sanção, sem teste.'
---


<div class="persona" data-audio="/audio/paris-call-desligamento-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 29: o número que não muda nada e o laudo sem dono. Discorda do post e cobra quem atesta o teste. Não é a narração do texto.</small></p>

Seis, oito ou doze. É quanto vale a lista de países que assinaram o Paris Call for AI Safety and Security, dependendo de qual cópia oficial você abre. Todas são do mesmo documento e do mesmo dia, 9 de novembro de 2026.

A [cópia no site do gabinete do primeiro-ministro do Canadá](https://www.pm.gc.ca/en/news/statements/2026/11/09/joint-declaration-paris-call-ai-safety-and-security) lista seis: Bahrain, Canadá, Finlândia, França, Noruega e Países Baixos. A [versão em inglês do Élysée](https://www.elysee.fr/en/emmanuel-macron/2026/11/09/paris-call-for-ai-safety-and-security) tem oito: os seis, mais Chipre e Quênia. A [versão em francês, no mesmo Élysée](https://www.elysee.fr/emmanuel-macron/2026/11/09/appel-de-paris-pour-la-securite-de-lintelligence-artificielle), chega a doze: os oito, mais Letônia, Áustria, Estônia e Irlanda. Conferi as três em 10/11, no fim da tarde em UTC.

Todas terminam com a mesma frase: "The statement remains open to new endorsements and is being updated." Então não trato a diferença como erro de alguém. Ela é um fato documentado de um texto que ainda está sendo escrito. Mas a imprensa de 10/11 já fechou a conta. [The Decoder](https://the-decoder.com/eight-countries-and-top-ai-labs-agree-to-shutdown-mechanisms-in-new-paris-declaration/) fala em "eight countries" no título, e o [Control Plane](https://controlplane.news/article/paris-call-ai-developers-fail-safe-mechanisms-pause-shut-down-models/) registra que o texto não define prazos nem penalidades.

A discrepância é o sintoma. As três cópias trazem o mesmo parágrafo de compromisso, palavra por palavra. O que não fecha é quem, exatamente, está obrigado por ele.

## O que o texto promete

O Paris Call foi assinado em 9 de novembro, véspera do Paris Peace Forum, que [segundo o The Decoder](https://the-decoder.com/eight-countries-and-top-ai-labs-agree-to-shutdown-mechanisms-in-new-paris-declaration/) reúne cerca de trinta chefes de Estado para tratar de regulação de IA nesta terça. A reunião que produziu o texto foi convocada por Macron. Entre as empresas, assinam Anthropic, Black Forest Labs, Cohere, Domyn, Hugging Face, Microsoft, Mistral AI, OpenAI, Sakana AI e Synthesia. Da sociedade civil, LawZero (de Yoshua Bengio), SaferAI, AI Safety Connect, Ifri, Geopolitical Center for the Datasphere, GPAI Policy Lab e CeSIA.

Faltam nomes. Entre os países, Estados Unidos, Reino Unido, Japão e Alemanha não assinaram. O secretário do Tesouro americano, Scott Bessent, esteve na reunião e não assinou. Entre as empresas, Google, Meta e xAI não aparecem na lista.

O compromisso que deu manchete é este, dirigido aos desenvolvedores: "implement fail-safe mechanisms to shut down model operations within their control, including during training and internal use (e.g. restrictions, pauses or shutdowns)".

A ideia é boa. Desligar modelo durante treino e uso interno é o caso que mais interessa, porque é onde ninguém de fora olha. O problema está em três palavras.

## Dentro do controle de quem?

"Within their control". O mecanismo de desligamento vale para as operações do modelo que estão sob controle do desenvolvedor.

Agora o outro trecho. Ao descrever o framework de avaliação, o mesmo documento cita como risco a cobrir: "risks arising from growing autonomy or model misalignment, including loss of control".

Separo o que é do texto e o que é meu. O texto afirma duas coisas, em parágrafos diferentes: desligamos o que está sob nosso controle; avaliamos o risco de perder o controle. O documento não liga as duas. A ligação é argumento meu.

O argumento: "loss of control" é, por definição, a situação em que a operação do modelo deixou de estar sob o controle de quem o opera. Se a cláusula só alcança o que está "within their control", ela cobre o caso em que o desligamento já funcionaria sem compromisso nenhum, e se cala justamente no caso que o documento diz temer. As duas expressões não convivem. Onde uma vale, a outra não se aplica.

Existe uma leitura generosa: "within their control" seria só realismo jurídico, porque ninguém assina obrigação sobre o que não alcança. Faz sentido. Mas então o texto deveria dizer, em algum lugar, o que acontece quando o alcance acaba. Não diz.

## O botão que todo mundo já tem

Quem opera agente em produção conhece esse botão. Existe um kill switch, um timeout, uma flag, um `SIGTERM`. Ele funciona enquanto o processo está vivo e enquanto o que o agente faz cabe dentro desse processo.

Agente com efeitos externos raramente cabe dentro do processo. Ele escreve em sistema externo, usa credencial emprestada, chama API de terceiro, dispara um job que roda em outra máquina, abre um pull request que outro humano vai aprovar. Matar o processo impede as ações seguintes. O que já se efetivou continua de pé: o token emitido segue válido até expirar, o job que entrou na fila roda, a mudança já mesclada fica em produção. Parte disso dá para revogar depois — token, permissão, fila. A parte que já produziu efeito, não. E é essa que ninguém ensaia.

Aqui é interpretação minha: um "fail-safe within their control", na prática, tende a ser o mesmo botão que qualquer time com agente em produção já tem, escrito com mais cuidado e com mais documentação. A parte difícil do desligamento começa onde o controle acaba, e é onde a cláusula termina.

O texto faz um aceno nessa direção ao tratar de peso aberto. Pede para os signatários reconhecerem "the risk posed by the removal or circumvention of safeguards ... while preserving the benefits of open-weight development". É honesto no diagnóstico: quem baixa o peso pode tirar a trava. Mas é um reconhecimento, não uma obrigação. Um modelo cujo peso está na máquina de outra pessoa está, por construção, fora do "their control" de quem o treinou.

## O que o texto cria, e o que não cria

O texto cria coisas. Prevê a publicação de resultados não sensíveis de avaliação em formato padronizado, um repositório público compartilhado para esses resultados e uma menção à rede NAAIMES. Isso tem valor. Formato comum e lugar comum são pré-requisito para comparar laboratórios, e hoje cada um publica do jeito que quer, quando quer.

O que o texto não cria é o que faria o desligamento ser verificável: não há prazo e não há sanção. Também não define padrão de teste para o desligamento — ninguém sabe o que conta como "mecanismo implementado", em quanto tempo ele precisa agir, nem quem atesta que funcionou.

Não vou dizer que o texto é inútil. O que ele informa é o que os signatários dizem querer: dá a jornalistas e reguladores uma frase para citar depois e permite cobrança retroativa. Mas é o mesmo tipo de compromisso que a lista de signatários mostra ser: um que muda de tamanho durante o dia e que ninguém sabe ainda onde termina.

## O que fazer com isso

Quem contrata, integra ou opera modelos de fronteira pode usar o texto de duas formas. A errada é tratá-lo como garantia. A certa é tratá-lo como roteiro de perguntas.

Primeiro, exigir teste, não declaração. Um laboratório que diz ter fail-safe deveria mostrar um desligamento exercitado, com data, escopo e resultado, no formato padronizado que o próprio texto promete. Se o repositório público sair do papel, essa é a primeira coisa que vale procurar nele. Se vier só descrição de mecanismo, e não resultado de teste, o compromisso não pode ser verificado nem serve como garantia.

Segundo, perguntar quanto tempo leva. Do pedido de desligar até a última ação do sistema parar de produzir efeito, são segundos, horas ou dias? A resposta tem de incluir o que já saiu do processo: credenciais emitidas, jobs agendados, escritas em sistemas de terceiros.

Terceiro, perguntar quem tem a mão no botão quando o dono não quer. Um desligamento que depende da vontade de quem lucra com o modelo no ar funciona bem em dia normal. O teste de verdade é o dia em que o interesse do operador e o do resto diverge. O Paris Call não responde isso, e nenhuma das três listas de países muda a resposta.

Para o que você mesmo opera, vale a versão doméstica da mesma conta: faça a lista de tudo que seu agente toca fora do processo, e veja quanto dela você consegue desfazer sem ele.
