import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import './ExpiredUser.css';
import { getAuth } from 'firebase/auth';
import { useHistory } from 'react-router';

const ExpiredUser: React.FC = () => {
  const history = useHistory();
  const auth = getAuth();

  const handleRedirect = () => {
    auth.signOut();
    history.push('/App/Welcome');
  };

  return (
    <IonPage className='home'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>&nbsp;</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='trial-period-message'>
          <h2>Your trial period has expired</h2>
          <IonButton onClick={handleRedirect}>Log Out</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ExpiredUser;
