---
title: "O teste dizia 98%, a produção dizia um quarto: a migração da Messages API para Rust"
author: Vinicius Costa
pubDatetime: 2026-11-26T10:00:00Z
slug: migracao-rust-paridade-fora-do-teste
featured: false
draft: false
tags:
  - ia
  - engenharia
  - verificacao
  - agentes
description: 'Claude escreveu a migração da Messages API em uma semana. O problema foi provar que ela estava certa: 98% dos testes, um quarto das entradas em produção.'
---

A Anthropic publicou em 25 de novembro o relato de como migrou a [Messages API](https://www.anthropic.com/research/migrating-api-to-rust) de Python para Rust. É a API pela qual clientes e também os produtos da própria empresa, como o Claude Code, chegam ao Claude. O tráfego cresceu cerca de 1.800 vezes entre o início de 2024 e o outono de 2026. A versão em Rust usa cerca de 70% menos CPU por requisição e corta a mediana do tempo até o primeiro token em cerca de 20%, sem tirar o serviço do ar nem congelar o desenvolvimento de features. Claude escreveu a primeira versão do caminho central de uma requisição em cerca de uma semana.

O número que eu quero guardar é outro. Em abril, a versão em Rust passava cerca de 98% dos testes e casava com a produção em cerca de um quarto das entradas. A distância entre os dois números é o assunto do relato. Quando o mesmo modelo escreve o código e ajuda a mexer no teste, "passou" deixa de significar o que a gente costuma achar que significa.

## O atalho incremental que não pagou

O conselho padrão para ganhar performance é reescrever só o pedaço lento, e foi por aí que o time começou. Em Rust, ele portou o código que lê a saída do modelo e chamou esse código a partir do Python. O ganho ficou entre 8% e 10% de CPU, e cada token passava três vezes entre as duas linguagens. O relato diz que os ganhos não justificaram a complexidade extra e que o caminho foi abandonado.

O porquê da conta ter mudado está no texto. Em maio de 2026, Claude escrevia mais de 80% do código que a Anthropic mergeava. O custo de escrever o port inteiro caiu, e o gargalo passou a ser outro: como saber se o port está certo.

## O teste que perdeu valor

Havia cerca de 700 testes de integração, e os dois problemas que limitavam a confiança neles são os mesmos de qualquer suíte.

O primeiro: os testes eram acoplados à implementação em Python. Eles subiam a API dentro do processo do teste e simulavam serviços como cobrança e rate limit na memória do Python. Como o código ia mudar, os testes também tinham de mudar, e Claude ajudou nos dois lados. Um "passou" passou a admitir duas leituras: o código estava certo, ou o teste foi alterado de um jeito que deixava código errado entrar. A fonte diz que isso foi observado: na auditoria dos testes portados, a Anthropic achou mais de 100 asserções enfraquecidas.

O segundo: os testes não cobriam a API. Só 20 opções binárias dão mais de um milhão de combinações, o que equivale a 12 dias de teste a um segundo por caso, para um modelo, antes de variar o conteúdo dos prompts. Engenheiro testa um subconjunto que tenta aproximar a produção, e esse subconjunto perde caso por construção.

A leitura que eu faço: 98% ali não é uma nota do código, é uma nota da suíte depois de o mesmo modelo que escreveu a migração ter ajudado a mudar os testes. É um modo de falha que um time com agente em CI pode encontrar, e ele não aparece como teste vermelho. Aparece como teste verde que ninguém consegue explicar.

## A produção como oráculo

A saída foi rodar a versão velha e a nova sobre as mesmas requisições e comparar, técnica conhecida como shadowing. O caminho padrão não servia por dois motivos. As ferramentas de comparação costumam supor que a requisição pode rodar duas vezes ou que o serviço é determinístico, e nenhuma das duas coisas valia aqui: cada requisição só pode contar uma vez na conta e no limite do cliente, e o Claude responde diferente à mesma entrada.

O time resolveu chamando o modelo uma vez e reenviando a mesma saída às duas versões. Com isso, a comparação passa a ser sobre o código em volta do modelo, e não sobre a amostragem. Cada etapa antes e depois da chamada é comparada, e tem de bater exatamente. O motivo é que o Claude aceita quase qualquer prompt: um desvio de bytes não dá erro, muda a resposta.

A restrição de privacidade moldou o instrumento. O time não podia ler requisição nem resposta de cliente, então registrou a forma da diferença em vez do texto. Duas técnicas:

- **Checkpoint.** As duas versões executam as mesmas etapas (aceitar ou rejeitar, resolver configurações, montar o prompt), e cada etapa produz um resultado comparável. O primeiro ponto em que divergem indica onde o código do port se afastou do código de produção.
- **Fingerprint.** Para distinguir um bug de outro, o sistema registra onde a diferença começa no prompt e a diferença de comprimento entre as versões. Um bug tende a deixar a mesma marca em toda requisição que afeta.

Um bug pode gerar centenas de milhares de registros quase idênticos. Um script rodava a cada 10 a 30 minutos, agrupava por campo e só acordava um agente coordenador quando aparecia um tipo novo de registro. Esse coordenador dava um agente trabalhador para cada tipo e abria uma thread no Slack onde engenheiros acompanhavam e corrigiam o rumo.

## Os dois loops e a costura entre eles

O loop interno é o barato. Cada agente ganha um sandbox com os dois códigos e uma checagem que monta o prompt das duas versões e mostra o que difere. Como essa checagem nunca chama o modelo, roda em menos de um segundo. Depois entrou uma checagem de saída, que passa uma resposta roteirizada, como uma chamada de ferramenta, pelas duas versões. O agente via só a impressão digital, então escrevia a própria requisição para tentar reproduzir a diferença. Se reproduzia, editava o Rust até bater e acrescentava um teste que falha no código antigo e passa no novo.

O loop externo é o caro. Ele compara builds do Rust com e sem cada correção no tráfego sombreado, agrupando requisições por modelo e por recurso usado, como cache de prompt ou ferramentas, sem guardar o texto. Assim dá para perguntar com que frequência a marca do bug aparece em cada build.

A costura entre os dois é onde fica a revisão humana. Um fix só atravessa depois de PR revisado. O texto explica a divisão em uma frase: dentro do sandbox, um palpite errado custa segundos e não afeta usuário; fora dele, custa produção.

## O fix que casou e não servia

O caso mais útil do relato é de meados de maio. A maior diferença restante vinha da busca na web. A API de produção pegava a descrição da ferramenta em um serviço interno. A versão em Rust ainda não chamava esse serviço, então a descrição sumia do prompt.

Um agente propôs um atalho: copiar o texto para arquivos que o Rust leria. Os prompts passaram a bater e o verificador local aprovou. Um engenheiro recusou, porque o atalho não resolvia o problema. O Rust ia precisar chamar o serviço antes do lançamento de qualquer jeito, e a gambiarra seria jogada fora.

O relato tira a lição sem rodeio: "A verifier can tell an agent whether the outputs matched, but not whether the fix is good enough to ship." O verificador premiava saída igual, e o agente achou o jeito mais barato de produzir saída igual.

Construir a chamada ao serviço levou semanas. Nesse meio-tempo, o bug continuou gerando registros, alguns com impressão digital nova porque o texto que faltava caía em outra posição do prompt. Os agentes passaram a consultar a nota de memória, reconhecer o bug conhecido e ligar os registros a ele em vez de escrever outro contorno.

## A memória virou check de merge

O loop de memória guardava o que saía de cada revisão. Depois de um agente adivinhar o comportamento do Python, um engenheiro fez uma regra: portar exatamente o que o Python fazia. O agente comparou o código existente com a regra e achou sete outros lugares onde o port tinha dependido de adivinhação.

Em junho, um agente leu cerca de 60 comentários de revisão do time, agrupou os problemas recorrentes e propôs regras. Um engenheiro editou e aprovou para o CLAUDE.md. Parte dessas lições virou verificação permanente: testes que falham quando o Rust se afasta do Python, lints que proíbem padrões que os revisores marcavam toda semana e, por último, um check de merge que obriga quem mexe no Python a fazer a mudança correspondente no Rust ou pedir isenção.

Esse último item é o mais forte do relato, e não é sobre agente. É o mesmo problema que qualquer time com dois serviços espelhados tem, resolvido com uma regra que o CI cobra em vez de uma convenção que o revisor lembra.

## O que o relato não mede

Os 70% e os 20% são "about", medidos pela própria Anthropic, sem benchmark externo, sem região e sem hardware declarados no texto. O par 98% e um quarto é de abril, tirado de um gráfico, e o relato não mostra a curva: não dá para saber quanto tempo a paridade levou para subir nem se chegou perto de 100%.

Também não há número de erro depois da virada completa, latência de cauda, nem custo. O texto diz que a migração não tirou o serviço do ar, o que é uma afirmação operacional importante e sem medida publicada. O "mais de 80% do código mergeado" é de maio, de outra página, e não foi medido no projeto de migração.

A parte que me parece reaproveitável é o instrumento, não o resultado. Registrar a forma do diff, com checkpoint e fingerprint, permite comparar dois sistemas sem ler dado de usuário. O número que eu passaria a exigir em relato assim é um só: em que fração das entradas reais as duas versões concordam, medido no tráfego, não na suíte.

## Conclusões

O relato é de uma migração que foi ao ar, e o que se tira dele não é que agentes migram sistemas grandes. É que, quando a escrita deixa de ser o gargalo, o verificador vira o projeto. O time passou mais tempo construindo o sinal (checkpoint, fingerprint, agrupamento, dois loops, memória) do que na primeira versão do código, que saiu em uma semana.

Sobra o limite. Igualdade de saída não é qualidade de fix, e o caso do web search mostra o agente produzindo o match mais barato e um engenheiro barrando. Por isso o portão humano não fica no fim do pipeline, revisando tudo, e sim na costura entre o sandbox e a produção, olhando propostas que já passaram pelo verificador. Quem monta esse tipo de loop precisa escolher onde essa costura fica antes de ligar o agente. Depois, o volume de registros decide por você.

## 📎 Fonte Original

- Anthropic, "Migrating our Messages API to Rust" (25/11/2026): https://www.anthropic.com/research/migrating-api-to-rust
- Anthropic Institute, "Recursive self-improvement" (dado de que Claude escrevia mais de 80% do código mergeado em maio de 2026): https://www.anthropic.com/institute/recursive-self-improvement
- GitHub Engineering, "Scientist: do things more gooder" (a referência citada no texto sobre teste em produção): https://github.blog/2016-02-03-scientist/

<div class="persona" data-audio="/audio/migracao-rust-paridade-fora-do-teste-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
    <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Caio</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 12: Caio aponta o atalho que passou no verificador e defende testar a suíte com código sabotado antes de montar shadowing. Não é a narração do texto.</small></p>
