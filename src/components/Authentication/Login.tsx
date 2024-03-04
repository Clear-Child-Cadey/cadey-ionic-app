import React, { useState } from 'react';
import { useHistory } from 'react-router';

import './Login.css'; // Adjust the path as necessary
import useCadeyAuth from '../../hooks/useCadeyAuth';
import LoginErrors from '../notices/LoginErrors';
import LoginMessages from '../notices/LoginMessages';

const LoginComponent: React.FC = () => {
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
    // Handle email submission with the API

    setLoginState('password');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(''); // Clear any existing errors

    try {
      await signInWithEmailAndPasswordDecorated(email, password);
      // Navigation to another component upon success can be handled here
    } catch (e) {
      console.error(e);
    }
  };

  const handleForgotPassword = async () => {
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

  return (
    <div className='login-component'>
      <LoginMessages messages={messages} />
      <LoginErrors errors={errors} />
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
      {localError && <p>{localError}</p>}
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
