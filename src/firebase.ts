// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCjuYrcQjGkuqypNdqh37Hi942czv-VHmE',
  authDomain: 'focusflow-75c1c.firebaseapp.com',
  projectId: 'focusflow-75c1c',
  storageBucket: 'focusflow-75c1c.firebasestorage.app',
  messagingSenderId: '873999134606',
  appId: '1:873999134606:web:13b2c16992e4535e74bedf',
  measurementId: 'G-SWYR62TDYR',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
