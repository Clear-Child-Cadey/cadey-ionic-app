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

const RegistrationPage = () => {
  const authLoading = useSelector(
    (state: RootState) => state.authStatus.authLoading,
  );

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
            <p className='login-instructions'>
              Please enter a valid email address to start your free 7-day trial.
            </p>
            <RegistrationComponent />
          </IonRow>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegistrationPage;
