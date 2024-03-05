import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';

import './Login.css'; // Adjust the path as necessary
import useCadeyAuth from '../../hooks/useCadeyAuth';
import LoginErrors from '../notices/LoginErrors';
import LoginMessages from '../notices/LoginMessages';
// API
import { postUserAuth } from '../../api/Authentication';
import { getQuiz } from '../../api/Quiz';
// Context
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
import { useModalContext } from '../../context/ModalContext';
import { useTabContext } from '../../context/TabContext';

const LoginComponent: React.FC = () => {
  const { apiUrl } = useContext(ApiUrlContext);
  const { cadeyUserId } = useContext(CadeyUserContext);
  const { setIsTabBarVisible } = useTabContext();
  const { setQuizModalData } = useModalContext();
  const [loginState, setLoginState] = useState('email'); // 'email' or 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const history = useHistory();

  const {
    messages,
    errors,
    signInWithEmailAndPasswordDecorated,
    sendPasswordResetEmailDecorated,
  } = useCadeyAuth();

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(''); // Clear any existing errors

    // Handle email submission with the API
    // const userAuthResponse = await postUserAuth(apiUrl, email);
    // if (userAuthResponse.cadeyUserId > 0) {
    //   // User exists
    //   if (userAuthResponse.regStatus === 0) {
    //     // User is registered
    //     // Create a switch based on authStatus. If 0, user is registered. If 1, user's trial has expired. If 2, user is inactive and has no permissions.
    //     switch (userAuthResponse.authStatus) {
    //       case 0:
    //         // User is registered
    //         setLoginState('password');
    //         break;
    //       case 1:
    //         // User's trial has expired
    //         setLocalError(
    //           'Your trial has expired. Please contact support to continue using Cadey.',
    //         );
    //         console.log('User trial expired');
    //         break;
    //       case 2:
    //         // User is inactive and has no permissions
    //         setLocalError(
    //           'Your account is inactive. Please contact support to continue using Cadey.',
    //         );
    //         console.log('User is inactive');
    //         break;
    //       default:
    //         setLocalError('An unknown error occurred.');
    //         console.log('Unknown error');
    //         break;
    //     }
    //   } else {
    //     // User is not registered
    //     setLocalError('User not registered. Please create an account.');
    //     console.log('User not registered');
    //     return;
    //   }
    // } else {
    //   // User does not exist
    //   setLocalError('User not found. Please create an account.');
    //   console.log('User not found');
    //   return;
    // }

    setLoginState('password');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(''); // Clear any existing errors

    try {
      await signInWithEmailAndPasswordDecorated(email, password);
      // Navigation to another component upon success can be handled here
      // history.push('/App/Home'); // Redirect to Home
      // Check for onboarding quiz
      requestQuiz();
    } catch (e) {
      console.error(e);
    }
  };

  const handleForgotPassword = async () => {
    setLocalError(''); // Clear any existing errors
    if (!email) {
      setLocalError('Please enter your email address to reset your password.');
      return;
    }

    await sendPasswordResetEmailDecorated(email);
    alert('Password reset email sent! Check your inbox.');
  };

  const handleCreateAccount = () => {
    history.push('/App/Authentication/Register');
  };

  const requestQuiz = async () => {
    console.log('Checking for welcome sequence');
    const quizResponse = await getQuiz(
      apiUrl,
      Number(cadeyUserId),
      3, // Client Context: Where the user is in the app (3 = Onboarding sequence)
      0, // Entity Type (1 = video)
      0, // Entity IDs (The ID of the video)
    );

    // If the user has not completed the welcome sequence, take them to the welcome sequence
    if (quizResponse.question !== null && quizResponse.question.id > 0) {
      // Set the quiz data
      setQuizModalData(quizResponse);

      // Hide the tab bar
      setIsTabBarVisible(false);

      // Redirect user to Welcome sequence - Age group
      history.push('/App/Welcome/Path');
    } else {
      // Show the tab bar and redirect to the home page
      setIsTabBarVisible(true);
      history.push('/App/Home');
    }
  };

  return (
    <div className='login-component'>
      {/* <LoginMessages messages={messages} />
      <LoginErrors errors={errors} /> */}
      {localError && <p className='error-message'>{localError}</p>}
      <form onSubmit={loginState === 'email' ? handleEmail : handleLogin}>
        {loginState === 'email' && (
          <>
            <label>Email</label>
            <input
              required
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
            />
          </>
        )}
        {loginState === 'password' && (
          <>
            <label>Password</label>
            <input
              required
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />
          </>
        )}
        <button
          className='continue'
          type='submit'
          disabled={!email && !password}
        >
          Continue
        </button>
      </form>
      <p>
        <a onClick={handleForgotPassword}>Forgot Password?</a>
      </p>
      <p>
        Don't have an account?{' '}
        <a onClick={handleCreateAccount}>Create a free account</a>
      </p>
    </div>
  );
};

export default LoginComponent;
