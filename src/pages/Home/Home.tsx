import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import { 
    IonPage, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonText,
    IonLoading,
} from '@ionic/react';
import { SplashScreen } from '@capacitor/splash-screen';
// Contexts
import { useSpotlight } from '../../context/SpotlightContext';
import { useModalContext } from '../../context/ModalContext';
import { useAppPage } from '../../context/AppPageContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// Components
import ArticlesListHorizontal from '../../components/Articles/ArticlesListHorizontal';
import VideoList from '../../components/Videos/VideoList';
// API
import getHomeData from '../../api/HomeData';
import { logUserFact } from '../../api/UserFacts';

const HomePage: React.FC<{ 
  currentTab: string, 
  tutorialStep: number, 
  setTutorialStep: React.Dispatch<React.SetStateAction<number>>, 
  vimeoIdFromUrl?: string,
  articleIdFromUrl?: string,
}> = ({ currentTab, tutorialStep, setTutorialStep, vimeoIdFromUrl, articleIdFromUrl }) => {
  
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [playedVideos, setPlayedVideos] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [articleIds, setArticleIds] = useState<number[]>([]);
  const { showSpotlight, setShowSpotlight } = useSpotlight();
  const timerRef = useRef<number | undefined>();

  const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

  const { cadeyUserId } = React.useContext(CadeyUserContext);
  const { apiUrl } = React.useContext(ApiUrlContext);

  // Get all the props from the modal context
  const { 
    isVideoModalOpen,
    setVideoModalOpen,
    setArticleDetailModalOpen,
    setCurrentVimeoId,
    setCurrentArticleId,
  } = useModalContext();

  // Get the latest data from the API
  const { getHomeDataFromApi } = getHomeData();

  const fetchData = async () => {
    // Start loader
    setIsLoading(true);
    try {
      const { featuredVideos, newVideos, playedVideos, trendingVideos, articleIds } = await getHomeDataFromApi();
      setFeaturedVideos(featuredVideos);
      setNewVideos(newVideos);
      setPlayedVideos(playedVideos);
      setTrendingVideos(trendingVideos);
      setArticleIds(articleIds);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Hide the splash screen after data has been fetched
      SplashScreen.hide();
    }
  };

  // useEffect to dismiss the loader
  useEffect(() => {
    console.log("articleIds.length: ", articleIds.length);
    console.log("trendingVideos.length: ", trendingVideos.length);
    // If the API has returned something, and did not return articles, dismiss the loader. Otherwise, the loader will be dismissed in the onArticlesLoaded callback
    if (
      (featuredVideos.length > 0 || newVideos.length > 0 || playedVideos.length > 0 || trendingVideos.length > 0 || articleIds.length > 0 ) 
      && 
      (articleIds.length == 0)) 
  {
    setIsLoading(false);
  }
  }, [articleIds, trendingVideos, featuredVideos, newVideos, playedVideos]);

  // On mount, check if Messages is the currentTab. If so, set it to Home.
  // This happens when the user navigates to Home from the Messages tab via 
  // the button present before they get their first message
  // Refactor: This is not good code and should be re-written when it makes business sense
  useEffect(() => {
    if (currentTab === 'Messages') {
      currentTab = 'Home';
    }
  }, []);

  // This runs on mount and every time currentTab changes or the video modal opens/closes
  // We want to fetch new data when the modal closes because there's a good chance we have new videos to serve
  useEffect(() => {
    if (currentTab === 'Home') {
      // Start loader
      fetchData(); // Fetch the homepage data if the user is on the Home tab
      if (tutorialStep === 0) setTutorialStep(1); // If the tutorial hasn't started, mark it completed
    } else if (timerRef.current) {
      // Clear the timer if navigating away from the Home tab.
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, [currentTab, isVideoModalOpen]);

  // Run when trendingVideos or tutorialStep changes
  useEffect(() => {
    // If the tutorial has already progressed, don't set a new timer.
    if (tutorialStep !== 0) return;
    
    // Wait to show the spotlight if the user has trending videos and the tutorial step is 0
    if (trendingVideos.length > 0 && tutorialStep === 0) {
      timerRef.current = window.setTimeout(() => {
        setShowSpotlight(true);
        setTutorialStep(1);
      }, 8000); 
    }

    // This is to ensure if for some reason the component gets unmounted, we clear the timer
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trendingVideos, tutorialStep]);

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

    // Dismiss the spotlight on interaction
    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      setShowSpotlight(false);
    };  
      
    // Add event listeners for clicks and touches, and handle the interaction
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
  
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }
  , []);

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

  // Callback function to handle the load status of articles
  const onArticlesLoaded = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("isLoading: ", isLoading);
  } , [isLoading]);

  return (
    <IonPage className="home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

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
          <IonText className="subcopy">
            {trendingVideos.length > 0 
              ? "Browse popular topics or tap Concerns to get more personalized results."
              : "Here are a few suggestions, based on your concerns about your child."
            }
          </IonText>
        </IonRow>
        <hr className="divider" />

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
        {/* If user has articles, show this. Else, skip it */}
        {articleIds.length > 0 && (
          <IonRow className="article-list-row">
            <h2>Read Now</h2>
            <ArticlesListHorizontal articleIds={articleIds} onLoaded={onArticlesLoaded} />
          </IonRow>
        )}
        {/* If user has new videos, show this. Else, skip it */}
        {newVideos.length > 0 && (
          <IonRow className="video-list-row new">
              <h2>New Videos</h2>
              <VideoList videos={newVideos} listType='horizontal' />
          </IonRow>
        )}
        {/* If user has trending videos, show this. Else, skip it */}
        {trendingVideos.length > 0 && (
          <IonRow className="video-list-row trending">
              <h2>Trending Now</h2>
              <VideoList videos={trendingVideos} listType='horizontal' />
          </IonRow>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;