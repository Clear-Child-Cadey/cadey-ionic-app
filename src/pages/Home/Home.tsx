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

const HomePage: React.FC<{ currentTab: string }> = ({ currentTab }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [newVideos, setNewVideos] = useState([]);
  const [playedVideos, setPlayedVideos] = useState([]);

  // Get the latest set of videos from the API
  const { getHomeVideoData } = getHomeVideos();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { newVideos, playedVideos } = await getHomeVideoData();
      setNewVideos(newVideos);
      setPlayedVideos(playedVideos);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
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
        <IonRow className="video-list-row">
            <h2>New Videos</h2>
            <VideoList videos={newVideos} />
        </IonRow>
        <IonRow className="video-list-row">
            <h2>Recently Viewed</h2>
            <VideoList videos={playedVideos} />
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;