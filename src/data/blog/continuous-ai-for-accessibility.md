---
author: Vinicius Costa
pubDatetime: 2026-03-23T23:40:00Z
title: "Continuous AI for Accessibility: Como o GitHub transforma feedback em inclusão"
featured: false
draft: false
tags:
  - inteligencia-artificial
  - copilot
  - acessibilidade
  - continuos-ai
description: "Exploração de como o GitHub utiliza IA para automatizar a triagem de feedback de acessibilidade e promover a inclusão contínua."
---

O GitHub publicou recentemente um artigo fascinante sobre como eles estão utilizando o que chamam de **Continuous AI** para resolver um problema histórico: a fragmentação do feedback de acessibilidade.

## O Desafio: Feedback sem Dono

Problemas de acessibilidade raramente pertencem a uma única equipe. Um erro de leitor de tela pode envolver navegação, autenticação e configurações ao mesmo tempo. Historicamente, isso resultava em feedbacks perdidos em backlogs intermináveis ou "bugs" que nunca encontravam um dono para resolvê-los.

## A Solução: Fluxo de Trabalho Potencializado por IA

Para transformar esse caos em um sistema eficiente, o GitHub desenvolveu um workflow interno utilizando **GitHub Actions**, **GitHub Copilot** e **GitHub Models**. O objetivo não é substituir o julgamento humano, mas automatizar as tarefas repetitivas de triagem.

### Como funciona o fluxo:

1.  **Entrada (Intake):** O feedback chega de diversas fontes (fóruns, suporte, redes sociais). Um membro da equipe cria um problema (issue) usando um template padronizado.
2.  **Análise do GitHub Copilot:** Uma Action aciona o Copilot (via API do GitHub Models) para analisar o relato. A IA preenche cerca de 80% dos metadados, sugerindo critérios de sucesso WCAG violados, nível de severidade e grupos de usuários impactados.
3.  **Checklist de Testes:** O Copilot gera um comentário com um checklist de testes básicos, permitindo que pessoas sem especialização em acessibilidade possam reproduzir e validar o problema.
4.  **Revisão Humana:** O autor do post e a equipe de acessibilidade revisam as sugestões da IA. Se a IA errar, os humanos corrigem, e esse feedback é usado para refinar as instruções (prompts) do sistema.
5.  **Fechando o Ciclo (Closing the Loop):** O usuário que reportou o erro é mantido informado sobre o plano de ação e é convidado a validar a correção assim que ela é implementada.

## Resultados Impressionantes

A implementação desse sistema trouxe melhorias drásticas em apenas um ano:

- **89% dos problemas resolvidos em até 90 dias** (antes era apenas 21%).
- **Redução de 62% no tempo médio de resolução** (de 118 para 45 dias).
- **Redução de 70% no tempo administrativo manual.**

## Lição Principal

Como destaca o artigo, o sucesso da IA depende de uma base humana sólida. "Sem essa fundação humana, a IA é apenas uma maneira mais rápida de perder o foco". Ferramentas como o Copilot funcionam como um multiplicador de força, permitindo que a equipe foque no que realmente importa: escrever código mais inclusivo e garantir a independência de todos os usuários.

---
*Para ler o artigo original completo (em inglês), acesse: [The GitHub Blog](https://github.blog/ai-and-ml/github-copilot/continuous-ai-for-accessibility-how-github-transforms-feedback-into-inclusion/)*
