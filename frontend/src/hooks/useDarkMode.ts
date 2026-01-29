import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(prev => !prev) };
};