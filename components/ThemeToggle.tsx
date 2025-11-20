import React, { useEffect, useState } from 'react';

const getInitialTheme = (): boolean => {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
  } catch {}
  return true; // défaut sombre si rien n'est sauvegardé
};

const applyTheme = (dark: boolean) => {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
};

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    applyTheme(dark);
    // Retire la classe de transition après l'application
    try {
      const root = document.documentElement;
      setTimeout(() => root.classList.remove('theme-transition'), 320);
    } catch {}
  }, [dark]);

  const toggle = () => {
    try {
      const root = document.documentElement;
      root.classList.add('theme-transition');
    } catch {}
    setDark((d) => !d);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Passer en theme clair' : 'Passer en theme sombre'}
      className="px-3 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
      title={dark ? 'Passer en thème clair' : 'Passer en thème sombre'}
    >
      <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'}`}></i>
      <span className="hidden md:inline">{dark ? 'Clair' : 'Sombre'}</span>
    </button>
  );
};

export default ThemeToggle;
