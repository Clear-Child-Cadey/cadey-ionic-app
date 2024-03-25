import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonLoading,
  IonPage,
  IonRow,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Auth, applyActionCode } from 'firebase/auth';

// Styles
import './VerifyEmailPage.css';

import presentToast from '../../utils/presentToast';

interface Props {
  auth: Auth;
  actionCode: string | null;
  loading: boolean;
}

// This is a minimum designed Page
const VerifyEmailPage: React.FC<Props> = ({
  auth,
  actionCode,
  loading,
}: Props) => {
  const history = useHistory();
  const [emailverified, setEmailVerified] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [firingToast, setFiringToast] = useState(false);

  const [present] = useIonToast();

  const fireToast = () => {
    if (firingToast) {
      return;
    }
    setFiringToast(true);
    presentToast(
      present,
      'top',
      'Email verified successfully, please log in',
      3000,
    );
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (auth && actionCode) {
      applyActionCode(auth, actionCode)
        .then(() => {
          setEmailVerified(true);

          auth.currentUser?.reload();
          timeoutId = setTimeout(() => {
            if (auth.currentUser && auth.currentUser.emailVerified) {
              auth.signOut();
              // Send the user to the home page if they are on the same device and have the same login session
              history.push('/App/Welcome');
              fireToast();
            } else {
              history.push('/App/Welcome');
            }
          }, 8000); //To account for the loading spinner on the previous page
          // }
        })
        .catch((err) => {
          console.log(err.message);
          setEmailVerified(false);
        });
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [auth, actionCode]);

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

  if (loading) {
    return <IonLoading isOpen={true} message={'Loading...'} />;
  }

  return (
    <IonPage className='home'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>&nbsp;</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='verify-email-content'>
          {emailverified || auth.currentUser?.emailVerified ? (
            <>
              <h2 className='email-heading'>
                Your email has been succesfully verified!
              </h2>
              <IonRow className='content'>
                <IonButton
                  onClick={() => {
                    fireToast();
                    history.push('/App/Welcome');
                  }}
                >
                  Take me back
                </IonButton>
                <p className='info-text'>
                  If you aren't automatically redirected within the next 5
                  seconds, please click the button
                </p>
              </IonRow>
            </>
          ) : (
            <>
              <h2 className='email-heading'>OOPS!</h2>
              <p className='sub-heading'>
                There seems to have been a problem verifying your email address,
                please log in and try the link in your email again.
              </p>
              <IonRow className='content'>
                <IonButton
                  disabled={disabled}
                  onClick={() => history.push('/App/Welcome')}
                >
                  Take me back
                </IonButton>
                {/* update this to correct email address */}
                <p className='info-text'>
                  If the problem presists, please contact support at{' '}
                  <a href='mailto:support@cadey.com'>support@cadey.com</a>
                </p>
              </IonRow>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VerifyEmailPage;
