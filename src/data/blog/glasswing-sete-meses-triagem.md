---
author: Vinicius Costa
pubDatetime: 2026-11-11T10:00:00Z
title: "Glasswing em sete meses: 11.813 achados a mais, 15 correções a mais"
slug: glasswing-sete-meses-triagem
featured: false
draft: false
tags:
  - inteligencia-artificial
  - seguranca
  - open-source
  - agentes
description: "Em dois meses, o Glasswing somou 11.813 achados e 15 correções. A triagem que faltou na Anthropic foi empurrada para os maintainers, que pagam a conta."
---

O Glasswing completou sete meses. O programa, lançado em 7 de abril, usa modelos da Anthropic para procurar vulnerabilidades em software, inclusive em projetos open source. A VulnCheck fez a conta do que sobrou. Segundo a VulnCheck, o total de achados cresceu muito mais que o de correções, e quem absorve a diferença é o maintainer que recebe o relatório. A VulnCheck vende inteligência de vulnerabilidade, então é parte interessada na crítica, e trato os números dela como a leitura de quem tem interesse nela. Os números da própria Anthropic vêm do ledger público, consultado em 11 de novembro, e do post de lançamento do OSS Scanner, de 8 de outubro. O que muda entre as duas leituras é a interpretação.

A distância entre descobrir e corrigir cresceu. Entre 8 de setembro e 2 de novembro, o total de achados no ledger foi de 26.153 para 37.966, um salto de 11.813. No mesmo intervalo, as correções marcadas foram de 202 para 217. São quinze. O ledger é atualizado em lotes, então 217 é o número de correções marcadas, não a medida do que foi consertado no mundo. Mesmo com essa ressalva, a direção é clara: a fila de achados cresce muito mais rápido que a fila de fechamentos registrados.

A parte pública também cresceu. As entradas reveladas passaram de 2.736 para 7.349, e 5.087 delas estão marcadas como divulgadas. A própria Anthropic mede o programa por uma taxa de verdadeiro positivo declarada, que subiu de 90,8% no lançamento, em maio, para 91,4% em 8 de setembro e 94,2% em 2 de novembro. O número é bom, e não vou fingir o contrário. Mas ele responde a outra pergunta. Diz quantos achados são reais, não quanto da fila vira trabalho útil. No mesmo intervalo, as duplicatas saíram de 2 para 1.654 e as retiradas de 245 para 419. As retiradas cresceram 174. As correções cresceram 15. Um relatório pode estar certo e ainda assim ser duplicata de outro, ou ser retirado depois de consumir a atenção de alguém. Nos dois casos, alguém gastou tempo. E nenhum dos números que a empresa publica mede esse tempo.

O caso do curl mostra o que esse custo significa na prática. Segundo a VulnCheck, o projeto recebeu 45 relatórios, e 34 estavam publicados até 10 de novembro. Dezenove foram marcados como não sendo vulnerabilidade. Seis foram confirmados, todos de severidade baixa. Nove aguardam avaliação. A VulnCheck calcula 55,9% de falso positivo na amostra e 17,6% de confirmados. Em maio, segundo o relato do próprio maintainer, Daniel Stenberg, cinco achados do Mythos no curl viraram uma única vulnerabilidade confirmada. São dados de um projeto só, e não generalizo a partir deles. Mas basta contar quem leu cada relatório para ver onde o tempo foi parar.

Há outro número que me incomoda mais. Em setembro, o próprio Claude classificou 91,5% dos achados do ledger como críticos ou altos. Os maintainers classificaram 51,3% assim. Não sei qual leitura é a certa caso a caso, e o material publicado não permite decidir. Mas uma distância tão grande entre quem gera o achado e quem precisa responder por ele não é detalhe de calibração. É a diferença entre o que o programa parece entregar e o que chega à mesa do projeto.

Em 8 de outubro, a Anthropic lançou o OSS Scanner, um serviço opt-in para projetos open source. No próprio anúncio, a empresa diz que os relatórios são "fully model-generated, without human review or triage" e que "it is possible reports will be incorrect or invalid". Ou seja: nenhum humano revisa antes de o relatório sair, e a empresa admite que pode haver erro. A mesma publicação fala em mais de 29.000 vulnerabilidades candidatas, das quais cerca de 6.000 foram revisadas e triadas manualmente. A Anthropic escreve que segue limitada pela capacidade humana de validar esses achados. São candidatos, não achados confirmados, e por definição a maior parte nunca passou por triagem.

O gargalo não desapareceu. Mudou de lado da mesa. A triagem que ficou de fora do processo da empresa foi repassada ao maintainer, que recebe o relatório, reproduz o problema, decide se ele é real e responde por isso. Para quem mantém um projeto, esse trabalho não é abstrato. Cada relatório que precisa ser reproduzido entra na fila ao lado de tarefas que já existiam. O caso do curl mede esse custo. O desenho do OSS Scanner torna o padrão previsível: se a triagem não entra no processo de quem gera, ela cai no processo de quem recebe.

Quero ser justo com o que funciona, porque funciona. Encontrar bug com IA é real. Em sete meses, a Anthropic tem 442 CVEs atribuídas, média de 63 por mês, o que equivale a 0,5% dos 93.450 CVEs publicados no ano. Esse recorte mede crédito de atribuição, não qualidade do modelo, e não diz que o risco é baixo. Diz que o funil entre achado e exploração é estreito: duas dessas CVEs, CVE-2026-61500 e CVE-2026-26980, foram exploradas em campo, 0,45% do total. Dois casos não provam que IA não acha bug grave. E nada disso diz qual fração dos candidatos ainda não triados vira falha real.

Minha conclusão é sobre o desenho do programa, não sobre a capacidade do modelo. Achar bug escala com computação: mais execuções, mais achados. Julgar se um achado é real, se é novo, se importa e se vale o tempo de um mantenedor não escala na mesma curva, porque depende de gente. Um programa que publica o total de achados, mede a taxa declarada e manda o restante para o projeto transfere o custo do julgamento para quem tem menos folga para absorvê-lo. O modelo acha. Quem decide se aquilo é verdade é o maintainer, e os números publicados não mostram esse custo.

Se eu fosse cobrar algo de um programa desses, pediria três coisas. Que a taxa de correções aceitas e o tempo de triagem do maintainer aparecessem ao lado da taxa de verdadeiro positivo, no mesmo painel. Que duplicatas e retiradas tivessem a mesma visibilidade das correções. E que houvesse uma etapa de triagem humana antes de o relatório sair da empresa, mesmo que isso deixe a fila mais lenta. Para quem recebe um relatório hoje, a pergunta prática é simples: quanto do custo de validar esse achado já foi pago por quem o gerou? Pelo que a própria Anthropic descreve do OSS Scanner, a resposta é nenhum antes de chegar ao projeto.

## 📎 Fonte Original

VulnCheck, "After 7-months, Glasswing Overwelms Maintainers with Underwhelming Findings", 10/11/2026: https://www.vulncheck.com/blog/anthropic-glasswing-november-update

Ledger público da Anthropic, consultado em 11/11/2026: https://red.anthropic.com/2026/cvd/ledger/

Anthropic, post do OSS Scanner, 08/10/2026: https://www.anthropic.com/research/launching-opt-in-vuln-finding-service-for-open-source

<div class="persona" data-audio="/audio/glasswing-sete-meses-triagem-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Nadine</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 00: os dois lados da comparação saem da mesma casa, e a hora do maintainer é a conta que ninguém publica. Não é a narração do texto.</small></p>
