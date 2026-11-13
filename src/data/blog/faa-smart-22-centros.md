---
author: Vinicius Costa
pubDatetime: 2026-11-13T10:00:00Z
title: "SMART: 180 voos de evidência para um sistema de US$ 875 milhões no céu inteiro"
description: "A FAA passou a usar o SMART, sua IA de fluxo aéreo, nos 22 centros do país. A base de evidência são 180 voos, e a taxa de aceitação não foi publicada."
tags: ["IA", "Infraestrutura Crítica", "Verificação", "Política de Tecnologia"]
---

Em 10 de novembro de 2026, a FAA anunciou que o SMART passa a operar no espaço aéreo dos 22 centros de controle dos Estados Unidos. Até então ele funcionava só na região da capital, Washington, onde entrou em uso em 21 de setembro. O SMART é um sistema em nuvem que junta 200 fluxos de dados, entre eles padrões de clima, rotas de voo, fluxo de tráfego e métricas de escala de controladores, e usa IA para prever fluxo e conflito antes que aconteçam.

Ele mexe na programação de voos de um sistema que atende mais de 44 mil voos por dia. Vale olhar com cuidado o que ele faz e, principalmente, o que ninguém publicou sobre ele.

## Quem decide

O SMART recomenda. Quem decide são pessoas, e a cadeia tem três etapas humanas.

Especialistas da FAA no centro do SMART, em Washington, analisam e validam os dados e enviam recomendações de programação ao Command Center, em Warrenton, na Virgínia. O Command Center encaminha essas recomendações às instalações de controle de tráfego aéreo. Lá, a chefia local considera a sugestão e pode aceitar ou recusar.

Nada disso toca o controle do avião. No comunicado de 21 de setembro, a FAA escreveu que o SMART não pode substituir o papel dos controladores nem assumir o controle de uma aeronave, e que todas as recomendações passam por revisão da equipe da FAA. A pergunta certa, então, não é se o sistema controla o avião. É quantas recomendações chegam à chefia local e saem como decisão.

## O número, e o que ele não é

A FAA publicou os resultados desde o início da operação: 180 voos redirecionados, 10 minutos economizados por voo em média e quase 80 galões de combustível economizados por voo em média.

Vale fazer a conta. Entre 21 de setembro e 10 de novembro, contando o primeiro e o último dia, são 51 dias. Isso dá cerca de 3,5 voos redirecionados por dia. A FAA diz que atende mais de 44 mil voos por dia. Três e meio contra 44 mil dá 0,008% do tráfego diário.

Pelos valores médios publicados, os 180 voos somariam 1.800 minutos, ou 30 horas, de economia. Em combustível, a conta dá até 14.400 galões, porque o número oficial é "quase 80" por voo, não exatamente 80.

E os 180 voos são, por definição do próprio comunicado, voos que o sistema ajudou a redirecionar. É a única população que a FAA contou. O que a agência não diz é de quantas recomendações esse número saiu: se foram 200, a adesão é quase total; se foram 2.000, o sistema é um conselho que quase sempre é ignorado. As duas leituras cabem no mesmo 180.

## O denominador que falta

Quantas recomendações foram feitas, quantas foram aceitas, quantas foram recusadas e por qual motivo: nada disso aparece nos documentos que a FAA publicou sobre o sistema, nem no comunicado de setembro, nem no de novembro, nem no one-pager.

Sem esse denominador, não dá para saber se o SMART acerta. Também não dá para saber se as chefias locais ignoram o sistema, ou se a maior parte das sugestões nunca chega a virar decisão. Os dois cenários produzem o mesmo número de 180 voos.

Foi exatamente isso que 23 deputados do comitê de Transporte e Infraestrutura da Câmara pediram ao GAO, o órgão de auditoria do Congresso, em carta de 13 de outubro. Entre eles estão Rick Larsen e André Carson. Os signatários pedem auditoria da análise de risco, dos planos de teste e certificação, da estratégia de implantação e das métricas de desempenho do SMART e do FMDS, o outro sistema do pacote. O pedido é literal: "any quantifiable performance metrics", qualquer métrica quantificável de desempenho.

A carta também aponta que a força de trabalho da segurança aérea teve pouca ou nenhuma participação no desenvolvimento do SMART. O sindicato dos controladores, a NATCA, disse ao Flying Magazine que não participou do desenho, dos testes nem da implantação do sistema, e por isso não pode falar sobre o efeito dele no trabalho dos controladores.

## O arranjo

O contrato dura 12 anos e vale US$ 875 milhões, segundo a Nextgov, que cobriu o caso em junho. A Politico fala em até US$ 875,9 milhões. Doze empresas concorreram, conforme dados do SAM.gov. A fornecedora é a Air Space Intelligence, de Boston, e o pacote tem dois sistemas: o SMART e o FMDS, que a agência descreve como a nova espinha dorsal tecnológica de um Command Center modernizado.

Em 15 de outubro, a Politico revelou um documento interno. Ele mostra um term sheet, uma proposta de termos, para que a FAA tenha participação acionária na própria fornecedora. A negociação de um warrant, um direito de compra de ações, está em curso, e o term sheet vence no fim do ano. A FAA não comprou participação na ASI. Ela está negociando.

Isso é juízo meu, não fato apurado: um regulador que negocia participação no fornecedor da ferramenta que ele mesmo avalia tem menos constrangimento externo para publicar um número que possa atrapalhar o negócio. Não há prova de que o dado exista e tenha sido escondido. O que existe é uma estrutura em que publicar o denominador não é obrigatório, um contrato de 12 anos e nenhuma métrica de aceitação na vitrine.

## O que fica de fora

A FAA tem uma meta, escrita no one-pager: "zero delays at the start of the day", zero atrasos no começo do dia. É meta, não resultado. Não há taxa de acerto publicada, nem redução percentual de atraso, nem taxa de aceitação. E a amostra disponível é a dos voos que a agência contou como ajudados.

## O que isso custa a quem constrói

Quem põe recomendação de modelo dentro de um processo com decisão humana reconhece o desenho: três portões entre a saída do modelo e o mundo, cada um com poder de recusar. O SMART tem os especialistas em Washington, o Command Center e a chefia local. Nesse arranjo, o painel que mostra resultado sempre acaba mostrando o que passou pelo portão, porque é o que virou ação. A recusa não produz evento, não gera economia de combustível e não entra em relatório de sucesso.

Por isso o contador que interessa é o de recusas, com motivo, e ele precisa existir antes do lançamento. Se o sistema que decide recomendar registra a sugestão, o aceite e a recusa, a taxa de adesão aparece sozinha e a discussão vira técnica: onde o modelo erra e onde a chefia local sabe mais. Sem isso, o que sobra é a média dos casos bons, que é boa por construção.

O SMART pode estar fazendo um bom trabalho. Hoje ninguém consegue dizer. A expansão para os 22 centros aconteceu com 180 voos de resultado publicado e sem uma métrica de adesão, e é essa lacuna que o GAO teria de preencher para que a próxima etapa da implantação fosse julgada por dado, não por meta. Se o denominador não aparecer antes do fim do warrant, o que se saberá sobre o SMART em 2027 será a mesma coisa que se sabe hoje: quanto ele economiza quando acerta.

<div class="persona" data-audio="/audio/faa-smart-22-centros-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Nadine">
    <img src="/personas/nadine.webp" alt="Retrato de Nadine, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Nadine</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 41: O que a FAA não publicou sobre o SMART: quantas recomendações viraram decisão. Não é a narração do texto.</small></p>
