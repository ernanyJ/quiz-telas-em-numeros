import { icons } from './icons';
import { currentQuestion, isCorrectSelection, scoreBand, starsFor } from './quiz';
import type { QuizState, ScoreBand } from './types';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const MESSAGES: Record<ScoreBand, string> = {
  high: 'Incrível! Você é fera em telas e números!',
  mid: 'Muito bem! Você sabe bastante sobre telas!',
  low: 'Boa tentativa! Que tal jogar de novo e aprender mais?',
};

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderStart(): string {
  return `
    <section class="start">
      <div class="banner">
        <span class="banner__atom">${icons.atom}</span>
        <span class="banner__bulb">${icons.bulb}</span>
        <h1>Feira do <span>Conhecimento</span></h1>
        <div class="title-pill">Telas em Números</div>
        <p class="tagline">Conectando ideias, explorando o mundo digital!</p>
      </div>
      <div class="start__cta">
        <button class="btn btn--big" data-action="start">Começar</button>
        <p class="start__hint">10 perguntas · toque para jogar</p>
        <div class="qr card">
          <img src="${import.meta.env.BASE_URL}qrcode.svg" alt="QR code para quiz.jogaro.com.br" />
          <p><strong>Jogue no seu celular!</strong><span>quiz.jogaro.com.br</span></p>
        </div>
      </div>
    </section>`;
}

export function renderProgress(state: QuizState): string {
  const total = state.round.length;
  const bars = state.round
    .map((_, i) => {
      const cls = i < state.index ? 'done' : i === state.index ? 'current' : '';
      return `<i class="${cls}"></i>`;
    })
    .join('');
  return `
    <div class="progress" aria-label="Pergunta ${state.index + 1} de ${total}">
      <span class="progress__label">Pergunta ${state.index + 1} de ${total}</span>
      <div class="progress__bar" style="--total:${total}">${bars}</div>
    </div>`;
}

export function renderQuestion(state: QuizState): string {
  const rq = currentQuestion(state);
  if (!rq) return '';
  const answered = state.selected !== null;
  const isLast = state.index === state.round.length - 1;

  const options = rq.options
    .map((opt, i) => {
      let cls = '';
      let mark = '';
      if (answered) {
        if (opt.correct) {
          cls = 'is-correct';
          mark = icons.check;
        } else if (i === state.selected) {
          cls = 'is-wrong';
          mark = icons.cross;
        } else {
          cls = 'is-dim';
        }
      }
      return `
        <button class="option ${cls}" data-action="answer" data-index="${i}" ${answered ? 'disabled' : ''}>
          <span class="option__letter">${LETTERS[i] ?? i + 1}</span>
          <span class="option__text">${escapeHtml(opt.text)}</span>
          ${mark ? `<span class="option__mark">${mark}</span>` : ''}
        </button>`;
    })
    .join('');

  let feedback = '';
  if (answered) {
    const ok = isCorrectSelection(state);
    feedback = `
      <div class="feedback" aria-live="polite">
        <p class="verdict ${ok ? 'verdict--ok' : 'verdict--no'}">
          <span class="ico">${ok ? icons.check : icons.cross}</span>
          <span>${ok ? 'Acertou! Mandou bem!' : 'Quase! A resposta certa está em verde.'}</span>
        </p>
        <div class="fact">
          <span class="fact__star">${icons.star}</span>
          <div>
            <h3>Você sabia?</h3>
            <p>${escapeHtml(rq.question.fact)}</p>
          </div>
        </div>
        <button class="btn" data-action="next">${isLast ? 'Ver resultado' : 'Próxima'} →</button>
      </div>`;
  }

  return `
    <section class="quiz">
      <div class="prompt card">
        <span class="prompt__num">${state.index + 1}</span>
        <h2>${escapeHtml(rq.question.prompt)}</h2>
      </div>
      <div class="options">${options}</div>
      ${feedback}
    </section>`;
}

export function renderResult(state: QuizState, autoResetMs: number): string {
  const total = state.round.length;
  const stars = starsFor(state.score, total);
  const starHtml = Array.from(
    { length: 5 },
    (_, i) =>
      `<span class="${i < stars ? 'on' : ''}" style="animation-delay:${400 + i * 150}ms">${icons.star}</span>`,
  ).join('');
  return `
    <section class="result">
      <div class="result__card card">
        <p class="result__thanks">Obrigada por participar!</p>
        <p class="score">
          <span class="score__value">${state.score}</span>
          <span class="score__total">de ${total} acertos</span>
        </p>
        <div class="stars" aria-label="${stars} de 5 estrelas">${starHtml}</div>
        <p class="result__msg">${MESSAGES[scoreBand(state.score, total)]}</p>
        <button class="btn btn--big" data-action="restart">Jogar de novo</button>
        <div class="result__auto" style="--auto-ms:${autoResetMs}ms" aria-hidden="true"><i></i></div>
      </div>
    </section>`;
}

const CONFETTI_COLORS = ['#ffc83d', '#4b8bff', '#bfd7ff', '#ffffff', '#1fa463', '#ff7ab6'];

/** Cria uma chuva de confete que se remove sozinha. */
export function launchConfetti(host: HTMLElement, pieces = 90): void {
  const layer = document.createElement('div');
  layer.className = 'confetti';
  for (let i = 0; i < pieces; i++) {
    const p = document.createElement('i');
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#ffc83d';
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = color;
    p.style.animationDuration = `${2.4 + Math.random() * 2}s`;
    p.style.animationDelay = `${Math.random() * 0.8}s`;
    p.style.setProperty('--dx', `${(Math.random() - 0.5) * 30}vw`);
    p.style.setProperty('--rot', `${360 + Math.random() * 720}deg`);
    layer.appendChild(p);
  }
  host.appendChild(layer);
  window.setTimeout(() => layer.remove(), 5500);
}
