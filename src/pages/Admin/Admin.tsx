import React, { useContext, useState } from 'react';
import ApiUrlContext, { EDGE_API_URL, STAGING_API_URL, PRODUCTION_API_URL } from '../../context/ApiUrlContext';
import { 
    IonButton,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
} from '@ionic/react';

const AdminPage: React.FC = () => {
  const { apiUrl, setApiUrl } = useContext(ApiUrlContext);
  
  const handleUrlChange = (event: any) => {
    setApiUrl(event.detail.value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Admin Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form>
          <IonItem>
            <IonLabel>API URL:</IonLabel>
            <IonSelect value={apiUrl} onIonChange={handleUrlChange}>
              <IonSelectOption value={EDGE_API_URL}>Edge</IonSelectOption>
              <IonSelectOption value={STAGING_API_URL}>Staging</IonSelectOption>
              <IonSelectOption value={PRODUCTION_API_URL}>Production</IonSelectOption>
            </IonSelect>
          </IonItem>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
