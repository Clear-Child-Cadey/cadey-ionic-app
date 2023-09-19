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
import VideoPlayer from '../../../components/Videos/VideoPlayer';

interface VideoDetailModalProps {
    vimeoId: string;
    isOpen: boolean;
    onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ vimeoId, isOpen, onClose }) => {

  const { apiUrl } = useContext(ApiUrlContext);
  const userFactUrl = `${apiUrl}/userfact`

  const [currentVimeoId, setCurrentVimeoId] = useState(vimeoId);
  const [currentMediaId, setCurrentMediaId] = useState(vimeoId);

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
  }, [vimeoId, currentVimeoId]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Watch Now</IonTitle>
                <IonButton slot="end" onClick={onClose}>Close</IonButton>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonRow className="video-player-row">
              {videoData && (
                <VideoPlayer 
                  videoId={currentVimeoId}
                  mediaId={videoData.mediaId}
                  videoType="videoDetail from modal" 
                />
              )}
            </IonRow>
            <IonRow>
                <IonText className="featured-message">{videoData?.featuredMessage}</IonText>
            </IonRow>
            <IonRow className="suggested-video-row">
              <img 
                src="https://i.vimeocdn.com/video/1711321134-fd2aedff2fe7e8753719c6d9d050293090466b8432a8798c05ba5b13a79a23a4-d?mw=1600&mh=900"
                alt="New Video Title" 
                onClick={() => setCurrentVimeoId("855048900/c5036cbce8")} 
              />
            </IonRow>
        </IonContent>
    </IonModal>
  );
};

export default VideoDetailModal;
