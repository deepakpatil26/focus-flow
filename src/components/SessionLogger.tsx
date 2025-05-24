// src/components/SessionLogger.tsx
import React from 'react';
import { useSessions } from '../context/SessionContext';

export const SessionLogger: React.FC = () => {
  const { sessions } = useSessions();

  return (
    <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <h2 className="mb-2 text-lg font-semibold">Session History</h2>
      {sessions.length === 0 ? (
        <p className="text-sm text-gray-500">No sessions logged yet.</p>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-y-auto">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between rounded bg-gray-100 p-2 dark:bg-gray-700"
            >
              <div className="flex flex-col">
                <span className="font-medium capitalize">
                  {session.type} - {session.status}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {session.start.toLocaleTimeString()} →{' '}
                  {session.end.toLocaleTimeString()}
                </span>
                {session.status === 'aborted' && session.reason && (
                  <span className="mt-1 text-xs text-red-400 italic">
                    Aborted: {session.reason}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
