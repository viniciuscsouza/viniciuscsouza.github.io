---
author: Vinicius Costa
pubDatetime: 2026-03-24T01:15:00Z
title: "[AI Post] Usando Git com Coding Agent"
slug: usando-git-com-coding-agent
featured: false
draft: false
tags:
  - inteligencia-artificial
  - git
  - coding-agent
description: "Exploração de como o Git é uma ferramenta essencial para trabalhar com agentes de codificação, cobrindo desde conceitos básicos até técnicas avançadas de reescrita de histórico."
canonicalURL: "https://simonwillison.net/guides/agentic-engineering-patterns/using-git-with-coding-agents/"
---

O Git é uma ferramenta fundamental para trabalhar com agentes de codificação. Manter o código em controle de versão nos permite registrar como ele muda ao longo do tempo, além de investigar e reverter quaisquer erros. Todos os agentes de codificação modernos são fluentes no uso dos recursos do Git, tanto básicos quanto avançados.

Essa fluência significa que podemos ser mais ambiciosos sobre como usamos o Git. Não precisamos memorizar todos os comandos, mas estar cientes do que é possível nos permite aproveitar todo o potencial das habilidades do Git.

## Essentials do Git

Cada projeto Git vive em um **repositório** — uma pasta no disco que rastreia alterações nos arquivos. Essas mudanças são registradas em **commits**, que são pacotes de alterações com data, mensagem descritiva e autor.

O Git suporta **branches** (ramos), que permitem experimentar novas mudanças de forma independente. Elas podem ser mescladas (**merged**) de volta ao ramo principal quando estiverem prontas. Além disso, repositórios podem ser clonados, permitindo que desenvolvedores e agentes explorem todo o histórico localmente sem tráfego de rede extra.

## Conceitos Core e Prompts

Agentes de codificação entendem profundamente o jargão do Git. Aqui estão alguns prompts que funcionam bem:

- **"Start a new Git repo here"**: O agente executará `git init` para transformar a pasta atual em um repositório.
- **"Commit these changes"**: Cria um novo commit com as mudanças feitas.
- **"Add username/repo as a github remote"**: Configura o repositório para o GitHub.
- **"Review changes made today"**: Uma ótima forma de iniciar uma sessão. O agente executa `git log` para carregar o contexto com detalhes do que foi trabalhado recentemente.
- **"Integrate latest changes from main"**: Para buscar contribuições do repositório remoto ou integrar mudanças da main em uma branch.

Se você não tiver certeza de qual estratégia de mesclagem usar (merge, rebase, squash), você pode simplesmente pedir:
> "Discuss options for integrating changes from main"

## Resolvendo "Bagunças" no Git (Git Messes)

Um dos prompts mais úteis é:
> "Sort out this git mess for me"

Agentes são excelentes para navegar em conflitos de mesclagem bizantinos, raciocinando sobre a intenção do código e decidindo o que manter. Se você tiver testes automatizados, o agente pode garantir que eles passem antes de finalizar a mesclagem.

## Recuperação de Código

Se você perder código que foi commitado anteriormente (ou salvo com `git stash`), o agente pode encontrá-lo usando o **reflog**, que captura detalhes de código que ainda não foi para uma branch permanente.

## Git Bisect com Agentes

O `git bisect` é uma ferramenta poderosa para encontrar qual commit introduziu um bug, mas tem uma curva de aprendizado íngreme. Ele realiza uma busca binária no histórico para identificar o commit problemático.

Os agentes de codificação podem lidar com todo o "boilerplate" necessário, tornando o `git bisect` uma ferramenta acessível sempre que você estiver curioso sobre o comportamento histórico do seu software.

## Reescrita de Histórico

O histórico do Git não deve ser visto como um registro permanente imutável, mas como uma história deliberadamente escrita para descrever a progressão do projeto. Agentes são muito bons em:

- **Desfazer o último commit**: Útil quando você percebe que incluiu um arquivo indesejado.
- **Remover arquivos específicos de um commit**: Ex: "Remove uv.lock from that last commit".
- **Combinar commits**: Juntar os últimos commits com uma mensagem melhor.

Modelos de fronteira geralmente têm bom gosto para mensagens de commit, muitas vezes produzindo algo melhor do que o próprio desenvolvedor faria sob pressão.

## Construindo Novos Repositórios de "Restos" de Antigos

Uma técnica avançada é extrair código de um repositório maior para um novo, mantendo o histórico essencial. Isso é comum na extração de bibliotecas. Operações que antes eram complexas e faziam os desenvolvedores desistirem do histórico agora são triviais com agentes.

---

*Este post é baseado no guia [Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/) de Simon Willison.*
