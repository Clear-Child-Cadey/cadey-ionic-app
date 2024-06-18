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
import useDeviceFacts from '../../hooks/useDeviceFacts';
import getDeviceId from '../../utils/getDeviceId';
import { useAppPage } from '../../context/AppPageContext';

const RegistrationSelectPage = () => {
  const history = useHistory();
  const { logDeviceFact } = useDeviceFacts();
  const deviceId = getDeviceId();
  const { currentBasePage } = useAppPage();

  const handleCorporate = () => {
    logDeviceFact({
      deviceId: deviceId,
      userFactTypeName: 'UserTap',
      appPage: 'Register Select',
      detail1: currentBasePage,
      detail2: 'Corporate Signup Button',
    });

    history.push('/App/Authentication/Register');
  };

  const handleTrial = () => {
    logDeviceFact({
      deviceId: deviceId,
      userFactTypeName: 'UserTap',
      appPage: 'Register Select',
      detail1: currentBasePage,
      detail2: 'Free Trial Signup Button',
    });

    history.push('/App/Authentication/Register');
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
              onClick={() => handleCorporate()}
            >
              Corporate user signup
            </IonButton>
          </IonRow>
        </IonRow>
        <IonRow className='free-trial'>
          <IonRow className='free-trial-text'>
            Otherwise start your free 7-day trial
          </IonRow>
          <h3>Cadey Pro</h3>
          <IonRow className='free-trial-text'>
            Learn parenting strategies in the moment with quick videos, watch
            weekly webinars, and pinpoint your concerns with assessments
          </IonRow>
          <IonRow className='continue-row'>
            <IonButton
              className='continue-button'
              onClick={() => handleTrial()}
            >
              Free trial signup
            </IonButton>
          </IonRow>
          <IonRow className='free-trial-text'>(After that $9.99/month)</IonRow>
          <div className='support-links'>
            <a href='https://clearchildpsychology.com/TermsOfUse/'>
              Terms of Use
            </a>
            <a href='https://clearchildpsychology.com/privacy/'>
              Privacy Policy
            </a>
          </div>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default RegistrationSelectPage;
