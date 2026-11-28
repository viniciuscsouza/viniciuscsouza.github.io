---
title: "Uma ação por estado: o log não identifica o contrafactual"
author: Vinicius Costa
pubDatetime: 2026-11-28T10:30:00Z
slug: jepa-uma-acao-por-estado
featured: false
draft: false
tags:
  - ia
  - engenharia
  - agentes
  - pesquisa
description: 'Cada estado do log tem uma ação só, então nenhum volume de transições diz o que outra ação faria. Dois papers mostram o limite e um conserto barato.'
---

## Sumário Executivo

Dois papers publicados em novembro de 2026 tratam do mesmo limite de world models treinados com dados de comportamento. Um deles, de 18 de novembro, é assinado por Balestriero e LeCun no texto do paper — a ficha do arXiv também lista Kerda Varaku. O outro, de 20 de novembro, tem oito autores, entre eles Qifan Wang. O log registra uma ação por estado. Por isso, nenhuma quantidade de transições identifica o que teria acontecido com outra ação no mesmo estado.

Os dois chegam ao mesmo diagnóstico por caminhos diferentes. Um corrige o desfecho observado com uma conta que não pede dado contrafactual; o outro mede o contrafactual com pares de ações executadas do mesmo estado, a um custo de cerca de 0,5% dos dados. Nenhum dos dois responde com mais escala.

Um world model prevê o próximo quadro a partir do estado e da ação. Comparar duas ações no mesmo estado é outra pergunta: o que teria acontecido se o agente tivesse feito X em vez de Y. O log de comportamento guarda só a ação que a política escolheu.

## Um estado, uma ação

Cada linha do log é uma tripla (estado, ação, próximo estado). Em cada estado, a política escolheu uma ação, e a outra nunca foi executada ali. Ela não aparece em nenhum registro.

O paper B prova isso num caso local e linear: a resposta à ação não é identificada em nenhuma direção que a política nunca variou dentro de um estado. O paper A vai mais longe. Mesmo com todas as leis intervencionais conhecidas exatamente, o risco minimax para estimar um contrafactual individual fica longe de zero. Não é falta de dado, de otimização ou de capacidade. Há ainda uma ambiguidade de gauge: o ruído latente de um modelo generativo pode ser reetiquetado para cada ação sem mudar nenhuma previsão factual.

A pergunta que vale fazer sobre um dataset muda. Quantos passos eu tenho importa pouco. Importa saber se a ação variou dentro do mesmo estado. Se não variou, cada passo novo responde à mesma pergunta de novo.

## Caminho 1: corrigir o modelo já treinado

O paper A não cria dado contrafactual. Ele pega o desfecho observado e soma a ele a diferença que o modelo prevê entre a ação alternativa e a ação que de fato aconteceu. Os autores chamam isso de residual reuse. O abstract resume: nenhum dado contrafactual, parâmetro extra ou retreino. O modelo continua treinado só com transições factuais.

A correção tem uma condição. Ação e distúrbio precisam entrar como forças separadas. Os autores são explícitos: "This separate-channel structure is assumed, not derived from smoothness". Um sistema suave não basta. Um atuador desgastado é suave e, mesmo assim, interage com a ação em primeira ordem.

A correção cai junto com a condição. Contato, saturação de atuador e grampeamento introduzem interações não suaves. Coordenadas dobradas podem apagar a resposta de primeira ordem ao distúrbio. Se o distúrbio multiplica o comando, a separação deixa de valer. Em pixel cru, a intensidade muda de forma abrupta nas bordas, e o resíduo não se transporta em nenhuma duração testada.

O erro do método é O(h²) em relação à variância do distúrbio, e o limite minimax tem o mesmo formato. Esse O(h²) é taxa assintótica, não número de passos. O texto diz que "how short is short enough depends on the system". Não existe passo mágico.

Os números do paper A vêm com essa ressalva embutida. Nos quatro simuladores renderizados, o R² contrafactual vai de 38–46% para 86–96% com a correção, usando os mesmos preditores factuais. Aplicada direto nas features, sem rótulo de estado, chega a 73–94%. No BlueROV2, um veículo subaquático, a faixa é 90–94% com dezesseis vezes mais dados factuais. Na busca retrospectiva, o modelo encontra a ação que teria chegado ao objetivo em 35–69% dos eventos. Um planejador oráculo, que conhece o simulador e o estado completo, fica entre 14% e 23%.

O oráculo não erra por falta de treino. Ele não conhece o distúrbio que ocorreu.

## Caminho 2: medir o contrafactual

O paper B não corrige o desfecho depois. Os autores executam duas ações a partir do mesmo estado restaurado, e chamam isso de fork future. A diferença entre os dois desfechos cancela o termo de estado e identifica a resposta à ação no espaço amostrado.

O modelo se chama Fork-JEPA. No treino, ele alinha a diferença prevista com a diferença medida, ancora o sucessor registrado com predição de comportamento e adiciona uma cabeça de lookback que mantém o predecessor recuperável. O planejamento fica igual.

Sem forks, o problema aparece com clareza. No TwoRoom, o LeWM tem M-ID 0,91 para leitura de estado e M-ID-Δ de −0,10 para o efeito da ação. Com forks, o M-ID-Δ sobe para 0,69. O modelo lê bem o estado e não sabe o efeito da ação.

O mesmo paper traz um contraponto. O LpWM separa as zonas melhor, com 96,6% de acurácia contra 88,4%, e planeja pior. Reconhecer um regime não é prever o efeito das ações nele.

## O conserto: cerca de 0,5% dos dados

Cada par custa dois blocos de ação. Mil pares somam 0,5% a um dataset de 2 milhões de passos. O experimento usa um mundo com quatro zonas ocultas, 10.000 episódios de comportamento e 1.024 pares de fork. A avaliação usa 200 pares fixos de início e objetivo, metade dos quais atravessa zonas.

No cenário cross-zone, o LeWM vai de 35% para 38% quando recebe 60% a mais de dados de comportamento. Forks, com cerca de 0,5% de interação extra e sem gastar o orçamento original, levam o mesmo modelo a 48%. O Fork-JEPA chega a 68%.

O abstract resume isso como "1.024 fork pairs beat 1.2M extra behavior steps". O corpo mede outro recorte: 60% a mais sobre 2 milhões de passos, e não um bloco de 1,2 milhão de passos colado no resultado. O número precisa do cenário junto.

Os ganhos por tarefa também pedem cuidado. Em relação ao LeWM, o ganho de sucesso é de 14 pontos percentuais no TwoRoom (de 86±2% para 100±0%) e no Cube (de 66±4% para 80±4%). No PushT é de 2 pontos (de 92% para 94%). O abstract diz "up to 14%", e são pontos percentuais, não aumento relativo.

As duas peças também não são a mesma coisa. Só o lookback leva o TwoRoom de 86% para 100%, mas derruba o PushT de 92% para 82%. Os forks, no PushT, chegam a 94%.

## O que não está provado

Tudo aqui é simulador renderizado ou controle visual: TwoRoom, PushT, Cube, o BlueROV2 e ambientes de física. Nenhum dos dois mediu agente de software, tarefa de engenharia ou robô real. O paper A valida a correção a partir de pixels, com encoders congelados como DINOv2 e MAE, e depois com mais quatro. Isso não se transfere sozinho para outras tarefas.

Os forks exigem algo que o log não tem: voltar a um estado e executar duas ações a partir dele. Em sistema real, esse acesso pode não existir, ou pode custar caro.

## Conclusões

Quem treina ou avalia world model deveria contar, antes de comprar mais computação, quantos estados do dataset têm mais de uma ação registrada. Se a resposta for zero, mais dado não responde a pergunta de comparação. A variação pode ser gerada de duas formas: medindo pares de fork, quando o sistema pode voltar a um estado e executar duas ações; ou corrigindo o desfecho observado com a diferença prevista, desde que a separação entre ação e distúrbio seja testada antes de ser assumida.

A consequência vale para a avaliação: um benchmark montado só com transições registradas mede acerto de previsão do que aconteceu. Ele pode ficar verde enquanto o planejador escolhe com base em efeitos de ações que o modelo nunca viu variar.

## 📎 Fonte Original

[arXiv:2611.24778](https://arxiv.org/abs/2611.24778), "Counterfactual World Models: JEPAs That Reason About 'What If'", Balestriero e LeCun no PDF; a ficha do arXiv também lista Kerda Varaku, 18/11/2026.

[arXiv:2611.28350](https://arxiv.org/abs/2611.28350), "Two Actions from One State: Fork Futures Teach JEPA World Models to Compare", Yihao Wu et al., com Qifan Wang entre os oito autores, 20/11/2026.

<div class="persona" data-audio="/audio/jepa-uma-acao-por-estado-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 07: Vicente separa prever o próximo quadro de comparar duas ações no mesmo estado e defende contar a variação no log antes do treino. Não é a narração do texto.</small></p>
