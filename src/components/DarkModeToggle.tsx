// src/components/DarkModeToggle.tsx
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(
    localStorage.getItem('focusflow-dark') === 'true',
  );

  useEffect(() => {
    const html = document.documentElement;

    if (enabled) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    localStorage.setItem('focusflow-dark', String(enabled));
  }, [enabled]);

  useEffect(() => {
    const saved = localStorage.getItem('focusflow-dark');
    if (saved === 'true') {
      document.documentElement.classList.add('dark');
      setEnabled(true); // <-- sync state
    } else {
      document.documentElement.classList.remove('dark');
      setEnabled(false); // <-- sync state
    }
  }, []);

  return (
    <button
      onClick={() => setEnabled((prev) => !prev)}
      className="rounded bg-gray-300 p-2 text-sm dark:bg-gray-700"
    >
      {enabled ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
