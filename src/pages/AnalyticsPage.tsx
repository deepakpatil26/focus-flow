import { useMemo } from 'react';
import { useSessions } from '../context/SessionContext';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, eachDayOfInterval, subDays } from 'date-fns';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

export default function AnalyticsPage() {
  const { sessions } = useSessions();

  const stats = useMemo(() => {
    const workSessions = sessions.filter((s) => s.type === 'work');
    const totalSessions = workSessions.length;
    const completedSessions = workSessions.filter(
      (s) => s.status === 'completed',
    ).length;
    const abortedSessions = totalSessions - completedSessions;

    const totalFocusTime = workSessions.reduce((acc, session) => {
      const duration =
        (new Date(session.end).getTime() - new Date(session.start).getTime()) /
        (1000 * 60);
      return acc + duration;
    }, 0);

    const avgFocusTime = totalSessions ? totalFocusTime / totalSessions : 0;

    return {
      totalSessions,
      completedSessions,
      abortedSessions,
      totalFocusTime,
      avgFocusTime,
      completionRate: totalSessions
        ? (completedSessions / totalSessions) * 100
        : 0,
    };
  }, [sessions]);

  const dailyStats = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return last7Days.map((date) => {
      const dayStr = format(date, 'yyyy-MM-dd');
      const daySessions = sessions.filter(
        (s) =>
          s.type === 'work' &&
          format(new Date(s.start), 'yyyy-MM-dd') === dayStr,
      );

      return {
        date: format(date, 'MMM dd'),
        completed: daySessions.filter((s) => s.status === 'completed').length,
        aborted: daySessions.filter((s) => s.status === 'aborted').length,
      };
    });
  }, [sessions]);

  const pieData = [
    { name: 'Completed', value: stats.completedSessions },
    { name: 'Aborted', value: stats.abortedSessions },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-2xl font-bold">Analytics Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold">Total Focus Time</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {Math.round(stats.totalFocusTime)} min
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold">Average Session Length</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(stats.avgFocusTime)} min
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold">Completion Rate</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(stats.completionRate)}%
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold">Daily Sessions</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#10B981"
                  name="Completed"
                />
                <Bar
                  dataKey="aborted"
                  stackId="a"
                  fill="#EF4444"
                  name="Aborted"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold">Session Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">Session History</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Duration</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(0, 10).map((session) => (
                <tr key={session.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">
                    {format(new Date(session.start), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-4 py-2 capitalize">{session.type}</td>
                  <td className="px-4 py-2">
                    {Math.round(
                      (new Date(session.end).getTime() -
                        new Date(session.start).getTime()) /
                        (1000 * 60),
                    )}{' '}
                    min
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
