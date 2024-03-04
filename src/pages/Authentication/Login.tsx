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
import LoginComponent from '../../components/Authentication/Login';

const LoginPage = () => {
  const authLoading = useSelector(
    (state: RootState) => state.authStatus.authLoading,
  );

  return (
    <IonPage className='login-page'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>Sign in to Cadey</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className={authLoading ? 'action-loading content' : 'content'}>
          <IonRow>
            <p className='login-instructions'>
              Please enter your registered email address.
            </p>
            <LoginComponent />
          </IonRow>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
