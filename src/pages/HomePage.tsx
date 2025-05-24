import PomodoroTimer from '../components/PomodoroTimer';
import PomodoroSettings from '../components/PomodoroSettings';
import { SessionLogger } from '../components/SessionLogger';
import { useState } from 'react';
import { useSessions } from '../context/SessionContext';

export default function HomePage() {
  const [settings, setSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
  });

  // Use global session context instead of local state
  const { sessions } = useSessions();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 p-6">
      <PomodoroTimer settings={settings} />
      <PomodoroSettings settings={settings} onUpdate={setSettings} />
      <SessionLogger sessions={sessions} />
    </div>
  );
}
