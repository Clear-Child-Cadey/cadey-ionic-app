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
// Pages
import ConcernsPage from './pages/Concerns/Concerns';
import HomePage from './pages/Home/Home';
// Components
import AppUpdateModal from './components/Modals/AppUpdateModal';
import RouterTabs from './components/RouterTabs/RouterTabs';
// Contexts
import { CadeyUserContext } from './main';
import { HomeTabVisibilityContext } from './context/TabContext';

setupIonicReact();

const App: React.FC = () => {
  // Ensure user is on the latest version of the app
  const appVersion = '2.1';
  const { cadeyUserId, minimumSupportedVersion } = useContext(CadeyUserContext);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const homeTabVisibility = useContext(HomeTabVisibilityContext);
  const isHomeTabVisible = homeTabVisibility?.isHomeTabVisible ?? false;

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
      {/* <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/Concerns" component={ConcernsPage} />
          <Route exact path="/" render={() => <Redirect to="/Concerns" />} />
        </IonRouterOutlet>
      </IonReactRouter> */}

      {/* Tab bar setup */}
      <RouterTabs />
    </IonApp>
  );
};

export default App;