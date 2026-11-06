export interface Question {
  id: number;
  prompt: string;
  /** Alternativas na ordem "canônica"; o app embaralha a cada partida. */
  options: string[];
  /** Índice da alternativa correta em `options`. */
  correctIndex: number;
  /** Curiosidade mostrada após responder ("Você sabia?"). */
  fact: string;
}

export type Screen = 'start' | 'question' | 'result';

export interface RoundOption {
  text: string;
  correct: boolean;
}

export interface RoundQuestion {
  question: Question;
  /** Alternativas já embaralhadas para esta partida. */
  options: RoundOption[];
}

export interface QuizState {
  screen: Screen;
  round: RoundQuestion[];
  /** Índice da pergunta atual em `round`. */
  index: number;
  score: number;
  /** Índice (em `round[index].options`) da alternativa escolhida; null = ainda não respondeu. */
  selected: number | null;
}

/** Faixa de desempenho: low = 0–4, mid = 5–7, high = 8–10 (proporcional ao total). */
export type ScoreBand = 'low' | 'mid' | 'high';
