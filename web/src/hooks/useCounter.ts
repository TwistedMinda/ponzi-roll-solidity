import { useEffect, useRef, useState } from 'react';
import { useRoundInfo } from 'hooks/useRoundInfo';
import { addMinutes, intervalToDuration } from 'date-fns';
import { TIME_PER_ROUND } from 'constants/constants';

const add0 = (n?: number) => {
  if (!n) return '00';
  if (n < 10) return `0${n}`;
  return n;
};

const renderTime = (start: number) => {
  const end = addMinutes(start, TIME_PER_ROUND / 60 / 1000);
  if (Date.now() > end.getTime()) return '0 Days 00:00:00';
  const interval = { start: Date.now(), end: end };
  const parts = intervalToDuration(interval);
  return `${parts.days} Days ${add0(parts.hours)}:${add0(parts.minutes)}:${add0(
    parts.seconds
  )}`;
};

const useCounter = () => {
  const { lastRound } = useRoundInfo();
  const timestamp = lastRound ? lastRound.timestamp * 1000 : 0;
  const isEnded = Date.now() - timestamp > TIME_PER_ROUND;
  const [remaining, setRemaining] = useState(renderTime(timestamp));
  const ref = useRef<any>(undefined);

  useEffect(() => {
    if (ref.current) clearInterval(ref.current);
    ref.current = setInterval(() => {
      setRemaining(renderTime(timestamp));
    }, 1000);
  }, [timestamp]);

  useEffect(() => {
    return () => clearInterval(ref.current);
  }, []);

  return {
    remaining,
    isEnded
  };
};

export default useCounter;
