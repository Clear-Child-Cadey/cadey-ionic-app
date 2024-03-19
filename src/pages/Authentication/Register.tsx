import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonProgressBar,
  IonIcon,
  IonSearchbar,
  IonRow,
  IonButton,
} from '@ionic/react';
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// Styles
import './Login.css';
// Components
import RegistrationComponent from '../../components/Authentication/Register';

import AppMeta from '../../variables/AppMeta';
import VerificationPage from '../../components/VerificationMessage';

const RegistrationPage = () => {
  const authLoading = useSelector(
    (state: RootState) => state.authStatus.authLoading,
  );

  const [loginState, setLoginState] = useState<string>('email'); // 'email' or 'password'
  const [messages, setMessages] = useState<string[]>(['']);

  const getValues = (loginStatus: string, messages: string[]) => {
    setLoginState(loginStatus);
    setMessages(messages);
  };

  if (
    AppMeta.forceEmailVerification &&
    messages.includes(AppMeta.emailVerificationMessage)
  ) {
    return <VerificationPage />;
  }

  return (
    <IonPage className='login-page'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>Sign up for Cadey</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className={authLoading ? 'action-loading content' : 'content'}>
          <IonRow>
            {loginState !== 'password' && (
              <p className='login-instructions'>
                Please enter a valid email address to start your free 7-day
                trial.
              </p>
            )}
            <RegistrationComponent getValues={getValues} />
          </IonRow>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegistrationPage;
