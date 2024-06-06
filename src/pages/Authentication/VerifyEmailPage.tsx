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
import { useSelector } from 'react-redux';
import { Auth, applyActionCode } from 'firebase/auth';
import presentToast from '../../utils/presentToast';
import { RootState } from '../../store';

// Styles
import './VerifyEmailPage.css';

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

  const isCorporateUser = useSelector((state: RootState) => {
    return (
      state?.authStatus?.userData?.cadeyUser?.companyId &&
      state.authStatus.userData.cadeyUser.companyId > 0
    );
  });

  const isGrandfatheredUser = useSelector((state: RootState) => {
    return state?.authStatus?.grandfatherStatus;
  });

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

  // if (loading) {
  //   return <IonLoading isOpen={loading} message={'Loading...'} />;
  // }

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
              <h2>Great! Your email has been verified. Welcome to Cadey!</h2>
              <img src='assets/svgs/smile.svg' />
              <IonRow className='content'>
                <IonButton
                  onClick={() => {
                    fireToast();
                    auth.signOut().then(() => {
                      // history.push('/App/Authentication/Login');
                      window.location.href = '/App/Authentication/Login';
                    });
                  }}
                >
                  Log in to get started
                </IonButton>
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
                  onClick={() => history.push('/App/Authentication/Login')}
                >
                  Log in to get started
                </IonButton>
                <p className='info-text'>
                  If the problem presists, please contact support at{' '}
                  <a href='mailto:support@cadey.co'>support@cadey.co</a>
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
