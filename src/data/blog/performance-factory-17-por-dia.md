---
title: "17 investigações por dia e 70% de acerto nas causas sugeridas: a OpenAI publica a nota da própria fábrica de agentes"
description: "A Performance Factory investiga regressões do ChatGPT com agentes de código e mede o próprio erro: 70% das causas sugeridas em 100 revisadas estavam certas."
pubDatetime: 2026-11-19T18:30:00Z
author: Vinicius Costa
tags: [ia, engenharia, agentes]
---

Em 19 de novembro, a OpenAI publicou no blog de engenharia o [funcionamento da Performance Factory](https://openai.com/index/how-openai-performance-factory-keeps-chatgpt-fast), o sistema que usa Codex para encontrar e corrigir as regressões de desempenho do ChatGPT. O caminho principal é este. Um alerta de lentidão dispara, um agente abre a tarefa, procura a causa nos dados de produção, registra o que encontrou e propõe uma correção, e um engenheiro decide se faz o merge. Depois do deploy, outro agente volta à mesma tarefa para conferir se o desempenho retornou à linha de base. Se a recuperação for parcial, ele fecha a regressão original e abre tarefa nova para o que sobrou; se não houver melhora, a regressão volta para investigação.

O balanço do período está no segundo parágrafo da página: em pouco mais de três meses, o fluxo de regressão acompanhou mais de 1.700 investigações e chegou a mais de 600 causas raiz, o que a empresa resume como 17 investigações automáticas por dia.

O segundo número é o que me fez escrever sobre isso. Numa revisão manual de 100 sugestões de causa raiz, a própria equipe classificou 70% como corretas, com 30% precisando de mais trabalho ou sem estabelecer a causalidade por completo. É raro ver esse número num texto escrito pela empresa que construiu o sistema, e os dois números juntos dizem mais do que a soma: a fábrica não é um gerador de correções, é um desenho em volta da desconfiança do primeiro diagnóstico.

## O que a fábrica faz

A peça central não é o modelo, é a tarefa. Cada trabalho vira uma tarefa num fluxo cujos estados, transições permitidas e etapas que exigem gente ficam declarados num arquivo de configuração em Markdown, com prompts separados dizendo ao agente o que fazer em cada estado. Um laço de despacho verifica quais tarefas estão prontas, inicia uma sessão de Codex na nuvem com as instruções daquele estado, e o agente registra o progresso e move a tarefa adiante. Tarefas que dependem de uma pessoa ou de um deploy assinam eventos, como um comentário de revisão no pull request ou um deploy concluído, e acordam quando o evento chega. O agente roda com identidade de serviço, o que permite limitar permissões e distinguir o que veio dos agentes de performance do que veio de gente.

Antes disso, a equipe tinha acumulado mais de 30 ferramentas de performance. O que mudou não foi a capacidade de medir, foi quem executa a investigação.

## O segundo agente existe para derrubar o primeiro

A revisão adversarial nasceu de um erro observado. "Early on, agents sometimes stopped at the first plausible explanation they found, and some of those diagnoses turned out to be wrong", escrevem Okay Zed e Cyrus Forbes. O conserto foi colocar uma segunda sessão de Codex com a tarefa explícita de refutar o diagnóstico proposto. Ela refaz as premissas e testa contra-factuais: se um rollout causou a lentidão, as requisições parecidas que não passaram por ele ficaram saudáveis? Se a mudança suspeita foi revertida, a métrica voltou?

Um caso da página mostra o revisor ganhando. Um investigador rastreou conversas do ChatGPT que falhavam até erros no download de imagens e marcou a causa como encontrada. O revisor notou que o serviço interno que localiza arquivos já tinha se recuperado enquanto as requisições de imagem continuavam falhando. O diagnóstico não explicava a falha que seguia, e a investigação foi reaberta.

Corrigir se mostrou mais difícil do que achar. A página é direta: "Getting fixes right has been harder than finding the cause", com casos em que a mudança proposta pelo agente era mais complicada do que o necessário ou introduzia problema novo. Por isso a revisão adversarial também se aplica à correção. E alguns consertos exigem decisão de arquitetura, como o exemplo que a página dá: um cache pode melhorar o desempenho e trazer dado velho. Trocar latência por dado desatualizado é decisão sobre o serviço, e o desenho deixa essa decisão com quem conhece o serviço.

## Para medir, é preciso apagar a memória

A parte que menos aparece na cobertura é como a empresa avalia os próprios agentes, e é a mais interessante. O conjunto de testes são os incidentes passados. Cada um vira um caso que pode ser rodado de novo quando a skill de investigação ou o modelo muda. Cada caso começa com um investigador novo, recebendo só o sinal original, "stripped of details that might give away the answer". O agente não pode usar memórias salvas de investigações anteriores, não pode ler o relatório do incidente e não pode ver resultados de execuções anteriores. Depois da execução, o transcript é inspecionado em busca de informação que tenha estragado o teste.

O agente também não é avaliado por uma nota só. A empresa pontua separadamente quando o problema começou, qual foi o tamanho e quais requisições foram afetadas, porque "An agent can get the timing right and still blame the wrong deployment". Os resumos que chegam ao engenheiro passam por outro avaliador, que checa se alguém de fora do serviço entende o que aconteceu e por que importa, se os gráficos úteis foram mantidos e se o próximo passo proposto é sustentado pela evidência.

## O que a operação ensinou

Duas lições de operação aparecem no texto. A primeira: "Agents can investigate more regressions than a team has time to read about". A versão inicial entregava uma tela cheia de achados, e alguém ainda tinha de decidir o que importava. Hoje o fluxo liga incidentes relacionados, agrupa pelo que o time acompanha e ordena por impacto estimado. A segunda é que o agente também precisa de vigia: um agente roda todos os dias pelos logs e mensagens das execuções recentes procurando falha de ferramenta e erro de acesso, e abre tarefa para consertar o que estiver bloqueando investigações.

A minha leitura é que o dado mais honesto da página é a divisão que ela não faz. Mais de 1.700 investigações e mais de 600 causas raiz dão pouco mais de um terço do total, pela conta que eu faço aqui. A página não diz o que aconteceu com o restante: se ficaram abertas, se eram duplicatas ou se fecharam sem causa identificada. O número que a empresa escolheu publicar é o que concluiu, e a diferença entre os dois fica sem explicação.

O gargalo também está declarado. "Today, the bottleneck may be waiting for an engineer to review and merge the fix. We're already exploring whether agents can do this themselves." Ou seja, a fábrica moveu o gargalo em vez de eliminá-lo. A empresa diz estar explorando se os agentes podem fazer esse trabalho sozinhos, incluindo usar as ferramentas de revisão para identificar mudanças de baixo risco e eventualmente publicá-las sem ninguém no meio.

O que me interessa nesse texto não é a autonomia. É que a parte transferível está na avaliação, não no agente: guardar os incidentes passados como conjunto de teste, rodar o investigador sem memória e sem o gabarito, e publicar a taxa de acerto mesmo quando ela é 70%. Se o padrão pegar, o trabalho que sobra é escrever os estados do fluxo e decidir as trocas que a página deixa com o engenheiro, como latência contra dado velho. A pergunta que vale acompanhar nos próximos trimestres é se esse 70% se sustenta quando o volume crescer, e se a empresa continua publicando o número quando ele cair.

<div class="persona" data-audio="/audio/performance-factory-17-por-dia-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
    <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Caio</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 26: Caio acha que investigar é a parte barata e cobra o número que falta, o de correções que sobreviveram, antes de copiar a fábrica inteira. Não é a narração do texto.</small></p>
