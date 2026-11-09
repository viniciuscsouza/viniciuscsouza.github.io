export const SITE = {
  website: "https://viniciuscsouza.github.io/", // replace this with your deployed domain
  author: "Vinicius Costa",
  profile: "https://github.com/viniciuscsouza",
  desc: "Caderno de campo sobre construir sistemas com LLM: agentes, contexto, avaliação e as lições que só aparecem quando o sistema vai para o ar.",
  title: "Engenharia de IA",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/viniciuscsouza/viniciuscsouza.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "pt-BR", // html lang code. Set this empty and default will be "en"
  timezone: "America/Sao_Paulo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
