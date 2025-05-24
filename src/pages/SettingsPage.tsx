// src/pages/SettingsPage.tsx
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    localStorage.setItem('focusflow-muted', String(isMuted));
    localStorage.setItem('focusflow-volume', String(volume));
  }, [isMuted, volume]);

  return (
    <div className="mx-auto max-w-xl p-4">
      <h2 className="mb-4 text-2xl font-semibold">Settings</h2>

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isMuted}
            onChange={(e) => setIsMuted(e.target.checked)}
          />
          <span>Mute notifications</span>
        </label>
      </div>

      <div>
        <label className="mb-1 block">Notification Volume</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          disabled={isMuted}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
