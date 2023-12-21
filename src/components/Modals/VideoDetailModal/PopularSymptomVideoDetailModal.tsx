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
import { getQuiz } from '../../../api/Quiz';
// CSS
import './PopularSymptomVideoDetailModal.css';
// Components
import VideoPlayer from '../../../components/Videos/VideoPlayer';
import ArticleItem from '../../Articles/ArticleItem';
// Interfaces
import { Message } from '../../../pages/Messages/Messages';
import { WP_Article, getArticlesByIds } from '../../../api/WordPress/GetArticles';
import { PopularSymptomVideo } from '../../SymptomsList/PopularSymptomsList';

interface PopularSymptomVideoDetailModalProps {
    
}

const PopularSymptomVideoDetailModal: React.FC<PopularSymptomVideoDetailModalProps> = () => {

  // Get all the props from the modal context
  const { 
    isArticleDetailModalOpen, 
    setCurrentArticleId,
    currentVideoType,
    setCurrentVideoType,
    setQuizModalOpen,
    setQuizModalData,
    popularSymptomId,
    isPopularSymptomVideoModalOpen,
    setIsPopularSymptomVideoModalOpen,
    popularSymptomVideo,
    setPopularSymptomVideo,
    nextPopularSymptomVideo,
    setNextPopularSymptomVideo,
    popularSymptomPlaylist,
    popularSymptomPlaylistPosition,
    setPopularSymptomPlaylistPosition,
  } = useModalContext();

  // Define an empty nextPopularSymptomVideo object with a type of PopularSymptomVideo
    
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
        if (isPopularSymptomVideoModalOpen && !source) {
        setSource(document.title);
        }
    }, [isPopularSymptomVideoModalOpen]);

    // Scroll user to top of page when the video changes
    useEffect(() => {
        contentRef.current?.scrollToTop(500); // 500 is the duration of the scroll animation in milliseconds
    }, [popularSymptomVideo?.vimeoId]);  

    useEffect(() => {
        let isMounted = true; // To avoid state updates on unmounted component

        const fetchVideoData = async () => {
            console.log("Fetching video data");
            if(!popularSymptomVideo?.vimeoId) return; // Early return if no vimeoId is present

            try {
                const data = await getVideoDetailData(apiUrl, popularSymptomVideo.vimeoId);

                // Ensure relatedMedia is always an array
                if (data && data.relatedMedia && !Array.isArray(data.relatedMedia)) {
                    data.relatedMedia = [data.relatedMedia]; // Wrap in an array
                }

                if(data && data.mediaId) {
                    if (popularSymptomVideo.vimeoId === location.search.split('video=')[1]) {
                        // Log user fact that the user clicked on a push notification
                        logUserFact({
                        cadeyUserId: cadeyUserId,
                        baseApiUrl: apiUrl,
                        userFactTypeName: 'FeaturedVideoNotificationClicked',
                        appPage: currentAppPage,
                        detail1: String(data.mediaId),
                        detail2: popularSymptomVideo.vimeoId,
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
        
        if (isPopularSymptomVideoModalOpen) {
            setCurrentAppPage('Popular Symptom Video Detail');
            logUserFact({
                cadeyUserId: cadeyUserId,
                baseApiUrl: apiUrl,
                userFactTypeName: 'appPageNavigation',
                appPage: 'Popular Symptom Video Detail',
                detail1: 'Symptom ID: ' + popularSymptomId,
            });
            fetchVideoData();
        } else {
            // Reset states when modal is closed
            setPopularSymptomVideo(null);
            setCurrentArticleId(null);
            setVideoData(undefined);
            setSource('');
        }
    }, [isPopularSymptomVideoModalOpen, popularSymptomVideo?.vimeoId]);

    // If the popular symptom video changes, update the nextPopularSymptomVideo value
    useEffect(() => {
        if (popularSymptomPlaylist.length > 0 && popularSymptomPlaylistPosition <= popularSymptomPlaylist.length - 1) {
            setNextPopularSymptomVideo(popularSymptomPlaylist[popularSymptomPlaylistPosition + 1]);
        } else {
            console.log("Clearing nextPopularSymptomVideo");
            setNextPopularSymptomVideo({
                title: '',
                vimeoId: '',
                mediaId: '',
                thumbnail: '',
            });
        }
    }, [popularSymptomVideo]);

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

    const requestQuiz = async () => {
        // Commenting out - no quiz for MVP on popular symptom videos

        // const quizResponse = await getQuiz(
        //   apiUrl,
        //   Number(cadeyUserId),
        //   1,                            // Client Context: Where the user is in the app (1 = VideoDetail)
        //   1,                            // Entity Type (1 = video)
        //   Number(videoData!.mediaId)    // Entity IDs (The ID of the video)
        // );

        // if (quizResponse.question !== null && quizResponse.question.id > 0) {
        //   // Set the quiz data
        //   setQuizModalData(quizResponse);

        //   // Open the quiz modal
        //   setQuizModalOpen(true);
        // }
    }

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
        // Set the source for logging
        setSource('Popular Symptom Video Detail');
        
        // Set the video type for logging
        setCurrentVideoType('nextPopularVideo');

        // Increment the playlist position
        setPopularSymptomPlaylistPosition(popularSymptomPlaylistPosition + 1);
        
        // Set the video to the next video in sequence symptom video
        setPopularSymptomVideo(nextPopularSymptomVideo);

        // Get a quiz
        requestQuiz();
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
        setIsPopularSymptomVideoModalOpen(false);

        requestQuiz();
    }

    return (
        <IonModal
            className="video-detail"
            // isOpen={isPopularSymptomVideoModalOpen}
            isOpen={true}
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
                {popularSymptomVideo && popularSymptomVideo.vimeoId && (
                <IonRow className="video-player-row">
                    <div className="current" key={popularSymptomVideo.vimeoId} ref={videoRef}>
                        <VideoPlayer 
                        videoId={popularSymptomVideo.vimeoId}
                        mediaId={popularSymptomVideo.mediaId.toString()}
                        source={source}
                        onVideoHeightChange={(height) => setVideoHeight(height)}
                        />
                    <div className="video-metadata" style={{ marginTop: videoHeight || 0 }}>
                        <div className="tag-share">
                        {canShare && popularSymptomVideo.vimeoId && (
                            <div className="share" onClick={(event) => handleShare(event, popularSymptomVideo.vimeoId, popularSymptomVideo.mediaId.toString())}>
                            <p>Share </p>
                            <div className="share-button">
                                <IonIcon icon={arrowRedoOutline} />
                            </div>
                            </div>
                        )}
                        </div>
                        <h3>{popularSymptomVideo.title}</h3>
                    </div>
                    </div>
                </IonRow>
                )}
                <IonRow>
                    <IonText className="featured-message">{videoData?.featuredMessage}</IonText>
                </IonRow>
                {nextPopularSymptomVideo && nextPopularSymptomVideo.title && (
                    <IonRow className="suggested-content">
                        <hr />
                        {/* Show the next video in sequence */}
                        <h3>Next Video</h3>
                        <div
                            onClick={() => handleRelatedVideoClick(nextPopularSymptomVideo.vimeoId)}
                            className="related video-item"
                        >
                            <div className="video-thumb-play-container">
                                <img src={nextPopularSymptomVideo.thumbnail || ''} alt={nextPopularSymptomVideo.title || ''} />
                                <IonIcon icon={playCircleOutline} className="play-icon" />
                            </div>
                            <h3>{nextPopularSymptomVideo.title}</h3>
                        </div>
                    </IonRow>
                )}
            </IonContent>
        </IonModal>
    );
};

export default PopularSymptomVideoDetailModal;
