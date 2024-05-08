// InitializeFirebase.tsx
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { Firestore, getFirestore } from 'firebase/firestore';
import {
  Auth,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
  apiKey: 'AIzaSyBcqwDAbWGh25wog7XpbV9gtjV4HEA_Fys',
  authDomain: 'cadeylite.firebaseapp.com',
  projectId: 'cadeylite',
  storageBucket: 'cadeylite.appspot.com',
  messagingSenderId: '743363017370',
  appId: '1:743363017370:web:3e1d427d4c85895e73bd23',
  measurementId: 'G-G2QZMXWEVS',
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAnalytics = getAnalytics(firebaseApp);
const firebasePerf = getPerformance(firebaseApp);
const firestore: Firestore = getFirestore(firebaseApp);

// Initialize auth with specific persistence settings - this allows the user to stay logged in
const auth = initializeAuth(firebaseApp, {
  persistence: Capacitor.isNativePlatform()
    ? indexedDBLocalPersistence
    : browserLocalPersistence,
});

export { firebaseApp, firebaseAnalytics, firebasePerf, firestore, auth };

// TODO: Crashlytics - this still isn't working
// Best link I've found so far: https://github.com/capacitor-community/firebase-crashlytics
// Ran into dependency issues with the above link though
