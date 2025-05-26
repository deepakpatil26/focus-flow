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
      isDark: false,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'dark-mode-storage',
    },
  ),
);

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={toggle}
      className="rounded-lg px-4 py-2 text-sm font-medium transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 bg-gray-200 text-gray-900 hover:bg-gray-300"
    >
      {isDark ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}