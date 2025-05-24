import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
      });

      setSuccess('Registration successful! Please login.');
      setError('');
      // Redirect to login after short delay or immediately
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setSuccess('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <h2 className="mb-4 text-2xl font-semibold">Register</h2>
      <form onSubmit={handleRegister} className="w-full max-w-md space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
        <input
          type="text"
          placeholder="Name"
          className="w-full rounded border px-4 py-2 dark:bg-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
