---
author: Vinicius Costa
pubDatetime: 2026-03-27T20:59:00Z
title: "Vibe Coding com SwiftUI: Criando Apps macOS de Alto Nível com IA"
slug: vibe-coding-com-swiftui
featured: false
draft: false
tags:
  - inteligencia-artificial
  - swiftui
  - vibe-coding
  - ia
description: "Exploração de como Simon Willison utilizou Claude e GPT-5 para criar aplicativos macOS funcionais em SwiftUI através do conceito de Vibe Coding."
---

## Sumário Executivo

O conceito de "Vibe Coding" — onde o desenvolvedor foca na intenção e no resultado visual/funcional através de prompts, deixando a implementação técnica pesada para a IA — ganhou um novo capítulo com o relato de Simon Willison. Utilizando modelos avançados como Claude 4.6 e GPT-5.4, ele demonstrou que é possível construir aplicativos macOS nativos e funcionais em SwiftUI sem sequer abrir o Xcode ou possuir conhecimento profundo da linguagem Swift. Este post detalha como ele criou ferramentas de monitoramento de sistema (`Bandwidther` e `Gpuer`) e o que isso significa para o futuro do desenvolvimento de software.

## Arquitetura de Ideias

### O Poder do SwiftUI em Arquivo Único

Uma das descobertas centrais é que aplicativos SwiftUI completos podem ser contidos em um único arquivo de texto. Isso facilita enormemente o trabalho com LLMs, pois o contexto total do código pode ser enviado e recebido em uma única interação.

- **Bandwidther**: Um app que monitora o uso de largura de banda, diferenciando tráfego local (LAN) de internet.
- **Gpuer**: Uma ferramenta para visualizar o uso de memória RAM e carga da GPU, áreas onde o Monitor de Atividade nativo do macOS às vezes carece de detalhes imediatos.

### O Fluxo de Trabalho do Vibe Coding

O processo utilizado por Willison não seguiu o desenvolvimento tradicional, mas sim uma evolução guiada por conversação:

1.  **Prompts Minimais**: Começar com uma pergunta direta sobre como obter dados do sistema.
2.  **Iteração Rápida**: Pedir à IA para criar um app nativo que exiba esses dados em tempo real.
3.  **Sugestão de Features**: Deixar que a própria IA sugira funcionalidades, aproveitando que o modelo muitas vezes conhece as APIs disponíveis melhor que o próprio desenvolvedor.
4.  **Recombinação**: Usar o código de um projeto anterior como contexto para o próximo (ex: ensinar ao `Gpuer` como criar um ícone na barra de menu baseando-se no que foi feito no `Bandwidther`).

### Exemplos de Prompting e Automação

Willison utilizou comandos simples para estruturar o projeto:
```bash
mkdir /tmp/bandwidther and write a native Swift UI app in there that shows me these details on a live ongoing basis
```

A IA não apenas escreveu o código Swift, mas também forneceu os comandos de terminal necessários para compilar o aplicativo, eliminando a barreira de entrada que o ecossistema complexo do Xcode costuma impor.

### O Risco da "Vibe": Precisão vs. Aparência

Um ponto crucial levantado é a confiabilidade. Como o desenvolvedor não domina a linguagem ou as APIs internas do sistema, ele depende totalmente da interpretação da IA. Willison notou discrepâncias nos dados reportados pelo `Gpuer` em comparação com o Monitor de Atividade, o que o levou a usar o Claude Code para analisar screenshots e ajustar os cálculos.

## Conclusões e Próximos Passos

O experimento de Simon Willison prova que a barreira para criar ferramentas personalizadas e nativas para o macOS nunca foi tão baixa. O SwiftUI se mostra uma linguagem excepcionalmente "amigável" para agentes de IA devido à sua sintaxe declarativa e concisão.

**Próximos Passos para Desenvolvedores:**
- **Experimentar SwiftUI para utilitários**: Mesmo que você não seja um desenvolvedor Apple, use LLMs para criar pequenas ferramentas de workflow.
- **Focar em Recombinação**: Mantenha uma biblioteca de "padrões" que funcionam e forneça-os como contexto para novos projetos.
- **Validação Crítica**: Sempre cross-reference os resultados gerados por ferramentas "vibe coded" com fontes de verdade conhecidas antes de confiar cegamente nos dados.

---

## 📎 Fonte Original

> Este post foi baseado no artigo original: [Vibe coding SwiftUI apps is a lot of fun](https://simonwillison.net/2026/Mar/27/vibe-coding-swiftui/)
