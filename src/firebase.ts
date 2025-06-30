import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC48wsPgQZeMmQU5nJ4Ph8wxWFdnfjlbX0",
  authDomain: "focus-flow-b552a.firebaseapp.com",
  projectId: "focus-flow-b552a",
  storageBucket: "focus-flow-b552a.firestorage.app",
  messagingSenderId: "1097537196508",
  appId: "1:1097537196508:web:19bfcb049262b35c593f19",
  measurementId: "G-20NFQR94EM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);