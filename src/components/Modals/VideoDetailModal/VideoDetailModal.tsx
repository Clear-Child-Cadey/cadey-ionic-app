import React, { useState, useEffect, useContext } from 'react';
import { Share } from '@capacitor/share';
import { 
    IonModal,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonText,
    IonIcon,
 } from '@ionic/react';
//  Icons
import { arrowRedoOutline } from 'ionicons/icons';
//  Contexts
import ApiUrlContext from '../../../context/ApiUrlContext';
import { CadeyUserContext } from '../../../main';
import UnreadCountContext from '../../../context/UnreadCountContext';
//  API
import { getVideoDetailData } from '../../../api/VideoDetail';
import { logShareClick } from '../../../api/UserFacts';
// CSS
import './VideoDetailModal.css';
// Components
import VideoPlayer from '../../../components/Videos/VideoPlayer';

interface VideoDetailModalProps {
    vimeoId: string;
    videoType: string;
    isOpen: boolean;
    onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ vimeoId, videoType, isOpen, onClose }) => {

  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context

  const { apiUrl } = useContext(ApiUrlContext);
  const userFactUrl = `${apiUrl}/userfact`

  const [currentVimeoId, setCurrentVimeoId] = useState(vimeoId);

  const [canShare, setCanShare] = useState(false);

  // By default, use the route as the source
  const [source, setSource] = useState('');

  interface VideoDetailData {
    mediaId: string;
    sourceId: string;
    title: string;
    description: string;
    featuredMessage: string;
    audience: string;
  }

  const [videoData, setVideoData] = useState<VideoDetailData>();

  // Check if the user's device has sharing capabilities
  useEffect(() => {
    Share.canShare().then((res: {value: boolean}) => setCanShare(res.value));
  }, []);

  useEffect(() => {
    if (isOpen && !source) {
      setSource(document.title);
      console.log("Setting source to: ", document.title);
    }
}, [isOpen]);

  // Whenever the modal is opened, set the currentVimeoId to the vimeoId prop
  useEffect(() => {
    if (isOpen) {
      setCurrentVimeoId(vimeoId);
    }
  }, [isOpen, vimeoId]);  

  useEffect(() => {
    const fetchVideoData = async () => {
        try {
          const data = await getVideoDetailData(apiUrl, currentVimeoId);
          setVideoData(data);

        } catch (error) {
            console.error("Error fetching video details:", error);
        }
    };

    if (isOpen) {
      fetchVideoData();
    } else {
      // Reset states when modal is closed
      setCurrentVimeoId('');
      setVideoData(undefined);
      setSource('');
      console.log("Setting source to empty string");

    }

  }, [isOpen, currentVimeoId]);

  // Function to copy the shareable link to clipboard
  const handleShare = async (event: React.MouseEvent, videoId: string, mediaId: string, videoType: string) => {
    // Log a user fact that the user tapped on Share
    logShareClick(cadeyUserId, userFactUrl, mediaId, videoType, source)

    // Share the Vimeo URL
    await Share.share({
      url: `https://vimeo.com/${videoId}`,
    });
  }

  const handleRelatedVideoClick = (videoId: string) => {
    setSource('Related Video');
    console.log("Setting source to: Related Video");
    setCurrentVimeoId(videoId);
  }

  return (
    <IonModal className="video-detail" isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
            <IonToolbar>
                <IonTitle style={{ textAlign: 'left', paddingLeft: 0 }}>Watch Now</IonTitle>
                <IonButton className="close-button" slot="end" onClick={onClose}>Close</IonButton>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          {videoData && (
            <IonRow className="video-player-row">
              <div className="video-item" key={videoData.sourceId}>
                <VideoPlayer 
                  videoId={currentVimeoId}
                  mediaId={videoData.mediaId}
                  videoType={videoType}
                  source={source}
                />
                <div className="video-metadata">
                  <div className="tag-share">
                    <p>{videoData.audience}</p>  
                    {canShare && (
                      <div className="share" onClick={(event) => handleShare(event, videoData.sourceId, videoData.mediaId, "Video Modal Type")}>
                        <p>Share </p>
                        <div className="share-button">
                          <IonIcon icon={arrowRedoOutline} />
                        </div>
                      </div>
                    )}
                  </div>
                  <h3>{videoData.title}</h3>
                </div>
              </div>
            </IonRow>
          )}
            <IonRow>
                <IonText className="featured-message">{videoData?.featuredMessage}</IonText>
            </IonRow>
            
            <IonRow className="suggested-content">
              <hr />
              <h3>Also Recommended</h3>
              <IonRow className="suggested-video-row">
                <img 
                  src="https://i.vimeocdn.com/video/1711321134-fd2aedff2fe7e8753719c6d9d050293090466b8432a8798c05ba5b13a79a23a4-d?mw=1600&mh=900"
                  alt="New Video Title" 
                  onClick={() => handleRelatedVideoClick("855048900/c5036cbce8")}
                />
              </IonRow>
            </IonRow>
        </IonContent>
    </IonModal>
  );
};

export default VideoDetailModal;
