import React, { useState, useEffect, useContext, useRef } from 'react';
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
    IonList,
 } from '@ionic/react';
 import { useHistory } from 'react-router';
 //  Icons
import { arrowRedoOutline, playCircleOutline } from 'ionicons/icons';
//  Contexts
import ApiUrlContext from '../../../context/ApiUrlContext';
import { CadeyUserContext } from '../../../main';
//  API
import { getVideoDetailData } from '../../../api/VideoDetail';
import { logShareClick } from '../../../api/UserFacts';
// CSS
import './VideoDetailModal.css';
// Components
import VideoPlayer from '../../../components/Videos/VideoPlayer';
import ArticleItem from '../../Articles/ArticleItem';
import { WP_Article } from '../../../api/WordPress/GetArticles';
// Modals
import ArticleDetailModal from '../ArticleDetailModal/ArticleDetailModal';

interface VideoDetailModalProps {
    vimeoId: string;
    videoType: string;
    isOpen: boolean;
    onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ vimeoId, videoType, isOpen, onClose }) => {

  const history = useHistory(); // Initialize the useHistory hook

  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context

  const { apiUrl } = useContext(ApiUrlContext);
  const userFactUrl = `${apiUrl}/userfact`

  const [currentVimeoId, setCurrentVimeoId] = useState(vimeoId);

  const [canShare, setCanShare] = useState(false);

  // By default, use the route as the source
  const [source, setSource] = useState(''); 

  // Refs for the video and modal container elements
  const videoRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLIonContentElement>(null);

  // State to store the calculated height for the video
  const [videoHeight, setVideoHeight] = useState<number | null>(null);

  const [videoData, setVideoData] = useState<VideoDetailData>();
  
  interface RelatedMediaItem {
    mediaType: number;                // 1 = video, 2 = article
    mediaId: number;                  // Our media item database ID
    sourceId: string | null;          // Vimeo ID for videos, null for articles
    thumbnail: string | null;         // Vimeo thumbnail for videos, null for articles
    title: string | null;             // Title of the video, null for articles
    description: string | null;       // Description of the video, null for articles
    featuredMessage: string | null;   // Featured message for the video, null for articles
    audience: string | null;          // Audience for the video, null for articles
  }
  
  interface RelatedMedia {
    relatedMediaItems: RelatedMediaItem[];
  }
  
  interface VideoDetailData {
    mediaType: number;                  // 1 = video, 2 = article
    mediaId: number;                    // Our media item database ID
    sourceId: string | null;            // Vimeo ID for videos, null for articles
    thumbnail: string | null;           // Vimeo thumbnail for videos, null for articles
    title: string | null;               // Title of the video, null for articles
    description: string | null;         // Description of the video, null for articles
    featuredMessage: string | null;     // Featured message for the video, null for articles
    audience: string | null;            // Audience for the video, null for articles
    relatedMedia: RelatedMedia[];       // Array of related media items
  }

  // Check if the user's device has sharing capabilities
  useEffect(() => {
    Share.canShare().then((res: {value: boolean}) => setCanShare(res.value));
  }, []);

  useEffect(() => {
    if (isOpen && !source) {
      setSource(document.title);
    }
  }, [isOpen]);

  // Whenever the modal is opened, set the currentVimeoId to the vimeoId prop
  useEffect(() => {
    if (isOpen) {
      setCurrentVimeoId(vimeoId);
    }
  }, [isOpen, vimeoId]);  

  // Scroll user to top of page when the video changes
  useEffect(() => {
    contentRef.current?.scrollToTop(500); // 500 is the duration of the scroll animation in milliseconds
  }, [currentVimeoId]);  

  useEffect(() => {
    const fetchVideoData = async () => {
        try {
          const data = await getVideoDetailData(apiUrl, currentVimeoId);

          // Ensure relatedMedia is always an array
        if (data && data.relatedMedia) {
          if (!Array.isArray(data.relatedMedia)) {
            data.relatedMedia = [data.relatedMedia]; // Wrap in an array
          }
        }
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
        <IonContent fullscreen ref={contentRef}>
          {videoData && (
            <IonRow className="video-player-row">
              <div className="current" key={videoData.sourceId} ref={videoRef}>
                <VideoPlayer 
                  videoId={currentVimeoId}
                  mediaId={videoData.mediaId.toString()}
                  videoType={videoType}
                  source={source}
                  onVideoHeightChange={(height) => setVideoHeight(height)}
                />
                <div className="video-metadata" style={{ marginTop: videoHeight || 0 }}>
                  <div className="tag-share">
                    {canShare && videoData.sourceId && (
                      <div className="share" onClick={(event) => handleShare(event, videoData.sourceId!, videoData.mediaId.toString(), "Video Modal Type")}>
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
              {videoData?.relatedMedia && Array.isArray(videoData.relatedMedia) && (
                <IonList className="related-items-list">
                  {videoData.relatedMedia.map((relatedMedia, index) => (
                    <div key={index}>
                      {relatedMedia.relatedMediaItems.map((item, itemIndex) => (
                        <div className='related-item' key={itemIndex}>
                          {/* Videos */}
                          {item.mediaType === 1 && item.sourceId && (
                            <div
                              onClick={() => handleRelatedVideoClick(item.sourceId!)}
                              className="related video-item"
                            >
                              <div className="video-thumb-play-container">
                                <img src={item.thumbnail || ''} alt={item.title || ''} />
                                <IonIcon icon={playCircleOutline} className="play-icon" />
                              </div>
                              <p>Video</p>
                              <h3>{item.title}</h3>
                            </div>
                          )}
                          {/* Articles */}
                          {item.mediaType === 2 && (
                            <ArticleItem articleId={item.mediaId} />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </IonList>
              )}
              {/* ---------- */}
            </IonRow>
        </IonContent>
    </IonModal>
  );
};

export default VideoDetailModal;
