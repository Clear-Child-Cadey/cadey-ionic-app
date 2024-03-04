import React, { useState } from 'react';

import './Login.css'; // Adjust the path as necessary
import useCadeyAuth from '../../hooks/useCadeyAuth';
import LoginErrors from '../notices/LoginErrors';
import LoginMessages from '../notices/LoginMessages';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
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
      // Navigation to another component upon success can be handled here
    } catch (e) {
      console.error(e);
    }
  };

  const handleForgotPassword = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (!email) {
      setLocalError('Please enter your email address to reset your password.');
      return;
    }

    await sendPasswordResetEmailDecorated(email);
    alert('Password reset email sent! Check your inbox.');
  };

  return (
    <div>
      <LoginMessages messages={messages} />
      <LoginErrors errors={errors} />
      <form onSubmit={handleLogin}>
        <input
          required
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
          required
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
        />
        <button type='submit'>Login</button>
      </form>
      {localError && <p>{localError}</p>}
      <p style={{ textAlign: 'center' }}>
        <span
          role='button'
          style={{ color: '#6B6B6B', cursor: 'pointer' }}
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
