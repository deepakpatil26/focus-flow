import PomodoroTimer from '../components/PomodoroTimer';
import PomodoroSettings from '../components/PomodoroSettings';
import { SessionLogger } from '../components/SessionLogger';
import QuickNotes from '../components/QuickNotes';
import Achievements from '../components/Achievements';
import { useState } from 'react';
import { useSessions } from '../context/SessionContext';

export default function HomePage() {
  const [settings, setSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
  });

  const { sessions } = useSessions();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-6 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <PomodoroTimer settings={settings} />
        <PomodoroSettings settings={settings} onUpdate={setSettings} />
        <SessionLogger sessions={sessions} />
      </div>
      <div className="flex flex-col gap-6">
        <QuickNotes />
        <Achievements />
      </div>
    </div>
  );
}
