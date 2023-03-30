import { RefObject, useEffect, useRef } from 'react';

function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onOutsideClick: (event: MouseEvent) => void,
): void {
  const savedCallback = useRef(onOutsideClick);

  useEffect(() => {
    savedCallback.current = onOutsideClick;
  }, [onOutsideClick]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        savedCallback.current(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideClick;
