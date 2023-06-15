// AppUpdateModal.tsx
import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

interface AppUpdateModalProps {
  isOpen: boolean;
  title: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
}

const AppUpdateModal: React.FC<AppUpdateModalProps> = ({ isOpen, title, body, buttonText, buttonUrl }) => {
  return (
    <IonModal 
      isOpen={isOpen}
      backdropDismiss={false}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>{body}</p>
        <IonButton expand="full" onClick={() => window.open(buttonUrl, '_blank')}>{buttonText}</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default AppUpdateModal;
