import { useEffect, useRef } from 'react';

type DebounceFn<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): DebounceFn<T> {
  const timerRef = useRef<number | null>(null);

  const debounceFn = useRef<DebounceFn<T>>((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  });

  useEffect(() => {
    debounceFn.current = (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }, [callback, delay]);

  return debounceFn.current;
}

export default useDebounce;
