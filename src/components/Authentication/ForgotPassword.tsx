import React, { useState } from 'react';

import './ForgotPassword.css'; // Adjust the path as necessary
import useCadeyAuth from '../../hooks/useCadeyAuth';
import LoginErrors from '../notices/LoginErrors';
import LoginMessages from '../notices/LoginMessages';
import {
  actionButton,
  actionButtonWrap,
  actionError,
  actionErrorText,
  actionFormFieldsWrap,
  actionMessageText,
  actionOuterWrap,
} from '../../pages/Authentication/Landing';

function ForgotPasswordComponent() {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const { sendPasswordResetEmailDecorated, errors, messages, loading } =
    useCadeyAuth();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await sendPasswordResetEmailDecorated(email);
      // Optionally, clear the email field or show a success message
      setEmail('');
      setLocalError(''); // Clear any existing errors on successful reset
      // Show success message or handle accordingly
    } catch (err) {
      if (err instanceof Error) {
        // If the error is an instance of Error, display its message
        setLocalError(err.message);
      } else {
        // If the error is not an instance of Error, set a default error message
        setLocalError('Failed to send password reset email. Please try again.');
      }
    }
  };

  return (
    <div className={actionOuterWrap}>
      <LoginMessages messages={messages} />
      <LoginErrors errors={errors} />

      <p className={actionMessageText}>
        Enter Your Email to Reset Your Password
      </p>
      <form className={actionFormFieldsWrap} onSubmit={handleForgotPassword}>
        <input
          required
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={actionButton} type='submit'>
          Reset Password
        </button>
      </form>
      {localError && <p className={actionError}>{localError}</p>}
    </div>
  );
}

export default ForgotPasswordComponent;
