import React, { useState } from 'react';
// Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../api/Firebase/InitializeFirebase';
// CSS
import './Register.css'; // Adjust the path as necessary
import LoginMessages from '../notices/LoginMessages';
import LoginErrors from '../notices/LoginErrors';
import useCadeyAuth from '../../hooks/useCadeyAuth';

function RegisterComponent() {
  const { messages, errors, createUserWithEmailAndPasswordDecorated } =
    useCadeyAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    try {
      await createUserWithEmailAndPasswordDecorated(email, password);
      // Navigation to another component upon success can be handled here
      console.log('User registered');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <LoginMessages messages={messages} />
      <LoginErrors errors={errors} />
      <form onSubmit={handleRegister}>
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
        <button type='submit'>Register</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default RegisterComponent;
