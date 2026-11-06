import type { Question, QuizState, RoundQuestion, ScoreBand } from './types';

/** Fisher–Yates; retorna uma cópia embaralhada sem mutar a entrada. */
export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const a = result[i] as T;
    const b = result[j] as T;
    result[i] = b;
    result[j] = a;
  }
  return result;
}

export function initialState(): QuizState {
  return { screen: 'start', round: [], index: 0, score: 0, selected: null };
}

export function startQuiz(
  questions: readonly Question[],
  rng: () => number = Math.random,
): QuizState {
  const round: RoundQuestion[] = questions.map((question) => ({
    question,
    options: shuffle(
      question.options.map((text, i) => ({ text, correct: i === question.correctIndex })),
      rng,
    ),
  }));
  return { screen: 'question', round, index: 0, score: 0, selected: null };
}

export function currentQuestion(state: QuizState): RoundQuestion | undefined {
  return state.round[state.index];
}

export function answer(state: QuizState, optionIndex: number): QuizState {
  if (state.screen !== 'question' || state.selected !== null) return state;
  const option = currentQuestion(state)?.options[optionIndex];
  if (!option) return state;
  return {
    ...state,
    selected: optionIndex,
    score: state.score + (option.correct ? 1 : 0),
  };
}

export function next(state: QuizState): QuizState {
  if (state.screen !== 'question' || state.selected === null) return state;
  if (state.index >= state.round.length - 1) {
    return { ...state, screen: 'result' };
  }
  return { ...state, index: state.index + 1, selected: null };
}

export function isCorrectSelection(state: QuizState): boolean {
  if (state.selected === null) return false;
  return currentQuestion(state)?.options[state.selected]?.correct === true;
}

export function scoreBand(score: number, total: number): ScoreBand {
  if (total === 0) return 'low';
  const ratio = score / total;
  if (ratio < 0.5) return 'low';
  if (ratio < 0.8) return 'mid';
  return 'high';
}

export function starsFor(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 5);
}
