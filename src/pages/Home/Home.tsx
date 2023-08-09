import React, { useEffect, useState } from 'react';
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

const HomePage: React.FC<{ currentTab: string }> = ({ currentTab }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [playedVideos, setPlayedVideos] = useState([]);

  // Get the latest set of videos from the API
  const { getHomeVideoData } = getHomeVideos();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { featuredVideos, newVideos, playedVideos } = await getHomeVideoData();
      setFeaturedVideos(featuredVideos);
      setNewVideos(newVideos);
      setPlayedVideos(playedVideos);
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
      fetchData();
    }
  }, [currentTab]);

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
            <IonText className="subcopy">Here are a few suggestions, based on your concerns about your child.</IonText>
        </IonRow>
        <hr className="divider" />
        {/* If user has featured videos, show this. Else, skip it */}
        {featuredVideos.length > 0 && (
          <IonRow className="video-list-row">
              <h2>Watch Now</h2>
              <VideoList videos={featuredVideos} /> 
              {/* <VideoList videos={featuredVideosTest} />  */}
          </IonRow>
        )}
        {/* If user has new videos, show this. Else, skip it */}
        {newVideos.length > 0 && (
          <IonRow className="video-list-row">
              <h2>New Videos</h2>
              <VideoList videos={newVideos} />
          </IonRow>
        )}
        {/* If user has watched videos, show this. Else, skip it */}
        {playedVideos.length > 0 && (
          <IonRow className="video-list-row">
              <h2>Recently Viewed</h2>
              <VideoList videos={playedVideos} />
          </IonRow>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;