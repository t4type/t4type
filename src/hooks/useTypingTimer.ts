import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTypingTimerOptions {
  isCountdown: boolean;
  durationSeconds: number;
  onExpire?: () => void;
}

export function useTypingTimer({
  isCountdown,
  durationSeconds,
  onExpire,
}: UseTypingTimerOptions) {
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startTimestampRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const expiredFiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning && startTimestampRef.current === null) {
      setRemainingSeconds(durationSeconds);
    }
  }, [durationSeconds, isRunning]);

  const start = useCallback(() => {
    if (intervalRef.current !== null || startTimestampRef.current !== null) {
      return;
    }

    const now = Date.now();
    startTimestampRef.current = now;
    expiredFiredRef.current = false;
    setIsRunning(true);

    intervalRef.current = window.setInterval(() => {
      if (startTimestampRef.current === null) return;

      const elapsedMs = Date.now() - startTimestampRef.current;
      const elapsed = elapsedMs / 1000;

      if (isCountdown) {
        const totalMs = durationSeconds * 1000;
        const remainingMs = totalMs - elapsedMs;
        const remaining = Math.max(0, Math.ceil(remainingMs / 1000));

        setRemainingSeconds(remaining);
        setElapsedSeconds(Math.min(durationSeconds, elapsed));

        if (remainingMs <= 0 && !expiredFiredRef.current) {
          expiredFiredRef.current = true;
          clearTimerInterval();
          setIsRunning(false);
          setRemainingSeconds(0);
          setElapsedSeconds(durationSeconds);
          onExpireRef.current?.();
        }
      } else {
        setElapsedSeconds(elapsed);
      }
    }, 100);
  }, [isCountdown, durationSeconds, clearTimerInterval]);

  const stop = useCallback((): number => {
    clearTimerInterval();
    setIsRunning(false);

    let finalElapsed = elapsedSeconds;
    if (startTimestampRef.current !== null) {
      const exactElapsed = (Date.now() - startTimestampRef.current) / 1000;
      finalElapsed = isCountdown
        ? Math.min(durationSeconds, exactElapsed)
        : exactElapsed;
      setElapsedSeconds(finalElapsed);
    }

    return finalElapsed;
  }, [clearTimerInterval, elapsedSeconds, isCountdown, durationSeconds]);

  const reset = useCallback(
    (nextDuration?: number) => {
      clearTimerInterval();
      startTimestampRef.current = null;
      expiredFiredRef.current = false;
      setIsRunning(false);
      setElapsedSeconds(0);
      setRemainingSeconds(nextDuration ?? durationSeconds);
    },
    [clearTimerInterval, durationSeconds]
  );

  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  return {
    isRunning,
    remainingSeconds,
    elapsedSeconds,
    start,
    stop,
    reset,
  };
}
