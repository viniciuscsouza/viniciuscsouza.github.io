---
author: Vinicius Costa
pubDatetime: 2026-03-24T01:25:05Z
title: "Engenharia de Contexto no Copilot - Parte 1: Fundamentos e Curadoria"
slug: engenharia-de-contexto-no-copilot-parte-1
featured: false
draft: false
tags:
  - inteligencia-artificial
  - copilot
  - context-engineering
  - vscode
description: "Uma introdução à engenharia de contexto no VS Code Copilot e como estruturar o contexto inicial do projeto usando arquivos de documentação e instruções customizadas."
---

A engenharia de contexto é uma das habilidades mais críticas para desenvolvedores que utilizam ferramentas de IA como o GitHub Copilot no VS Code. Não se trata apenas de escrever um bom prompt isolado, mas de estabelecer uma base sólida de conhecimento que permita à IA entender não apenas *como* codificar, mas *o que* e *por que* ela está construindo algo dentro do ecossistema do seu projeto.

Nesta primeira parte de nossa série sobre Engenharia de Contexto, vamos explorar os fundamentos desta abordagem e como configurar a curadoria inicial do seu projeto.

## O que é Engenharia de Contexto?

A engenharia de contexto é uma abordagem sistemática para fornecer aos agentes de IA informações contextuais ricas e direcionadas. Ao curar informações essenciais do projeto — como visão do produto, princípios de arquitetura e diretrizes de contribuição — você permite que a IA tome decisões mais alinhadas com os objetivos do negócio e as convenções técnicas da sua equipe.

### Por que isso ajuda?

Embora os modelos de linguagem modernos consigam "ler" o seu código, informações cruciais muitas vezes estão enterradas em comentários, espalhadas por múltiplos arquivos ou sequer documentadas no código fonte. Ao fornecer um resumo conciso e estruturado, você garante que o agente tenha acesso imediato aos critérios críticos de tomada de decisão, reduzindo alucinações e respostas genéricas.

## O Fluxo de Trabalho de Engenharia de Contexto

O fluxo de trabalho recomendado no VS Code consiste em três etapas principais:

1.  **Curadoria do contexto global do projeto**: Usar instruções customizadas e arquivos de documentação para alinhar a IA.
2.  **Geração do plano de implementação**: Criar uma persona de planejamento para desenhar a solução antes de codar.
3.  **Geração do código de implementação**: Produzir código baseado no plano, seguindo diretrizes de estilo e testes.

---

## Passo 1: Curadoria do Contexto Global

Para fundamentar o agente de IA nas especificidades do seu projeto, o primeiro passo é coletar e estruturar a documentação chave.

### 1. Documentação em Markdown

Crie ou atualize arquivos Markdown na raiz do seu repositório para descrever os pilares do projeto. Se você não tem esses arquivos, pode até pedir para o Copilot gerá-los baseando-se no código existente:

*   **`PRODUCT.md`**: Descreve a visão do produto, objetivos de negócio e funcionalidades principais.
*   **`ARCHITECTURE.md`**: Detalha a arquitetura do sistema, padrões de design e princípios técnicos.
*   **`CONTRIBUTING.md`**: Define as diretrizes para desenvolvedores, convenções de código e melhores práticas.

### 2. Instruções Customizadas do Copilot

O VS Code permite criar um arquivo `.github/copilot-instructions.md` na raiz do repositório. As instruções contidas neste arquivo são incluídas automaticamente em todas as interações de chat como contexto fundamental.

Um exemplo básico de estrutura para este arquivo:

```markdown
# Diretrizes do Projeto [Nome do Projeto]

* [Visão e Objetivos do Produto](../PRODUCT.md): Compreenda a visão de alto nível para garantir alinhamento.
* [Arquitetura e Princípios de Design](../ARCHITECTURE.md): Padrões de arquitetura que guiam o desenvolvimento.
* [Diretrizes de Contribuição](../CONTRIBUTING.md): Visão geral das práticas de colaboração e padrões de código.

Sugira atualizações nestes documentos se encontrar informações incompletas ou conflitantes durante o trabalho.
```

### Dica de Ouro: Comece Pequeno

Não tente documentar cada detalhe técnico imediatamente. Comece com um contexto conciso e foque nas informações mais críticas. À medida que você observa onde a IA comete erros repetitivos (como usar comandos de shell errados ou ignorar certos padrões de design), adicione regras específicas para corrigir esses comportamentos.

Na próxima parte desta série, veremos como usar esse contexto para criar planos de implementação detalhados e agentes customizados de planejamento.

---

## 📎 Fonte Original

> Este post foi baseado no artigo original: [Set up a context engineering flow in VS Code](https://code.visualstudio.com/docs/copilot/guides/context-engineering-guide)
