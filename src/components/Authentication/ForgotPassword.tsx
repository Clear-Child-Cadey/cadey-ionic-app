import React, { useState } from 'react';
// Firebase
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../api/Firebase/InitializeFirebase';
// CSS
import './ForgotPassword.css'; // Adjust the path as necessary

function ForgotPasswordComponent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

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
      <input
        type='email'
        placeholder='Enter your email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type='button' onClick={handleForgotPassword}>
        Reset Password
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default ForgotPasswordComponent;
