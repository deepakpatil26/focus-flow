import { useMemo } from 'react';
import { SessionEntry } from '../components/SessionLogger';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Mock session data – replace with state or prop
const mockSessions: SessionEntry[] = [
  {
    id: '1',
    type: 'work',
    start: new Date('2025-05-21T10:00:00'),
    end: new Date('2025-05-21T10:25:00'),
    status: 'completed',
  },
  {
    id: '2',
    type: 'work',
    start: new Date('2025-05-21T11:00:00'),
    end: new Date('2025-05-21T11:10:00'),
    status: 'aborted',
    reason: 'phone call',
  },
  {
    id: '3',
    type: 'work',
    start: new Date('2025-05-20T09:00:00'),
    end: new Date('2025-05-20T09:25:00'),
    status: 'completed',
  },
];

function groupSessionsByDay(sessions: SessionEntry[]) {
  const result: Record<string, number> = {};

  sessions.forEach((session) => {
    const date = session.start.toISOString().split('T')[0];
    if (session.status === 'completed') {
      result[date] = (result[date] || 0) + 1;
    }
  });

  return Object.entries(result).map(([date, count]) => ({ date, count }));
}

function getAverageFocusTime(sessions: SessionEntry[]) {
  const focusTimes = sessions
    .filter((s) => s.status === 'completed')
    .map((s) => (s.end.getTime() - s.start.getTime()) / 60000);
  const avg = focusTimes.reduce((a, b) => a + b, 0) / focusTimes.length || 0;
  return avg.toFixed(1);
}

function getSessionStats(sessions: SessionEntry[]) {
  const total = sessions.length;
  const completed = sessions.filter((s) => s.status === 'completed').length;
  const aborted = total - completed;
  return [
    { name: 'Completed', value: completed },
    { name: 'Aborted', value: aborted },
  ];
}

export default function AnalyticsPage() {
  const sessions = mockSessions; // Replace with actual data source
  const chartData = useMemo(() => groupSessionsByDay(sessions), [sessions]);
  const averageFocus = getAverageFocusTime(sessions);
  const stats = getSessionStats(sessions);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

      <div className="text-lg">
        Average Focus Time:{' '}
        <span className="font-bold">{averageFocus} minutes</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-semibold">Pomodoros Per Day</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-semibold">Completed vs Aborted</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
