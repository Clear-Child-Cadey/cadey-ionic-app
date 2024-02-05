import React, { useState, useEffect, useContext } from 'react';
import {
  IonApp,
  setupIonicReact,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import semver from 'semver';
// Components
import { SplashScreen } from '@capacitor/splash-screen';
import RouterTabs from './components/Routing/RouterTabs';
// Modals
import AppUpdateModal from './components/Modals/AppUpdateModal';
import VideoDetailModal from './components/Modals/VideoDetailModal/VideoDetailModal';
import ArticleDetailModal from './components/Modals/ArticleDetailModal/ArticleDetailModal';
import FalseDoorModal from './components/Modals/FalseDoorModal/FalseDoorModal';
import QuizModal from './components/Modals/QuizModal/QuizModal';
import WelcomeModal from './pages/Welcome/Welcome';
// Contexts
import { CadeyUserContext } from './main';
import { useModalContext } from './context/ModalContext';
import ApiUrlContext from './context/ApiUrlContext';
import { useAppPage } from './context/AppPageContext';
import { useTabContext } from './context/TabContext';
// Variables
import { AppVersion } from './variables/AppVersion';
// API
import { setExternalUserId } from './api/OneSignal/SetExternalUserId';
import { logUserFact } from './api/UserFacts';
import PopularSymptomVideoDetailModal from './components/Modals/VideoDetailModal/PopularSymptomVideoDetailModal';
import { getQuiz } from './api/Quiz';
// Pages
import WelcomePage from './pages/Welcome/Welcome';

setupIonicReact();

const App: React.FC = () => {
  const { cadeyUserId, minimumSupportedVersion, oneSignalId } = useContext(CadeyUserContext);
  const { apiUrl } = React.useContext(ApiUrlContext);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [videoModalEverOpened, setVideoModalEverOpened] = useState(false);
  const [falseDoorData, setFalseDoorData] = useState<any>(null); // Hold the data for the false door
  const [isFalseDoorModalOpen, setIsFalseDoorModalOpen] = useState(false); // Control the modal visibility
  const { currentBasePage, currentAppPage } = useAppPage();
  const history = useHistory();
  const [checkForWelcome, setCheckForWelcome] = useState(false);
  const [showWelcomePage, setShowWelcomePage] = useState(false);
  const { setIsTabBarVisible } = useTabContext();

  const {
    isVideoModalOpen,  
    isArticleDetailModalOpen,
    isQuizModalOpen,
    quizModalData,
    setQuizModalData,
    currentVimeoId,
    currentArticleId,
    isPopularSymptomVideoModalOpen,
    popularSymptomVideo,
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

  // Route the user to the welcome page if they haven't completed the welcome sequence
  useEffect(() => {
    const requestQuiz = async () => {
      if (!checkForWelcome) {
        const quizResponse = await getQuiz(
          apiUrl,
          Number(cadeyUserId),
          3, // Client Context: Where the user is in the app (3 = Onboarding sequence)
          0, // Entity Type (1 = video)
          0  // Entity IDs (The ID of the video)
        );

        setCheckForWelcome(true); // Prevents re-fetching the quiz

        if (quizResponse.question !== null && quizResponse.question.id > 0) {
          // Set the quiz data
          setQuizModalData(quizResponse);
          
          // Hide the tab bar
          setIsTabBarVisible(false);

          // Route the user to the welcome page
          history.push('/App/Welcome');
        }
      }
    }

    requestQuiz();
  }, [cadeyUserId, apiUrl]);

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

      {/* Show a quiz modal if context dictates */}
      <QuizModal />

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
      
      {/* Router Tabs */}
      <RouterTabs />
    </IonApp>
  );
};

export default App;