import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

export function useWindowDimension() {
  const [dimension, setDimension] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  const debounce = useDebounce()
  useEffect(() => {
    const debouncedResizeHandler = debounce(() => {
      setDimension([window.innerWidth, window.innerHeight]);
    }, 100); // will work after 100ms
    window.addEventListener('resize', debouncedResizeHandler);
    return () => window.removeEventListener('resize', debouncedResizeHandler);
  }, [debounce]); // Note this empty array. this effect should run only on mount and unmount
  return dimension;
}