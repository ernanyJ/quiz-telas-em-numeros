import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createIdleTimer } from './idle';

describe('createIdleTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('dispara após o timeout e só uma vez', () => {
    const onIdle = vi.fn();
    const idle = createIdleTimer(onIdle);
    idle.start(1000);
    vi.advanceTimersByTime(1000);
    expect(onIdle).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(10_000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('não dispara antes do timeout', () => {
    const onIdle = vi.fn();
    const idle = createIdleTimer(onIdle);
    idle.start(1000);
    vi.advanceTimersByTime(999);
    expect(onIdle).not.toHaveBeenCalled();
  });

  it('reset adia o disparo', () => {
    const onIdle = vi.fn();
    const idle = createIdleTimer(onIdle);
    idle.start(1000);
    vi.advanceTimersByTime(600);
    idle.reset();
    vi.advanceTimersByTime(600);
    expect(onIdle).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('reset com timer parado não inicia', () => {
    const onIdle = vi.fn();
    const idle = createIdleTimer(onIdle);
    idle.reset();
    expect(idle.isRunning()).toBe(false);
    vi.advanceTimersByTime(100_000);
    expect(onIdle).not.toHaveBeenCalled();
  });

  it('stop cancela a contagem', () => {
    const onIdle = vi.fn();
    const idle = createIdleTimer(onIdle);
    idle.start(1000);
    idle.stop();
    vi.advanceTimersByTime(5000);
    expect(onIdle).not.toHaveBeenCalled();
    expect(idle.isRunning()).toBe(false);
  });

  it('start substitui o timeout anterior', () => {
    const onIdle = vi.fn();
    const idle = createIdleTimer(onIdle);
    idle.start(1000);
    idle.start(5000);
    vi.advanceTimersByTime(1000);
    expect(onIdle).not.toHaveBeenCalled();
    vi.advanceTimersByTime(4000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('isRunning reflete o estado', () => {
    const idle = createIdleTimer(() => undefined);
    expect(idle.isRunning()).toBe(false);
    idle.start(1000);
    expect(idle.isRunning()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(idle.isRunning()).toBe(false);
  });

  it('onIdle pode chamar start() novamente', () => {
    let count = 0;
    const idle = createIdleTimer(() => {
      count += 1;
      if (count === 1) idle.start(500);
    });
    idle.start(1000);
    vi.advanceTimersByTime(1000);
    expect(count).toBe(1);
    expect(idle.isRunning()).toBe(true);
    vi.advanceTimersByTime(500);
    expect(count).toBe(2);
    expect(idle.isRunning()).toBe(false);
  });
});
