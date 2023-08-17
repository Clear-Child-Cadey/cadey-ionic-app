import React, { useState, useEffect, useContext } from 'react';
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
//  Contexts
import ApiUrlContext from '../../context/ApiUrlContext';
//  API
import { getVideoDetailData } from '../../api/VideoDetail';

const VideoDetailPage: React.FC = () => {

  const { id1, id2 } = useParams<{ id1: string, id2: string }>();
  const vimeoId = id1 + "/" + id2;
  const { apiUrl } = useContext(ApiUrlContext);

  interface VideoDetailData {
    mediaId: string;
    sourceId: string;
    title: string;
    description: string;
    featuredMessage: string;
    audience: string;
  }

  const [videoData, setVideoData] = useState<VideoDetailData>();

  useEffect(() => {
    const fetchVideoData = async () => {
        try {
          // Getting data for VideoDetailPage
          const data = await getVideoDetailData(apiUrl, id1, id2);
          setVideoData(data);
        } catch (error) {
            console.error("Error fetching video details:", error);
        }
    };

    fetchVideoData(); // Get data when the component mounts
    document.title = 'Video Detail'; // Set the page title when the component mounts
  }, []);

  return (
    <IonPage className="video-detail">
        <IonHeader>
            <IonToolbar>
              <IonTitle>{videoData?.title || "Loading..."}</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{videoData?.title}</IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonRow className="video-list-row">
              {/* Only pass the necessary properties to VideoList */}
              <VideoList videos={videoData ? [{
                  mediaId: videoData.mediaId,
                  videoId: videoData.sourceId,
                  title: videoData.title,
                  audience: videoData.audience
              }] : []} />
            </IonRow>
            <IonRow>
                <IonText className="featured-message">{videoData?.featuredMessage}</IonText>
            </IonRow>
            <IonRow>
                <IonText className="subcopy">{videoData?.description}</IonText>
            </IonRow>
        </IonContent>
    </IonPage>
  );
};

export default VideoDetailPage;