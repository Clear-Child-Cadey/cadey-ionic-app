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
import { useEffect, useState } from 'react';

interface BadUserProps {
  authStatus: number | undefined;
  regStatus: number | undefined;
}

const BadUser: React.FC<BadUserProps> = ({ authStatus, regStatus }) => {
  const history = useHistory();
  const auth = getAuth();

  const handleRedirect = () => {
    auth.signOut();
    history.push('/App/Welcome');
    window.location.reload();
  };

  const [header, setHeader] = useState('');
  const [message, setMessage] = useState('');

  // regstatus
  //
  //     0 = Registered
  //     1 = NotFound
  //     2 = FoundNotRegistered
  //     3 = PendingDeletion
  //
  // authstatus
  //
  //     0 = Successful
  //     1 = FailedExpired
  //     2 = FailedNotActive
  //     3 = FailedNotRegistered
  //     4 = PendingDeletion

  // Update header and message based on authStatus and regStatus
  useEffect(() => {
    if (regStatus === 3) {
      setHeader('Pending Deletion');
      setMessage(
        'Your account and all related data will be deleted within the next 5 business days. We will send you an email when this process is complete.',
      );
    } else if (regStatus !== 0) {
      setHeader('You are not registered');
      setMessage('Please contact your employer to register.');
    } else {
      if (authStatus === 1) {
        setHeader('Your trial period has expired');
        setMessage('Now, request Cadey as a benefit from your employer.');
      } else if (authStatus === 2) {
        setHeader('Your account is not active');
        setMessage('Please contact your employer to activate your account.');
      } else if (authStatus === 3) {
        setHeader('You are not registered');
        setMessage('Please contact your employer to register.');
      }
    }
  }, [authStatus, regStatus]);

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
          {regStatus !== 3 && (
            <IonButton
              onClick={() =>
                window.open('https://cadey.co/request-benefits', '_blank')
              }
            >
              Request Benefits
            </IonButton>
          )}
          <IonButton onClick={handleRedirect}>Sign Out</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BadUser;
