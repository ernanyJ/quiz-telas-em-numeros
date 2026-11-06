import { describe, it, expect } from 'vitest';
import { questions } from './data/questions';
import {
  answer,
  currentQuestion,
  initialState,
  isCorrectSelection,
  next,
  scoreBand,
  shuffle,
  starsFor,
  startQuiz,
} from './quiz';

/** RNG determinístico simples (LCG). */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function correctIdx(state: ReturnType<typeof startQuiz>): number {
  return (currentQuestion(state)?.options ?? []).findIndex((o) => o.correct);
}

function wrongIdx(state: ReturnType<typeof startQuiz>): number {
  return (currentQuestion(state)?.options ?? []).findIndex((o) => !o.correct);
}

describe('shuffle', () => {
  it('mantém os mesmos elementos e não muta a entrada', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const copy = [...input];
    const out = shuffle(input, seeded(1));
    expect(input).toEqual(copy);
    expect(out).not.toBe(input);
    expect([...out].sort()).toEqual(copy);
  });

  it('é determinístico com rng fixo', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(shuffle(input, seeded(42))).toEqual(shuffle(input, seeded(42)));
  });
});

describe('initialState', () => {
  it('começa na tela inicial', () => {
    expect(initialState()).toEqual({
      screen: 'start',
      round: [],
      index: 0,
      score: 0,
      selected: null,
    });
  });
});

describe('startQuiz', () => {
  const state = startQuiz(questions, seeded(7));

  it('cria 10 perguntas na ordem original', () => {
    expect(state.screen).toBe('question');
    expect(state.round).toHaveLength(10);
    expect(state.round.map((r) => r.question.id)).toEqual(questions.map((q) => q.id));
    expect(state.index).toBe(0);
    expect(state.score).toBe(0);
    expect(state.selected).toBeNull();
  });

  it('cada pergunta tem exatamente uma opção correta, igual a options[correctIndex]', () => {
    for (const rq of state.round) {
      const corrects = rq.options.filter((o) => o.correct);
      expect(corrects).toHaveLength(1);
      expect(corrects[0]?.text).toBe(rq.question.options[rq.question.correctIndex]);
      expect(rq.options).toHaveLength(rq.question.options.length);
    }
  });
});

describe('answer', () => {
  it('resposta correta soma 1', () => {
    const s = startQuiz(questions, seeded(1));
    const idx = correctIdx(s);
    const after = answer(s, idx);
    expect(after.score).toBe(1);
    expect(after.selected).toBe(idx);
    expect(isCorrectSelection(after)).toBe(true);
  });

  it('resposta errada não soma', () => {
    const s = startQuiz(questions, seeded(1));
    const idx = wrongIdx(s);
    const after = answer(s, idx);
    expect(after.score).toBe(0);
    expect(after.selected).toBe(idx);
    expect(isCorrectSelection(after)).toBe(false);
  });

  it('responder duas vezes não muda nada', () => {
    const s = startQuiz(questions, seeded(1));
    const once = answer(s, correctIdx(s));
    const twice = answer(once, wrongIdx(s));
    expect(twice).toBe(once);
  });

  it('índice fora do intervalo é no-op', () => {
    const s = startQuiz(questions, seeded(1));
    expect(answer(s, -1)).toBe(s);
    expect(answer(s, 99)).toBe(s);
  });

  it('fora da tela de pergunta é no-op', () => {
    const s = initialState();
    expect(answer(s, 0)).toBe(s);
  });
});

describe('next', () => {
  it('sem responder é no-op', () => {
    const s = startQuiz(questions, seeded(1));
    expect(next(s)).toBe(s);
  });

  it('avança para a próxima pergunta e limpa a seleção', () => {
    const s = answer(startQuiz(questions, seeded(1)), 0);
    const n = next(s);
    expect(n.index).toBe(1);
    expect(n.selected).toBeNull();
    expect(n.screen).toBe('question');
  });

  it('percorrer as 10 acertando termina em result com score 10', () => {
    let s = startQuiz(questions, seeded(3));
    for (let i = 0; i < 10; i++) {
      s = next(answer(s, correctIdx(s)));
    }
    expect(s.screen).toBe('result');
    expect(s.score).toBe(10);
    expect(s.round).toHaveLength(10);
  });
});

describe('scoreBand', () => {
  it('respeita os limites com total 10', () => {
    expect(scoreBand(0, 10)).toBe('low');
    expect(scoreBand(4, 10)).toBe('low');
    expect(scoreBand(5, 10)).toBe('mid');
    expect(scoreBand(7, 10)).toBe('mid');
    expect(scoreBand(8, 10)).toBe('high');
    expect(scoreBand(10, 10)).toBe('high');
  });

  it('total 0 é low', () => {
    expect(scoreBand(0, 0)).toBe('low');
  });
});

describe('starsFor', () => {
  it('calcula estrelas de 0 a 5', () => {
    expect(starsFor(0, 10)).toBe(0);
    expect(starsFor(10, 10)).toBe(5);
    expect(starsFor(5, 10)).toBe(Math.round(2.5));
    expect(starsFor(0, 0)).toBe(0);
  });
});

describe('imutabilidade', () => {
  it('as funções não mutam o estado de entrada', () => {
    const s = startQuiz(questions, seeded(5));
    const snapshot = structuredClone(s);
    const answered = answer(s, correctIdx(s));
    expect(s).toEqual(snapshot);
    const answeredSnapshot = structuredClone(answered);
    next(answered);
    expect(answered).toEqual(answeredSnapshot);
  });
});
