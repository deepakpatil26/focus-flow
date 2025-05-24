// src/context/SessionContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface SessionEntry {
  id: string;
  type: 'work' | 'break';
  start: Date;
  end: Date;
  status: 'completed' | 'aborted';
  reason?: string;
}

interface SessionContextType {
  sessions: SessionEntry[];
  addSession: (session: SessionEntry) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const q = query(
          collection(db, 'users', user.uid, 'sessions'),
          orderBy('start', 'desc'),
        );
        const querySnapshot = await getDocs(q);
        const loaded: SessionEntry[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type,
            start: data.start.toDate(),
            end: data.end.toDate(),
            status: data.status,
            reason: data.reason,
          };
        });
        setSessions(loaded);
      } else {
        setUserId(null);
        setSessions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addSession = async (session: SessionEntry) => {
    setSessions((prev) => [session, ...prev]);

    if (userId) {
      const ref = collection(db, 'users', userId, 'sessions');
      await addDoc(ref, {
        ...session,
        start: session.start,
        end: session.end,
      });
    }
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
};
