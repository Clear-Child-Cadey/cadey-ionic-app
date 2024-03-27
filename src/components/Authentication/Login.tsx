import React, { useState } from 'react';
import { useHistory } from 'react-router';

import './Login.css'; // Adjust the path as necessary
import useCadeyAuth from '../../hooks/useCadeyAuth';
import LoginErrors from '../notices/LoginErrors';
import LoginMessages from '../notices/LoginMessages';
// API
// import { postUserAuth } from '../../api/Authentication';
// import { getQuiz } from '../../api/Quiz';
// Context
// import ApiUrlContext from '../../context/ApiUrlContext';
// // import { CadeyUserContext } from '../../main';
// import { useModalContext } from '../../context/ModalContext';
// import { useTabContext } from '../../context/TabContext';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store';
import useRequestQuiz from '../../hooks/useRequestQuiz';
import AppMeta from '../../variables/AppMeta';

const LoginComponent: React.FC = () => {
  // const { apiUrl } = useContext(ApiUrlContext);

  // const { setIsTabBarVisible } = useTabContext();
  // const { setQuizModalData } = useModalContext();
  // const [loginState, setLoginState] = useState('email'); // 'email' or 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const history = useHistory();
  const { requestQuiz } = useRequestQuiz({
    clientContext: 3,
    entityType: 0,
    entityId: 0,
  });

  const {
    messages,
    errors,
    signInWithEmailAndPasswordDecorated,
    sendPasswordResetEmailDecorated,
  } = useCadeyAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(''); // Clear any existing errors

    try {
      await signInWithEmailAndPasswordDecorated(email, password);

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
    // alert('Password reset email sent! Check your inbox.'); //Can be commented out, but this seemed a bit reduntant since there is already a message notifying the user on the page
  };

  const handleCreateAccount = () => {
    history.push('/App/Authentication/Register');
  };

  return (
    <div className='login-component'>
      <LoginMessages messages={messages} />
      <LoginErrors errors={errors} />
      {localError && <p className='error-message'>{localError}</p>}
      <form onSubmit={handleLogin}>
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

        <div style={{ marginTop: '1rem' }}>
          <label>Password</label>
          <input
            required
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />
        </div>

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
        <a onClick={handleCreateAccount}>Create an account</a>
      </p>
    </div>
  );
};

export default LoginComponent;
