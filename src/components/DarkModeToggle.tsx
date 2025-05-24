import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(
    localStorage.getItem('focusflow-dark') === 'true',
  );

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('focusflow-dark', String(enabled));
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
    >
      {enabled ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}