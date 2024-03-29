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

  const handleButtonClick = () => {
    // Log user fact?

    history.push('/App/Authentication/Register');
  };

  return (
    <IonPage className='grandfather-page'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>Grandfather!</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <p className='grandfather-copy'>
            We're grandfathering your account permanently! Please register to
            continue using Cadey for free.
          </p>
          <IonButton className='grandfather-button' onClick={handleButtonClick}>
            Register
          </IonButton>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default GrandfatherPage;
