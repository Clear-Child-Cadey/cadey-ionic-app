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
          <h2>Login</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <div className={authLoading ? 'action-loading' : ''}>
            <LoginComponent />
          </div>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
