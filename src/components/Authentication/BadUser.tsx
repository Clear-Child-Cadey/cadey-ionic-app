import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import './BadUser.css';
import { getAuth } from 'firebase/auth';
import { useHistory } from 'react-router';

interface BadUserProps {
  authStatus: number | undefined;
  regStatus: number | undefined;
}

const BadUser: React.FC<BadUserProps> = ({ authStatus, regStatus }) => {
  console.log('BadUser.tsx');

  const history = useHistory();
  const auth = getAuth();

  const handleRedirect = () => {
    auth.signOut();
    history.push('/App/Welcome');
    window.location.reload();
  };

  let header = '';
  let message = '';

  // regstatus
  //
  //     0 = Registered
  //     1 = NotFound
  //     2 = FoundNotRegistered
  //
  // authstatus
  //
  //     0 = Successful
  //     1 = FailedExpired
  //     2 = FailedNotActive
  //     3 = FailedNotRegistered

  if (regStatus != 0) {
    header = 'You are not registered';
    message = 'Please contact your employer to register.';
  } else {
    if (authStatus === 1) {
      header = 'Your trial period has expired';
      message = 'Now, request Cadey as a benefit from your employer.';
    } else if (authStatus === 2) {
      header = 'Your account is not active';
      message = 'Please contact your employer to activate your account.';
    } else if (authStatus === 3) {
      header = 'You are not registered';
      message = 'Please contact your employer to register.';
    }
  }

  return (
    <IonPage className='home'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>&nbsp;</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='trial-period-message'>
          <h2>{header}</h2>
          <p>
            {message} Or feel free to contact us at{' '}
            <a href='mailto:support@cadey.co'>support@cadey.co</a> for
            assistance.
          </p>
          <IonButton
            onClick={() =>
              window.open('https://cadey.co/request-benefits', '_blank')
            }
          >
            Request Benefits
          </IonButton>
          <IonButton onClick={handleRedirect}>Sign Out</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BadUser;
