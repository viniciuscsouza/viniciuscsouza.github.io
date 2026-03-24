---
author: Vinicius Costa
pubDatetime: 2026-03-24T01:25:05Z
title: "Engenharia de Contexto no Copilot - Parte 2: Planejamento e Implementação"
slug: engenharia-de-contexto-no-copilot-parte-2
featured: false
draft: false
tags:
  - inteligencia-artificial
  - copilot
  - agents
  - vscode
  - tdd
description: "Aprenda a criar planos de implementação estruturados e usar agentes customizados no Copilot para automatizar o ciclo de planejamento e geração de código."
---

Depois de estabelecermos a base de conhecimento do projeto na [Parte 1](./engenharia-de-contexto-no-copilot-parte-1), o próximo passo na engenharia de contexto é transformar esse conhecimento em ação. Nesta segunda parte, vamos focar em como o Copilot pode ajudar a planejar funcionalidades complexas e executar a implementação de forma estruturada.

## Passo 2: Criar o Plano de Implementação

Muitas vezes, o maior erro ao usar IA é pular direto para o código. Funcionalidades complexas exigem um plano. O uso de IA para gerar esse plano garante que você considerou todos os requisitos antes de escrever a primeira linha de código.

### 1. Template de Plano de Implementação

O uso de um template garante que a IA colete todas as informações necessárias de forma consistente. Crie um arquivo `plan-template.md` para guiar o agente:

```markdown
---
title: [Título descritivo da funcionalidade]
date_created: [YYYY-MM-DD]
---
# Plano de Implementação: <funcionalidade>
[Breve descrição dos requisitos e objetivos]

## Arquitetura e Design
Considerações de design e mudanças estruturais.

## Tarefas
- [ ] Tarefa 1
- [ ] Tarefa 2

## Perguntas Abertas
Incertezas que precisam de esclarecimento.
```

### 2. Agentes Customizados de Planejamento

Você pode criar um agente dedicado ao planejamento definindo uma persona específica no arquivo `.github/agents/plan.agent.md`. Este agente deve focar em arquitetura e não em escrever código diretamente.

Exemplo de configuração de um agente de planejamento:

```yaml
---
description: 'Arquiteto e planejador para criar planos detalhados.'
tools: ['web/fetch', 'search/codebase', 'agent']
handoffs:
- label: Iniciar Implementação
    agent: tdd
    prompt: Agora implemente o plano acima usando princípios de TDD.
    send: true
---
# Agente de Planejamento
Você é um arquiteto focado em decompor requisitos complexos em tarefas acionáveis.
```

### 3. Arquivos de Prompt (Prompt Files)

Opcionalmente, use arquivos de prompt como `.github/prompts/plan-qna.prompt.md` para criar fluxos de trabalho que forçam a IA a fazer perguntas de esclarecimento antes de começar o planejamento, reduzindo mal-entendidos.

---

## Passo 3: Gerar o Código de Implementação

Com o plano refinado e aprovado, entramos na fase de execução.

### Agentes de Implementação Especializados

Em vez de usar um chat genérico, você pode usar um agente especializado em implementação, como um focado em **TDD (Test-Driven Development)**. Configure um arquivo `.github/agents/tdd.agent.md` com diretrizes claras:

1.  **Escreva os testes primeiro**: Codifique os critérios de aceitação.
2.  **Implementação mínima**: Escreva apenas o código necessário para passar nos testes.
3.  **Refatore**: Melhore o código mantendo os testes verdes.

### O Poder do Agente Autônomo

O modo "Agent" no Copilot é otimizado para executar tarefas multi-etapas. Você só precisa fornecer o arquivo de plano (ex: `implemente #meu-plano.md`) e ele será capaz de navegar pelo projeto, entender as dependências e realizar as alterações necessárias de forma autônoma.

### Dica: Revisão por um "Novo Par de Olhos"

Após a implementação, abra um novo chat e peça para o agente revisar o código gerado em relação ao plano original. Isso ajuda a identificar requisitos negligenciados ou inconsistências técnicas.

Na última parte desta série, abordaremos as melhores práticas para manter este ecossistema saudável e como escalar a engenharia de contexto para grandes equipes.

---

## 📎 Fonte Original

> Este post foi baseado no artigo original: [Set up a context engineering flow in VS Code](https://code.visualstudio.com/docs/copilot/guides/context-engineering-guide)
