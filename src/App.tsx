import React, { useState, useEffect, useContext } from 'react';
import { setupIonicReact } from '@ionic/react';
import semver from 'semver';
// Components
import { SplashScreen } from '@capacitor/splash-screen';
// Modals
import AppUpdateModal from './components/Modals/AppUpdateModal';
import VideoDetailModal from './components/Modals/VideoDetailModal/VideoDetailModal';
import ArticleDetailModal from './components/Modals/ArticleDetailModal/ArticleDetailModal';
import QuizModal from './components/Modals/QuizModal/QuizModal';
// Contexts
import { CadeyUserContext } from './main';
import { useModalContext } from './context/ModalContext';
import ApiUrlContext from './context/ApiUrlContext';
// API
import { setExternalUserId } from './api/OneSignal/SetExternalUserId';
import { logUserFact } from './api/UserFacts';
import GenericModal from './components/Modals/GenericModal';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from './store';
import useRequestQuiz from './hooks/useRequestQuiz';
import AppMeta from './variables/AppMeta';

setupIonicReact();

const App: React.FC = () => {
  const cadeyUser = useSelector(
    (state: RootState) => state.authStatus.userData.cadeyUser,
  );
  const deviceId = useSelector(
    (state: RootState) => state.deviceIdStatus.deviceId,
  );

  const cadeyMinimumSupportedAppVersion = useSelector(
    (state: RootState) => state.appVersion.cadeyMinimumSupportedAppVersion,
  );

  const { apiUrl } = React.useContext(ApiUrlContext);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [videoModalEverOpened, setVideoModalEverOpened] = useState(false);
  const { requestQuiz } = useRequestQuiz({
    clientContext: 3,
    entityType: 0,
    entityId: 0,
    shouldHaveEmailVerified: AppMeta.forceEmailVerification,
  });

  const {
    isVideoModalOpen,
    isArticleDetailModalOpen,
    // setQuizModalData,
    currentVimeoId,
    currentArticleId,
  } = useModalContext();

  const getStoreLink = () => {
    const userAgent = window.navigator.userAgent;
    let url;

    if (/android/i.test(userAgent)) {
      url =
        'https://play.google.com/store/apps/details?id=co.cadey.liteapp&hl=en_US&gl=US';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      url = 'https://apps.apple.com/app/cadeylite/id6449231819';
    } else {
      url = 'https://cadey.co/app'; // fallback for desktop browsers and other devices
    }

    return url;
  };

  // Route the user to the welcome page if they haven't completed the welcome sequence
  useEffect(() => {
    if (!cadeyUser?.cadeyUserId) {
      return;
    }

    requestQuiz();
  }, [cadeyUser]);

  // Show the upgrade modal if the current app version is not the latest
  useEffect(() => {
    if (
      semver.lt(AppMeta.version, cadeyMinimumSupportedAppVersion || '1.0.0')
    ) {
      SplashScreen.hide(); // Hide the splash screen
      setShowUpgradeModal(true);
    }
  }, [cadeyMinimumSupportedAppVersion, AppMeta.version]);

  useEffect(() => {
    if (!cadeyUser?.cadeyUserId) {
      return;
    }
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
  }, [isVideoModalOpen, cadeyUser]);

  const onVideoDetailPageClosed = async () => {
    const response = await logUserFact({
      cadeyUserId: cadeyUser?.cadeyUserId || 0,
      userFactTypeName: 'VideoDetailPageClosed',
      appPage: 'Video Detail',
    });
  };

  return (
    <>
      {/* Show a modal if the user needs to update their app*/}

      <AppUpdateModal
        isOpen={showUpgradeModal}
        title='Update Required'
        body='You need to update the app to the latest version to continue using it.'
        buttonText='Upgrade'
        buttonUrl={getStoreLink()}
      />

      {/* Show a quiz modal if context dictates */}
      <QuizModal />

      {/* Show a video modal if context dictates */}
      {isVideoModalOpen && currentVimeoId && <VideoDetailModal />}

      {/* Show an article modal if context dictates */}
      {isArticleDetailModalOpen && currentArticleId && <ArticleDetailModal />}

      {/* Show a generic modal if context dictates */}
      <GenericModal />
    </>
  );
};

export default App;
