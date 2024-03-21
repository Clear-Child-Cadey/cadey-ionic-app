import { IonButton } from '@ionic/react';
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
    <div className='email-verification-message'>
      <h2>Great! Now, check your email</h2>
      <p>{AppMeta.emailVerificationMessage}</p>
      <IonButton disabled={disabled} onClick={resendEmail}>
        {disabled
          ? `Please wait ${countdown} seconds to request a resend`
          : 'Resend Email'}
      </IonButton>
    </div>
  );
};

export default VerificationPage;
