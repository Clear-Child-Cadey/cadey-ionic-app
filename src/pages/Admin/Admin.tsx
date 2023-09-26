import React, { useContext, useState, useEffect } from 'react';
import ApiUrlContext, { EDGE_API_URL, STAGING_API_URL, PRODUCTION_API_URL, API_PATH, API_FULL_PATH } from '../../context/ApiUrlContext';
import OneSignal from 'onesignal-cordova-plugin';
import { 
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
// Contexts
import { CadeyUserContext } from '../../main';
// Variables
import { AppVersion } from '../../variables/AppVersion';

const AdminPage: React.FC = () => {
  const { apiUrl, setApiUrl } = useContext(ApiUrlContext);
  const [pushEnabled, setPushEnabled] = useState(false);
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const [oneSignalExternalId, setOneSignalExternalId] = useState<string | null>(null);
  
  // Set the state of the push notification toggle on mount. If the user hasNotificationPermission, we can determine the correct value.
  useEffect(() => {
    document.title = 'Admin';
    if (window.cordova) {
      OneSignal.getDeviceState((deviceState) => {
        if (deviceState.hasNotificationPermission) {
          setOneSignalExternalId(deviceState.userId);
          if (deviceState.pushDisabled === true) {
            setPushEnabled(false);
          } else if (deviceState.pushDisabled === false) {
            setPushEnabled(true);
          }
        }
        console.log(deviceState);
      });
    }
  }, []);

  const handleUrlChange = (event: any) => {
    const apiBaseUrl = event.detail.value;
    const apiPath = API_PATH;
    const newApiUrl = `${apiBaseUrl}${apiPath}`;
    setApiUrl(newApiUrl);
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
            <IonLabel>Cadey User ID:</IonLabel>
            <IonLabel slot="end" className="ion-text-end">{cadeyUserId}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Current App Version:</IonLabel>
            <IonLabel slot="end" className="ion-text-end">{AppVersion}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>API URL ({API_FULL_PATH}):</IonLabel>
            <IonSelect value="" onIonChange={handleUrlChange}>
              <IonSelectOption value={EDGE_API_URL}>Edge</IonSelectOption>
              <IonSelectOption value={STAGING_API_URL}>Staging</IonSelectOption>
              <IonSelectOption value={PRODUCTION_API_URL}>Production</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Push Notifications:</IonLabel>
            <IonToggle checked={pushEnabled} onIonChange={togglePushNotifications} />
          </IonItem>
          <IonItem>
            <IonLabel>OneSignal ID:</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel slot="end" className="ion-text-end one-signal-id">{oneSignalExternalId || 'Unknown'}</IonLabel>
          </IonItem>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
