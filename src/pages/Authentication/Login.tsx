import React, { useEffect, useState } from 'react';
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// Styles
import './Login.css';
// Components
import LoginComponent from '../../components/Authentication/Login';
import RegisterComponent from '../../components/Authentication/Register';
import ForgotPasswordComponent from '../../components/Authentication/ForgotPassword';

type UserAction = 'login' | 'register' | 'forgotPassword';

export const actionError = 'action-error';
export const actionButtonWrap = 'action-button-wrap';
export const actionButton = 'action-button';
export const actionButtonActive = 'action-button-active';
export const actionMessageText = 'action-message-text';
export const actionErrorText = 'action-error-text';
export const actionOuterWrap = 'action-outer-wrap';
export const actionFormFieldsWrap = 'action-form-fields-wrap';

const LoginPage = () => {
  const authLoading = useSelector(
    (state: RootState) => state.authStatus.authLoading,
  );

  const components = {
    login: LoginComponent,
    register: RegisterComponent,
    forgotPassword: ForgotPasswordComponent,
  };

  useEffect(() => {
    console.log(authLoading, 'LOADING!');
  }, [authLoading]);

  const [tab, setTab] = useState<UserAction>('login');

  const handleLoginClick = () => {
    setTab('login');
  };

  const handleRegisterClick = () => {
    setTab('register');
  };

  const handleForgotPasswordClick = () => {
    setTab('forgotPassword');
  };

  const actionButtonActiveClasses = `${actionButton} ${actionButtonActive}`;

  return (
    <div>
      <div className='action-tabs'>
        <button
          className={tab === 'login' ? actionButtonActiveClasses : actionButton}
          onClick={handleLoginClick}
        >
          Login
        </button>
        <button
          className={
            tab === 'register' ? actionButtonActiveClasses : actionButton
          }
          onClick={handleRegisterClick}
        >
          Register
        </button>
        <button
          className={
            tab === 'forgotPassword' ? actionButtonActiveClasses : actionButton
          }
          onClick={handleForgotPasswordClick}
        >
          Forgot Password
        </button>
      </div>

      {authLoading && <div>Loading...</div>}

      <div className={authLoading ? 'action-loading' : ''}>
        {React.createElement(components[tab])}
      </div>
    </div>
  );
};

export default LoginPage;
