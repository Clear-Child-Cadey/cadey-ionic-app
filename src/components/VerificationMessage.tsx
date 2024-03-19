import { IonButton } from '@ionic/react';
import { useState, useEffect } from 'react';
import './VerificationMessage.css';
import AppMeta from '../variables/AppMeta';

const VerificationPage: React.FC = () => {
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Redirect user back to welcome page and refresh its data
  const handleRedirectHome = () => {
    // user?.reload(); redux issue!
    // history.push('/App/Welcome');
    window.location.href = '/App/Welcome';
  };

  const resendEmail = () => {
    setDisabled(true);
    setCountdown(60);
    // Your logic to resend the email goes here
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
      <IonButton onClick={handleRedirectHome}>I already verified</IonButton>
      <IonButton disabled={disabled} onClick={resendEmail}>
        {disabled
          ? `Please wait ${countdown} seconds to request a resend`
          : 'Resend Email'}
      </IonButton>
    </div>
  );
};

export default VerificationPage;
