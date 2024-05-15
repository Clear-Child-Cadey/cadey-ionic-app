import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
// CSS
import './Account.css';

const AccountPage = () => {
  const handlePurchase = () => {
    // Logic to initiate purchase
    console.log('Purchase subscription');
  };

  const handlePause = () => {
    // Logic to pause subscription
    console.log('Pause subscription');
  };

  const handleCancel = () => {
    // Logic to cancel subscription
    console.log('Cancel subscription');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonButton expand='block' onClick={handlePurchase}>
          Purchase Subscription
        </IonButton>
        <IonButton expand='block' onClick={handlePause}>
          Pause Subscription
        </IonButton>
        <IonButton expand='block' onClick={handleCancel}>
          Cancel Subscription
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
