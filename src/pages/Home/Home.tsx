import React from 'react';
import './Home.css';
import VideoList from '../../components/Videos/VideoList';
import { 
    IonPage, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonText
} from '@ionic/react';

const HomePage: React.FC = () => {
  // Create a mock video array
  // TODO: Replace with an API call to get the video IDs every time this component is rendered
  const videos = [
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
    },{
      videoId: '822097592/44878cd162',
      mediaId: '1',
      title: 'Fourth Video',
      audience: 'For Kids',
    },{
      videoId: '822073557/a9efd31aab',
      mediaId: '1',
      title: 'Fifth Video',
      audience: 'For Parents',
    },
    {
      videoId: '831615340/777d84f4b8',
      mediaId: '1',
      title: 'Our Test Analytics Video',
      audience: 'For Analytics',
    }
];

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
            <VideoList videos={videos} />
        </IonRow>
        <IonRow className="video-list-row">
            <h2>Recently Viewed</h2>
            <VideoList videos={videos} />
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;