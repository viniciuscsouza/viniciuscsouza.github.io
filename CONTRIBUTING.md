# Guia de Contribuição — Blog de Anotações

Este documento descreve as convenções e o fluxo de trabalho para adicionar novos artigos a este blog.

## Convenções de Conteúdo

### Estrutura de Pastas

Os posts devem ser criados no diretório `src/data/blog/`.

💡 **Organização em pastas:** A partir do AstroPaper v5.1.0, você pode criar subpastas (ex: `src/data/blog/2026/meu-post.md`). Isso afetará a URL: `/posts/2026/meu-post`.
Para organizar sem alterar a URL, use um `_` no início do nome da pasta (ex: `src/data/blog/_rascunhos/post.md`).

### Frontmatter (Metadados)

Todo post `.md` deve começar com um bloco YAML como este:

```yaml
---
author: Vinicius Costa
pubDatetime: 2026-03-23T19:22:00Z
title: "Título do Post"
slug: titulo-do-post
featured: false
draft: true
tags:
  - geral
description: "Descrição curta para SEO e listagem."
---
```

| Campo | Descrição | Obrigatório |
|---|---|---|
| `author` | Nome do autor | Sim |
| `pubDatetime` | Data de publicação (ISO 8601) | Sim |
| `title` | Título que aparece no blog | Sim |
| `description` | Resumo para listagem | Sim |
| `slug` | Parte da URL. Se omitido, usa o nome do arquivo | Opcional |
| `featured` | Se `true`, ganha destaque na Home | Opcional (default: `false`) |
| `draft` | Se `true`, não aparece no build de produção | Opcional (default: `false`) |
| `tags` | Array de categorias/tags | Opcional |

---

## Fluxo de Trabalho (Workflow)

### 1. Criar novo post
Copie o template `src/data/blog/_template.md` como base:

```bash
cp src/data/blog/_template.md src/data/blog/YYYY-MM-DD-slug.md
```

### 2. Escrever
Atualize o frontmatter (`draft: true` enquanto escreve) e adicione seu conteúdo em Markdown abaixo.

### 3. Visualizar localmente
Rode o servidor de desenvolvimento para testar:

```bash
npm run dev
```
Acesse `http://localhost:4321` para ver as mudanças em tempo real.

### 4. Build de Teste
Antes de publicar, confira se o build passa sem erros:

```bash
npm run build
```

### 5. Publicar
Mude `draft: false` no frontmatter e faça o push para a branch `main`:

```bash
git add .
git commit -m "feat: novo post sobre X"
git push origin main
```

O GitHub Actions cuidará do deploy automaticamente!
