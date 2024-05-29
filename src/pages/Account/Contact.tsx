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
import './Contact.css';
import useUserFacts from '../../hooks/useUserFacts';
import { useAppPage } from '../../context/AppPageContext';

const ContactPage = () => {
  const [message, setMessage] = useState('');
  const cadeyUser = useSelector(
    (state: RootState) => state.authStatus.userData.cadeyUser,
  );
  const { logUserFact } = useUserFacts();
  const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

  useEffect(() => {
    document.title = 'Contact'; // Set the page title
    setCurrentBasePage('Contact'); // Set the current base page
    setCurrentAppPage('Contact'); // Set the current app page
    logUserFact({
      userFactTypeName: 'appPageNavigation',
      appPage: 'Contact',
    });
  }, []);

  const handleSubmit = () => {
    console.log('Message submitted:', message);
    // Here you would handle submitting the message to your support system
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/App/Account' />
          </IonButtons>
          <IonTitle>Contact Support</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonLabel className='contact-label'>How can we help you?</IonLabel>
        <IonTextarea
          value={message}
          onIonChange={(e) => setMessage(e.detail.value!)}
          rows={6}
          placeholder='Type your message here...'
        />
        <IonLabel className='contact-email'>
          The reply will be sent to your email address:{' '}
          {cadeyUser?.cadeyUserEmail}
        </IonLabel>
        <IonButton expand='block' onClick={handleSubmit}>
          Submit
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ContactPage;
