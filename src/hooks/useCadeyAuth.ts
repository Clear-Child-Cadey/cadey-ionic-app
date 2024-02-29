import { useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../api/Firebase/InitializeFirebase';

const useCadeyAuth = () => {
  const initialErrorsState: string[] = [];
  const initialMessagesState: string[] = [];
  type UserState = User | null;
  const [user, setUser] = useState<UserState>(null);
  const [errors, setErrors] = useState<[] | Array<string>>(initialErrorsState);
  const [messages, setMessages] = useState(initialMessagesState);
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
  };

  const runAfterRequest = () => {
    setLoading(false);
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('User is signed in, UID:', currentUser.uid);
        setUser(currentUser); // This will set the user state with the current user
        // Here, you no longer need to explicitly check for non-anonymous users to avoid signing in anonymously
        // as this condition is now inherently considered by placing the signInAnonymously call in the else block below
      } else {
        console.log('User is signed out or not yet loaded');
        // Since there's no user, attempt to sign in anonymously
        console.log('Signing in anonymously');
        signInAnonymouslyDecorated(); // This will only trigger if there's no current user at all
      }
    });
    return () => unsubscribe(); // Clean up subscription on unmount
  }, []); // The empty dependency array ensures this effect only runs once at mount

  // Function to sign in anonymously
  const signInAnonymouslyDecorated = async () => {
    if (user) return;
    runBeforeRequest();

    try {
      await signInAnonymously(auth);
      console.log('Signed in anonymously');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorDecorated(e);
        throw e;
      }
      throw e;
    } finally {
      runAfterRequest();
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
        throw e;
      }
      throw e;
    } finally {
      runAfterRequest();
    }
    setMessageDecorated('Logged in successfully!');
  };

  const createUserWithEmailAndPasswordDecorated = async (
    email: string,
    password: string,
  ) => {
    runBeforeRequest();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessageDecorated('Account created');
    } catch (e) {
      if (e instanceof Error) {
        setErrorDecorated(e);
        throw e;
      }
      throw e;
    } finally {
      runAfterRequest();
    }
  };

  // Enhanced: Function to send password reset email
  const sendPasswordResetEmailDecorated = async (email: string) => {
    runBeforeRequest();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessageDecorated('Password reset email sent!');
    } catch (e) {
      if (e instanceof Error) {
        setErrorDecorated(e);
        throw e;
      }
      throw e;
    } finally {
      runAfterRequest();
    }
  };

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
    createUserWithEmailAndPasswordDecorated,
    isUserAnonymous,
    getUid,
    getEmailVerified,
    messages,
    loading,
  };
};

export default useCadeyAuth;
