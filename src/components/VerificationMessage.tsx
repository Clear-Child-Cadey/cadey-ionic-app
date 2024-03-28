import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import './VerificationMessage.css';
import AppMeta from '../variables/AppMeta';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const VerificationPage: React.FC = () => {
  const isCorporateUser = useSelector((state: RootState) => {
    return (
      state?.authStatus?.userData?.cadeyUser?.companyId &&
      state.authStatus.userData.cadeyUser.companyId > 0
    );
  });

  const [disabled, setDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const history = useHistory();
  const auth = getAuth();

  // Redirect user back to welcome page and refresh its data
  // const handleRedirectHome = () => {
  //   window.location.href = '/App/Welcome';
  // };

  const resendEmail = async () => {
    setDisabled(true);
    setCountdown(60);
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (disabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setDisabled(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [disabled, countdown]);

  useEffect(() => {
    if (auth.currentUser && auth.currentUser.emailVerified) {
      //Redirect user to welcome sequence if they have a verified email
      history.push('/App/Welcome/Path');
    }
  }, [auth]);

  return (
    <IonPage className='home'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>&nbsp;</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page'>
        <div className='email-verification-message'>
          <h2>
            {!isCorporateUser && (
              <>
                Great, you’re starting your 7-day free trial period. <br /> Now,
                check your email on this device.
              </>
            )}
            {isCorporateUser && (
              <>Great! Now, check your email on this device.</>
            )}
          </h2>

          <IonButton
            disabled={disabled}
            onClick={resendEmail}
            style={{ marginTop: '2rem' }}
          >
            {disabled
              ? `Please wait ${countdown} to request a resend`
              : 'Resend Email'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VerificationPage;
