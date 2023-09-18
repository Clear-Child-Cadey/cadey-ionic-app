import React, { useState, useEffect, useContext } from 'react';
import { 
    IonModal,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonText,
 } from '@ionic/react';
//  Contexts
import ApiUrlContext from '../../../context/ApiUrlContext';
import { CadeyUserContext } from '../../../main';
import UnreadCountContext from '../../../context/UnreadCountContext';
//  API
import { getVideoDetailData } from '../../../api/VideoDetail';
// CSS
import './VideoDetailModal.css';
// Components
import VideoList from '../../../components/Videos/VideoList';

interface VideoDetailModalProps {
    vimeoId: string;
    isOpen: boolean;
    onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ vimeoId, isOpen, onClose }) => {

  const { apiUrl } = useContext(ApiUrlContext);
  const userFactUrl = `${apiUrl}/userfact`
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

  useEffect(() => {
    const fetchVideoData = async () => {
        try {
          const data = await getVideoDetailData(apiUrl, vimeoId);
          setVideoData(data);

        } catch (error) {
            console.error("Error fetching video details:", error);
        }
    };

    fetchVideoData(); // Get data when the component mounts
  }, []);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Watch Now</IonTitle>
                <IonButton slot="end" onClick={onClose}>Close</IonButton>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonRow className="video-list-row">
              <VideoList videos={videoData ? [{
                  mediaId: videoData.mediaId,
                  videoId: videoData.sourceId,
                  title: videoData.title,
                  audience: videoData.audience,
                  videoType: "videoDetail",
              }] : []} />
            </IonRow>
            <IonRow>
                <IonText className="featured-message">{videoData?.featuredMessage}</IonText>
            </IonRow>
        </IonContent>
    </IonModal>
  );
};

export default VideoDetailModal;
