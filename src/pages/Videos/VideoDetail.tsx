import React from 'react';
import './VideoDetail.css';
import { useParams } from 'react-router-dom';
import VideoList from '../../components/Videos/VideoList';
import { 
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonText,
 } from '@ionic/react';

const VideoDetailPage: React.FC = () => {

  // TODO: Replace with an API call to get the video IDs
  const { id1, id2 } = useParams<{ id1: string, id2: string }>();
  const videos = [
    {
      videoId: id1 + '/' + id2,
      mediaId: '1',
      title: 'Lists and Lines for Homework Organization',
      description: 'This is a description of the video',
      audience: 'For Parents',
    },
  ];

  return (
    <IonPage className="video-detail">
        <IonHeader>
            <IonToolbar>
                <IonTitle>{videos[0].title}</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
            <IonToolbar>
                <IonTitle size="large">{videos[0].title}</IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonRow>
                <IonText className="subcopy">{videos[0].description}</IonText>
            </IonRow>
            <IonRow className="video-list-row">
                <VideoList videos={videos} />
            </IonRow>
        </IonContent>
    </IonPage>
  );
};

export default VideoDetailPage;