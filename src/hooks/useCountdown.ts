import { useCallback, useEffect, useState } from 'react';

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const useCountdown = (initialSeconds: number) => {
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

  const reset = useCallback((value: number = initialSeconds) => {
    setSeconds(value);
  }, [initialSeconds]);

  return {
    seconds,
    formatted: formatTime(seconds),
    reset,
    isExpired: seconds <= 0,
  };
};
