import { useCallback, useEffect, useState } from 'react';

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

type UseCountdownReturn = {
  readonly seconds: number;
  readonly formatted: string;
  readonly isExpired: boolean;
  /** Resets the countdown to `value` (defaults to the initial seconds). */
  readonly reset: (value?: number) => void;
};

export const useCountdown = (initialSeconds: number): UseCountdownReturn => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const reset = useCallback((value: number = initialSeconds): void => {
    setSeconds(value);
  }, [initialSeconds]);

  return {
    seconds,
    formatted: formatTime(seconds),
    reset,
    isExpired: seconds <= 0,
  };
};
