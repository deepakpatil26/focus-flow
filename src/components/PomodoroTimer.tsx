/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { useSessions } from '../context/SessionContext';
import { db, auth } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface PomodoroTimerProps {
  settings: {
    workDuration: number;
    breakDuration: number;
  };
}

export default function PomodoroTimer({ settings }: PomodoroTimerProps) {
  const { addSession } = useSessions();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(settings.workDuration * 60);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Load sound settings
  const [isMuted] = useState(
    () => localStorage.getItem('focusflow-muted') === 'true',
  );
  const [volume] = useState(() =>
    parseFloat(localStorage.getItem('focusflow-volume') || '1'),
  );

  // Initialize sounds
  const startWorkSound = new Audio(
    'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  );
  const startBreakSound = new Audio(
    'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  );
  const abortSound = new Audio(
    'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  );

  // Update sound volumes
  useEffect(() => {
    [startWorkSound, startBreakSound, abortSound].forEach((sound) => {
      sound.volume = isMuted ? 0 : volume;
    });
  }, [isMuted, volume]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 1) {
            handleSessionSwitch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(
        sessionType === 'work'
          ? settings.workDuration * 60
          : settings.breakDuration * 60,
      );
    }
  }, [settings, sessionType]);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  interface SessionEntry {
    id: string;
    type: 'work' | 'break';
    start: Date;
    end: Date;
    status: 'completed' | 'aborted';
    reason?: string;
  }

  const logToFirestore = async (data: SessionEntry) => {
    if (!userId) return;
    const ref = collection(db, 'users', userId, 'sessions');
    await addDoc(ref, data);
  };

  const playSound = (sound: HTMLAudioElement) => {
    if (!isMuted) {
      sound.currentTime = 0;
      sound.play();
    }
  };

  const handleStart = () => {
    if (!hasStarted) {
      setStartTime(new Date());
    }
    setIsRunning(true);
    setHasStarted(true);
    playSound(sessionType === 'work' ? startWorkSound : startBreakSound);

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        `${sessionType === 'work' ? 'Work' : 'Break'} session started`,
        {
          body: `Time to ${sessionType === 'work' ? 'focus' : 'take a break'}!`,
          icon: '/icons/icon128.png',
        },
      );
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    playSound(abortSound);
  };

  const handleReset = () => {
    setIsRunning(false);
    setHasStarted(false);
    setSecondsLeft(
      sessionType === 'work'
        ? settings.workDuration * 60
        : settings.breakDuration * 60,
    );
    setStartTime(null);
  };

  const handleSessionSwitch = async () => {
    const endTime = new Date();

    if (startTime) {
      const entry: SessionEntry = {
        id: crypto.randomUUID(),
        type: sessionType,
        start: startTime,
        end: endTime,
        status: 'completed',
      };
      addSession(entry);
      await logToFirestore(entry);
    }

    const nextType = sessionType === 'work' ? 'break' : 'work';
    setSessionType(nextType);
    setSecondsLeft(
      nextType === 'work'
        ? settings.workDuration * 60
        : settings.breakDuration * 60,
    );
    setStartTime(new Date());

    playSound(nextType === 'work' ? startWorkSound : startBreakSound);

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        `${nextType === 'work' ? 'Work' : 'Break'} session started`,
        {
          body: `Time to ${nextType === 'work' ? 'focus' : 'take a break'}!`,
          icon: '/icons/icon128.png',
        },
      );
    }
  };

  const handleAbort = async () => {
    if (!isRunning || !startTime) return;
    const reason = prompt('Why are you aborting this session?');
    const entry: SessionEntry = {
      id: crypto.randomUUID(),
      type: sessionType,
      start: startTime,
      end: new Date(),
      status: 'aborted',
      reason: reason || undefined,
    };
    addSession(entry);
    await logToFirestore(entry);
    playSound(abortSound);
    setIsRunning(false);
    setStartTime(null);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h1 className="text-2xl font-semibold capitalize">
        {sessionType} Session
      </h1>
      <div className="font-mono text-5xl">{formatTime(secondsLeft)}</div>

      <div className="mt-4 flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className={`rounded px-4 py-2 text-white ${
              hasStarted
                ? 'bg-blue-600 hover:bg-blue-700' // Resume
                : 'bg-green-600 hover:bg-green-700' // Start
            }`}
          >
            {hasStarted ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
          >
            Pause
          </button>
        )}

        <button
          onClick={handleReset}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Reset
        </button>
        {isRunning && (
          <button
            onClick={handleAbort}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Abort
          </button>
        )}
      </div>
    </div>
  );
}
