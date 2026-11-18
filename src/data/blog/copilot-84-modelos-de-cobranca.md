---
title: "Os 84% de economia do Copilot comparam modelos de cobrança, não modelos de IA"
description: "O estudo que sustenta os 84% foi pago e rodado pela Microsoft, e a maior parte da diferença está no que a assinatura já inclui, não no modelo."
pubDatetime: 2026-11-18T11:00:00Z
author: Vinicius Costa
tags: [ia, agentes, custo]
---

Satya Nadella abriu o Ignite 2026 nesta terça chamando o Copilot de "o novo sistema operacional do trabalho". O anúncio que sustenta o slogan: Word, Excel e PowerPoint passaram a rodar dentro do Copilot em disponibilidade geral, e cada arquivo herda as permissões, os rótulos de sensibilidade e os controles de conformidade do Microsoft 365 desde o começo. A inversão é o ponto. O aplicativo deixa de ser o lugar onde o trabalho acontece e vira peça do agente, que passa a ser o lugar de onde se começa. O Chat e o Cowork se juntaram num Home, e o Code entra em disponibilidade geral "nas próximas semanas".

Na véspera, a Microsoft publicou o número que dá sentido de negócio à ideia: para um usuário comum, o Copilot é 84% mais barato que o Claude e 63% mais barato que o ChatGPT. Para um usuário avançado, 68% e 35%. O número circulou como se medisse inteligência por dinheiro. O documento que o produz diz outra coisa, e diz com todas as letras.

## O que o estudo é

O relatório se chama "Demystifying the TCO of Enterprise AI" e a primeira informação relevante está na metodologia: "Microsoft commissioned and funded research with GigaOm". Um pouco depois, "Microsoft ran the testing and cost analysis. GigaOm contributed to the research design, validated the methodology, results, and cost analysis, and co-developed the findings". Não é deslize de redação: é um estudo de fornecedor, com metodologia e resultados validados por um terceiro, declarado como tal. A diferença entre ler isso e ler o post de anúncio é a diferença entre saber o que o número mede e achar que ele mede o produto.

O desenho: 37 prompts, outubro de 2026, a mesma empresa fictícia e a mesma base de dados para Copilot, ChatGPT Enterprise e Claude Enterprise. Ao longo de um mês modelado, isso vira 100 tarefas para o usuário comum e 140 para o avançado, incluindo 20 fluxos agênticos. Os prompts foram repetidos para absorver a variação das respostas. As estimativas usam preço de lista de outubro de 2026 "ou um preço assumido onde o preço de lista não é publicado", e excluem descontos negociados.

A qualidade foi medida com uma lista de verificação escrita por avaliadores humanos antes do teste — fontes certas, pessoas certas, números certos, entrega completa, nenhuma ação que o usuário não pediu. Uma execução só passava se cumprisse todos os itens, e trabalho parcialmente correto falhava. O resultado declarado: os três produtos entregaram qualidade "amplamente comparável", com variação por tarefa.

A tabela: US$ 30 por mês no Copilot contra US$ 205 no Claude e US$ 81 no ChatGPT, para o usuário comum. US$ 96 contra US$ 299 e US$ 149, para o avançado.

## De onde vem a diferença

O próprio estudo aponta o fator principal, e ele não é o modelo: "The biggest cost difference came from everyday work. Chat and Microsoft 365 app usage is included in the Copilot user subscription". O custo estimado das tarefas cotidianas fica dentro da assinatura; nos concorrentes, o uso é somado por cima. O texto descreve o efeito sem rodeio: quando toda tarefa tem um medidor, cada prompt entra na conta, e uma implantação que dá certo — gente usando mais, todo dia — vira problema de orçamento. As empresas, diz o estudo, podem responder racionando acesso: só alguns recebem a ferramenta. A comparação embute, portanto, uma escolha comercial do fornecedor, não uma eficiência de engenharia.

O segundo fator é o caminho até o contexto. O Microsoft 365 guarda mais de 19,5 exabytes, com 90 bilhões de e-mails, 15 bilhões de mensagens no Teams e 10 bilhões de arquivos novos por semana. No Copilot, esse conjunto é organizado pelo Work IQ, que Nadella chamou no palco de "o banco de dados mais importante de qualquer organização"; o estudo descreve o ponto de partida como "the semantic index, which organizes Microsoft 365 content into a map of what's there". No teste, "Claude and ChatGPT accessed Microsoft 365 data through connectors and add-ins". E o estudo registra o que isso pode custar: reunir o contexto certo pode exigir vários passos — achar a apresentação, conferir a versão, ler os comentários, localizar o e-mail da reunião —, e esses passos "podem aumentar a quantidade de informação que o modelo precisa processar", com reflexo potencial na fatura.

Essa é a parte do documento que mais interessa a quem compra, e a leitura é minha, não do estudo: se parte da diferença vem de quantos passos cada produto precisa dar até o dado, então essa parte depende da empresa, não do modelo.

O terceiro fator é o roteamento. O Auto é desenhado para escolher modelo e esforço por tarefa, em vez de mandar tudo para o mais caro — o relatório descreve o que ele "might use" num exemplo: Opus para liderar o trabalho, um GPT-5.5 em esforço médio para reunir notas, o Opus em esforço alto só na pesquisa que exige raciocínio e um modelo de imagem para os visuais.

Nenhum dos três fatores é "o modelo responde melhor"; o estudo diz que a qualidade foi comparável. O que os 84% medem é o preço de uma assinatura com uso incluído contra duas assinaturas com medidor, mais quantas viagens até o dado cada produto precisa fazer. É uma medida real, e é de custo total de propriedade — como o próprio título do relatório admite. Só não é a medida que o anúncio sugere.

## A conta que não foi publicada

O Ignite mostra onde essa arquitetura de cobrança vai dar. O Office dentro do Copilot entra "sem girar medidor": criar uma apresentação ou uma planilha está incluído na licença. Já o Autopilot — o agente que trabalha sozinho, com identidade própria no tenant, memória e ferramentas, que se orienta pelos últimos 30 dias de e-mail, reuniões, chats e arquivos a que o usuário já tem acesso e pode ser mencionado num canal como um colega — é cobrado por uso, em Copilot Credits. A FAQ do produto é explícita: "Final pricing and packaging will be shared before general availability". E ele começou a ser distribuído para clientes do programa Frontier.

Ou seja: o componente que muda a natureza do trabalho é o único cuja tarifa não existe em lugar nenhum, e ele já está em distribuição restrita. É a mesma assimetria do estudo — o que dá para planejar é a assinatura, o que decide a diferença é o medidor —, só que agora o medidor não tem tabela.

Do outro lado, a unidade de valor também mudou. O Agent 365 Business Analytics, que entrou em Frontier Public, mede o investimento "em trabalho concluído, não simplesmente em tokens": analisa as tarefas, quanto tempo aquilo normalmente leva para uma pessoa e a fatia que o Cowork fez, para estimar as horas que a inteligência sustenta e quanto o trabalho vale. Para quem assina o cheque, horas dizem mais que tokens. Mas é uma estimativa do fornecedor sobre o trabalho do cliente, com uma tabela de duração que o fornecedor escolhe, contra um custo que também é do fornecedor. Nas duas pontas da conta, quem mede é quem vende.

## O que sobra para quem compra

O próprio relatório pede que os resultados sejam lidos como direcionais: refletem as tarefas escolhidas, a frequência com que são feitas, as configurações dos produtos e os preços usados. O que sobra do número, então, não é uma promessa de economia — é uma condição: o dado estar dentro do Microsoft 365. Quando está, o custo estimado das tarefas cotidianas fica dentro da assinatura, e a comparação faz sentido. Quando está fora, o que se compra na prática é o índice e a integração, e o preço da ferramenta que a equipe já usa deixa de ser o termo de comparação.

O critério que eu usaria antes de assinar é uma contagem, não um preço: quantos passos o dado da sua equipe precisa para chegar até a tarefa. Um, se ele já estiver no Microsoft 365. Vários, se estiver fora — e o estudo registra que, dependendo de como a recuperação funciona, esses passos podem aumentar o tempo e o volume de informação processada, com potencial de custo. O número que decide a conta é esse, e ele não está no slide.

<div class="persona" data-audio="/audio/copilot-84-modelos-de-cobranca-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Helena">
    <img src="/personas/helena.webp" alt="Retrato de Helena, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Helena</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 04: lê os 84% como vitória da estrutura de cobrança, separa onde mora o dado da empresa e pede a tabela do crédito do Autopilot por escrito antes de pilotar. Não é a narração do texto.</small></p>
