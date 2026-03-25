import { useState, useEffect } from 'react';

export const useDarkMode = () => {
 const [isDark, setIsDark] = useState(() => {
 // Default to light mode. Only activate dark if user explicitly chose it.
 return localStorage.theme === 'dark';
 });

 useEffect(() => {
 document.documentElement.classList.toggle('dark', isDark);
 localStorage.theme = isDark ? 'dark' : 'light';
 }, [isDark]);

 return { isDark, toggle: () => setIsDark(prev => !prev) };
};
