/**
 * Player de áudio único do blog.
 *
 * Um só <audio> para o site inteiro, criado fora do DOM da página. Como o
 * elemento não pertence ao conteúdo trocado pelo ClientRouter, o áudio
 * continua tocando quando o leitor navega para outro post — e o mini-player
 * fixo mostra o que está no ar, com controle de pausa e fechar.
 *
 * API em window.HermesAudio:
 *   play({ src, title, persona, avatar })  troca a faixa e toca
 *   toggle()  pausa/retoma
 *   stop()    para e limpa
 *   attach(playerEl)  liga um card .persona a este player
 *   subscribe(fn)     recebe o estado atual e as mudanças
 */

const AUDIO = new Audio();
AUDIO.preload = "none";

let current = null;
let ui = null;
const listeners = new Set();
/** Cancelamentos das assinaturas dos cards da página atual. */
const unsubs = new Set();

function emit() {
  const snapshot = {
    src: current?.src ?? null,
    title: current?.title ?? "",
    persona: current?.persona ?? "",
    avatar: current?.avatar ?? "",
    playing: !AUDIO.paused && !AUDIO.ended,
    time: AUDIO.currentTime || 0,
    duration: AUDIO.duration || 0,
  };
  listeners.forEach(fn => fn(snapshot));
  if (ui) render(snapshot);
  return snapshot;
}

function buildUi() {
  const el = document.createElement("div");
  el.id = "mini-player";
  el.className = "mini-player";
  el.hidden = true;
  el.setAttribute("data-pagefind-ignore", "");
  el.innerHTML = `
    <img class="mini-avatar" alt="" width="44" height="44" />
    <div class="mini-text">
      <a class="mini-title" href="#"></a>
      <span class="mini-persona"></span>
    </div>
    <button class="mini-toggle" type="button" aria-label="Pausar"></button>
    <button class="mini-close" type="button" aria-label="Fechar o player">✕</button>
    <div class="mini-progress" aria-hidden="true"><span></span></div>
  `;
  el.querySelector(".mini-toggle").addEventListener("click", () => toggle());
  el.querySelector(".mini-close").addEventListener("click", () => stop());
  document.body.appendChild(el);
  return el;
}

function render(state) {
  if (!ui) return;
  if (!state.src) {
    ui.hidden = true;
    return;
  }
  ui.hidden = false;
  const img = ui.querySelector(".mini-avatar");
  if (state.avatar) {
    img.src = state.avatar;
    img.hidden = false;
  } else {
    img.removeAttribute("src");
    img.hidden = true;
  }
  ui.querySelector(".mini-title").textContent = state.title || "Comentário em áudio";
  ui.querySelector(".mini-persona").textContent = state.persona
    ? `${state.persona} · ${state.playing ? "tocando" : "pausado"}`
    : state.playing
      ? "tocando"
      : "pausado";
  const toggle = ui.querySelector(".mini-toggle");
  toggle.textContent = state.playing ? "❚❚" : "▶";
  toggle.setAttribute("aria-label", state.playing ? "Pausar" : "Retomar");
  const bar = ui.querySelector(".mini-progress span");
  const pct = state.duration ? (state.time / state.duration) * 100 : 0;
  bar.style.width = `${pct}%`;
}

function ensureUi() {
  if (!ui || !ui.isConnected) ui = buildUi();
  return ui;
}

function play(meta) {
  ensureUi();
  const same = current && current.src === meta.src;
  if (!same) {
    current = meta;
    AUDIO.src = meta.src;
    AUDIO.currentTime = 0;
  }
  AUDIO.play().catch(() => {
    stop();
  });
  emit();
}

function toggle() {
  if (!current) return;
  if (AUDIO.paused) {
    AUDIO.play().catch(() => stop());
  } else {
    AUDIO.pause();
  }
  emit();
}

function stop() {
  AUDIO.pause();
  AUDIO.removeAttribute("src");
  AUDIO.load();
  current = null;
  emit();
}

AUDIO.addEventListener("timeupdate", emit);
AUDIO.addEventListener("play", emit);
AUDIO.addEventListener("pause", emit);
AUDIO.addEventListener("ended", () => stop());

/* O ClientRouter troca o conteúdo do body; o player volta na nova página. */

const HermesAudio = {
  play,
  toggle,
  stop,
  subscribe(fn) {
    listeners.add(fn);
    fn(emit());
    return () => listeners.delete(fn);
  },
  /**
   * Liga um card .persona ao player global.
   * Duplo toque toca; toque durante a reprodução para; teclado alterna.
   */
  attach(player) {
    if (!player || player.dataset.playerBound === "true") return;
    player.dataset.playerBound = "true";

    const button = player.querySelector(".persona-avatar");
    const hint = player.querySelector(".persona-hint");
    const bar = player.querySelector(".persona-progress span");
    const img = player.querySelector(".persona-avatar img");
    const defaultHint = hint?.textContent ?? "";
    const meta = {
      src: player.dataset.audio,
      title: (document.title || "").split("|")[0].trim(),
      persona: player.querySelector(".persona-name")?.textContent?.trim() || "",
      avatar: img?.getAttribute("src") || "",
    };
    let lastTapAt = 0;

    const cancel = HermesAudio.subscribe(state => {
      const active = state.src === meta.src;
      player.classList.toggle("is-playing", active && state.playing);
      button?.setAttribute("aria-pressed", active && state.playing ? "true" : "false");
      if (hint) {
        hint.textContent = active && state.playing
          ? "Tocando. Toque para parar."
          : active
            ? "Pausado. Toque para retomar."
            : defaultHint;
      }
      if (bar) {
        const pct = active && state.duration ? (state.time / state.duration) * 100 : 0;
        bar.style.width = `${pct}%`;
      }
    });
    unsubs.add(cancel);

    button?.addEventListener("click", event => {
      const state = emit();
      // Teclado: ativação com detail 0 alterna direto.
      if (event.detail === 0) {
        if (state.src === meta.src && state.playing) HermesAudio.stop();
        else HermesAudio.play(meta);
        return;
      }
      if (state.src === meta.src && state.playing) {
        HermesAudio.stop();
        lastTapAt = 0;
        return;
      }
      const now = Date.now();
      if (now - lastTapAt < 450) {
        HermesAudio.play(meta);
        lastTapAt = 0;
      } else {
        lastTapAt = now;
      }
    });
  },
};

window.HermesAudio = HermesAudio;
/* Exposto para depuração e para testes de ponta a ponta. */
window.__hermesAudioEl = AUDIO;

/* Liga os cards da página atual e de cada página que o ClientRouter montar. */
function attachAll() {
  document.querySelectorAll(".persona").forEach(player => HermesAudio.attach(player));
}

document.addEventListener("astro:page-load", attachAll);
document.addEventListener("astro:before-swap", () => {
  unsubs.forEach(fn => fn());
  unsubs.clear();
});
document.addEventListener("astro:after-swap", () => {
  ui = null;
  if (current) {
    ensureUi();
    emit();
  }
  attachAll();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attachAll);
} else {
  attachAll();
}
