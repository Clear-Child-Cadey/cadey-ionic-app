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
 //  Icons
import { arrowRedoOutline, playCircleOutline } from 'ionicons/icons';
//  Contexts
import ApiUrlContext from '../../../context/ApiUrlContext';
import UnreadCountContext from '../../../context/UnreadContext';
import { CadeyUserContext } from '../../../main';
import { useModalContext } from '../../../context/ModalContext';
import { useAppPage } from '../../../context/AppPageContext';
//  API
import { getVideoDetailData } from '../../../api/VideoDetail';
import { logUserFact } from '../../../api/UserFacts';
import { getUserMessages } from '../../../api/UserMessages';
// CSS
import './VideoDetailModal.css';
// Components
import VideoPlayer from '../../../components/Videos/VideoPlayer';
import ArticleItem from '../../Articles/ArticleItem';
// Interfaces
import { Message } from '../../../pages/Messages/Messages';
import { WP_Article, getArticlesByIds } from '../../../api/WordPress/GetArticles';

interface VideoDetailModalProps {
    
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = () => {

  // Get all the props from the modal context
  const { 
    isVideoModalOpen, 
    setVideoModalOpen,
    isArticleDetailModalOpen, 
    setCurrentArticleId,
    currentVimeoId,
    setCurrentVimeoId,
    currentVideoType,
    setCurrentVideoType,
  } = useModalContext();

  const { currentBasePage, currentAppPage, setCurrentAppPage } = useAppPage();

  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context

  const { apiUrl } = useContext(ApiUrlContext);

  const [canShare, setCanShare] = useState(false);

  // By default, use the route as the source
  const [source, setSource] = useState(''); 

  // Refs for the video and modal container elements
  const videoRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLIonContentElement>(null);

  // State to store the calculated height for the video
  const [videoHeight, setVideoHeight] = useState<number | null>(null);

  const [videoData, setVideoData] = useState<VideoDetailData>();
  const [relatedArticles, setRelatedArticles] = useState<WP_Article[]>();

  const unreadCount = useContext(UnreadCountContext); // Get the current unread count
  
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
    if (isVideoModalOpen && !source) {
      setSource(document.title);
    }
  }, [isVideoModalOpen]);

  // Scroll user to top of page when the video changes
  useEffect(() => {
    contentRef.current?.scrollToTop(500); // 500 is the duration of the scroll animation in milliseconds
  }, [currentVimeoId]);  

  useEffect(() => {
    let isMounted = true; // To avoid state updates on unmounted component

    const fetchVideoData = async () => {
      if(!currentVimeoId) return; // Early return if no vimeoId is present

      try {
        const data = await getVideoDetailData(apiUrl, currentVimeoId);

        // Ensure relatedMedia is always an array
        if (data && data.relatedMedia && !Array.isArray(data.relatedMedia)) {
          data.relatedMedia = [data.relatedMedia]; // Wrap in an array
        }

        if(data && data.mediaId) {
          if (currentVimeoId === location.search.split('video=')[1]) {
            // Log user fact that the user clicked on a push notification
            logUserFact({
              cadeyUserId: cadeyUserId,
              baseApiUrl: apiUrl,
              userFactTypeName: 'FeaturedVideoNotificationClicked',
              appPage: currentAppPage,
              detail1: String(data.mediaId),
              detail2: currentVimeoId,
            });
          }
          
          // Get Messages when the user visits the Video Detail page
          // We use this to decrement the unread counter
          fetchMessages(); 
        }
        
        if (isMounted) setVideoData(data); // Update state only if component is mounted

        // Set article IDs in state via setRelatedArticleIds
        // An article is a related media item with a mediaType of 2
        const articleIds = data.relatedMedia
          .map((relatedMedia: RelatedMedia) => relatedMedia.relatedMediaItems)
          .flat()
          .filter((item: RelatedMediaItem) => item.mediaType === 2)
          .map((item: RelatedMediaItem) => item.mediaId);
        
        // If any articles were returned, set them in state
        if (articleIds.length > 0) {
          setRelatedArticles(await getArticlesByIds(articleIds));
        }

      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    if (isVideoModalOpen) {
      setCurrentAppPage('Video Detail');
      logUserFact({
        cadeyUserId: cadeyUserId,
        baseApiUrl: apiUrl,
        userFactTypeName: 'appPageNavigation',
        appPage: 'Video Detail',
      });
      fetchVideoData();
    } else {
      // Reset states when modal is closed
      setCurrentVimeoId(null);
      setCurrentArticleId(null);
      setVideoData(undefined);
      setSource('');
    }
  }, [isVideoModalOpen, currentVimeoId]);

  const fetchMessages = async () => {
    try {
      // Getting messages
      const data: Message[] = await getUserMessages(apiUrl, cadeyUserId);
      const unread = data.filter(data => !data.isRead).length;
      unreadCount.setUnreadMessagesCount?.(unread);
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  // Function to copy the shareable link to clipboard
  const handleShare = async (event: React.MouseEvent, videoId: string, mediaId: string) => {
    // Log a user fact that the user tapped on Share
    logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'MediaShared',
      appPage: source,
      detail1: mediaId,
      detail2: currentVideoType,
    });

    // Share the Vimeo URL
    await Share.share({
      url: `https://vimeo.com/${videoId}`,
    });
  }

  const handleRelatedVideoClick = (videoId: string) => {
    setSource('Video Detail');
    setCurrentVideoType('relatedVideos');
    setCurrentVimeoId(videoId);
  }

  function handleClose() {
    if (!isArticleDetailModalOpen) {
      setCurrentAppPage(currentBasePage);
      logUserFact({
        cadeyUserId: cadeyUserId,
        baseApiUrl: apiUrl,
        userFactTypeName: 'appPageNavigation',
        appPage: currentBasePage,
      });
    }
    setVideoModalOpen(false);
  }

  return (
    <IonModal
      className="video-detail"
      isOpen={isVideoModalOpen}
      onDidDismiss={() => handleClose()}
    >
      <IonHeader>
          <IonToolbar>
              <IonTitle style={{ textAlign: 'left', paddingLeft: 16 }}>Watch Now</IonTitle>
              <IonButton className="close-button" slot="end" onClick={() => handleClose()}>
                Close
              </IonButton>
          </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        {videoData && currentVimeoId && (
          <IonRow className="video-player-row">
            <div className="current" key={videoData.sourceId} ref={videoRef}>
                <VideoPlayer 
                  videoId={currentVimeoId}
                  mediaId={videoData.mediaId.toString()}
                  source={source}
                  onVideoHeightChange={(height) => setVideoHeight(height)}
                />
              <div className="video-metadata" style={{ marginTop: videoHeight || 0 }}>
                <div className="tag-share">
                  {canShare && videoData.sourceId && (
                    <div className="share" onClick={(event) => handleShare(event, videoData.sourceId!, videoData.mediaId.toString())}>
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
                        {item.mediaType === 2 && relatedArticles && (
                          <>
                            {/* Get the related article from the relatedArticles array whose ID matches the mediaId */}
                            <ArticleItem article={relatedArticles.find((article) => article.id === item.mediaId)!} />
                          </>
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
