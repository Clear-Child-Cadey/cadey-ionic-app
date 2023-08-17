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
import { CadeyUserContext } from '../../main';
import UnreadCountContext from '../../context/UnreadCountContext';
//  API
import { getVideoDetailData } from '../../api/VideoDetail';
import { logFeaturedVideoNotificationClicked } from '../../api/UserFacts';

const VideoDetailPage: React.FC = () => {

  const { id1, id2 } = useParams<{ id1: string, id2: string }>();
  const vimeoId = id1 + "/" + id2;
  const { apiUrl } = useContext(ApiUrlContext);
  const userFactUrl = `${apiUrl}/api/cadeydata/userfact`
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const unreadCount = useContext(UnreadCountContext); // Get the current unread count

  interface VideoDetailData {
    mediaId: string;
    sourceId: string;
    title: string;
    description: string;
    featuredMessage: string;
    audience: string;
  }

  const [videoData, setVideoData] = useState<VideoDetailData>();

  // On component mount:
  // - Get the video data
  // - Set the page title
  // - Log a user fact that the user saw this "message" (video)
  useEffect(() => {
    const fetchVideoData = async () => {
        try {
          // Getting data for VideoDetailPage
          const data = await getVideoDetailData(apiUrl, id1, id2);
          setVideoData(data);

          if(data && data.mediaId) {
            // Log user fact that the user saw this "message" (video)
            logFeaturedVideoNotificationClicked(
              cadeyUserId, 
              userFactUrl, 
              String(data.mediaId), 
              vimeoId, 
              location.pathname
            );
            // Decrement the unread counter
            unreadCount.setUnreadCount?.(prevCount => prevCount - 1);
          }
        } catch (error) {
            console.error("Error fetching video details:", error);
        }
    };

    document.title = 'Video Detail'; // Set the page title when the component mounts
    fetchVideoData(); // Get data when the component mounts
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