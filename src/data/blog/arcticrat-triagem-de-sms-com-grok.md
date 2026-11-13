---
author: Vinicius Costa
pubDatetime: 2026-11-13T14:30:00Z
title: 'O RAT "com IA" tem 129 comandos, e a IA é um deles'
description: "O ArcticRAT usa a API da xAI para separar código de uso único em SMS roubados. A IA é um dos 129 comandos; o custo de triagem saiu do atacante."
tags: ["IA", "Segurança", "Malware", "Verificação"]
---

Em 12 de novembro de 2026, a Zimperium publicou o relatório do ArcticRAT, um trojan Android que começou como spyware contra usuários de 11 apps de cripto e virou um RAT completo. Nas amostras analisadas por volta de julho de 2026 apareceu uma chamada a um modelo de linguagem. Foi isso que rendeu o rótulo "AI-powered" ao relatório e às coberturas, que começaram no dia seguinte, com GBHackers e Cyber Security News.

O rótulo sugere um agente rodando dentro do telefone. O que o relatório descreve é mais simples, e por isso mais fácil de deixar passar.

## Como chega

O malware entra por três caminhos: malvertising, smishing e fóruns de terceiros. A isca é uma landing page que imita o Google Play. O dropper pede privilégio de VPN para criar uma null-route, que anula a rota e cega a telemetria do Play Protect. Depois instala o payload secundário pelo session installer e derruba a VPN. O payload também pode ser servido a partir de buckets da AWS.

## O mecanismo da parte de IA

O comando `<xAI_API>` é disparado pelo servidor de comando e controle, e o que ele faz é entregar uma chave de API da xAI ao aparelho infectado. A partir daí o telefone envia a lista de apps instalados e os SMS roubados para o modelo `grok-4.20-0309-non-reasoning`, em uma requisição para `https://api.x.ai/v1/chat/completions`.

Dois prompts fixos fazem o trabalho. O primeiro analisa os apps instalados e filtra os de banco, cripto e plataformas de trading. O segundo lê os SMS, descarta o ruído promocional e isola código de uso único, aviso de alteração de saldo e aviso de transferência. Ele ainda pede ao modelo uma projeção da situação financeira da vítima a partir de padrões do texto, e manda a análise em JSON.

A resposta fica guardada em `/storage/emulated/0/config/AI_DATA/`. Quando o operador envia `<Get_AI_ANA_Data>`, o malware recupera esses arquivos e os leva para o C2. O modelo classifica texto e devolve JSON. Ele não executa comando, não navega no aparelho e não escala privilégio. Quem copia, envia e decide o que fazer com cada arquivo continua sendo o código do RAT.

## 129 comandos, e um deles chama o modelo

O relatório cataloga 129 comandos distintos, espalhados por versões que vão da v6.3 à v6.5.2. Ele conta 78 amostras únicas, sendo 42 droppers e 36 payloads, e 21 endereços de C2 no resumo executivo. A seção técnica fala em 17 endereços, e a diferença fica sem explicação no texto. Desses comandos, um dispara a chamada ao modelo. O outro, `<Get_AI_ANA_Data>`, só busca no cartão o arquivo que a chamada deixou. O resto é engenharia de RAT.

Basta olhar a lista. HVNC pela porta 8888. Cast de tela pela 5055. Microfone pela 5000. Redesenho de tela pela 5058, com o intervalo fixado em 661 ms pelo comando `<layout_spped:661>` (com o erro de digitação original, como o relatório faz questão de manter). Tela preta. ADB sem fio, com varredura mDNS de `_adb-tls-pairing._tcp` e handshake com o código de seis dígitos. Um keylogger que grava um JSON por dia em `/storage/emulated/0/config/System/`. Uma tela de bloqueio falsa que captura padrão, PIN ou senha. Antes de tudo isso, um DEVINFO que pede bateria, estado da tela, Wi-Fi e o wallpaper, só para confirmar que do outro lado há um aparelho de verdade.

O catálogo completo está no repositório de IOCs da Zimperium, em https://github.com/Zimperium/IOC/tree/master/2026-11-ArticRAT, no arquivo `Commands.md`.

## O que a IA substitui

Li o relatório pensando em quem faz esse trabalho sem máquina. O malware já colhia telemetria, SMS incluídos. O que faltava era alguém sentado diante dos dados, separando código de banco de promoção de loja. O próprio relatório diz isso: os operadores recorreram à IA para contornar o gargalo operacional de peneirar à mão grandes volumes de dados exfiltrados.

A capacidade de roubar não mudou. Mudou quem faz a triagem, e isso tem uma consequência que o relatório deixa ver sem dizer: a triagem passou a acontecer no aparelho, antes da exfiltração. O C2 não recebe mais o saco de correspondência, recebe a lista do que havia dentro dele. O operador não precisa estar na frente do painel quando o SMS cai, e o cano que sai do telefone carrega menos texto cru do que carregava.

## Por que a defesa muda

Do lado de fora, a chamada é uma requisição válida para o endpoint público da xAI, feita pelo próprio aparelho infectado, com uma chave válida. O que está errado não é a forma da conexão, é o conteúdo do corpo: a lista de apps de alguém e os SMS dessa pessoa. Nenhuma regra que olhe a conexão vai separar isso de uma integração legítima.

Sobram três frentes. A primeira é o vetting de apps que embutem chave de LLM. A segunda é o escopo e a rotação dessa chave. A terceira é a detecção de abuso do lado do provedor, e aí está o problema: o provedor só vê o tráfego que chega até ele. Uma chave usada por um atacante, a partir de um aparelho infectado, chega como uma chave válida fazendo chamadas válidas.

## O que o relatório não diz

Nada no relatório indica que a xAI foi comprometida ou que o modelo falhou. A chave é do atacante, e a chamada é a API pública funcionando como foi desenhada.

Não há número de vítimas, de dispositivos infectados, de contas comprometidas, de chaves usadas ou de dinheiro roubado. Não há taxa de acerto da IA nem taxa de detecção do produto da Zimperium. A campanha continua em desenvolvimento, então as 78 amostras e os endereços de C2 descrevem um momento, e não o tamanho da operação.

O módulo de "ransomware" não criptografa nada. Os comandos `<Attack_run>` e `<Attack_costom>` mostram uma barra de progresso infinita, e os endereços de cripto são placeholder. O próprio relatório diz que o padrão repete o que a Zimperium já tinha descrito no RatHat.

Uma linha sobre a fonte: a Zimperium vende produtos de segurança que detectam esse tipo de malware. Isso não invalida a análise, mas ela deve ser lida com essa informação ao lado.

## O que muda para quem constrói

Se você põe uma chave de LLM dentro de um app ou de um fluxo automatizado, essa chave é credencial de C2 em potencial.

O caso mostra onde ela viaja: o C2 do ArcticRAT manda a chave para o aparelho, e ela fica lá, no telefone de outra pessoa, até alguém trocá-la. Rotação em data marcada é o que dá prazo a esse vazamento. Escopo mínimo é o que limita o estrago enquanto a chave vale, porque a chamada do atacante é indistinguível de uma chamada sua. E a fatura costuma ser o primeiro sinal fora do aparelho: o relatório não registra nenhuma detecção desse uso, então o gasto anômalo é o que sobra para alguém notar.

Antes da próxima integração, procure a chave no código, no APK e nos fluxos que rodam sozinhos. Se ela estiver lá, trate como credencial que já pode ter saído.

<div class="persona" data-audio="/audio/arcticrat-triagem-de-sms-com-grok-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Vicente">
    <img src="/personas/vicente.webp" alt="Retrato de Vicente, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Vicente</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 06: Vicente separa segurança de modelo de segurança de conta: o modelo obedeceu, a chave é que estava exposta. Não é a narração do texto.</small></p>
