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
import fetchWithTimeout from '../utils/fetchWithTimeout';
import Trilean from '../types/trilean';
import UserState from '../types/UserState';

const useCadeyAuth = () => {
  const dispatch = useDispatch();
  const authLoading = useSelector((state: RootState) => state.authStatus); // Access global authLoading state

  const initialErrorsState: string[] = [];
  const initialMessagesState: string[] = [];

  const [errors, setErrors] = useState<[] | Array<string>>(initialErrorsState);
  const [messages, setMessages] = useState(initialMessagesState);
  const [firebaseUser, setFirebaseUser] = useState<UserState>(null);
  const [cadeyUser, setCadeyUser] = useState<any>(null); //@todo update
  const [userIsAnonymous, setUserIsAnonymous] = useState<Trilean>('pending');
  const [firebaseUserLoaded, setFirebaseUserLoaded] = useState<boolean>(false);
  const [cadeyUserLoaded, setCadeyUserLoaded] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    cadeyUser: any;
    firebaseUser: UserState;
  }>({
    cadeyUser: null,
    firebaseUser: null,
  });

  const { apiUrl } = React.useContext(ApiUrlContext);
  const getCurrentUserData = async () => {
    const firebaseUser = await handleFullLogin();
    setUserData({
      cadeyUser,
      firebaseUser,
    });
  };

  useEffect(() => {
    getCurrentUserData();
  }, []);

  const handleFullLogin = async (): Promise<UserState> => {
    // Define a function to wait for the auth state change.
    const waitForAuthStateChange = (): Promise<UserState> => {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (currentUser) => {
          resolve(currentUser);
        });
      });
    };

    let currentUser = await waitForAuthStateChange(); // Wait for the auth state to change.

    if (currentUser) {
      setUserIsAnonymous(currentUser.isAnonymous);
      setFirebaseUserLoaded(true);
      const cadeyUser = await handleCadeyLoginAndReturnUser(currentUser);
      setCadeyUserLoaded(true);
      setCadeyUser(cadeyUser);
    } else {
      // No user is signed in, attempt to sign in anonymously.
      try {
        currentUser = await signInAnonymouslyDecorated();
        console.log('Signed in anonymously');
        setUserIsAnonymous(true);
        setFirebaseUserLoaded(true);
        // Optionally set the anonymous user, depending on your app logic.
        // Depending on your implementation, you might want to setUser here as well.
      } catch (error) {
        console.error('Error signing in anonymously:', error);
        // @todo error handling
      }
    }

    // Assuming you have a mechanism to update the login status based on the currentUser.
    setFirebaseUser(currentUser);

    return currentUser; // Return the current user, which could be null, an anonymous user, or a registered user.
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
  const signInAnonymouslyDecorated = async (): Promise<UserState> => {
    if (firebaseUser) return firebaseUser; // Assuming 'user' is of type 'UserState'.
    runBeforeRequest();

    try {
      const result = await signInAnonymously(auth);
      console.log('Signed in anonymously');
      // Assuming 'signInAnonymously' returns a 'UserCredential' object.
      // Extract the user from the result, if available.
      const currentUser = result.user || null; // Adjust based on actual structure if needed.
      return currentUser;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorDecorated(e);
        throw e;
      }
      throw e;
    } finally {
      runAfterRequest();
    }
    // Implicit return null if try/catch doesn't return anything.
    // This line is not strictly necessary due to function's return type, but added for clarity.
    return null;
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

  const handleCadeyLoginAndReturnUser = async (firebaseUser: User) => {
    const url = `${apiUrl}/userauth`;
    let response;
    try {
      response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            accept: 'text/plain',
            apiKey: 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cadeyUserEmail: firebaseUser.email,
          }),
        },
        { requestName: 'postUserAuth' },
      );
    } catch (error) {
      throw new Error(`HTTP error! status: ${error}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cadeyUserLocal = await response.json();
    setCadeyUser(cadeyUserLocal);
    return cadeyUserLocal;
  };

  return {
    errors,
    userData,
    signInWithEmailAndPasswordDecorated,
    sendPasswordResetEmailDecorated,
    createUserWithEmailAndPasswordDecorated,
    messages,
    userIsAnonymous,
    cadeyUserLoaded,
    firebaseUserLoaded,
    loading: !cadeyUserLoaded || !firebaseUserLoaded,
    resetErrors: () => setErrors([]),
  };
};

export default useCadeyAuth;
