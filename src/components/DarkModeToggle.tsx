import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DarkModeStore {
  isDark: boolean;
  toggle: () => void;
}

const useDarkMode = create<DarkModeStore>()(
  persist(
    (set) => ({
      isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'focusflow-dark-mode',
    },
  ),
);

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={toggle}
      className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}