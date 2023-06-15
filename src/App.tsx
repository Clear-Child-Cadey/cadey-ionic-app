import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ConcernsPage from './pages/Concerns/Concerns';
import VideoPage from './pages/Videos/Videos';
import PushNotification from './pages/PushNotification/PushNotification';
import { videocamOutline, helpCircleOutline, mailUnreadOutline } from 'ionicons/icons';
import AppUpdateModal from './components/Modals/AppUpdateModal';
import { CadeyUserContext } from './main';

setupIonicReact();

const App: React.FC = () => {

  // Ensure user is on the latest version of the app
  const appVersion = '2.0';
  const { cadeyUserId, minimumSupportedVersion } = useContext(CadeyUserContext);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const getStoreLink = () => {
    const userAgent = window.navigator.userAgent;
    let url;
  
    if (/android/i.test(userAgent)) {
      url = 'https://play.google.com/store/apps/details?id=co.cadey.liteapp&hl=en_US&gl=US';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      url = 'https://apps.apple.com/app/cadeylite/id6449231819';
    } else {
      url = 'https://cadey.co/app'; // fallback for desktop browsers and other devices
    }
  
    return url;
  };

  useEffect(() => {
    // Show the upgrade modal if the current app version is not the latest
    if (appVersion < minimumSupportedVersion) {
      setShowUpgradeModal(true);
    }
  }, [minimumSupportedVersion, appVersion]);

  return (
    <IonApp>
      <AppUpdateModal
        isOpen={showUpgradeModal}
        title="Update Required"
        body="You need to update the app to the latest version to continue using it."
        buttonText="Upgrade"
        buttonUrl={getStoreLink()}
      />

      {/* Basic setup only showing the Concerns page */}
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/Concerns" component={ConcernsPage} />
          <Route exact path="/" render={() => <Redirect to="/Concerns" />} />
        </IonRouterOutlet>
      </IonReactRouter>

      {/* Tab bar setup */}
      {/* <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/Concerns" component={ConcernsPage} exact />
            <Route path="/Videos" component={VideoPage} exact />
            <Route path="/Message" component={PushNotification} exact />
            <Route exact path="/">
              <Redirect to="/Concerns" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="Concerns" href="/Concerns">
              <IonIcon icon={helpCircleOutline} />
              <IonLabel>Concerns</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Videos" href="/Videos">
              <IonIcon icon={videocamOutline} />
              <IonLabel>Videos</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Message" href="/Message">
              <IonIcon icon={mailUnreadOutline} />
              <IonLabel>Messages</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter> */}
    </IonApp>
  );
};

export default App;