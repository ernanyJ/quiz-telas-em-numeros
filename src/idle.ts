export interface IdleTimer {
  /** (Re)inicia a contagem com este timeout, substituindo qualquer contagem anterior. */
  start(timeoutMs: number): void;
  /** Se estiver rodando, recomeça a contagem do zero com o último timeout. Se parado, não faz nada. */
  reset(): void;
  /** Cancela a contagem. */
  stop(): void;
  isRunning(): boolean;
}

export function createIdleTimer(onIdle: () => void): IdleTimer {
  let handle: ReturnType<typeof setTimeout> | undefined;
  let lastTimeout = 0;

  const clear = (): void => {
    if (handle !== undefined) {
      clearTimeout(handle);
      handle = undefined;
    }
  };

  const start = (timeoutMs: number): void => {
    clear();
    lastTimeout = timeoutMs;
    handle = setTimeout(() => {
      handle = undefined;
      onIdle();
    }, timeoutMs);
  };

  return {
    start,
    reset() {
      if (handle !== undefined) start(lastTimeout);
    },
    stop: clear,
    isRunning: () => handle !== undefined,
  };
}
