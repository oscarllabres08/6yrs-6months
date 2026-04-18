import { useState, useEffect } from 'react';

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export function useLiveCounter(startDate: Date): TimeElapsed {
  const calculate = (): TimeElapsed => {
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();

    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalSeconds = Math.floor(diff / 1000);

    const years = Math.floor(totalDays / 365);
    const remainingAfterYears = totalDays - years * 365;
    const months = Math.floor(remainingAfterYears / 30);
    const days = remainingAfterYears - months * 30;

    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { years, months, days, hours, minutes, seconds, totalDays };
  };

  const [elapsed, setElapsed] = useState<TimeElapsed>(calculate);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(calculate()), 1000);
    return () => clearInterval(timer);
  });

  return elapsed;
}
