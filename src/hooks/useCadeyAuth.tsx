import React, { useState, useEffect } from 'react';
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
import {
  setCadeyResolved,
  setFirebaseResolved,
  setIsAnonymous,
  setCadeyUser,
  setFirebaseUser,
} from '../features/authLoading/slice';
// API
import ApiUrlContext from '../context/ApiUrlContext';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import FirebaseUserModel from '../types/FirebaseUserModel';
import AppMeta from '../variables/AppMeta';
import { RootState } from '../store';
import { useHistory } from 'react-router';
import { setHttpErrorModalData } from '../features/httpError/slice';
import firebaseErrorMapper from '../utils/firebaseErrorMapper';

const useCadeyAuth = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const loginRequestAlreadyFired = useSelector(
    (state: RootState) =>
      state.authStatus.cadeyResolved !== 'pending' ||
      state.authStatus.firebaseResolved !== 'pending',
  );

  const initialErrorsState: string[] = [];
  const initialMessagesState: string[] = [];

  const [errors, setErrors] = useState<[] | Array<string>>(initialErrorsState);
  const [messages, setMessages] = useState(initialMessagesState);

  const { apiUrl } = React.useContext(ApiUrlContext);

  useEffect(() => {
    // This effect replaces the waitForAuthStateChange mechanism
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Dispatch relevant actions for current user
        dispatch(setIsAnonymous(currentUser.isAnonymous));
        dispatch(setFirebaseUser(currentUser));
        dispatch(setFirebaseResolved(true));

        if (!currentUser.isAnonymous) {
          // Handle logged in user
          try {
            const cadeyUser = await handleCadeyLoginAndReturnUser(currentUser);
            dispatch(setCadeyUser(cadeyUser));
            dispatch(setCadeyResolved(true));
          } catch (error) {
            console.error('Error handling Cadey login:', error);
            setErrors([...errors, error.message]);
            // Handle any additional error state updates or dispatches here
          }
        } else {
          // Handle anonymous user
          dispatch(setCadeyResolved(true));
          dispatch(setCadeyUser(null));
        }
      } else {
        // Handle no user signed in
        dispatch(setCadeyResolved(false));
        dispatch(setFirebaseResolved(false));
        try {
          currentUser = await signInAnonymouslyDecorated();
          console.log('Signed in anonymously');

          dispatch(setIsAnonymous(true));
          dispatch(setCadeyResolved(true));
          dispatch(setCadeyUser(null));
          dispatch(setFirebaseUser(currentUser));
          // Optionally set the anonymous user, depending on your app logic.
          // Depending on your implementation, you might want to setUser here as well.
        } catch (error) {
          console.error('Error signing in anonymously:', error);
          dispatch(
            setHttpErrorModalData(
              AppMeta.httpErrorModalDataFirebaseTooManyRequests,
            ),
          );
        }
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

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
    setErrors(initialErrorsState);
    setMessages(initialMessagesState);
  };

  // Subscribe to auth state changes
  const signInAnonymouslyDecorated = async (): Promise<FirebaseUserModel> => {
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
      setTimeout(() => {
        history.push('/App/Welcome/Path');
      }, 4000);
    } catch (e) {
      if (e instanceof Error) {
        setErrorDecorated(e);
        throw e;
      }
      throw e;
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
            apiKey: AppMeta.cadeyApiKey,
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
    dispatch(setCadeyUser(cadeyUserLocal));
    return cadeyUserLocal;
  };

  return {
    errors,
    signInWithEmailAndPasswordDecorated,
    sendPasswordResetEmailDecorated,
    createUserWithEmailAndPasswordDecorated,
    messages,
    resetErrors: () => setErrors([]),
  };
};

export default useCadeyAuth;
