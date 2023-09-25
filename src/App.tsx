import React, { useState, useEffect, useContext } from 'react';
import {
  IonApp,
  setupIonicReact,
  IonLoading,
} from '@ionic/react';
import semver from 'semver';
// Components
import { SplashScreen } from '@capacitor/splash-screen';
import AppUpdateModal from './components/Modals/AppUpdateModal';
import RouterTabs from './components/Routing/RouterTabs';
// Contexts
import { CadeyUserContext } from './main';
import { useLoadingState } from './context/LoadingStateContext';
// Variables
import { AppVersion } from './variables/AppVersion';
// API
import { setExternalUserId } from './api/OneSignal/SetExternalUserId';

setupIonicReact();

const App: React.FC = () => {
  const { minimumSupportedVersion, oneSignalId } = useContext(CadeyUserContext);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { state: loadingState, dispatch } = useLoadingState();

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

  // Check if the app is running in a browser or on a device
  if (window.cordova) {
    // Set the external user ID for OneSignal
    setExternalUserId(oneSignalId.toString());
  } else {
    // Don't interact with OneSignal (which relies on Cordova)
  }

  // Show the upgrade modal if the current app version is not the latest
  useEffect(() => {
    if (semver.lt(AppVersion, minimumSupportedVersion)) {
      SplashScreen.hide();  // Hide the splash screen
      setShowUpgradeModal(true);
    }
  }, [minimumSupportedVersion, AppVersion]);

  return (
    <IonApp>
      {/* Show a modal if the user needs to update their app*/}
      <AppUpdateModal
        isOpen={showUpgradeModal}
        title="Update Required"
        body="You need to update the app to the latest version to continue using it."
        buttonText="Upgrade"
        buttonUrl={getStoreLink()}
      />
      {/* Show a loading state if anything is loading */}
      {Object.values(loadingState).some(Boolean) && (
        <IonLoading isOpen={true} message={'Please wait...'} />
      )}
      <RouterTabs />
    </IonApp>
  );
};

export default App;