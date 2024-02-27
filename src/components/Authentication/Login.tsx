import React, { useState } from 'react';
// Firebase
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../../api/Firebase/InitializeFirebase';
// CSS
import './Login.css'; // Adjust the path as necessary

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation to another component upon success can be handled here
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      setError(
        'Failed to send password reset email. Please make sure the email is correct.',
      );
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
        />
        <button type='submit'>Login</button>
        <button type='button' onClick={handleForgotPassword}>
          Forgot Password?
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default LoginScreen;
