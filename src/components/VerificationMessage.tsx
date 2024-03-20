import { IonButton } from '@ionic/react';
import { useState, useEffect } from 'react';
import './VerificationMessage.css';
import AppMeta from '../variables/AppMeta';
import { getAuth, sendEmailVerification } from 'firebase/auth';

interface Props {
  isAfterSignup?: boolean;
}

const VerificationPage: React.FC<Props> = ({
  isAfterSignup = false,
}: Props) => {
  const [disabled, setDisabled] = useState(isAfterSignup);
  const [countdown, setCountdown] = useState(60);

  const auth = getAuth();

  // Redirect user back to welcome page and refresh its data
  const handleRedirectHome = () => {
    window.location.href = '/App/Welcome';
  };

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

  return (
    <div className='email-verification-message'>
      <h2>Great! Now, check your email</h2>
      <p>{AppMeta.emailVerificationMessage}</p>
      {!isAfterSignup && (
        <IonButton onClick={handleRedirectHome}>I already verified</IonButton>
      )}
      <IonButton disabled={disabled} onClick={resendEmail}>
        {disabled
          ? `Please wait ${countdown} seconds to request a resend`
          : 'Resend Email'}
      </IonButton>
    </div>
  );
};

export default VerificationPage;