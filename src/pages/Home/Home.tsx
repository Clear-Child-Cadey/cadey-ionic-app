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
import { useHistory } from 'react-router';
import { SplashScreen } from '@capacitor/splash-screen';
// Contexts
import { useSpotlight } from '../../context/SpotlightContext';
import { useLoadingState } from '../../context/LoadingStateContext';
import { useModalContext } from '../../context/ModalContext';
// Components
import ArticlesListHorizontal from '../../components/Articles/ArticlesListHorizontal';
import VideoList from '../../components/Videos/VideoList';
// Modals
import VideoDetailModal from '../../components/Modals/VideoDetailModal/VideoDetailModal';
import ArticleDetailModal from '../../components/Modals/ArticleDetailModal/ArticleDetailModal';
// API
import getHomeData from '../../api/HomeData';
// Interfaces
import { WP_Article } from '../../api/WordPress/GetArticles';

const HomePage: React.FC<{ 
  currentTab: string, 
  tutorialStep: number, 
  setTutorialStep: React.Dispatch<React.SetStateAction<number>>, 
  vimeoIdFromUrl?: string,
  articleIdFromUrl?: string,
}> = ({ currentTab, tutorialStep, setTutorialStep, vimeoIdFromUrl, articleIdFromUrl }) => {
  // Initialize the useHistory hook
  const history = useHistory();
  
  const { state: loadingState, dispatch } = useLoadingState();
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [playedVideos, setPlayedVideos] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [articleIds, setArticleIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { showSpotlight, setShowSpotlight } = useSpotlight();
  const timerRef = useRef<number | undefined>();

  // Get all the props from the modal context
  const { 
    isVideoModalOpen, 
    setVideoModalOpen,
    isArticleDetailModalOpen, 
    setArticleDetailModalOpen,
    currentVimeoId,
    setCurrentVimeoId,
    setCurrentArticleId,
  } = useModalContext();

  // Get the latest data from the API
  const { getHomeDataFromApi } = getHomeData();

  const fetchData = async () => {
    // Start loader
    dispatch({ type: 'SET_LOADING', payload: { key: 'homepageData', value: true } });
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
      dispatch({ type: 'SET_LOADING', payload: { key: 'homepageData', value: false } });
      SplashScreen.hide(); // Hide the splash screen after data has been fetched
    }
  };

  // This runs every time currentTab changes
  useEffect(() => {
    if (currentTab === 'Home') {
      fetchData(); // Fetch the homepage data if the user is on the Home tab
      if (tutorialStep === 0) setTutorialStep(1); // If the tutorial hasn't started, mark it completed
    } else if (timerRef.current) {
      // Clear the timer if navigating away from the Home tab.
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, [currentTab]);

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

  return (
    <IonPage className="home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
        
        {isArticleDetailModalOpen && (
          <ArticleDetailModal />
        )}

        {isVideoModalOpen && currentVimeoId && (
          <VideoDetailModal />
        )}

        {/* If user has featured videos, show this. Else, skip it */}
        {featuredVideos.length > 0 && (
          <IonRow className="video-list-row featured">
              <h2>Watch Now</h2>
              <VideoList videos={featuredVideos} /> 
          </IonRow>
        )}
        {/* If user has articles, show this. Else, skip it */}
        {articleIds.length > 0 && (
          <IonRow className="article-list-row">
            <h2>Read Now</h2>
            <ArticlesListHorizontal articleIds={articleIds} />
          </IonRow>
        )}
        {/* If user has new videos, show this. Else, skip it */}
        {newVideos.length > 0 && (
          <IonRow className="video-list-row new">
              <h2>New Videos</h2>
              <VideoList videos={newVideos} />
          </IonRow>
        )}
        {/* If user has trending videos, show this. Else, skip it */}
        {trendingVideos.length > 0 && (
          <IonRow className="video-list-row trending">
              <h2>Trending Now</h2>
              <VideoList videos={trendingVideos} />
          </IonRow>
        )}
        {/* If user has watched videos, show this. Else, skip it */}
        {playedVideos.length > 0 && (
          <IonRow className="video-list-row recently-viewed">
              <h2>Recently Viewed</h2>
              <VideoList videos={playedVideos} />
          </IonRow>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;