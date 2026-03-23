# AI Dev Notes 📄

Blog de anotações sobre desenvolvimento de projetos com Inteligência Artificial, construído com [Astro](https://astro.build/) e o tema [AstroPaper](https://github.com/satnaing/astro-paper).

---

## 🚀 Estrutura do Projeto

Dentro do projeto, você verá as seguintes pastas e arquivos principais:

```bash
/
├── public/
│   ├── pagefind/        # auto-gerado no build (busca)
│   └── favicon.svg      # favicon
├── src/
│   ├── assets/          # imagens e ícones
│   ├── components/      # componentes Astro
│   ├── data/
│   │   └── blog/        # ARTIGOS EM MARKDOWN (Seus posts vão aqui!)
│   ├── layouts/         # templates de página
│   ├── pages/           # rotas públicas (Home, About, Search)
│   ├── styles/          # arquivos CSS
│   ├── config.ts        # configurações gerais do blog
│   └── constants.ts     # links sociais e compartilhamento
└── astro.config.ts      # configuração do Astro
```

---

## 👨🏻‍💻 Como Rodar Localmente

Para testar o blog na sua máquina:

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesso em `http://localhost:4321`.

---

## 🧞 Comandos Úteis

| Comando | Ação |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local em `localhost:4321` |
| `npm run build` | Compila o site estático para a pasta `./dist/` |
| `npm run preview` | Pré-visualiza o build localmente antes de publicar |
| `npm run format` | Corrige a formatação do código com Prettier |

---

## 🚀 Publicação (Deploy)

O deploy é feito automaticamente via **GitHub Actions** toda vez que houver um `push` para a branch `main` (desde que os posts estejam com `draft: false`).

---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
