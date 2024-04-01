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
import './RegisterSelect.css';

const RegistrationSelectPage = () => {
  const history = useHistory();

  const handleContinue = (url: string) => {
    // Log user fact?

    history.push(url);
  };

  return (
    <IonPage className='register-select'>
      <IonContent fullscreen>
        <IonRow className='corporate'>
          <IonRow className='corporate-text'>
            Your employer has provided access to Cadey
          </IonRow>
          <IonRow className='continue-row'>
            <IonButton
              className='continue-button'
              onClick={() => handleContinue('/App/Authentication/Register')}
            >
              Corporate user signup
            </IonButton>
          </IonRow>
        </IonRow>
        <IonRow className='free-trial'>
          <IonRow className='free-trial-text'>
            Otherwise start your free 7-day trial
          </IonRow>
          <IonRow className='continue-row'>
            <IonButton
              className='continue-button'
              onClick={() => handleContinue('/App/Authentication/Register')}
            >
              Free trial signup
            </IonButton>
          </IonRow>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default RegistrationSelectPage;
