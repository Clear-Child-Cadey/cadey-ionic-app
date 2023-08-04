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
  const [newVideos, setNewVideos] = useState([]);
  const [playedVideos, setPlayedVideos] = useState([]);

  // TODO: Replace with an API call
  const featuredVideos = [
    {
      videoId: '824105229/68feae4566',
      mediaId: '1',
      title: 'Lists and Lines for Homework Organization',
      audience: 'For Parents',
    },{
      videoId: '824102840/39a57cdeec',
      mediaId: '1',
      title: 'Second Video',
      audience: 'For Kids',
    },{
      videoId: '824100882/8cebb364bf',
      mediaId: '1',
      title: 'Third Video',
      audience: 'For Parents',
    },
  ];

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
        <IonRow className="video-list-row">
            <h2>Watch Now</h2>
            {/* TODO: Display the Featured Videos from the API here */}
            <VideoList videos={featuredVideos} /> 
        </IonRow>
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