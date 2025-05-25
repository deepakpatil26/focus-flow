import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  icon: string;
}

interface UserAchievement {
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-pomodoro',
    name: 'First Focus',
    description: 'Complete your first Pomodoro session',
    requirement: 1,
    icon: '🎯',
  },
  {
    id: 'focus-master',
    name: 'Focus Master',
    description: 'Complete 10 Pomodoro sessions',
    requirement: 10,
    icon: '🏆',
  },
  {
    id: 'productivity-streak',
    name: 'Productivity Streak',
    description: 'Maintain a 3-day streak',
    requirement: 3,
    icon: '🔥',
  },
  {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Create 5 quick notes',
    requirement: 5,
    icon: '📝',
  },
];

export default function Achievements() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    loadUserAchievements();
  }, []);

  const loadUserAchievements = async () => {
    if (!auth.currentUser) return;

    const userAchievementsRef = doc(db, 'users', auth.currentUser.uid, 'data', 'achievements');
    const docSnap = await getDoc(userAchievementsRef);

    if (docSnap.exists()) {
      setUserAchievements(docSnap.data().achievements);
    } else {
      // Initialize achievements for new users
      const initialAchievements: UserAchievement[] = ACHIEVEMENTS.map(achievement => ({
        achievementId: achievement.id,
        progress: 0,
        completed: false,
      }));

      await setDoc(userAchievementsRef, { achievements: initialAchievements });
      setUserAchievements(initialAchievements);
    }
  };

  const updateAchievement = async (achievementId: string, progress: number) => {
    if (!auth.currentUser) return;

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;

    const userAchievementIndex = userAchievements.findIndex(
      ua => ua.achievementId === achievementId
    );

    if (userAchievementIndex === -1) return;

    const updatedAchievements = [...userAchievements];
    const userAchievement = updatedAchievements[userAchievementIndex];

    userAchievement.progress = progress;
    
    if (progress >= achievement.requirement && !userAchievement.completed) {
      userAchievement.completed = true;
      userAchievement.completedAt = new Date();
    }

    setUserAchievements(updatedAchievements);

    const userAchievementsRef = doc(db, 'users', auth.currentUser.uid, 'data', 'achievements');
    await updateDoc(userAchievementsRef, { achievements: updatedAchievements });
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold">Achievements</h2>
      
      <div className="grid gap-4">
        {ACHIEVEMENTS.map(achievement => {
          const userAchievement = userAchievements.find(
            ua => ua.achievementId === achievement.id
          );
          
          const progress = userAchievement?.progress || 0;
          const completed = userAchievement?.completed || false;

          return (
            <div
              key={achievement.id}
              className={`rounded-lg border p-3 ${
                completed
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h3 className="font-medium">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {progress} / {achievement.requirement}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{
                      width: `${Math.min(
                        (progress / achievement.requirement) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}