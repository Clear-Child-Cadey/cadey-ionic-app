import { useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../api/Firebase/InitializeFirebase';

const useCadeyAuth = () => {
  const initialErrorsState: string[] = [];
  const initialMessagesState: string[] = [];
  type UserState = User | null;
  const [user, setUser] = useState<UserState>(null);
  const [errors, setErrors] = useState<[] | Array<string>>(initialErrorsState);
  const [messages, setMessages] = useState(initialMessagesState);

  const setMessageDecorated = (m: string) => {
    setMessages((prevMessagesArray) => {
      let messagesArrayCopy: Array<string> = [];
      if (Array.isArray(prevMessagesArray)) {
        messagesArrayCopy = [...prevMessagesArray];
      }

      messagesArrayCopy.push(m);
      return messagesArrayCopy;
    });
  };

  const setErrorDecorated = (e: Error) => {
    setErrors((prevErrorsArray) => {
      let errorsArrayCopy: Array<string> = [];
      if (Array.isArray(prevErrorsArray)) {
        errorsArrayCopy = [...prevErrorsArray];
      }

      errorsArrayCopy.push(e.message);
      return errorsArrayCopy;
    });
  };

  const runBeforeRequest = () => {
    setErrors(initialErrorsState);
    setMessages(initialMessagesState);
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log('User is signed in, UID:', currentUser.uid);
      } else {
        console.log('User is signed out');
        setUser(null);
      }
    });
    return unsubscribe; // Clean up subscription on unmount
  }, []);

  // Function to sign in anonymously
  const signInAnonymouslyDecorated = async () => {
    runBeforeRequest();
    if (user) return;
    try {
      await signInAnonymously(auth);
      console.log('Signed in anonymously');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorDecorated(e);
      }
      throw e;
    }
  };

  // Enhanced: Function to sign in with email and password
  const signInWithEmailAndPasswordDecorated = async (
    email: string,
    password: string,
  ) => {
    runBeforeRequest();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (e instanceof Error) {
        setErrorDecorated(e);
      }
      throw e;
    }
    setMessageDecorated('Logged in successfully!');
  };

  // Enhanced: Function to send password reset email
  const sendPasswordResetEmailDecorated = async (email: string) => {
    runBeforeRequest();
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      if (e instanceof Error) {
        setErrorDecorated(e);
      }
      throw e;
    }
    setMessageDecorated('Password reset email sent!');
  };

  // Automatically sign in anonymously
  useEffect(() => {
    signInAnonymouslyDecorated();
  }, [user]);

  const resetUser = () => {
    setUser(null);
  };

  const isUserAnonymous = () => {
    return user?.isAnonymous;
  };

  const getUid = () => {
    return user?.uid;
  };

  const getEmailVerified = () => {
    return user?.emailVerified;
  };

  return {
    errors,
    user,
    resetUser,
    signInWithEmailAndPasswordDecorated,
    sendPasswordResetEmailDecorated,
    isUserAnonymous,
    getUid,
    getEmailVerified,
    messages,
  };
};

export default useCadeyAuth;
