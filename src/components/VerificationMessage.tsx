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

interface Props {
  isAfterSignup?: boolean;
}

const VerificationPage: React.FC<Props> = ({
  isAfterSignup = false,
}: Props) => {
  const [disabled, setDisabled] = useState(isAfterSignup);
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
          <h2>Great! Now, check your email</h2>
          <p>{AppMeta.emailVerificationMessage}</p>
          <IonButton disabled={disabled} onClick={resendEmail}>
            {disabled
              ? `Please wait ${countdown} seconds to request a resend`
              : 'Resend Email'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VerificationPage;
