import React, { useContext, useState, useEffect } from 'react';
import ApiUrlContext, { EDGE_API_URL, STAGING_API_URL, PRODUCTION_API_URL } from '../../context/ApiUrlContext';
import OneSignal from 'onesignal-cordova-plugin';
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
    IonToggle,
} from '@ionic/react';
// API
import { requestNotificationPermission } from '../../api/OneSignal/RequestPermission';

const AdminPage: React.FC = () => {
  const { apiUrl, setApiUrl } = useContext(ApiUrlContext);
  const [pushEnabled, setPushEnabled] = useState(false);
  
  // Set the state of the push notification toggle on mount. If the user hasNotificationPermission, we can determine the correct value.
  useEffect(() => {
    document.title = 'Admin';
    if (window.cordova) {
      OneSignal.getDeviceState((deviceState) => {
        if (deviceState.hasNotificationPermission) {
          if (deviceState.pushDisabled === true) {
            setPushEnabled(false);
          } else if (deviceState.pushDisabled === false) {
            setPushEnabled(true);
          }
        }
        console.log(deviceState);
      });
    } else {
      // Don't interact with OneSignal (which relies on Cordova)
    }
  }, []);

  const handleUrlChange = (event: any) => {
    setApiUrl(event.detail.value);
  };

  const togglePushNotifications = () => {
    // Check if the app is running in a browser or on a device
    if (window.cordova) {
      OneSignal.getDeviceState((deviceState) => {
        if (deviceState.hasNotificationPermission) {
          OneSignal.disablePush(pushEnabled);
          setPushEnabled(!pushEnabled);
          OneSignal.getDeviceState((deviceState) => {
            console.log(deviceState);
          });
        } else {
          requestNotificationPermission();
        }
      });
    } else {
      // Don't interact with OneSignal (which relies on Cordova)
    }
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
          <IonItem>
            <IonLabel>Push Notifications:</IonLabel>
            <IonToggle checked={pushEnabled} onIonChange={togglePushNotifications} />
          </IonItem>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
