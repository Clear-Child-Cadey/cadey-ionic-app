import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Firebase
import {
  User,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../api/Firebase/InitializeFirebase';
// Redux
import { RootState } from '../store';
import { setAuthLoading } from '../features/authLoading/slice';
// API
import ApiUrlContext from '../context/ApiUrlContext';

const useCadeyAuth = () => {
  const dispatch = useDispatch();
  const authLoading = useSelector((state: RootState) => state.authStatus); // Access global authLoading state

  const initialErrorsState: string[] = [];
  const initialMessagesState: string[] = [];
  type UserState = User | null;
  const [user, setUser] = useState<UserState>(null);
  const [errors, setErrors] = useState<[] | Array<string>>(initialErrorsState);
  const [messages, setMessages] = useState(initialMessagesState);

  const { apiUrl } = React.useContext(ApiUrlContext);

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
        signInAnonymouslyDecorated(); // This will only trigger if there's no current user at all
      }
    });
    return () => unsubscribe(); // Clean up subscription on unmount
  }, []); // The empty dependency array ensures this effect only runs once at mount

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

  const runBeforeRequest = async () => {
    dispatch(setAuthLoading(true)); // Update global authLoading state
    setErrors(initialErrorsState);
    setMessages(initialMessagesState);
    // Simulate a delay (Return a promise that resolves after a 2-second delay)
    return new Promise((resolve) => setTimeout(resolve, 2000)); // 2000 milliseconds = 2 seconds
  };

  const runAfterRequest = () => {
    dispatch(setAuthLoading(false)); // Update global authLoading state
  };

  // Subscribe to auth state changes

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
  async function signInWithEmailAndPasswordDecorated(
    email: string,
    password: string,
  ) {
    let firebaseId = '';
    await runBeforeRequest();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      firebaseId = user.uid; // Get the Firebase ID
    } catch (e) {
      if (e instanceof Error) {
        setErrorDecorated(e);
        throw e;
      }
      throw e;
    } finally {
      runAfterRequest();
    }
  }

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
  };
};

export default useCadeyAuth;
