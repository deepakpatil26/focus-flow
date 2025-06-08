import { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import { Users, Activity, Clock, TrendingUp } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  registeredAt?: Date;
  lastLogin?: Date;
  totalSessions?: number;
  totalFocusTime?: number;
}

interface SessionData {
  userId: string;
  type: 'work' | 'break';
  start: Date;
  end: Date;
  status: 'completed' | 'aborted';
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    loadAllSessions();
  }, []);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: UserData[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Get user sessions for statistics
        const sessionsSnapshot = await getDocs(
          query(
            collection(db, 'users', userDoc.id, 'sessions'),
            orderBy('start', 'desc')
          )
        );

        const userSessions = sessionsSnapshot.docs.map(doc => doc.data());
        const workSessions = userSessions.filter(s => s.type === 'work');
        
        const totalFocusTime = workSessions.reduce((acc, session) => {
          const duration = (session.end.toDate().getTime() - session.start.toDate().getTime()) / (1000 * 60);
          return acc + duration;
        }, 0);

        usersData.push({
          id: userDoc.id,
          name: userData.name,
          email: userData.email,
          registeredAt: userData.createdAt?.toDate(),
          totalSessions: workSessions.length,
          totalFocusTime: Math.round(totalFocusTime),
        });
      }

      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const loadAllSessions = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allSessions: SessionData[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const sessionsSnapshot = await getDocs(
          query(
            collection(db, 'users', userDoc.id, 'sessions'),
            orderBy('start', 'desc')
          )
        );

        sessionsSnapshot.docs.forEach(sessionDoc => {
          const sessionData = sessionDoc.data();
          allSessions.push({
            userId: userDoc.id,
            type: sessionData.type,
            start: sessionData.start.toDate(),
            end: sessionData.end.toDate(),
            status: sessionData.status,
          });
        });
      }

      setSessions(allSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  // Set up real-time listeners for live updates
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Listen for new users
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), () => {
      loadUsers();
    });
    unsubscribes.push(usersUnsubscribe);

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const totalUsers = users.length;
  const totalSessions = sessions.length;
  const totalFocusTime = users.reduce((acc, user) => acc + (user.totalFocusTime || 0), 0);
  const activeUsersToday = users.filter(user => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions.some(session => 
      session.userId === user.id && 
      session.start >= today
    );
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor user activity and application usage
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalUsers}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Today
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {activeUsersToday}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Sessions
              </p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {totalSessions}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Focus Time
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(totalFocusTime / 60)}h
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Focus Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => {
                const isActiveToday = sessions.some(session => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return session.userId === user.id && session.start >= today;
                });

                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.registeredAt ? format(user.registeredAt, 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.totalSessions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.totalFocusTime || 0} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isActiveToday
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {isActiveToday ? 'Active Today' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sessions.slice(0, 20).map((session, index) => {
              const user = users.find(u => u.id === session.userId);
              return (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                        {user?.name.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.type} session • {session.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(session.start, 'MMM dd, HH:mm')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {Math.round((session.end.getTime() - session.start.getTime()) / (1000 * 60))} min
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}