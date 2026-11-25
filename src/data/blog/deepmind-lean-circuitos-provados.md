---
title: "O circuito que não dava para testar passou na prova; o que se copia é a política de merge"
author: Vinicius Costa
pubDatetime: 2026-11-25T10:30:00Z
slug: deepmind-lean-circuitos-provados
featured: false
draft: false
tags:
  - ia
  - engenharia
  - verificação
  - agentes
description: "Agentes com Lean acharam circuitos quânticos mais baratos. O que dá para copiar é a política de merge: spec congelada, re-verificação e limiar mínimo."
---

Em 23 de novembro, a Google DeepMind publicou no [blog](https://deepmind.google/blog/finding-faster-quantum-algorithms-with-agents-and-formal-verification/) os resultados de equipes de agentes de IA que encontraram versões mais baratas de algoritmos quânticos. Cada resultado saiu com prova verificada no assistente Lean. O texto separa duas coisas, e eu separo também: foi provado que o circuito está correto e que o custo declarado é o que a prova calcula. O que se mede ali não é execução.

O [paper](https://arxiv.org/abs/2611.09822), "Discovering formally verified quantum programs with AI", tem 19 dias de vida pública: a v1 foi submetida em 06/11 e a versão de hoje é a v3. O blog é de 23/11. Os números mudaram entre uma versão e outra, e isso entra na leitura mais abaixo.

A biblioteca Lean está aberta em [google-deepmind/formal-quantum-computation](https://github.com/google-deepmind/formal-quantum-computation).

## Por que não dá para testar

Os circuitos em questão usam qubits lógicos, qubits protegidos por correção de erro. Os intensivos em recursos não rodam em computador clássico nem nos processadores pequenos de hoje.

O blog tira a consequência direta: "Because we cannot test resource-intensive quantum circuits on classical computers or today's small quantum processors, we have to prove that they work mathematically. Our agent teams proved each result using Lean, a formal theorem prover."

Sem teste para os circuitos caros, sobra a prova. E isso muda o que a palavra "benchmark" significa aqui. Quando o circuito é caro demais para rodar, o custo tem de ser provado, não medido.

A escala está no paper: aplicações promissoras pedem milhares de qubits lógicos e entre 10^9 e 10^15 operações lógicas. Os primeiros processadores tolerantes a falha devem entregar cerca de um milhão.

## O custo dentro da especificação

A métrica não é tempo de execução. É o volume espaço-tempo lógico, Q·T: o pico de qubits lógicos, contando os auxiliares de trabalho limpos, multiplicado pela contagem de portas T. Quem lê "11,8×" como "roda 11,8 vezes mais rápido" leu errado.

O custo entra no enunciado do problema. A figura 1 do paper diz que os pesquisadores escrevem "a Lean quantum Hoare logic specification of correctness and cost" e que a equipe itera sobre o erro devolvido pelo kernel do Lean. A régua é escrita antes da busca. O candidato só vale se a prova fecha com esse custo, não com um número que o próprio agente reportou. O paper cita o risco que isso evita: agentes podem enfraquecer enunciados, alterar definições, adicionar axiomas ou informar custo errado.

Os pesquisadores escreveram a especificação e definiram a direção. Não dirigiram a busca durante o run. O paper é explícito: "researchers put their domain knowledge, discussion, and design into the problem specification itself rather than seeding domain knowledge or steering the research while underway". O texto não diz que a IA descobriu sozinha.

## A política de merge

Esta é a parte que eu quero copiar. O apêndice C do paper descreve as regras de aceitação. São três:

1. Candidato só entra se passar re-verificação automática contra a especificação congelada. O verificador externo roda a prova num sandbox limpo, no Lean Comparator, e confere se os teoremas-alvo e todas as definições transitivas continuam iguais, se as provas dependem só dos axiomas padrão do Lean e se não há sorry nem axioma próprio.

2. Candidato só entra se melhorar o custo relativo em pelo menos 5%, valor padrão do paper ("5% by default"). O motivo declarado: os times não devem gastar esforço se adaptando a atualizações pequenas e frequentes.

3. Em problemas que já têm solução, entra também a atualização que encurta o código Lean em pelo menos 20%, desde que o custo caia estritamente. O motivo: as provas crescem a cada iteração, e arquivos grandes estouram o contexto dos agentes e demoram para compilar.

Leio isso como controle de mudança, não como medida de progresso. O limiar de 5% segura o churn. Pelo que li, o paper não traz uma comparação com merge sem limiar, então não sei quanto essa regra contribuiu para o 11,8×. Afirmo só o desenho.

## Wiki e conferência

O artefato que persiste é um repositório versionado, com um diretório por problema. Cada diretório tem três coisas: a melhor solução verificada, que qualquer run novo pode adotar como ponto de partida; arquivos Lean parciais que compilam contra a biblioteca compartilhada; e notas revisadas que classificam famílias de ideias como verified, promising ou dead-end.

Só a solução e os arquivos Lean são verificados por máquina. A nota é um resumo revisado por gente. Uma ideia promising não conta como resultado até virar prova.

Resultado negativo também fica registrado, com a obstrução concreta: um contraexemplo numérico, um lema em Lean. O paper diz o motivo, e ele é de engenharia, não de arquivo morto: "Recording negative results with concrete obstructions ... prevents later runs across all teams from repeating known dead ends."

A conferência acontece a cada quatro horas, num fórum compartilhado entre pesquisadores e frameworks de agentes diferentes. Segundo o paper, nas sessões os agentes fazem perguntas, criticam afirmações e propõem construções para os outros times testarem. O blog resume como "trade, debate and compare ideas".

Cada pesquisador escolhe framework, modelos, prompts e divisão de trabalho, de um agente só a organizações hierárquicas. Ninguém padronizou o time. Padronizou-se o contrato entre eles.

## O que foi medido, e por quem

Os números são dos autores, na colaboração entre Google DeepMind e Google Quantum AI que o blog declara no fim. Não encontrei medição de terceiro publicada.

Fusão (partícula alfa mais hidrogênio, poder de freamento): 11,8× de redução no custo espaço-tempo, com memória caindo de 5.650 para 4.338 qubits lógicos. O corpo do paper e o blog dizem 11,8×. O abstract arredonda para 12×. Uso 11,8×, que é o número do corpo.

Fotoquímica (a molécula C23H20N3O, na seção de dinâmica não-Born–Oppenheimer): 8,22× na tabela do paper. O blog arredonda para 8×.

Citocromo P450, enzima que metaboliza a maioria dos remédios: 2,5× no blog, 2,49× na tabela do paper. A memória caiu de 481 para 333 qubits lógicos, trocando consultas de memória volumosas.

Busca paralela (Grover): "up to 2.57×" na v3. Na v1, de 06/11, o mesmo tipo de resultado aparecia como "up to 1.4×".

arcsin: 290×, combinando busca clássica e busca formal. Parte do ganho vem da busca clássica, não do Lean.

O caso do Grover pede cuidado. O ganho é sempre relativo à baseline escolhida, e entre a v1 e a v3 o número subiu de 1,4× para 2,57×. Não sei dizer se mudou a baseline, o método ou a conta. Um speedup sem a baseline escrita ao lado não diz nada.

## O que o número não permite afirmar

O número não mede velocidade nem execução. Os próprios autores escrevem a limitação: "Running these algorithms in scientific simulations would still demand more computational resources than the first error-corrected quantum computers are likely to provide, but these improvements are significant."

A faixa de 10^9 a 10^15 operações começa acima do milhão projetado para os primeiros processadores, e vai bem além. Não há como ler o resultado como "fusão resolvida" ou "química resolvida". O que existe é uma redução real na contabilidade, com a conta ainda sem fechar no hardware que existe.

## O que copiar num harness

Nada disso depende de física quântica. Dá para levar o desenho para qualquer harness de agentes que escreve código:

1. Especificação congelada antes do run, com commit fixado. O agente não edita o critério de aceite.
2. Quem verifica não é quem gerou o candidato. O agente não reporta o próprio resultado como prova.
3. Limiar mínimo de ganho para aceitar atualização. Mudança pequena e frequente custa adaptação que o time paga sem ganho.
4. Wiki de dead-ends com a causa concreta. Registro sem obstrução não impede ninguém de repetir o caminho.
5. Encontro periódico entre times independentes, cuja função é criticar e propor o que os outros testam.

A ressalva que eu faria: Lean dá uma garantia que teste não dá. Um teste passa nos casos que alguém escreveu. E um agente que pode editar o próprio arquivo de especificação enfraquece o enunciado, muda a definição ou acrescenta um axioma — é exatamente esse o risco que o Lean Comparator existe para pegar. Sem prova, a especificação congelada precisa ser ainda mais cuidadosa, porque ela é a única régua que ninguém mexeu. A parte copiável é o desenho. A força da garantia não vem junto.

Antes de copiar, pergunte ao seu harness: quem escreveu a régua, quem a roda e quanto um candidato precisa melhorar para entrar.

<div class="persona" data-audio="/audio/deepmind-lean-circuitos-provados-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Sabrina">
    <img src="/personas/sabrina.webp" alt="Retrato de Sabrina, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Sabrina</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 14: O gargalo mudou de lugar: agora é escrever a régua, não treinar o corredor. Não é a narração do texto.</small></p>
