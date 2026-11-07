import '@fontsource/baloo-2/latin-500.css';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/latin-800.css';
import './style.css';

import { registerSW } from 'virtual:pwa-register';
import { AUTO_NEXT_MS, QUESTION_IDLE_MS, RESULT_IDLE_MS } from './config';
import { questions } from './data/questions';
import { icons } from './icons';
import { createIdleTimer } from './idle';
import { answer, initialState, isCorrectSelection, next, startQuiz, scoreBand } from './quiz';
import { createSound } from './sound';
import type { QuizState } from './types';
import { launchConfetti, renderProgress, renderQuestion, renderResult, renderStart } from './ui';

registerSW({ immediate: true });

function must<T>(value: T | null, what: string): T {
  if (value === null) throw new Error(`${what} não encontrado`);
  return value;
}

const app = must(document.querySelector<HTMLDivElement>('#app'), '#app');

app.innerHTML = `
  <span class="deco deco--wifi">${icons.wifi}</span>
  <span class="deco deco--atom">${icons.atom}</span>
  <span class="deco deco--laptop">${icons.laptop}</span>
  <span class="deco deco--phone">${icons.phone}</span>
  <header class="topbar">
    <div id="topbar-left"></div>
    <button class="icon-btn" id="mute" aria-label="Som"></button>
  </header>
  <main id="screen"></main>`;

const screenEl = must(app.querySelector<HTMLElement>('#screen'), '#screen');
const topLeft = must(app.querySelector<HTMLElement>('#topbar-left'), '#topbar-left');
const muteBtn = must(app.querySelector<HTMLButtonElement>('#mute'), '#mute');

const sound = createSound();
const idle = createIdleTimer(() => setState(initialState()));

let state: QuizState = initialState();
let renderedKey = '';
let autoNext: ReturnType<typeof setTimeout> | undefined;

function setState(nextState: QuizState): void {
  const prev = state;
  state = nextState;
  clearTimeout(autoNext);
  autoNext = undefined;
  if (state.screen === 'question' && state.selected !== null) {
    autoNext = setTimeout(() => setState(next(state)), AUTO_NEXT_MS);
  }
  render();
  if (prev.screen !== 'result' && state.screen === 'result') {
    sound.finish();
    if (scoreBand(state.score, state.round.length) === 'high') launchConfetti(app);
  }
}

function render(): void {
  const key = `${state.screen}:${state.index}`;
  const isNewView = key !== renderedKey;
  renderedKey = key;

  if (state.screen === 'start') {
    screenEl.innerHTML = renderStart();
    topLeft.innerHTML = `<span class="brand-pill"><span class="ico">${icons.wifi}</span>Feira do Conhecimento</span>`;
    idle.stop();
  } else if (state.screen === 'question') {
    screenEl.innerHTML = renderQuestion(state);
    topLeft.innerHTML = renderProgress(state);
    if (isNewView) idle.start(QUESTION_IDLE_MS);
  } else {
    screenEl.innerHTML = renderResult(state, RESULT_IDLE_MS);
    topLeft.innerHTML = `<span class="brand-pill"><span class="ico">${icons.wifi}</span>Telas em Números</span>`;
    if (isNewView) idle.start(RESULT_IDLE_MS);
  }

  // Só anima a entrada quando muda de tela/pergunta (não ao responder).
  const section = screenEl.firstElementChild;
  if (isNewView && section) section.classList.add('enter');

  if (isNewView) {
    screenEl.scrollTop = 0;
  } else if (state.screen === 'question' && state.selected !== null) {
    // Respondeu: garante que o botão "Próxima" fique visível em telas baixas.
    screenEl
      .querySelector('[data-action="next"]')
      ?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }
}

function renderMute(): void {
  const muted = sound.isMuted();
  muteBtn.innerHTML = muted ? icons.soundOff : icons.soundOn;
  muteBtn.setAttribute('aria-label', muted ? 'Ligar som' : 'Desligar som');
  muteBtn.setAttribute('aria-pressed', String(muted));
}

screenEl.addEventListener('click', (event) => {
  const target = (event.target as Element).closest<HTMLElement>('[data-action]');
  if (!target) return;

  switch (target.dataset.action) {
    case 'start':
      sound.unlock();
      setState(startQuiz(questions));
      break;
    case 'answer': {
      const nextState = answer(state, Number(target.dataset.index));
      if (nextState === state) return;
      setState(nextState);
      if (isCorrectSelection(state)) sound.correct();
      else sound.wrong();
      break;
    }
    case 'next':
      setState(next(state));
      break;
    case 'restart':
      sound.unlock();
      setState(startQuiz(questions));
      break;
  }
});

muteBtn.addEventListener('click', () => {
  sound.toggleMuted();
  sound.unlock();
  renderMute();
});

// Qualquer toque conta como atividade: adia a volta automática ao início.
document.addEventListener(
  'pointerdown',
  () => {
    if (!idle.isRunning()) return;
    idle.reset();
    // Reinicia a barrinha de contagem regressiva da tela de resultado.
    const bar = screenEl.querySelector<HTMLElement>('.result__auto i');
    if (bar) {
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
    }
  },
  { passive: true },
);

// Evita menu de contexto / zoom por gesto em toque longo (modo estande).
document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('gesturestart', (event) => event.preventDefault());

renderMute();
render();
