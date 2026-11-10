---
author: Vinicius Costa
pubDatetime: 2026-11-10T21:30:00Z
title: "O Gemini 4 Carbon troca a régua do preço: agora é por tarefa"
slug: gemini-4-carbon-preco-por-tarefa
description: "O Carbon custa o mesmo por token do Argon e, segundo a Google, metade por tarefa. A métrica que decide a compra agora é definida por quem vende."
tags:
  - inteligencia-artificial
  - modelos
  - google
draft: false
---

Dois modelos da mesma geração, o mesmo preço introdutório: US$ 2 por milhão de tokens de entrada e US$ 10 por milhão de saída. O Carbon, um deles, gasta mais tokens que o Argon para explorar um problema. Mesmo assim, a Google o apresenta como a opção mais barata — desde que a conta seja feita por tarefa concluída, e não por token.

Essa troca de denominador é o anúncio. O resto é consequência dela.

Durante anos, a régua de preço de um modelo foi o custo por milhão de tokens: fácil de comparar, fácil de conferir, multiplica-se pelo volume e pronto. O post de lançamento do Gemini 4 Carbon, publicado em 10 de novembro, mantém a tabela e troca a pergunta. O que a Google quer que você compare agora é quanto custa terminar uma tarefa.

Os fatos: o Carbon ficou duas semanas restrito ao Fairwind, o programa de defesa cibernética, e agora está disponível para desenvolvedores, empresas, cientistas e consumidores. O Argon continua sendo a escolha para a maioria do trabalho de software e conhecimento. O Carbon é para tarefas que testam o limite do modelo, e a própria Google diz que ele usa mais tokens para explorar, raciocinar e rodar laços de verificação.

Por que gastar mais tokens pode sair mais barato? Um modelo que erra menos precisa de menos voltas, e cada volta repete contexto. Se a saída passa por verificação antes de chegar ao usuário, o retrabalho some antes de virar custo. A lógica é simples de escrever e difícil de medir: nada disso prova a proporção, e uma tarefa com muito raciocínio pode continuar mais cara mesmo acertando mais.

Os números ajudam a entender o tamanho da aposta. No CursorBench 4.0, o Carbon fica em primeiro lugar com mais de duas vezes menos custo por tarefa que o segundo melhor modelo externo. Vale ler a frase com cuidado: o concorrente é de outro fornecedor, não é o Argon, e a conta de custo é da própria Google.

E aqui está o que importa de verdade. Não existe benchmark independente de custo por tarefa. A métrica é definida por quem vende o modelo, o que conta como tarefa concluída é decidido no teste de quem vende, e nenhum terceiro audita o denominador. Isso não é má-fé: é o estado da arte da medição. Mas muda a natureza do número. Ele deixa de ser uma medida e passa a ser uma proposta comercial.

O que a Google entrega junto é a arquitetura que essa proposta pressupõe. O `/swarm`, em preview no Google Antigravity, transforma um prompt em um time de agentes que pode ser acompanhado em tempo real. O Carbon fica nos papéis de raciocínio profundo — arquitetura, coordenação, auditoria —, pareado com modelos mais rápidos em espaços isolados e verificadores adversariais que testam cada mudança.

Nesse desenho, o modelo deixa de ser a unidade de decisão. A unidade passa a ser o time. Escolher modelo vira decidir quem faz qual papel, e um modelo caro pode sair mais barato no conjunto se ocupar só a parte em que o raciocínio pesa. É também por isso que o custo por token perde poder de explicação: o que se paga não é uma chamada, é uma sequência de chamadas coordenadas até um resultado aceitável.

Para quem escolhe modelo no dia a dia, a pergunta muda de forma. Não é mais "qual é o melhor", que cabe numa tabela de benchmark. É "qual termina esta tarefa pelo menor custo total", que exige três coisas do seu lado: a taxa de acerto no seu tipo de tarefa, o número de tentativas até um resultado aceitável e o preço da verificação. Sem as três, qualquer comparação entre modelos é chute com planilha.

E é aí que a régua nova cobra o preço dela. Se o denominador é "tarefa concluída", e quem mede é o fornecedor, então o critério de aceite precisa ser definido por você **antes** de contar token. Não depois, olhando o relatório de consumo. Um teste em que a tarefa é dada por concluída quando o modelo para de tentar mede paciência, não competência.

A conta que vale é a sua, e ela começa pelo critério, não pelo preço. Escolha um conjunto de tarefas reais do seu fluxo, escreva o que conta como aceitável, rode com os dois modelos e conte quantas tentativas cada um levou até passar nesse critério. O total de tokens vem depois. Se o critério for o mesmo para os dois, a comparação vale. Se não for, o número que sobra é o do anúncio — e esse serve para vender, não para decidir.

<div class="persona" data-audio="/audio/gemini-4-carbon-preco-por-tarefa-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Bruna">
    <img src="/personas/bruna.webp" alt="Retrato de Bruna, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Bruna</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 1 min 46: Empolgada mas concreta: o custo por tarefa vira negociação comercial e o /swarm é o produto. Não é a narração do texto.</small></p>
