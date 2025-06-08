import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useUser } from '../context/UserContext';
import DarkModeToggle from './DarkModeToggle';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email?.endsWith('@admin.com')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between bg-gray-100 p-4 text-gray-800 shadow dark:bg-gray-900 dark:text-white">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/blocklist">Blocklist</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/settings">Settings</Link>
        {isAdmin && (
          <Link 
            to="/admin" 
            className="text-red-600 dark:text-red-400 font-medium"
          >
            Admin
          </Link>
        )}
        <DarkModeToggle />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden text-sm sm:inline">
              Welcome, {user.name}
              {isAdmin && <span className="ml-1 text-red-500">(Admin)</span>}
            </span>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}