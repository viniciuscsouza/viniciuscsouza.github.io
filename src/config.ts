export const SITE = {
  website: "https://viniciuscsouza.github.io/", // replace this with your deployed domain
  author: "Vinicius Souza",
  profile: "https://github.com/viniciuscsouza",
  desc: "Anotações sobre desenvolvimento de projetos com IA.",
  title: "AI Dev Notes",
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
