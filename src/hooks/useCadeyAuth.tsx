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

  const getFirebaseLoginStatus = async (): Promise<User | null> => {
    return new Promise<User | null>((resolve) => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser && currentUser.isAnonymous === false) {
          // User is signed in as a registered user
          console.log('User is signed in, UID:', currentUser.uid);
          setUser(currentUser); // This will set the user state with the current user
          resolve(currentUser);
        } else if (currentUser && currentUser.isAnonymous === true) {
          // User is signed in anonymously
          resolve(null);
        } else {
          // No user, attempt to sign in anonymously
          signInAnonymouslyDecorated(); // This will only trigger if there's no current user at all
          resolve(null);
        }
      });
    });
  };

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
    await runBeforeRequest();
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
    getFirebaseLoginStatus,
    loading: authLoading,
    resetErrors: () => setErrors([]),
  };
};

export default useCadeyAuth;
