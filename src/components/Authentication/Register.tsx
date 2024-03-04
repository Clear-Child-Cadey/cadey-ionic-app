import React, { useState } from 'react';
// Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../api/Firebase/InitializeFirebase';
// CSS
import './Register.css'; // Adjust the path as necessary
import LoginMessages from '../notices/LoginMessages';
import LoginErrors from '../notices/LoginErrors';
import useCadeyAuth from '../../hooks/useCadeyAuth';
import {
  actionButton,
  actionButtonWrap,
  actionError,
  actionFormFieldsWrap,
  actionOuterWrap,
} from '../../pages/Authentication/Login';

function RegisterComponent() {
  const { messages, errors, createUserWithEmailAndPasswordDecorated, loading } =
    useCadeyAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLocalError(''); // Clear any existing localErrors

    try {
      await createUserWithEmailAndPasswordDecorated(email, password);
      // Navigation to another component upon success can be handled here
      console.log('User registered');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={actionOuterWrap}>
      <LoginMessages messages={messages} />
      <LoginErrors errors={errors} />
      <form className={actionFormFieldsWrap} onSubmit={handleRegister}>
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
        <button className={actionButton} type='submit'>
          Register
        </button>
      </form>
      {localError && <p className={actionError}>{localError}</p>}
    </div>
  );
}

export default RegisterComponent;
