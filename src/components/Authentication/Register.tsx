import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';

import './Login.css'; // Adjust the path as necessary
import useCadeyAuth from '../../hooks/useCadeyAuth';
import LoginErrors from '../notices/LoginErrors';
import LoginMessages from '../notices/LoginMessages';
// Context
import ApiUrlContext from '../../context/ApiUrlContext';
import AppMeta from '../../variables/AppMeta';
// import requestQuiz from '../../utils/Quiz';
import useRequestQuiz from '../../hooks/useRequestQuiz';

interface Props {
  getValues: (loginStatus: string, messages: string[]) => void;
}

const RegistrationComponent: React.FC<Props> = ({ getValues }: Props) => {
  const { apiUrl } = useContext(ApiUrlContext);
  const [loginState, setLoginState] = useState('email'); // 'email' or 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const history = useHistory();
  const { requestQuiz } = useRequestQuiz({
    clientContext: 3,
    entityType: 0,
    entityId: 0,
    shouldHaveEmailVerified: AppMeta.forceEmailVerification,
  });

  const {
    resetErrors,
    messages,
    errors,
    createUserWithEmailAndPasswordDecorated,
  } = useCadeyAuth();

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(''); // Clear any existing errors
    setLoginState('password');
  };

  const handlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(''); // Clear any existing errors

    try {
      await createUserWithEmailAndPasswordDecorated(email, password);

      // Check for onboarding quiz
      console.log('Requesting quiz...');
      requestQuiz();
    } catch (e) {
      setLocalError(
        'Oops! Something went wrong. Please contact us at support@cadey.co.',
      );
      console.error(e);
    }
  };

  const handleLogin = () => {
    history.push('/App/Authentication/Login');
  };

  useEffect(() => {
    getValues(loginState, messages);
  }, [loginState, messages]);

  //TODO: fix conditional rendering logic and add button to manually trigger email verification
  return (
    <div className='login-component'>
      <LoginMessages messages={messages} />
      <LoginErrors
        errors={errors}
        goBack={() => {
          setEmail('');
          setPassword('');
          setLoginState('email');
          resetErrors();
        }}
      />
      {localError && <p className='error-message'>{localError}</p>}

      <form onSubmit={loginState === 'email' ? handleEmail : handlePassword}>
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
            <label>Create your password here.</label>
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
        Already have an account? <a onClick={handleLogin}>Login</a>
      </p>
    </div>
  );
};

export default RegistrationComponent;
