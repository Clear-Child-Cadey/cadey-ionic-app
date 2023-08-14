import React, { useEffect } from 'react';
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
      description: 'Take a walk with your child today. Listen to the sounds. Afterwards talk about what you each heard.',
      audience: 'For Parents',
    },
  ];

    // Set the page title when the component mounts
    useEffect(() => {
        document.title = 'Video Detail';
    } , []);

  return (
    <IonPage className="video-detail">
        <IonHeader>
            <IonToolbar>
                <IonTitle>Show Me How</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
            <IonToolbar>
                <IonTitle size="large">Show Me How</IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonRow>
                <IonText className="subcopy">{videos[0].description}</IonText>
            </IonRow>
            <IonRow className="video-list-row">
                <VideoList videos={videos} />
            </IonRow>
            <IonRow>
                <IonText className="subcopy">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tempor lorem vitae quam gravida, in aliquet nisl porttitor. Proin consectetur dolor nibh, nec tincidunt mauris pulvinar a. Suspendisse vitae arcu at lectus accumsan ultrices in in erat. Donec in sollicitudin nisl. In vehicula eget dui.</IonText>
            </IonRow>
        </IonContent>
    </IonPage>
  );
};

export default VideoDetailPage;