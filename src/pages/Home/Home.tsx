import React, { useEffect, useState, useContext } from 'react';
import './Home.css';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonRow,
  IonText,
  IonIcon,
  IonBadge,
} from '@ionic/react';

// Icons
import { chevronForwardOutline } from 'ionicons/icons';
import { SplashScreen } from '@capacitor/splash-screen';
// Routing
import { useHistory } from 'react-router-dom';
// Contexts
import { useModalContext } from '../../context/ModalContext';
import { useAppPage } from '../../context/AppPageContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import UnreadContext from '../../context/UnreadContext';
// Components
import VideoList from '../../components/Videos/VideoList';
// API
import getHomeData from '../../api/HomeData';
import { logUserFact } from '../../api/UserFacts';
// Variables
import { tracingEnabled } from '../../variables/Logging';
// Firebase
import { firebasePerf } from '../../api/Firebase/InitializeFirebase';
import { trace } from 'firebase/performance';
// Interfaces
import { HomeData } from '../../api/HomeData';
import { useDispatch, useSelector } from 'react-redux';
import { setHttpErrorModalData } from '../../features/httpError/slice';
import AppMeta from '../../variables/AppMeta';
import { RootState } from '../../store';

const HomePage: React.FC<{
  vimeoIdFromUrl?: string;
  articleIdFromUrl?: string;
}> = ({ vimeoIdFromUrl, articleIdFromUrl }) => {
  const dispatch = useDispatch();
  const [pathsInProgress, setPathsInProgress] = useState(0);
  const [completedPaths, setCompletedPaths] = useState(0);
  const [totalPaths, setTotalPaths] = useState(0);
  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);
  const [playedVideos, setPlayedVideos] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const {
    currentBasePage,
    setCurrentBasePage,
    currentAppPage,
    setCurrentAppPage,
  } = useAppPage();

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId || 0;
  });

  const { apiUrl } = React.useContext(ApiUrlContext);

  /**
   * Controls if the error modal should be visible
   */

  const history = useHistory();

  const { unreadMessagesCount, setUnreadMessagesCount } =
    useContext(UnreadContext); // Get the current unread count

  let getHomeDataTrace: any;

  let homeData: HomeData = {
    numPathsInProgress: 0,
    numCompletedPaths: 0,
    numTotalPaths: 0,
    featuredVideos: [],
    newVideos: [],
    playedVideos: [],
    trendingVideos: [],
    articleIds: [],
  };

  // Get all the props from the modal context
  const {
    setCurrentVimeoId,
    setCurrentArticleId,
    isVideoModalOpen,
    setVideoModalOpen,
    setArticleDetailModalOpen,
  } = useModalContext();

  const fetchData = async () => {
    // Start loader
    setIsLoading(() => {
      return true;
    });
    try {
      // Start a Firebase trace

      if (tracingEnabled) {
        getHomeDataTrace = trace(firebasePerf, 'getHomeDataTrace');
        await getHomeDataTrace.start();
      }

      // Get the data from the API
      homeData = await getHomeData(apiUrl, cadeyUserId.toString());

      setIsLoading(() => {
        return false;
      });

      setPathsInProgress(homeData.numPathsInProgress);
      setCompletedPaths(homeData.numCompletedPaths);
      setTotalPaths(homeData.numTotalPaths);
      setFeaturedVideos(homeData.featuredVideos);
      setPlayedVideos(homeData.playedVideos);
    } catch (error) {
      dispatch(setHttpErrorModalData(AppMeta.httpErrorModalData));
    } finally {
      setIsLoading(() => {
        return false;
      });
      // Hide the splash screen after data has been fetched
      SplashScreen.hide();
      // Stop the trace
      if (tracingEnabled) {
        getHomeDataTrace.stop();
      }
    }
  };

  // This runs on mount and every time currentTab changes or the video modal opens/closes
  // We want to fetch new data when the modal closes because there's a good chance we have new videos to serve
  useEffect(() => {
    fetchData(); // Fetch the homepage data
  }, [isVideoModalOpen]);

  // On component mount:
  useEffect(() => {
    document.title = 'Home'; // Set the page title
    setCurrentBasePage('Home'); // Set the current base page
    setCurrentAppPage('Home'); // Set the current app page
    logUserFact({
      cadeyUserId: cadeyUserId,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Home',
    });

    // Function to load the Bugherd script
    const loadBugherdScript = () => {
      const script = document.createElement('script');
      script.src =
        'https://www.bugherd.com/sidebarv2.js?apikey=stkrojaqmtujmlrixuxddw';
      script.async = true;
      document.body.appendChild(script);
    };

    loadBugherdScript();
  }, []);

  // Show the modal if a vimeoId is passed in via query string
  useEffect(() => {
    if (vimeoIdFromUrl) {
      setCurrentVimeoId(vimeoIdFromUrl);
      setVideoModalOpen(true);
    }
  }, [vimeoIdFromUrl]);

  // Show the modal if an articleId is passed in via query string
  useEffect(() => {
    if (articleIdFromUrl) {
      setCurrentArticleId(Number(articleIdFromUrl));
      setArticleDetailModalOpen(true);
    }
  }, [articleIdFromUrl]);

  const handleButtonClick = (route: string, entity: string) => () => {
    // Log user fact that the user clicked on the button
    logUserFact({
      cadeyUserId: cadeyUserId,
      userFactTypeName: 'UserTap',
      appPage: currentAppPage,
      detail1: currentBasePage,
      detail2: entity,
    });

    // Navigate to the page
    history.push('/App' + route);
  };

  return (
    <IonPage className='home'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>Home</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='page'>
        {/* Show a loading state if necessary - commenting out because we don't need it in the revised homepage*/}

        {/* <IonLoading
          isOpen={isLoading}
          message={`Loading your data.....${JSON.stringify(isGenericModalOpen)}`}
        /> */}
        <IonRow>
          <IonText className='subcopy'>Welcome</IonText>
        </IonRow>

        <IonRow className='content'>
          <IonRow className='dashboard'>
            <div className='paths dashboard-item full-width'>
              <div
                className='dashboard-button'
                onClick={handleButtonClick('/Paths', 'Paths Button')}
              >
                <img
                  src='assets/svgs/icn-paths.svg'
                  className='icon paths-icon'
                />
                <div className='text-container'>
                  <div className='text-title'>Your Paths</div>
                  {(completedPaths > 0 || pathsInProgress > 0) && (
                    <IonBadge className='progress-indicator'>
                      {completedPaths > 0 && (
                        <span className='completed-paths'>
                          {completedPaths} of {totalPaths} complete
                        </span>
                      )}
                      {completedPaths > 0 && pathsInProgress > 0 && (
                        <span>&nbsp;&bull;&nbsp;</span>
                      )}
                      {pathsInProgress > 0 && (
                        <span className='in-progress'>
                          {pathsInProgress} in progress
                        </span>
                      )}
                    </IonBadge>
                  )}
                </div>
                <IonIcon
                  className='icon arrow-icon'
                  icon={chevronForwardOutline}
                />
              </div>
            </div>
            <div className='library dashboard-item half-width'>
              <div
                className='dashboard-button'
                onClick={handleButtonClick('/Library', 'Library Button')}
              >
                <img
                  src='assets/svgs/icn-library.svg'
                  className='icon library-icon'
                />
                Library
              </div>
            </div>
            <div className='messages dashboard-item half-width'>
              <div
                className='dashboard-button'
                onClick={handleButtonClick('/Home/Messages', 'Messages Button')}
              >
                <div className='messages-content'>
                  <div className='content-wrapper'>
                    <img
                      src='assets/svgs/icn-messages.svg'
                      className='icon messages-icon'
                    />
                    Messages
                    {unreadMessagesCount > 0 && (
                      <IonBadge color='danger' className='unread-messages'>
                        {unreadMessagesCount}
                      </IonBadge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </IonRow>
          {/* If user has watched videos, show this. Else, skip it */}
          {playedVideos.length > 0 && (
            <IonRow className='video-list-row recently-viewed'>
              <h2>Recently Viewed</h2>
              <VideoList videos={playedVideos} listType='horizontal' />
            </IonRow>
          )}
          {/* If user has featured videos, show this. Else, skip it */}
          {featuredVideos.length > 0 && (
            <IonRow className='video-list-row featured'>
              <h2>Watch Now</h2>
              <VideoList videos={featuredVideos} listType='horizontal' />
            </IonRow>
          )}
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
