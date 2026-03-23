# Instruções para o Agente de IA (Jules)

## Idioma

- Toda comunicação e conteúdo gerado deve ser em **PT-BR** (Português do Brasil).

## Tarefa: Criar Post a Partir de Artigo

Quando uma issue com o label `jules` for criada com o título começando por `[AI Post]`, siga estas etapas:

### 1. Extrair Informações da Issue

A issue conterá os seguintes campos preenchidos pelo usuário:

- **Link do Artigo/Publicação**: URL do conteúdo original a ser analisado
- **Categoria Principal**: Categoria do post (ex: `inteligencia-artificial`, `desenvolvimento-web`)
- **Tags Adicionais** _(opcional)_: Tags extras separadas por vírgula
- **Post em Destaque** _(opcional)_: Se o post deve ser marcado como `featured: true`
- **Instruções Adicionais** _(opcional)_: Orientações específicas sobre o conteúdo

### 2. Analisar o Conteúdo do Artigo

- Acesse e leia o conteúdo do link fornecido
- Identifique os pontos principais, conceitos-chave e exemplos relevantes
- Entenda o contexto e público-alvo do artigo original

### 3. Criar o Arquivo do Post

Crie um novo arquivo Markdown em `src/data/blog/` com o nome no formato `slug-do-titulo.md`.

O arquivo **DEVE** seguir este formato de frontmatter:

```markdown
---
author: Vinicius Costa
pubDatetime: <DATA_ATUAL_ISO_8601>
title: "Título Atrativo em PT-BR"
slug: titulo-atrativo-em-pt-br
featured: <true|false conforme especificado na issue>
draft: false
tags:
  - <categoria-principal>
  - <tag-relevante-1>
  - <tag-relevante-2>
  - <tag-relevante-3>
description: "Descrição concisa do post em até 160 caracteres"
---
```

### 4. Regras do Frontmatter

| Campo          | Regra                                                           |
| -------------- | --------------------------------------------------------------- |
| `author`       | Sempre `Vinicius Costa`                                         |
| `pubDatetime`  | Data/hora atual no formato ISO 8601 (ex: `2026-03-23T20:00:00Z`) |
| `title`        | Título traduzido/adaptado em PT-BR, entre aspas duplas          |
| `slug`         | Versão kebab-case do título, sem acentos ou caracteres especiais |
| `featured`     | Conforme especificado na issue (padrão: `false`)                |
| `draft`        | Sempre `false`                                                  |
| `tags`         | Array com 3-6 tags em kebab-case; primeira tag = categoria da issue |
| `description`  | Resumo conciso em PT-BR, máximo 160 caracteres, entre aspas duplas |

### 5. Regras do Conteúdo

- **Idioma**: Todo o conteúdo deve ser em PT-BR
- **Profundidade**: O post deve ser detalhado e aprofundado, NÃO apenas um resumo
- **Estrutura**: Organize com seções claras usando headings Markdown (`##`, `###`)
- **Headings**: NÃO use heading de nível 1 (`#`) no conteúdo — o título já é o h1
- **Exemplos**: Inclua exemplos de código quando relevante
- **Tom**: Técnico mas acessível
- **Valor**: O post deve agregar valor ao leitor, não ser apenas uma tradução literal

### 6. Rodapé Obrigatório

Todo post DEVE terminar com esta seção:

```markdown
---

## 📎 Fonte Original

> Este post foi baseado no artigo original: [TITULO_OU_URL_DO_ARTIGO](URL_DO_ARTIGO)
```

### 7. Validação

Após criar o arquivo do post:

1. Execute `npm install` para garantir que as dependências estão instaladas
2. Execute `npm run build` para validar que o post compila corretamente
3. Corrija quaisquer erros de build antes de finalizar

### 8. Referência

Use o arquivo `src/data/blog/_template.md` como referência do formato.
Use o arquivo `src/data/blog/bem-vindo.md` como exemplo de post existente.
O schema de validação está em `src/content.config.ts`.
