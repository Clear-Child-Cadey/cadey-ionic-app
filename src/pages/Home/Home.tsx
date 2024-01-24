import React, { useEffect, useState, useRef } from 'react';
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
} from '@ionic/react';
import { SplashScreen } from '@capacitor/splash-screen';
// Routing
import { useHistory } from 'react-router-dom';
// Contexts
import { useModalContext } from '../../context/ModalContext';
import { useAppPage } from '../../context/AppPageContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// Components
import VideoList from '../../components/Videos/VideoList';
// API
import getHomeData from '../../api/HomeData';
import { logUserFact } from '../../api/UserFacts';
import { getQuiz } from '../../api/Quiz';
import { logErrorToFirestore } from '../../api/Firebase/logErrorToFirestore';
// Variables
import { tracingEnabled } from '../../variables/Logging';
// Firebase
import { firebasePerf } from '../../api/Firebase/InitializeFirebase';
import { trace } from "firebase/performance";

const HomePage: React.FC<{ }> = ({  }) => {
  
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [playedVideos, setPlayedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);

  const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

  const { cadeyUserId } = React.useContext(CadeyUserContext);
  const { apiUrl } = React.useContext(ApiUrlContext);

  const history = useHistory();

  var getHomeDataTrace: any;

  // Get all the props from the modal context
  const { 
    isVideoModalOpen,
    setQuizModalData,
    setWelcomeModalOpen,
  } = useModalContext();

  // Get the latest data from the API
  const { getHomeDataFromApi } = getHomeData();

  const fetchData = async () => {
    // Start loader
    setIsLoading(true);
    try {
      // Start a Firebase trace      
      if (tracingEnabled) {
          getHomeDataTrace = trace(firebasePerf, "getHomeDataTrace");
          await getHomeDataTrace.start();
      }
      
      // Get the data from the API
      const { featuredVideos, newVideos, playedVideos } = await getHomeDataFromApi();

      setFeaturedVideos(featuredVideos);
      setNewVideos(newVideos);
      setPlayedVideos(playedVideos);
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

  // Check for onboarding quiz on mount and when cadeyUserId changes
  useEffect(() => {
      
      if (cadeyUserId) {
        requestQuiz();
      }
  }, [cadeyUserId, apiUrl]);

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

  const requestQuiz = async () => {
    const quizResponse = await getQuiz(
      apiUrl,
      Number(cadeyUserId),
      2,                    // Client Context: Where the user is in the app (2 = App Opened)
      0,                    // Entity Type (1 = video)
      0                     // Entity IDs (The ID of the video)
    );

    if (quizResponse.question !== null && quizResponse.question.id > 0) {

      // Set the quiz data
      setQuizModalData(quizResponse);

      // Show the welcome screen
      setWelcomeModalOpen(true);

      // NOTE: We don't open the quiz modal here as the user needs to see the welcome screen first. Welcome screen will open the quiz modal.
    }
  }

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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
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
        
        {/* <IonRow>
          <IonText className="subcopy">
            Subcopy
          </IonText>
        </IonRow>
        <hr className="divider" /> */}

        <IonRow className='content'>
          <IonButton onClick={handleButtonClick("/Paths")}>Paths</IonButton>
          <IonButton onClick={handleButtonClick("/Library")}>Library</IonButton>
          <IonButton onClick={handleButtonClick("/Home/Messages")}>Messages</IonButton>
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
          {/* If user has new videos, show this. Else, skip it */}
          {newVideos.length > 0 && (
            <IonRow className="video-list-row new">
                <h2>New Videos</h2>
                <VideoList videos={newVideos} listType='horizontal' />
            </IonRow>
          )}
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;