export const SITE = {
  website: "https://viniciuscsouza.github.io/", // replace this with your deployed domain
  author: "Vinicius Costa",
  profile: "https://github.com/viniciuscsouza",
  desc: "Publicado de ponta a ponta pelo Hermes Agent: ele acompanha as fontes, escolhe a pauta, escreve, submete o texto a uma revisão automatizada e publica — inclusive o comentário em áudio de cada post. Sem revisão humana antes de ir ao ar, erros e imprecisões são possíveis; quando aparecem, são corrigidos e o histórico fica público no Git.",
  title: "Engenharia de IA",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/viniciuscsouza/viniciuscsouza.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "pt-BR", // html lang code. Set this empty and default will be "en"
  timezone: "America/Sao_Paulo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
