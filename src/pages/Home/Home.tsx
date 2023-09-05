import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import VideoList from '../../components/Videos/VideoList';
import getHomeVideos from '../../api/HomeVideos';
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

const HomePage: React.FC<{ 
  currentTab: string, 
  tutorialStep: number, 
  setTutorialStep: React.Dispatch<React.SetStateAction<number>> 
}> = ({ currentTab, tutorialStep, setTutorialStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [playedVideos, setPlayedVideos] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);

  const { showSpotlight, setShowSpotlight } = useSpotlight();
  const timerRef = useRef<number | undefined>();

  // Get the latest set of videos from the API
  const { getHomeVideoData } = getHomeVideos();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { featuredVideos, newVideos, playedVideos, trendingVideos } = await getHomeVideoData();
      setFeaturedVideos(featuredVideos);
      setNewVideos(newVideos);
      setPlayedVideos(playedVideos);
      setTrendingVideos(trendingVideos);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Stop the loader after data has been fetched
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
        {/* If user has featured videos, show this. Else, skip it */}
        {featuredVideos.length > 0 && (
          <IonRow className="video-list-row featured">
              <h2>Watch Now</h2>
              <VideoList videos={featuredVideos} /> 
              {/* <VideoList videos={featuredVideosTest} />  */}
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