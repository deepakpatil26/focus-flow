import { SessionEntry } from '../context/SessionContext';
import {
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface Props {
  sessions: SessionEntry[];
}

export default function AnalyticsDashboard({ sessions }: Props) {
  const workSessions = sessions.filter((s) => s.type === 'work');

  const sessionsByDate = workSessions.reduce<Record<string, number>>(
    (acc, s) => {
      const date = new Date(s.start).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {},
  );

  const avgFocusMinutes = (() => {
    const total = workSessions.reduce((sum, s) => {
      const ms = new Date(s.end).getTime() - new Date(s.start).getTime();
      return sum + ms / (1000 * 60);
    }, 0);
    return workSessions.length ? (total / workSessions.length).toFixed(1) : '0';
  })();

  const completed = workSessions.filter((s) => s.status === 'completed').length;
  const aborted = workSessions.filter((s) => s.status === 'aborted').length;

  const chartData = Object.entries(sessionsByDate).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900">
          <h3 className="text-lg font-semibold">Average Focus Time</h3>
          <p className="mt-2 text-3xl">{avgFocusMinutes} min</p>
        </div>
        <div className="rounded-lg bg-blue-100 p-4 dark:bg-blue-900">
          <h3 className="text-lg font-semibold">Completed vs Aborted</h3>
          <p className="mt-2">
            ✅ {completed} completed <br />❌ {aborted} aborted
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">Focus Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3182ce" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}