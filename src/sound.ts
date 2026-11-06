export interface Sound {
  unlock(): void;
  correct(): void;
  wrong(): void;
  finish(): void;
  isMuted(): boolean;
  toggleMuted(): boolean;
}

interface Note {
  freq: number;
  start: number;
  dur: number;
}

const MUTED_KEY = 'quiz-telas:muted';
const PEAK_GAIN = 0.25;
const ATTACK_S = 0.01;
const RELEASE_FLOOR = 0.0001;

type AudioContextCtor = typeof AudioContext;

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext ??
    null
  );
}

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTED_KEY) === '1';
  } catch {
    return false;
  }
}

function saveMuted(value: boolean): void {
  try {
    window.localStorage.setItem(MUTED_KEY, value ? '1' : '0');
  } catch {
    // localStorage indisponível (ex.: modo privado): ignora
  }
}

export function createSound(): Sound {
  const Ctor = getAudioContextCtor();
  let ctx: AudioContext | null = null;
  let muted = readMuted();

  function getContext(): AudioContext | null {
    if (!Ctor) return null;
    if (ctx) return ctx;
    try {
      ctx = new Ctor();
    } catch {
      ctx = null;
    }
    return ctx;
  }

  function playNotes(notes: Note[], type: OscillatorType): void {
    if (muted) return;
    try {
      const audio = getContext();
      if (!audio) return;
      if (audio.state === 'suspended') {
        audio.resume().catch(() => {});
      }
      const t0 = audio.currentTime;
      for (const note of notes) {
        const start = t0 + note.start;
        const end = start + note.dur;

        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(note.freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(PEAK_GAIN, start + ATTACK_S);
        gain.gain.exponentialRampToValueAtTime(RELEASE_FLOOR, end);

        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start(start);
        osc.stop(end + 0.02);
      }
    } catch {
      // Áudio nunca deve quebrar o quiz
    }
  }

  return {
    unlock(): void {
      try {
        const audio = getContext();
        if (!audio) return;
        if (audio.state === 'suspended') {
          audio.resume().catch(() => {});
        }
        // Oscilador silencioso de duração ~0 para destravar o áudio no iOS
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        gain.gain.setValueAtTime(0, audio.currentTime);
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start(audio.currentTime);
        osc.stop(audio.currentTime + 0.001);
      } catch {
        // ignora falhas de áudio
      }
    },

    correct(): void {
      playNotes(
        [
          { freq: 660, start: 0, dur: 0.12 },
          { freq: 990, start: 0.12, dur: 0.12 },
        ],
        'triangle',
      );
    },

    wrong(): void {
      playNotes(
        [
          { freq: 300, start: 0, dur: 0.15 },
          { freq: 220, start: 0.15, dur: 0.15 },
        ],
        'sine',
      );
    },

    finish(): void {
      playNotes(
        [
          { freq: 523.25, start: 0, dur: 0.1 },
          { freq: 659.25, start: 0.1, dur: 0.1 },
          { freq: 783.99, start: 0.2, dur: 0.1 },
          { freq: 1046.5, start: 0.3, dur: 0.1 },
        ],
        'triangle',
      );
    },

    isMuted(): boolean {
      return muted;
    },

    toggleMuted(): boolean {
      muted = !muted;
      saveMuted(muted);
      return muted;
    },
  };
}
