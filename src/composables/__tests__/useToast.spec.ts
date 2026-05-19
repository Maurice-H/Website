import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clear any leftover toasts from other tests
    const { toasts } = useToast();
    toasts.value = [];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a toast via show()', () => {
    const { toasts, show } = useToast();

    show('Test message', 'success');

    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0].message).toBe('Test message');
    expect(toasts.value[0].type).toBe('success');
  });

  it('defaults to info type when none specified', () => {
    const { toasts, show } = useToast();

    show('Info message');

    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0].type).toBe('info');
  });

  it('auto-removes toast after duration', () => {
    const { toasts, show } = useToast();

    show('Temporary', 'success', 2000);

    expect(toasts.value).toHaveLength(1);

    vi.advanceTimersByTime(2000);

    expect(toasts.value).toHaveLength(0);
  });

  it('auto-removes toast after default 3000ms duration', () => {
    const { toasts, show } = useToast();

    show('Default duration', 'error');

    expect(toasts.value).toHaveLength(1);

    vi.advanceTimersByTime(3000);

    expect(toasts.value).toHaveLength(0);
  });

  it('handles multiple toasts independently', () => {
    const { toasts, show } = useToast();

    show('First', 'success', 1000);
    show('Second', 'error', 3000);

    expect(toasts.value).toHaveLength(2);

    vi.advanceTimersByTime(1000);
    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0].message).toBe('Second');

    vi.advanceTimersByTime(2000);
    expect(toasts.value).toHaveLength(0);
  });

  it('assigns unique IDs to each toast', () => {
    const { toasts, show } = useToast();

    show('A', 'info');
    show('B', 'info');

    expect(toasts.value[0].id).not.toBe(toasts.value[1].id);
  });

  it('clears all toasts including their timeouts', () => {
    const { toasts, show, clearAll } = useToast();
    show('A', 'success');
    show('B', 'info');

    expect(toasts.value).toHaveLength(2);

    clearAll();

    expect(toasts.value).toHaveLength(0);

    // Advance timers to ensure timeouts were cleared
    vi.advanceTimersByTime(3000);
  });
});
