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
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../api/Firebase/InitializeFirebase';
// Redux
import {
  setCadeyResolved,
  setFirebaseResolved,
  setIsAnonymous,
  setCadeyUser,
  setFirebaseUser,
  setEmailVerified,
} from '../features/authLoading/slice';
// API
import ApiUrlContext from '../context/ApiUrlContext';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import FirebaseUserModel from '../types/FirebaseUserModel';
import AppMeta from '../variables/AppMeta';
import { RootState } from '../store';
import { useHistory } from 'react-router';
import { setHttpErrorModalData } from '../features/httpError/slice';
import getDeviceId from '../utils/getDeviceId';
import useDeviceFacts from './useDeviceFacts';

import axios from '../config/AxiosConfig';

const useCadeyAuth = () => {
  const countRef = React.useRef(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const { logDeviceFact } = useDeviceFacts();
  const initialErrorsState: string[] = [];
  const initialMessagesState: string[] = [];
  const currentDeviceId = getDeviceId();

  const [errors, setErrors] = useState<[] | Array<string>>(initialErrorsState);
  const [messages, setMessages] = useState(initialMessagesState);

  const { apiUrl } = React.useContext(ApiUrlContext);

  const [bypassOnAuthStateChange, setBypassOnAuthStateChange] = useState(false);

  useEffect(() => {
    // This effect replaces the waitForAuthStateChange mechanism
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (bypassOnAuthStateChange) {
        return;
      }
      if (currentUser) {
        // Dispatch relevant actions for current user
        dispatch(setIsAnonymous(currentUser.isAnonymous));
        dispatch(setFirebaseUser(currentUser));
        dispatch(setFirebaseResolved(true));
        dispatch(setEmailVerified(currentUser.emailVerified));
        if (!currentUser.isAnonymous) {
          // Handle logged in user
          try {
            const cadeyUser = await handleCadeyLoginAndReturnUser(currentUser);
            dispatch(setCadeyUser(cadeyUser));
            dispatch(setCadeyResolved(true));
            unsubscribe();
          } catch (error) {
            console.error('Error handling Cadey login:', error);
            setErrors([...errors, error.message]); // Should probably refactor into global state, and then clear errors when things complete / next thing starts
            // Handle any additional error state updates or dispatches here
          }
        } else {
          // Handle anonymous user
          dispatch(setCadeyResolved(true));
          dispatch(setCadeyUser(null));
          unsubscribe();
        }
      } else {
        // Handle no user signed in
        dispatch(setCadeyResolved(false));
        dispatch(setFirebaseResolved(false));
        try {
          currentUser = await signInAnonymouslyDecorated();

          dispatch(setIsAnonymous(true));
          dispatch(setCadeyResolved(true));
          dispatch(setCadeyUser(null));
          dispatch(setFirebaseUser(currentUser));
          unsubscribe();
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

  const runAfterRequest = () => {
    setBypassOnAuthStateChange(false);
  };

  const runBeforeRequest = async () => {
    setErrors(initialErrorsState);
    setMessages(initialMessagesState);
    setBypassOnAuthStateChange(true);
  };

  // Subscribe to auth state changes
  const signInAnonymouslyDecorated = async (): Promise<FirebaseUserModel> => {
    runBeforeRequest();

    try {
      const result = await signInAnonymously(auth);

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
      const { user: currentUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // We need to set firebaseUser here.
      // dispatch(setFirebaseUser(currentUser));

      const cadeyUser = await handleCadeyLoginAndReturnUser(currentUser);
      dispatch(setCadeyUser(cadeyUser));
      dispatch(setCadeyResolved(true));

      // Log a Firebase authentication success userfact
      logDeviceFact({
        userFactTypeName: 'FirebaseAuthenticationAttempt',
        appPage: 'Login',
        detail1: email, // email
        detail2: cadeyUser.authId, // authId
        detail3: 'Success', // Firebase status
        detail4: '', // Error message
      });
    } catch (e) {
      if (e instanceof Error) {
        // Log a Firebase authentication error userfact
        logDeviceFact({
          userFactTypeName: 'FirebaseAuthenticationAttempt',
          appPage: 'Login',
          detail1: email, // email
          detail2: '', // authId
          detail3: 'Failure', // Firebase status
          detail4: e.message, // Error message
        });

        setErrorDecorated(e);
        throw e;
      }
      // Log a Firebase authentication error userfact
      logDeviceFact({
        userFactTypeName: 'FirebaseAuthenticationAttempt',
        appPage: 'Login',
        detail1: email, // email
        detail2: '', // authId
        detail3: 'Failure', // Firebase status
        detail4: 'Unknown error', // Error message
      });
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const cadeyUser = await handleCadeyRegistrationUser(userCredential.user);
      dispatch(setCadeyUser(cadeyUser));
      if (AppMeta.forceEmailVerification) {
        await sendEmailVerification(userCredential.user);
        setMessageDecorated(AppMeta.emailVerificationMessage);
      }
      // Log a Firebase registration success userfact
      logDeviceFact({
        userFactTypeName: 'FirebaseAccountCreation',
        appPage: 'Register',
        detail1: email,
        detail2: cadeyUser.authId,
        detail3: 'Success',
        detail4: '',
      });
    } catch (e) {
      if (e instanceof Error) {
        // Log a Firebase registration error userfact
        logDeviceFact({
          userFactTypeName: 'FirebaseAccountCreation',
          appPage: 'Register',
          detail1: email,
          detail2: '',
          detail3: 'Failure',
          detail4: e.message,
        });
        setErrorDecorated(e);
        throw e;
      }
      // Log a Firebase registration error userfact
      logDeviceFact({
        userFactTypeName: 'FirebaseAccountCreation',
        appPage: 'Register',
        detail1: email,
        detail2: '',
        detail3: 'Failure',
        detail4: 'Unknown error',
      });
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
      setMessageDecorated(
        'Password reset email sent! If you do not receive a password reset email, please create an account or check your spam folder.',
      ); // Move this copy to appMeta later
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

  const handleCadeyLoginAndReturnUser = async (
    firebaseUser: User,
    authenticatedAuthId?: string, // This can be removed, it's never used
  ) => {
    const url = `${apiUrl}/userauth`;
    const cadeyUserDeviceId = await getDeviceId();

    const bodyObject = {
      cadeyUserEmail: firebaseUser.email,
      // authId: firebaseUser.uid, // This is the anonymous user ID
      authId: authenticatedAuthId // authenticatedAuthId is never passed in, so this is always the firebaseUser.uid. Can remove.
        ? authenticatedAuthId
        : firebaseUser.uid, //Pass in the authenticated firebase ID, fallback to the anonymous ID if not explicitly passed
      cadeyUserDeviceId,
    };

    const response = await axios.post(url, bodyObject, {
      headers: {
        accept: 'text/plain',
        apiKey: AppMeta.cadeyApiKey,
        'Content-Type': 'application/json',
      },
    });

    runAfterRequest();

    const cadeyUserLocal = await response.data;
    dispatch(setCadeyUser(cadeyUserLocal));
    dispatch(setFirebaseUser(firebaseUser)); // Move this to line 182?

    return cadeyUserLocal;
  };

  const handleCadeyRegistrationUser = async (firebaseUser: User) => {
    const url = `${apiUrl}/userreg`;
    const cadeyUserDeviceId = await getDeviceId();
    const bodyObject = {
      cadeyUserEmail: firebaseUser.email,
      authId: firebaseUser.uid,
      cadeyUserDeviceId,
    };

    const response = await axios.post(url, bodyObject, {
      headers: {
        accept: 'text/plain',
        apiKey: AppMeta.cadeyApiKey,
        'Content-Type': 'application/json',
      },
    });

    runAfterRequest();

    const cadeyUserLocal = await response.data;
    dispatch(setCadeyUser(cadeyUserLocal));
    return cadeyUserLocal;
  };

  return {
    errors, // Remove this later, shouldn't be exposed as it's state-based
    signInWithEmailAndPasswordDecorated,
    sendPasswordResetEmailDecorated,
    createUserWithEmailAndPasswordDecorated,
    messages, // Remove this later, shouldn't be exposed as it's state-based. Need to refactor to global state if we ever use this in multiple places.
    resetErrors: () => setErrors([]),
    setErrorDecorated,
  };
};

export default useCadeyAuth;
