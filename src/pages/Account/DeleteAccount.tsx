import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonTextarea,
  IonLabel,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './DeleteAccount.css';
import useUserFacts from '../../hooks/useUserFacts';
import { useAppPage } from '../../context/AppPageContext';
import { useHistory } from 'react-router';
import { DeleteAccount } from '../../api/DeleteAccount';

const DeleteAccountPage = () => {
  const [message, setMessage] = useState('');
  const cadeyUser = useSelector(
    (state: RootState) => state.authStatus.userData.cadeyUser,
  );
  const { logUserFact } = useUserFacts();
  const { setCurrentBasePage, setCurrentAppPage } = useAppPage();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Delete Account'; // Set the page title
    setCurrentBasePage('Delete Account'); // Set the current base page
    setCurrentAppPage('Delete Account'); // Set the current app page
    logUserFact({
      userFactTypeName: 'appPageNavigation',
      appPage: 'Delete Account',
    });
  }, []);

  const handleDoNotDelete = async () => {
    history.push('/App/Account');
  };

  const handleDeleteAccount = async () => {
    if (cadeyUser) {
      try {
        await DeleteAccount(cadeyUser?.cadeyUserId.toString());
        window.location.reload();
      } catch (error) {
        console.error('Error deleting account:', error);
        setMessage(
          'An error occurred while requesting account deletion. Please try again later or request deletion directly by sending an email to support@cadey.co',
        );
      }
    } else {
      console.error('No user found');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/App/Account' />
          </IonButtons>
          <IonTitle>Delete Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding delete-account-content'>
        <h3>
          Your account and all your personal data will be permanently deleted
          within the next 5 business days. Once completed, you will receive a
          notification to your email.
        </h3>
        <p>
          Subscriptions are managed in your app or play store. Please cancel
          your subscription to avoid charges.
        </p>
        {message && <p className='error-message'>{message}</p>}
        <div>
          <IonButton
            onClick={handleDoNotDelete}
            className='do-not-delete-button'
          >
            NO, do not delete my account
          </IonButton>
          <IonButton
            onClick={handleDeleteAccount}
            className='delete-account-button'
          >
            YES, delete my account
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DeleteAccountPage;
