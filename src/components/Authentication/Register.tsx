import React, { useState } from 'react';
// Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../api/Firebase/InitializeFirebase';
// CSS
import './Register.css'; // Adjust the path as necessary

function RegisterComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigation to another component upon success can be handled here
      console.log('User registered');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
