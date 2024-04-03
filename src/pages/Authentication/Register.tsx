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
import { trileanResolve } from '../../types/Trilean';

const RegistrationPage = () => {
  const authLoading = useSelector(
    (state: RootState) => state.authStatus.authLoading,
  );

  const aUserHasBeenReturned = useSelector((state: RootState) => {
    return state?.authStatus?.userData?.cadeyUser !== null;
  });

  const emailVerified = useSelector((state: RootState) => {
    return (
      state.authStatus?.emailVerified ||
      state.authStatus?.userData?.firebaseUser?.emailVerified
    );
  });

  const [loginState, setLoginState] = useState<string>('email'); // 'email' or 'password'

  const getValues = (loginStatus: string) => {
    setLoginState(loginStatus);
  };

  if (
    AppMeta.forceEmailVerification &&
    !trileanResolve(emailVerified) &&
    aUserHasBeenReturned
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
                Please enter a valid email address to get started.
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
