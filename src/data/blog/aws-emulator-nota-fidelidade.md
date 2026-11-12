---
author: Vinicius Costa
pubDatetime: 2026-11-12T09:50:00Z
title: "AWS Emulator: o clone da nuvem vem com a nota de fidelidade"
description: "Emulador da AWS escrito por agentes publica a nota por serviço: 56,5% dos testes de fidelidade passam no release de estreia, e CloudFormation fica em 18,9%."
tags: ["AWS", "Agentes", "Engenharia de Software", "Testes"]
---

A AWS publicou um emulador local dos seus serviços. É grátis, roda offline, tem licença CC0 e foi feito para um agente de código testar o próprio trabalho sem provisionar uma conta na nuvem. "All of AWS Emulator's code was written and tested by agents", diz o post de Swaminathan Sivasubramanian no blog de Werner Vogels, de 11 de novembro. O código e os testes foram escritos por agentes, com andaime humano por trás.

Isso importa menos pelo clone e mais pelo que veio junto: uma nota publicada por serviço. Na versão 1.0.322, 56,5% dos testes de fidelidade passam. CloudFormation fica em 18,9%. Vinte e um serviços não têm nenhum teste passando. Vou tratar aqui do que esse número mede, do que não mede e do que sobra para o engenheiro quando o agente escreve quase tudo.

## Como o agente sabe que acertou

O mecanismo cabe em poucas frases, e é aí que mora a ideia. Existe uma especificação pública, os modelos de API escritos em Smithy, com mais de 400 modelos cobrindo mais de 200 serviços da AWS. Existe também a coisa real, que é a própria AWS. O agente pega um cenário de cliente derivado desses modelos e corrige o teste até ele passar contra a AWS de verdade. Aquele teste passa a gravar como a AWS se comporta. Só depois o agente constrói o emulador até ele passar no mesmo teste.

A ordem importa. O teste não nasce da intuição de quem implementa. Nasce contra uma referência externa, e quando o emulador diverge, a divergência é observada, não suposta. Os casos encontrados ficam numa pasta pública chamada things-that-do-not-work, que guarda justamente o que não funciona.

Matt Goldberg, engenheiro sênior da AWS Developer Tools, teve a hipótese, deu um prompt ao Kiro e recebeu "a passable first version of an SQS emulator in about 15 minutes". Uma versão aceitável, não um produto. Esse ganho no primeiro rascunho é real, mas é a parte menos interessante da história.

## O número que a cobertura não abriu

O arquivo scores.json.gz, anexado ao release, traz 42.937 unidades de teste de fidelidade espalhadas por 355 namespaces de serviço. Dessas, 24.243 passam, ou 56,5%. As outras 18.614 falham. Do total, 32.402 são unidades comportamentais e 10.535 verificam o wire, isto é, status, corpo e cabeçalhos da resposta.

Os serviços que um agente de código mais chama estão longe de fechados. O SQS passa em 1.032 de 1.523 testes, ou 67,8%. O DynamoDB, em 1.153 de 1.694, 68,1%. O S3, em 1.763 de 2.814, 62,7%. O IAM fica em 58,0% e o EC2 em 38,8%. No fim da fila, o CloudFormation: 795 de 4.206 testes, 18,9%, na maior suíte de todas.

Essa distribuição diz menos sobre um ranking de maturidade e mais sobre o que a palavra "emulador" esconde. A confiabilidade do clone depende do serviço, e "use o emulador" não é uma afirmação que valha para qualquer projeto. A própria AWS responde a isso com uma skill que lê a nota antes de prometer qualquer coisa: ela levanta as operações que o seu código chama, confere contra os testes e as notas daquele release e depois diz em que parte você pode confiar.

A leitura certa é mais estreita do que parece. O número diz quantos dos testes de fidelidade de um serviço passam, não é uma taxa de erro do emulador. A própria documentação admite que os testes ainda não cobrem todo comportamento, e os 21 serviços com zero testes passando, 344 unidades ao todo, podem ser serviços cujo conjunto de testes nunca fechou. Por isso eu não colocaria o 18,9% do CloudFormation ao lado do 68% do DynamoDB como se medissem a mesma coisa. Cada suíte tem tamanho próprio, e um percentual sobre 4.206 unidades não se compara a um percentual sobre 1.694.

Há uma segunda leitura, no tempo. O repositório tem 29.684 commits, segundo Simon Willison, que registrou o número no próprio blog. O release anterior, a v1.0.293, publicado cerca de 10 horas antes, tinha 23.942 de 42.631 testes passando, 56,2%. Entre um e outro entraram 306 testes e o percentual subiu 0,3 ponto. Uma variação dessa ordem em meio dia sugere que a nota acompanha mais o que entrou na suíte do que mudanças no emulador. Nota por release serve para acompanhar a direção. Não serve para afirmar que o emulador ficou muito melhor de uma versão para outra.

Um teste que falha é divergência observada contra a AWS real. A amostra, porém, é a suíte que a própria AWS escreveu. Não há auditoria independente por trás dela.

## O que muda quando não existe especificação

Aqui está o ponto que me interessa. O mecanismo funciona porque a AWS reúne duas coisas que a maioria dos times não tem — e aqui eu falo por inferência, não por medida: uma especificação pública em formato de máquina e o serviço real para perguntar. Quando o agente erra, há contra o que corrigir. Sem essa referência, o agente tem código e nada para comparar.

O autor do post conta o próprio caso. O motor de replicação do Alf, construído com Al Vermeulen, levou cerca de quatro meses na primeira vez. Na tentativa com o Kiro, ele supervisionou o agente por quatro noites antes de perceber que o agente não tinha como checar os próprios resultados. Quando passou a ter uma especificação e um ambiente de teste, a reconstrução levou cerca de duas horas.

Quatro meses e duas horas não são diferença de motor. São diferença de especificação e de ambiente de teste. Onde a especificação pública não existe, como no seu serviço interno, no seu produto ou numa regra de negócio que só a sua equipe conhece, o agente não tem contra o que se corrigir. O custo de escrever esse teste não desaparece: muda de dono. É o trabalho que o agente não pôde fazer sozinho, e é nele que eu colocaria o centro do projeto.

O post também descreve o portão de merge do emulador: checagens automáticas, vários agentes de segurança fazendo revisão adversarial e checagens determinísticas que impedem agentes de tocar código que não deveriam tocar. "An engineer built the scaffolding that runs them", diz o texto. Um engenheiro construiu esse andaime. Ele não veio de graça junto com o agente. O que sobra para o engenheiro é exatamente isto: o teste que define o certo e o portão que decide quando o trabalho acabou.

## O que a nota não diz

Duas coisas ficam de fora do release, e convém separá-las. "Todo o código escrito por agentes" é afirmação da AWS, feita com andaime humano, não é auditoria independente. E a própria AWS diz que o emulador não deve ser usado em produção e não serve para testar segurança: para o ciclo de tentativa e erro do agente, sim; para o resto, a própria AWS põe um limite.

A nota é recalculada a cada release, e o arquivo traz o commit exato e a hora da medição. É um retrato de um instante, não um veredito sobre o projeto.

A pergunta útil num projeto com agentes deixa de ser quem escreveu o código. Passa a ser quem escreveu o teste que o agente teve de passar, e contra o quê. Se a resposta for a coisa real, o agente tem chão. Se a resposta for ninguém, a nota publicada pela AWS vira o que ela é: um número sobre uma suíte, e não sobre o serviço.

<div class="persona" data-audio="/audio/aws-emulator-nota-fidelidade-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 29: 56,5% dos testes de fidelidade passam no lançamento, e o número que decide adoção é outro. Não é a narração do texto.</small></p>
