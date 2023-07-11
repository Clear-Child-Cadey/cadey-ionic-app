import React, { useState, useEffect, useContext } from 'react';
import {
  IonApp,
  setupIonicReact,
} from '@ionic/react';
import semver from 'semver';
// Components
import AppUpdateModal from './components/Modals/AppUpdateModal';
import RouterTabs from './components/RouterTabs/RouterTabs';
// Contexts
import { CadeyUserContext } from './main';

setupIonicReact();

const App: React.FC = () => {
  // Ensure user is on the latest version of the app
  const oldAppVersion = '2.2';
  const appVersion = '2.2.0';
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

  // Show the upgrade modal if the current app version is not the latest
  useEffect(() => {
    if (semver.lt(appVersion, minimumSupportedVersion)) {
      setShowUpgradeModal(true);
    }
  }, [minimumSupportedVersion, appVersion]);

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
      <RouterTabs />
    </IonApp>
  );
};

export default App;