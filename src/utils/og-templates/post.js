import satori from "satori";
import fs from "node:fs/promises";
import path from "node:path";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

const PERSONAS = ["helena", "bruna", "nadine", "sabrina", "vicente", "caio"];

const PALETTE = {
  paper: "#f4ecdd",
  ink: "#151310",
  muted: "#6f6350",
  rule: "#c9bca4",
};

/** Descobre a persona do post: pelo bloco de persona no corpo, com fallback no nome do áudio. */
function personaOf(post) {
  const body = post.body ?? "";
  const named = [...body.matchAll(/class="persona-name"[^>]*>([^<]+)</g)]
    .map(m => m[1].trim().toLowerCase())
    .filter(slug => PERSONAS.includes(slug));
  if (named.length) return { slug: named[0], count: new Set(named).size };
  const found = [...body.matchAll(/data-audio="[^"]*?-([a-z]+)\.mp3"/g)]
    .map(m => m[1])
    .filter(slug => PERSONAS.includes(slug));
  return { slug: found[0] ?? null, count: new Set(found).size };
}

async function avatarDataUri(slug) {
  if (!slug) return null;
  try {
    const buf = await fs.readFile(
      path.join(process.cwd(), "src/assets/personas", `${slug}.png`)
    );
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function truncate(text, max) {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

export default async post => {
  const { slug: persona, count: personaCount } = personaOf(post);
  const avatar = await avatarDataUri(persona);

  const title = truncate(post.data.title, 92);
  const description = truncate(post.data.description, 150);
  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  })
    .format(post.data.pubDatetime)
    .replace(".", "");
  const tags = (post.data.tags ?? [])
    .slice(0, 2)
    .join(" · ")
    .toUpperCase();
  const personaLabel = persona
    ? personaCount > 1
      ? `${personaCount} comentaristas`
      : `comentário de ${persona[0].toUpperCase()}${persona.slice(1)}`
    : "notas de engenharia de IA";

  const texto = [title, description, SITE.title, date, tags, personaLabel, "por", post.data.author].join(" ");
  const fonts = await loadGoogleFonts(`${texto} ${texto.toUpperCase()}`);

  const rule = { borderBottom: `1px solid ${PALETTE.rule}` };

  return satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          background: PALETTE.paper,
          padding: "34px",
          fontFamily: "IBM Plex Mono",
          color: PALETTE.ink,
        },
        children: {
          type: "div",
          props: {
            style: {
              display: "flex",
              flex: 1,
              border: `3px solid ${PALETTE.ink}`,
              padding: "40px 46px 32px",
            },
            children: {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 20,
                        letterSpacing: "0.14em",
                        color: PALETTE.muted,
                        paddingBottom: "16px",
                        marginBottom: "24px",
                        ...rule,
                      },
                      children: [
                        { type: "span", props: { children: tags || "ENSAIO" } },
                        { type: "span", props: { children: date } },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flex: 1,
                        alignItems: "flex-start",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              flex: 1,
                              flexDirection: "column",
                              paddingRight: avatar ? "32px" : "0px",
                            },
                            children: [
                              {
                                type: "p",
                                props: {
                                  style: {
                                    fontSize: title.length > 58 ? 50 : 60,
                                    fontWeight: 700,
                                    lineHeight: 1.16,
                                    margin: 0,
                                    marginBottom: "20px",
                                  },
                                  children: title,
                                },
                              },
                              {
                                type: "p",
                                props: {
                                  style: {
                                    fontSize: 24,
                                    lineHeight: 1.45,
                                    color: PALETTE.muted,
                                    margin: 0,
                                  },
                                  children: description,
                                },
                              },
                            ],
                          },
                        },
                        avatar
                          ? {
                              type: "div",
                              props: {
                                style: {
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  width: "240px",
                                },
                                children: [
                                  {
                                    type: "img",
                                    props: {
                                      src: avatar,
                                      width: 240,
                                      height: 240,
                                      style: {
                                        border: `3px solid ${PALETTE.ink}`,
                                        objectFit: "cover",
                                      },
                                    },
                                  },
                                  {
                                    type: "span",
                                    props: {
                                      style: {
                                        marginTop: "12px",
                                        fontSize: 17,
                                        letterSpacing: "0.06em",
                                        color: PALETTE.muted,
                                      },
                                      children: personaLabel.toUpperCase(),
                                    },
                                  },
                                ],
                              },
                            }
                          : null,
                      ].filter(Boolean),
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        paddingTop: "18px",
                        marginTop: "24px",
                        fontSize: 21,
                        ...{ borderTop: `1px solid ${PALETTE.rule}` },
                      },
                      children: [
                        {
                          type: "span",
                          props: {
                            style: { fontWeight: 700 },
                            children: SITE.title,
                          },
                        },
                        {
                          type: "span",
                          props: {
                            style: { color: PALETTE.muted },
                            children: `por ${post.data.author}`,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    { width: 1200, height: 630, embedFont: true, fonts }
  );
};
