import React, { useEffect } from 'react';
import {
  IonButton,
  IonContent,
  IonLoading,
  IonPage,
  IonRow,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Auth, applyActionCode } from 'firebase/auth';

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

  useEffect(() => {
    if (auth && actionCode) {
      applyActionCode(auth, actionCode)
        .then(() => {
          auth.currentUser?.reload();
          // if (auth.currentUser) {
          //   auth.currentUser.reload();
          setTimeout(() => {
            if (auth.currentUser && auth.currentUser.emailVerified) {
              // Send the user to the home page if they are on the same device and have the same login session
              history.push('/App/Welcome');
              auth.signOut();
            } else {
              history.push('/App/Welcome');
            }
          }, 5000);
          // }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    // if (!loading) {
    //   const timeoutId = setTimeout(() => {
    //     if (auth.currentUser && auth.currentUser.emailVerified) {
    //       console.log('this is firing');
    //       // Send the user to the home page if they are on the same device and have the same login session
    //       history.push('/App/Welcome');
    //       auth.signOut();
    //     } else {
    //       history.push('/App/Welcome');
    //     }
    //   }, 5000);

    //   return () => clearTimeout(timeoutId);
    // }
  }, [auth.currentUser, actionCode, loading]);

  if (loading) {
    return <IonLoading isOpen={true} message={'Loading...'} />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='verify-email-content'>
          {auth.currentUser?.emailVerified ? (
            <>
              <h2 className='email-heading'>
                Your email has been succesfully verified!
              </h2>
              <IonRow className='content'>
                <IonButton
                  onClick={() =>
                    auth.currentUser?.uid
                      ? history.push('/App/Welcome')
                      : history.push('/App/Welcome')
                  }
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
              <h2 className='email-heading'>Oops!</h2>
              <p className='sub-heading'>
                There seems to have been a problem verifying your email address
              </p>
              <IonRow className='content'>
                <IonButton onClick={() => history.push('/App/Welcome')}>
                  Please try again
                </IonButton>
                <p className='info-text'>
                  If the problem presists, please contact support
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
