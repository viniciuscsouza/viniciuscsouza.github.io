---
title: "Qwen4-Max: 62% mais barato por tarefa, 18,7 pontos atrás do Kimi no terminal"
description: "A Alibaba anunciou 62% de economia por tarefa com o Qwen4-Max. A tabela caiu 25%, e o resto vem de menos token e de cache não publicado."
pubDatetime: 2026-11-16T12:30:00Z
author: Vinicius Costa
tags: [ia, agentes, custo, benchmarks]
---

A Alibaba abriu para uso geral, nesta segunda-feira, o Qwen4-Max, com cobrança por uso. O modelo está em QwenCloud, QwenWork, Qoder e QwenStudio, e a API segue os formatos da OpenAI e da Anthropic. O anúncio traz um número no cabeçalho: no Work360, a suíte interna de avaliação da empresa, o custo médio por tarefa caiu de US$ 4,43 para US$ 1,67, uma redução de 62%. Para quem escolhe modelo para laço de agente, esse é o número que importa, e é o que menos se explica.

## A tabela caiu 25%. O resto não está publicado

A página de preços da Alibaba Cloud Model Studio, atualizada em 16/11, lista o qwen4-max a US$ 1,50 por milhão de tokens de entrada e US$ 4,50 por milhão de saída, na faixa até 1M de tokens e na região de Singapura. O qwen3.8-max custa US$ 2 e US$ 6 na mesma tabela. São 25% a menos nas duas pontas.

Preço sozinho não explica 62%. O próprio anúncio diz que, no Work360, o uso de token caiu cerca de 24% no esforço Xhigh e 35% no High. No Terminal-Bench 4.0, a queda foi de cerca de 48% e 49%. O anúncio diz ainda que houve redução particularmente grande no preço de entrada em cache, mas não publica essa tabela.

Não dá para decompor os 62% com uma conta linear. O custo por tarefa depende da mistura de entrada e saída e da taxa de acerto de cache, e nenhuma das duas está publicada. O que dá para separar é o que tem tabela: 25% de preço de lista e as quedas de token medidas na suíte da Alibaba. O pedaço do cache fica fora da conta, e o 62% depende dele.

## Onde corta token, perde no terminal

O gráfico de Terminal-Bench 4.0 põe o Qwen4-Max em 48,5. O Kimi K3.1 tem 67,2, o Opus 5.5 tem 59,6, os dois modelos GPT-6 têm 59,1 e 56,1, e o Qwen3.8-Max tem 38,9. O Qwen4-Max fica abaixo dos quatro concorrentes de outras casas, 18,7 pontos atrás do Kimi e 11,1 atrás do Opus. Só supera o próprio antecessor.

O corte mais forte de token aparece justamente nesse benchmark, com 48% a 49%. A maior economia de token está onde o modelo fica atrás de todos os concorrentes que a Alibaba escolheu comparar.

Nos outros painéis o quadro muda. No DeepSWE v1.1, ele tem 75,7, o maior valor do painel, 0,2 acima do Kimi. No Agents' Last Exam, o gráfico mostra 46,7, também o maior valor, 3,3 acima do seguinte. Onde lidera, a vantagem é pequena. No ProgramBench, tem 31,5 contra 65,0 do Opus 5.5, e só supera o Kimi (25,0) e o próprio antecessor (28,0). Onde perde, perde por muito.

## Para o laço de agente

Eficiência de token é métrica de execução. Ela diz quanto o modelo gasta para chegar a algum lugar. Não diz se chegou. Conclusão de tarefa é outra coisa, e num laço de agente ela é a que cobra. Um agente que gasta menos token e falha no terminal ainda custa, porque alguém vai reexecutar, consertar ou descartar o resultado.

Comprar token mais barato sem olhar o benchmark de terminal é comprar desconto num eixo e pagar no outro. Para quem escolhe modelo para laço de agente, a ordem de leitura muda. Primeiro vem a taxa de conclusão em tarefas de terminal da sua própria carga. Depois vem o custo por tarefa concluída. Preço por milhão de token fica por último.

## O que fica de fora

O gráfico do fornecedor não tem eixo visível nem legenda textual. A identificação das barras depende do logo. O Opus 5.5 e o Kimi batem com a leitura publicada pela ShiftDelete, mas os dois modelos GPT-6 aparecem sem distinção, e este texto não afirma qual é qual.

O custo por tarefa é medido numa suíte interna. Não há replicação independente. A Bloomberg repete a leitura da própria Alibaba, de que o modelo ficou perto do topo nos benchmarks de código. Não há medição de terceiro que confirme.

Os números de segurança também são do fornecedor. Na Last Secure Code Bench, a taxa de acerto por função, em funcionalidade e segurança ao mesmo tempo, subiu de 22,0% para 31,8%. A fatia de código gerado com segurança nos três níveis, função, arquivo e repositório, foi de 8% para 14,7%. Na própria régua da Alibaba, cerca de dois terços do código continuam falhando nas duas coisas.

O Work360 tem 26 domínios de primeiro nível, 182 subdomínios e 721 campos. O Qwen4-Max marca 52,69 nele, contra 47,74 do Qwen3.8-Max. No material que li, o anúncio não traz o escore de nenhum concorrente nesse painel.

O anúncio também traz casos de uso: uma peça de manufatura que caiu de cerca de 475 minutos para 24 minutos de programação, uma due diligence jurídica com relatório de 86 páginas, e uma corrida de 48 horas em descoberta de fármaco. São relatos do fornecedor, sem medição independente.

## Arquitetura: explica o custo por token, não o número de tokens

O anúncio fala em 2,4 trilhões de parâmetros de backbone, 71 bilhões ativos por token e mais 328 bilhões de parâmetros de N-gram Embedding. Os três componentes nomeados são GDN com QSA, Gated Residual e N-gram Embedding. Segundo a descrição do próprio anúncio, o QSA usa um indexador leve para escolher contexto relevante em micro-blocos e reduz o custo de atenção e de indexação em sequências longas.

Isso explica custo de computação por token. Não explica por que o modelo escreve menos token numa mesma tarefa. O anúncio não liga uma coisa à outra. Para saber, é preciso medir a contagem de tokens gerados em tarefas próprias.

## Fechado, e o plugin

O Max não tem pesos publicados. O anúncio diz que "smaller models in the family are coming to open source", sem tamanho e sem data. A Bloomberg registra que a Alibaba não tornou o modelo open weight.

No mesmo dia, a Alibaba publicou o Qwen-Live-Delivery-Plugin, sob Apache 2.0, criado em 14/11. O README diz que a skill `$ld:go` orienta o agente a escolher a menor versão utilizável primeiro, planejar a próxima a partir do resultado real e incluir validação e entrega em cada iteração, sem número fixo de versões. Há um servidor MCP com `ld_begin`, `ld_publish`, `ld_status` e `ld_done`, e hooks que bloqueiam o fim do turno enquanto a tarefa estiver ativa e houver orçamento. A frase que abre o README é a confissão: entregar uma tarefa demorada a um agente que avança numa caixa-preta e devolve algo difícil de aproveitar.

O plugin sai no lançamento para o Codex CLI, da OpenAI. É a parte que o anúncio enterra. Leio o plugin como uma admissão: a falha de tarefa longa não é só questão de capacidade do modelo, é também questão de como o trabalho é entregue ao usuário. E a empresa abriu esse harness para o CLI de outra empresa no lançamento.

## Conclusões

Se você escolhe modelo para laço de agente, meça a taxa de conclusão na sua carga antes de olhar o preço. O anúncio mostra com clareza o preço de tabela e a queda de token. Não mostra a fatia do cache, nem medição independente, nem o caso em que o agente gasta menos token e não termina. O Qwen4-Max é uma opção real para quem paga por token de entrada repetido, e é uma aposta no escuro para quem paga por tarefa que precisa fechar.

## 📎 Fonte Original

"Qwen4-Max: Your New Teammate Has Arrived", Qwen Team, 16/11/2026: https://qwen.ai/blog?id=qwen4-max

<div class="persona" data-audio="/audio/qwen4-max-desconto-em-token-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Bruna">
    <img src="/personas/bruna.webp" alt="Retrato de Bruna, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Bruna</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 04: Bruna propõe usar o Qwen4-Max como rascunhador barato e deixar o fechamento com quem já termina. Não é a narração do texto.</small></p>
