import React, { useState, useEffect, useContext } from 'react';
import {
  IonApp,
  setupIonicReact,
  IonLoading,
} from '@ionic/react';
import semver from 'semver';
// Components
import { SplashScreen } from '@capacitor/splash-screen';
import RouterTabs from './components/Routing/RouterTabs';
// Modals
import AppUpdateModal from './components/Modals/AppUpdateModal';
import VideoDetailModal from './components/Modals/VideoDetailModal/VideoDetailModal';
import ArticleDetailModal from './components/Modals/ArticleDetailModal/ArticleDetailModal';
import FalseDoorModal from './components/Modals/FalseDoorModal/FalseDoorModal';
// Contexts
import { CadeyUserContext } from './main';
import { useLoadingState } from './context/LoadingStateContext';
import { useModalContext } from './context/ModalContext';
import ApiUrlContext from './context/ApiUrlContext';
import { useAppPage } from './context/AppPageContext';
// Variables
import { AppVersion } from './variables/AppVersion';
// API
import { setExternalUserId } from './api/OneSignal/SetExternalUserId';
import { logUserFact } from './api/UserFacts';

setupIonicReact();

const App: React.FC = () => {
  const { cadeyUserId, minimumSupportedVersion, oneSignalId } = useContext(CadeyUserContext);
  const { apiUrl } = React.useContext(ApiUrlContext);
  const userFactUrl = `${apiUrl}/userfact`;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { state: loadingState, dispatch } = useLoadingState();
  const [videoModalEverOpened, setVideoModalEverOpened] = useState(false);
  const [falseDoorData, setFalseDoorData] = useState<any>(null); // Hold the data for the false door
  const [isFalseDoorModalOpen, setIsFalseDoorModalOpen] = useState(false); // Control the modal visibility
  const { currentBasePage, currentAppPage } = useAppPage();

  const {
    isVideoModalOpen,  
    currentVimeoId,
    isArticleDetailModalOpen,
    currentArticleId,
  } = useModalContext();

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

  useEffect(() => {
    if (!isVideoModalOpen && !videoModalEverOpened) {
      // Modal closed, hasn't ever been opened
      // Currently, do nothing in this case
    } else if (isVideoModalOpen && !videoModalEverOpened) {
      // Modal opened for the first time
      setVideoModalEverOpened(true);
    } else if (!isVideoModalOpen && videoModalEverOpened) {
      // Modal closed, but has been opened before
      onVideoDetailPageClosed();
    }
  }, [isVideoModalOpen]);

  // Log the status of currentBasePage and currentAppPage when they change
  useEffect(() => {
    console.log('currentBasePage: ', currentBasePage);
    console.log('currentAppPage: ', currentAppPage);
  }, [currentBasePage, currentAppPage]);

  const onVideoDetailPageClosed = async () => {
    const response = await logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'VideoDetailPageClosed',
      appPage: 'Video Detail',
    });

    if (response.falseDoorQuestionId !== 0) {
      setFalseDoorData(response);
      setIsFalseDoorModalOpen(true);
    }
  }

  // Log anytime the loading state changes
  useEffect(() => {
    console.log('Loading state changed: ', loadingState);
  }, [loadingState]);

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
      {/* Show a video modal if context dictates */}
      {isVideoModalOpen && currentVimeoId && (
        <VideoDetailModal />
      )}
      {/* Show an article modal if context dictates */}
      {isArticleDetailModalOpen && currentArticleId && (
        <ArticleDetailModal />
      )}

      {/* Show a false door modal if context dictates */}
      <FalseDoorModal 
        source={currentAppPage}
        falseDoorQuestionId={falseDoorData?.falseDoorQuestionId || 0}
        iconUrl={falseDoorData?.questionIcon || ''}
        copy={falseDoorData?.questionText || ''}
        yesResponse="Yes, sign me up!"
        noResponse="No thanks, not interested"
        thankYouIconUrlYes={falseDoorData?.questionResponseYesIcon || ''}
        thankYouIconUrlNo={falseDoorData?.questionResponseNoIcon || ''}
        thankYouCopyYes={falseDoorData?.questionResponseYesText || ''}
        thankYouCopyNo={falseDoorData?.questionResponseNoText || ''}
        thankYouButtonText="Close"
        isOpen={isFalseDoorModalOpen}
        setIsOpen={setIsFalseDoorModalOpen}
      />
      <RouterTabs />
    </IonApp>
  );
};

export default App;