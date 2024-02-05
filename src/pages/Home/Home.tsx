import React, { useEffect, useState, useRef, useContext } from 'react';
import './Home.css';
import { 
    IonPage, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonLoading,
    IonButton,
    IonText,
    IonIcon,
    IonBadge,
} from '@ionic/react';
// Icons
import { 
    chevronForwardOutline, home,
} from 'ionicons/icons';
import { SplashScreen } from '@capacitor/splash-screen';
// Routing
import { useHistory } from 'react-router-dom';
// Contexts
import { useModalContext } from '../../context/ModalContext';
import { useAppPage } from '../../context/AppPageContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import UnreadContext from '../../context/UnreadContext';
// Components
import VideoList from '../../components/Videos/VideoList';
// API
import getHomeData from '../../api/HomeData';
import { logUserFact } from '../../api/UserFacts';
import { logErrorToFirestore } from '../../api/Firebase/LogErrorToFirestore';
// Variables
import { tracingEnabled } from '../../variables/Logging';
// Firebase
import { firebasePerf } from '../../api/Firebase/InitializeFirebase';
import { trace } from "firebase/performance";
// Interfaces
import { HomeData } from '../../api/HomeData';

const HomePage: React.FC<{ }> = ({  }) => {
  
  const [pathsInProgress, setPathsInProgress] = useState(0);
  const [completedPaths, setCompletedPaths] = useState(0);
  const [totalPaths, setTotalPaths] = useState(0);
  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);
  const [newVideos, setNewVideos] = useState<any[]>([]);
  const [playedVideos, setPlayedVideos] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

  const { cadeyUserId } = React.useContext(CadeyUserContext);
  const { apiUrl } = React.useContext(ApiUrlContext);

  const history = useHistory();

  const { 
    unreadMessagesCount, 
    setUnreadMessagesCount,
  } = useContext(UnreadContext); // Get the current unread count

  var getHomeDataTrace: any;

  var homeData: HomeData = {
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
    isVideoModalOpen,
  } = useModalContext();

  const fetchData = async () => {
    // Start loader
    setIsLoading(true);
    try {
      // Start a Firebase trace      
      if (tracingEnabled) {
          getHomeDataTrace = trace(firebasePerf, "getHomeDataTrace");
          await getHomeDataTrace.start();
      }
      
      console.log('Fetching home data...', apiUrl, cadeyUserId);
      // Get the data from the API
      homeData = await getHomeData(apiUrl, cadeyUserId);

      setPathsInProgress(homeData.numPathsInProgress);
      setCompletedPaths(homeData.numCompletedPaths);
      setTotalPaths(homeData.numTotalPaths);
      setFeaturedVideos(homeData.featuredVideos);
      setNewVideos(homeData.newVideos);
      setPlayedVideos(homeData.playedVideos);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Hide the splash screen after data has been fetched
      SplashScreen.hide();
      // Stop the trace
      if (tracingEnabled) {
        getHomeDataTrace.stop();
    }
    }
  };

  // useEffect to dismiss the loader
  useEffect(() => {
    // If the API has returned something, dismiss the loader
    if (featuredVideos.length > 0 || newVideos.length > 0 || playedVideos.length > 0 ) {
      setIsLoading(false);
    }
  }, [featuredVideos, newVideos, playedVideos]);

  // This runs on mount and every time currentTab changes or the video modal opens/closes
  // We want to fetch new data when the modal closes because there's a good chance we have new videos to serve
  useEffect(() => {
    let timeoutId: any;

    // Start a timer
    timeoutId = setTimeout(() => {
      if (!dataLoaded) {
        // TODO: Implement logic for handling long load times

        // Log a user fact
        logUserFact({
          cadeyUserId: cadeyUserId,
          baseApiUrl: apiUrl,
          userFactTypeName: 'ErrorLog',
          appPage: 'App Open',
          detail1: 'getAppData call (/appopened) took longer than 10 seconds. Time: ' + new Date().toISOString(),
        });
        
        logErrorToFirestore({
          userID: cadeyUserId,
          timestamp: new Date().toISOString(),
          error: 'getAppData call (/appopened) took longer than 10 seconds',
          context: "Fetching App Data"
        });

        setIsLoading(false); // Optionally stop the loader
      }
    }, 10000); // Set timeout for 10 seconds

    fetchData(); // Fetch the homepage data
    
  }, [isVideoModalOpen]);

  // On component mount:
  useEffect(() => {
    document.title = 'Home'; // Set the page title
    setCurrentBasePage('Home'); // Set the current base page
    setCurrentAppPage('Home'); // Set the current app page
    logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Home',
    });
  }, []);

  const handleButtonClick = (route: string) => () => {
    // Log user fact that the user clicked on the button
    // logUserFact({
    //   cadeyUserId: cadeyUserId,
    //   baseApiUrl: apiUrl,
    //   userFactTypeName: 'TapBarNavClick',
    //   appPage: 'Home',
    //   detail1: pageName,
    // });

    // Navigate to the page
    history.push('/App' + route);
  }

  return (
    <IonPage className="home">
      <IonContent fullscreen className='page'>

        {/* Show a loading state if necessary */}
        {isLoading && (
          <IonLoading isOpen={true} message={'Loading your data...'} />
        )}

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRow>
            <IonText className="subcopy">Welcome</IonText>
        </IonRow>

        <IonRow className='content'>
          <IonRow className='dashboard'>
            <div className='paths dashboard-item full-width'>
              <div className='dashboard-button' onClick={handleButtonClick("/Paths")}>
                <img src="assets/svgs/icn-paths.svg" className='icon paths-icon' />
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
                        <span>
                          &nbsp;&bull;&nbsp;
                        </span>
                      )}
                      {pathsInProgress > 0 && (
                        <span className='in-progress'>
                          {pathsInProgress} in progress
                        </span>
                      )}
                    </IonBadge>
                  )}
                </div>
                <IonIcon className='icon arrow-icon' icon={chevronForwardOutline} />
              </div>
            </div>
            <div className='library dashboard-item half-width'>
              <div className='dashboard-button' onClick={handleButtonClick("/Library")}>
                <img src="assets/svgs/icn-library.svg" className='icon library-icon' />
                Library
              </div>
            </div>
            <div className='messages dashboard-item half-width'>
              <div className='dashboard-button' onClick={handleButtonClick("/Home/Messages")}>
                <div className='messages-content'>
                  <div className='content-wrapper'>
                    <img src="assets/svgs/icn-messages.svg" className='icon messages-icon' />
                    Messages
                    {unreadMessagesCount > 0 && <IonBadge color="danger" className="unread-messages">{unreadMessagesCount}</IonBadge>}
                  </div>
                </div>
              </div>
            </div>
          </IonRow>
          {/* If user has watched videos, show this. Else, skip it */}
          {playedVideos.length > 0 && (
            <IonRow className="video-list-row recently-viewed">
                <h2>Recently Viewed</h2>
                <VideoList videos={playedVideos} listType='horizontal' />
            </IonRow>
          )}
          {/* If user has featured videos, show this. Else, skip it */}
          {featuredVideos.length > 0 && (
            <IonRow className="video-list-row featured">
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