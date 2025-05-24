import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No need to fetch profile here, UserProvider will handle it
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <h2 className="mb-4 text-2xl font-semibold">Login</h2>
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border px-4 py-2 dark:bg-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border px-4 py-2 dark:bg-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
