import React from 'react';
import './Videos.css';
import VideoList from '../../components/Videos/VideoList';
import { IonPage } from '@ionic/react';

const VideoPage: React.FC = () => {

  // TODO: Replace with an API call to get the video IDs
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
    <IonPage>
      <VideoList videos={videos} />
    </IonPage>
  );
};

export default VideoPage;