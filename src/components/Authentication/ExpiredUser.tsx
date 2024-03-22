import { IonButton } from '@ionic/react';
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
    <div className='trial-period-message'>
      <h2>Your trial period has expired</h2>
      <IonButton onClick={handleRedirect}>Log Out</IonButton>
    </div>
  );
};

export default ExpiredUser;
