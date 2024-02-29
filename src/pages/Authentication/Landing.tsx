import React, { useState } from 'react';
// Components
import LoginComponent from '../../components/Authentication/Login';
import RegisterComponent from '../../components/Authentication/Register';
import ForgotPasswordComponent from '../../components/Authentication/ForgotPassword';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
    setShowRegister(true);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgotPassword(true);
  };

  const loginWrapStyles = {
    display: 'flex',
    gap: '1rem',
    marginTop: '100px',
  };

  return (
    <div style={loginWrapStyles}>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleRegisterClick}>Register</button>
      <button onClick={handleForgotPasswordClick}>Forgot Password</button>

      {showLogin && <LoginComponent />}
      {showRegister && <RegisterComponent />}
      {showForgotPassword && <ForgotPasswordComponent />}
    </div>
  );
};

export default LandingPage;
