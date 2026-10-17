import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('drivora_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('drivora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
      aria-label="Toggle visual theme"
      style={{
        borderRadius: 'var(--radius-full)',
        padding: '0.55rem',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {theme === 'light' ? (
        <Moon size={18} style={{ color: 'var(--color-deep-forest-teal)' }} />
      ) : (
        <Sun size={18} style={{ color: 'var(--color-champagne-gold)' }} />
      )}
    </button>
  );
}
