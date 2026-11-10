---
author: Vinicius Costa
pubDatetime: 2026-11-10T23:20:00Z
title: "O segredo vaza no atalho, não no modelo"
featured: false
draft: false
tags:
  - inteligencia-artificial
  - seguranca
  - agentes
  - engenharia-de-software
description: 'A Apiiro achou 104.185 cópias públicas do arquivo de configuração do Claude Code no GitHub, 1.122 com credencial real. A Claroc abriu 35.578 apps do Grok Build sem login. Dois vazamentos, dois mecanismos, a mesma escolha: o padrão que poupa o usuário de decidir de novo.'
---

Em 10 de novembro, duas empresas de segurança publicaram, no mesmo dia, a contagem do que agentes de código deixaram exposto. A Apiiro encontrou 104.185 cópias públicas do arquivo de configuração local do Claude Code no GitHub, espalhadas por 103.617 repositórios, e 1.122 dessas cópias guardavam uma credencial real. A Claroc tentou abrir 43.551 endereços de aplicativos publicados pelo Grok Build: 37.571 ainda estavam no ar e 35.578 deles abriram para qualquer pessoa, sem login.

Não é a mesma falha técnica. Um caso é um arquivo de permissão gravado dentro do projeto; o outro é um subdomínio que qualquer um enumera. O que se repete é a escolha que produziu os dois, e ela tem o mesmo formato: um padrão que poupa o usuário de decidir de novo. "Don't ask again" evita um prompt. "Anyone with the link" evita um convite. Nenhum dos dois vazamentos está no modelo. Está no que a ferramenta gravou ou publicou nesse atalho.

## A regra que carrega a senha

O mecanismo do Claude Code é banal até doer. Você pede para ele conferir por que o login de staging falha. O comando que ele propõe carrega a string de conexão, porque sem ela o comando não funciona. Ele pede aprovação. Você escolhe "Yes, and don't ask again", e o Claude Code grava a regra em `.claude/settings.local.json` na pasta do projeto. A regra é o próprio comando, com o segredo que ele carrega.

O arquivo deveria ficar só na sua máquina. O Claude Code até tenta: quando cria o arquivo dentro de um repositório git, ele acrescenta o caminho à lista de ignore **global** do desenvolvedor. O que ele nunca faz é escrever a mesma linha no `.gitignore` do repositório. Pasta que vira repositório depois, clone em outra máquina, arquivo que já entrou num commit: nenhum desses casos é coberto por um ignore que existe só no seu home.

A contagem da Apiiro, feita entre 1º e 3 de novembro em branches padrão, mostra que isso não é hipótese. Dos 1.105 repositórios com segredo rastreado, 539 tiveram o arquivo alterado por um commit co-assinado pelo Claude, em versões que vão de Sonnet 4.5 a Opus 5.5. Na mediana, o arquivo havia sido commitado pela primeira vez 217 dias antes da coleta. Em 118 repositórios, mais de um ano antes. Há 211 forks de 74 repositórios carregando os mesmos segredos, e 734 segredos que só existem no histórico do arquivo, em 509 repositórios, apagados da versão atual e vivos em todo clone que já foi feito.

As 63 organizações afetadas incluem um fornecedor de banco de dados que expôs a própria chave de nuvem com permissão de manage, sem data de expiração declarada, uma startup B2B com a senha de produção do Azure Postgres, uma agência com o token de produção do Square e uma empresa de TI com a senha de owner do banco do seu aplicativo de prontuário. Somando histórico, o `settings.json` que os times commitam de propósito e transcrições de agente salvas em repositório, a conta fecha em 2.539 segredos em 1.994 repositórios. "Segredo", aqui e no resto do texto, é o critério da própria Apiiro: credencial que casa com o formato de um provedor ou que aponta para um host público. Nenhuma delas foi usada ou testada, e nenhum host foi contatado. A contagem é um piso, não um inventário de dano.

Uma parte disso não é o modelo fazendo algo errado. É o produto fazendo exatamente o que prometeu. A Apiiro reproduziu o comportamento com Opus 5.5 e Fable 5.1 e comparou 16 agentes de código pela documentação: o Claude Code é o único confirmado a gravar o comando aprovado inteiro num arquivo de projeto por padrão.

## O scanner que a indústria recomenda perde um em cada cinco

A resposta padrão para esse tipo de vazamento é rodar um scanner de segredo no pre-commit. A Apiiro rodou os dois mais usados sobre as 104.185 cópias. O gitleaks marcou 564 arquivos com segredo real, o TruffleHog marcou 643, e 215 não foram marcados por nenhum dos dois. Quase um em cada cinco passou limpo.

O motivo é estrutural, não é bug do scanner. As duas ferramentas procuram formato de chave: prefixo de provedor, string longa e aleatória. O que vaza aqui é senha dentro de comando, do tipo `PGPASSWORD=`, `sshpass -p`, `mysql -p` ou um header bearer num curl. É uma palavra comum numa linha de comando comum, e os scanners deixam passar. O mesmo buraco vale para transcrições, arquivos de memória e notas de handoff, que é exatamente onde o agente registra o que rodou.

Há um agravante que ninguém mede em auditoria de segurança: o tamanho da lista. Um em cada dez arquivos acima de 8 KB tem segredo real, contra menos de um em 500 abaixo de 500 bytes. Quanto mais tempo alguém convive com o agente, mais comandos aprovou, e mais provável que um deles tenha carregado uma credencial.

Os relatos existiam desde agosto de 2025, em issues no repositório do Claude Code. A Apiiro diz que nenhuma recebeu resposta da Anthropic e que três foram fechadas automaticamente como inativas ou duplicadas. O Boris Cherny, do time do Claude Code, apareceu numa thread do Hacker News no fim de semana dizendo que o time está "looking into what we can do to prevent this". Ele também disse que esses arquivos praticamente nunca deveriam ir para o controle de versão e que os casos pareciam vir de arquivos criados e commitados à mão. Quando outro usuário lembrou que o auto mode, que ele havia recomendado como alternativa, também grava comandos sensíveis, a resposta foi "good catch", seguida de "thinking through what we can do to improve this".

Nada nessa resposta é mentira. O problema é o endereço, e essa separação é leitura minha: o que a Apiiro recomenda (scanner, gitignore no repositório, rotacionar) e o que o time sugeriu na thread (auto mode, scanner embutido no produto) ficam do lado de quem usa. O mecanismo que grava o segredo cru fica do lado da ferramenta.

## O outro vazamento não é arquivo, é link

O Grok Build faz outra coisa com o mesmo resultado. Todo app publicado ganha endereço no formato `<nome>.grok.me`, e o padrão de compartilhamento é "Anyone with the link". O nome aleatório deveria tornar o link impossível de adivinhar. Só que ele fica à esquerda do domínio, como subdomínio, e não à direita, como nos links do Google.

A posição decide tudo. Toda primeira visita a um subdomínio novo gera uma consulta DNS, e serviços de DNS passivo registram essas consultas e vendem a busca por padrão. O nome que existia para esconder o app vira índice do app. A Claroc encontrou 43.601 nomes sob `grok.me` assim, sem adivinhar nada. Tentou 43.551 e 37.571 ainda respondiam.

Dos que respondiam, 35.578 (94,7%) abriam para quem clicasse, sem login. A estimativa de apps com dado privado de verdade fica entre 650 e 800, depois de conferir à mão a amostra que um modelo havia marcado. Entre os documentos que a Claroc diz ter lido estão 3.784 exames médicos ocupacionais, um diretório de hospital com cerca de 3.565 funcionários, uma lista de 108 pessoas ligadas a um contrato de logística da Marinha americana e cerca de 4.000 ordens de transporte de veículos com custo e margem.

## A plataforma derrubou os 24 dela

Entre os apps abertos havia 24 construídos pela própria SpaceXSI, o nome da SpaceX e da xAI depois da fusão. Um deles era o plano de integração confidencial de um novo vendedor da equipe enterprise. Outro, o mapa de território de vendas com 594 contas. Havia endereços internos das ferramentas do time comercial e propostas de publicidade.

Na noite de segunda-feira, os 24 estavam expondo. A SpaceXSI derrubou os links poucas horas depois de a Ars Technica mandar perguntas para a reportagem. Quase todo o resto continuou no ar.

Esse é o detalhe que eu levaria para qualquer conversa sobre governança de agente. A plataforma tem o poder de tirar um link do ar. Ela exerceu esse poder sobre os próprios apps e deixou os dos clientes expostos, incluindo os de empresas da Fortune 500 e de um fornecedor de defesa. Não é preciso saber a intenção para ler o fato: o primeiro material retirado foi o de casa, e ele só saiu depois que um jornalista perguntou.

## O que muda na prática

Comece pelas credenciais que já passaram por uma regra de permissão, porque são as únicas que você sabe estarem escritas em texto claro em algum arquivo. Depois trate as pastas de agente (`.claude/`, `.cursor/`, `.gemini/`, `.specstory/`), os arquivos de memória e as transcrições como material sensível, do mesmo jeito que `.env` já é tratado.

Para quem usa Claude Code, a ordem que a Apiiro recomenda é a certa e é chata: se o arquivo está versionado, tire do índice com `git rm --cached`, acrescente a linha no `.gitignore` do repositório, e rotacione toda credencial que ele já guardou. Rotacionar vem antes de limpar. O histórico, os forks e os clones não somem porque você apagou o arquivo.

A prevenção é mais simples do que parece e quase ninguém faz: não digite segredo dentro de comando. Referencie `$DB_URL` do seu gerenciador, para que a regra registre `$DB_URL` e não a senha. Aprove padrão (`Bash(npm run:*)`) em vez de comando literal. E, se você publica app em plataforma com link compartilhável, procure os seus em DNS passivo antes que outra pessoa procure.

Sobra a pergunta que eu faria a qualquer fornecedor de agente nesta semana: o que a ferramenta grava quando eu digo "não pergunte de novo"? A resposta está no arquivo que ela escreveu. Vale abrir e ler.

<div class="persona" data-audio="/audio/vazamento-no-arquivo-do-agente-comentario.mp3">
  <button class="persona-avatar" type="button" aria-pressed="false" aria-label="Tocar o comentário em áudio com Caio">
    <img src="/personas/caio.webp" alt="Retrato de Caio, em estilo de gravura" width="480" height="480" loading="lazy" />
  </button>
  <p class="persona-name">Caio</p>
  <p class="persona-hint">Toque duas vezes para ouvir</p>
  <div class="persona-progress" aria-hidden="true"><span></span></div>
</div>

<p class="persona-note"><small>Comentário em áudio, 2 min 09: Caio troca o número do título pelo que abre porta (379 senhas de banco, 122 chaves service-role) e propõe ler a lista de comandos aprovados em voz alta na daily. Não é a narração do texto.</small></p>

## Fontes

- Apiiro, "Coding Agents Are Leaking Your Secrets to GitHub": https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again
- Claroc, "GhostShares 2: Grok Apps Exposed xAI's Business Secrets and People's Private Data": https://blog.claroc.io/ghostshares-grok-build-apps/
- Ars Technica, "Claude Code settings files expose thousands of secrets on GitHub": https://arstechnica.com/ai/2026/11/claude-code-settings-files-expose-thousands-of-secrets-on-github/
- Ars Technica, "Grok Build coding agent leaks oodles of confidential info, some belonging to SpaceXSI": https://arstechnica.com/security/2026/11/grok-build-coding-agent-leaks-oodles-of-confidential-info-some-belonging-to-spacexsi/
- Thread do Hacker News com Boris Cherny: https://news.ycombinator.com/item?id=50408126
- Issues no repositório do Claude Code: https://github.com/anthropics/claude-code/issues/5544
