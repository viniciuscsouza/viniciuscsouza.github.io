---
author: Vinicius Costa
pubDatetime: 2024-05-22T10:00:00Z
title: "Boas práticas de prompting"
slug: boas-praticas-de-prompting
featured: false
draft: false
tags:
  - inteligencia-artificial
  - prompt
  - engenharia
  - agente
  - copilot
description: "Descubra as melhores práticas de engenharia de prompt para o Claude da Anthropic, cobrindo desde princípios básicos até sistemas agentes complexos."
canonicalURL: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
---

A Anthropic publicou um guia abrangente sobre as melhores práticas para interagir com os modelos Claude. Este guia é essencial para desenvolvedores e entusiastas que desejam extrair o máximo de desempenho dos modelos mais recentes, como o Claude Opus 4.6, Claude Sonnet 4.6 e Claude Haiku 4.5.

Aqui estão os pontos principais para dominar a engenharia de prompt:

## 1. Seja Claro e Direto

O Claude responde melhor a instruções explícitas. Pense no Claude como um estagiário brilhante, mas que não conhece o seu contexto interno.
- Seja específico sobre o formato de saída desejado.
- Use listas numeradas ou tópicos para instruções sequenciais.

## 2. Forneça Contexto

Explicar o "porquê" de uma tarefa ou fornecer material de referência ajuda o modelo a alinhar suas respostas aos seus objetivos. Se você tiver documentos longos, coloque-os no topo do prompt, antes das instruções.

## 3. Use Exemplos (Few-Shot Prompting)

Fornecer de 3 a 5 exemplos do formato e tom desejados é uma das formas mais eficazes de garantir consistência.
Dica: Envolva seus exemplos em tags `<example>` para que o Claude os identifique claramente.

## 4. Estruture Prompts com Tags XML

O uso de tags XML (ex: `<instructions>`, `<context>`, `<input>`) ajuda o Claude a analisar prompts complexos sem ambiguidade, separando claramente o que é instrução do que é dado de entrada.

## 5. Atribua uma Função (Role Prompting)

Definir um papel no prompt do sistema (ex: "Você é um especialista em segurança cibernética") ajuda a ajustar o tom e o nível de tecnicidade da resposta.

## 6. Pensamento e Raciocínio (Thinking)

Os modelos mais novos suportam capacidades de "thinking", onde o modelo processa o raciocínio antes de dar a resposta final. O Claude Opus 4.6 utiliza o pensamento adaptativo, decidindo dinamicamente quando e quanto pensar. Para o Sonnet 4.6, você pode alternar entre o modo adaptativo e o modo estendido.

## 7. Sistemas Agentes e Ferramentas

O Claude é excelente em usar ferramentas (Tool Use) e orquestrar subagentes. Para melhores resultados:
- Dê instruções explícitas para o uso de ferramentas.
- Use o modo de pensamento adaptativo para tarefas de longa duração.

---

Para ler o guia completo e ver exemplos detalhados, acesse a [documentação oficial da Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
