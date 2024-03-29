import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonRow,
  IonButton,
} from '@ionic/react';
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// Styles
import './Grandfather.css';

const GrandfatherPage = () => {
  const history = useHistory();

  const handleContinue = (url: string) => {
    // Log user fact?

    history.push(url);
  };

  return (
    <IonPage className='welcome grandfather'>
      <IonContent fullscreen>
        <IonRow className='welcome-content'>
          <h2>Welcome back to Cadey!</h2>
          <IonRow className='grandfather-text'>
            We have made some enhancements. To continue using the app, please
            create an account. It's quick and easy!
          </IonRow>
          <IonRow className='continue-row'>
            <IonButton
              className='continue-button'
              onClick={() => handleContinue('/App/Authentication/Register')}
            >
              Signup
            </IonButton>
          </IonRow>
        </IonRow>
        <IonRow className='welcome-image'>
          <img src='assets/images/welcome.png' />
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default GrandfatherPage;
