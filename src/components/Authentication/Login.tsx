import React, { useState } from 'react';
// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
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

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default LoginScreen;
