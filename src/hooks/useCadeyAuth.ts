import {
  User,
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../api/Firebase/InitializeFirebase';

const useCadeyAuth = () => {
  type UserState = User | null;
  const [user, setUser] = useState<UserState>(null);

  const signInAnonymouslyDecorated = async () => {
    if (user) {
      return;
    }
    signInAnonymously(auth)
      .then(() => {
        console.log('Signed in anonymously');
      })
      .catch((error) => {
        console.error('Error signing in anonymously:', error);
      });
  };

  useEffect(() => {
    signInAnonymouslyDecorated();
  }, []);

  useEffect(() => {
    signInAnonymouslyDecorated();
  }, [user]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      console.log('User is signed in anonymously, UID: ', user.uid);
    } else {
      // User is signed out
      console.log('User is signed out');
    }
  });

  const resetUser = () => {
    setUser(null);
  };

  return {
    user,
    resetUser,
  };

  // Authenticate with Firebase
};

export default useCadeyAuth;
