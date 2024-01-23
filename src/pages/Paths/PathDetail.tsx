import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
    IonPage,
 } from '@ionic/react';
 //  Icons
import { arrowRedoOutline, playCircleOutline } from 'ionicons/icons';
//  Contexts
import ApiUrlContext from '../../context/ApiUrlContext';
import UnreadCountContext from '../../context/UnreadContext';
import { CadeyUserContext } from '../../main';
import { useModalContext } from '../../context/ModalContext';
import { useAppPage } from '../../context/AppPageContext';
//  API
import { getVideoDetailData } from '../../api/VideoDetail';
import { logUserFact } from '../../api/UserFacts';
import { getUserMessages } from '../../api/UserMessages';
import { getQuiz } from '../../api/Quiz';
import { getPopularSeries } from '../../api/Playlists';
// CSS
import './PathDetail.css';
// Components
import VideoPlayer from '../../components/Videos/VideoPlayer';
// Interfaces
import { Message } from '../../pages/Messages/Messages';
import { WP_Article, getArticlesByIds } from '../../api/WordPress/GetArticles';

interface PathDetailModalProps {
    
}

const PathDetailPage: React.FC<PathDetailModalProps> = () => {

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
    setPopularSymptomPlaylist,
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

    // Get the ID from the URL. The URL path will be /app/paths/PathDetail?id=123

    const location = useLocation(); // Get the current location object
    const searchParams = new URLSearchParams(location.search); // Create a URLSearchParams object from the search string
    const pathId = Number(searchParams.get('id')); // Get the value of the 'id' query parameter
    
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

    // On mount:
    useEffect(() => {
        // Check if the user's device has sharing capabilities
        Share.canShare().then((res: {value: boolean}) => setCanShare(res.value));

        console.log("Popular Symptom ID: " + pathId);

        getPopularVideoData(pathId);
    }, []);

    useEffect(() => {
        if (isPopularSymptomVideoModalOpen && !source) {
            setSource(document.title);
        }
    }, [isPopularSymptomVideoModalOpen]);

    // Scroll user to top of page when the video changes
    useEffect(() => {
        contentRef.current?.scrollToTop(500); // 500 is the duration of the scroll animation in milliseconds
    }, [popularSymptomVideo?.vimeoSourceId]);  

    useEffect(() => {
        let isMounted = true; // To avoid state updates on unmounted component
        
        if (isPopularSymptomVideoModalOpen) {
            setCurrentAppPage('Popular Symptom Video Detail');
            logUserFact({
                cadeyUserId: cadeyUserId,
                baseApiUrl: apiUrl,
                userFactTypeName: 'appPageNavigation',
                appPage: 'Popular Symptom Video Detail',
                detail1: 'Symptom ID: ' + popularSymptomId,
            });
            
        } else {
            // Reset states when modal is closed
            setPopularSymptomVideo(null);
            setCurrentArticleId(null);
            setVideoData(undefined);
            setSource('');
            setPopularSymptomPlaylistPosition(0);
        }
    }, [isPopularSymptomVideoModalOpen, popularSymptomVideo?.vimeoSourceId]);

    // If the popular symptom video changes, update the nextPopularSymptomVideo value
    useEffect(() => {
        if (popularSymptomPlaylist.length > 0 && popularSymptomPlaylistPosition <= popularSymptomPlaylist.length - 1) {
            setNextPopularSymptomVideo(popularSymptomPlaylist[popularSymptomPlaylistPosition + 1]);
        } else {
            setNextPopularSymptomVideo({
                entityId: 0,
                entityType: 0,
                entityTitle: '',
                vimeoSourceId: '',
                vimeoThumbnail: '',
            });
        }
    }, [popularSymptomVideo]);

    // If the playlist position changes, update the nextPopularSymptomVideo value
    useEffect(() => {
        if (popularSymptomPlaylist.length > 0 && popularSymptomPlaylistPosition < popularSymptomPlaylist.length - 1) {
            setNextPopularSymptomVideo(popularSymptomPlaylist[popularSymptomPlaylistPosition + 1]);
        } else {
            console.log("No more videos in the playlist");
            setNextPopularSymptomVideo(null);
        }
    }, [popularSymptomPlaylistPosition, popularSymptomPlaylist]);

    const getPopularVideoData = async ( pathIdForVideos: number ) => {
        
        // Get the popular symptom playlist from the API
        const popularSeries = await getPopularSeries(apiUrl, pathIdForVideos);

        // Set the popular symptom playlist to the videos returned from the API
        setPopularSymptomPlaylist(popularSeries.items);

        setPopularSymptomVideo(popularSeries.items[0]);
    }

    const requestQuiz = async () => {

        // Get a quiz
        const quizResponse = await getQuiz(
            apiUrl,
            Number(cadeyUserId),
            1,                                      // Client Context: Where the user is in the app (1 = VideoDetail)
            1,                                      // Entity Type (1 = video)
            Number(popularSymptomVideo!.entityId)   // Entity IDs (The ID of the video)
        );

        if (quizResponse.question !== null && quizResponse.question.id > 0) {
            // Set the quiz data
            setQuizModalData(quizResponse);

            // Open the quiz modal
            setQuizModalOpen(true);
        }
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

    const handleRelatedVideoClick = async (videoId: string) => {
        
        // Get a quiz
        await requestQuiz();

        // Set the video to the next video in sequence
        setPopularSymptomVideo(nextPopularSymptomVideo);
        
        // Increment the playlist position
        setPopularSymptomPlaylistPosition(popularSymptomPlaylistPosition + 1);
        
        // Set the source for logging
        setSource('Popular Symptom Video Detail');
                
        // Set the video type for logging
        setCurrentVideoType('nextPopularVideo');
    }

    // Define the function that should be called when a video ends
    const handleVideoEnd = async () => {

        // Get a quiz
        await requestQuiz();

        // Increment the playlist position
        const newPosition = popularSymptomPlaylistPosition + 1;
        
        // If there's another video, set it as the current video
        if (newPosition < popularSymptomPlaylist.length) {
            setPopularSymptomPlaylistPosition(newPosition);
            setPopularSymptomVideo(popularSymptomPlaylist[newPosition]);
        } else {
            // Handle the end of the playlist if needed
        }
    };

    return (
        <IonPage className="video-detail">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Path Detail</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen ref={contentRef}>
                {popularSymptomVideo && popularSymptomVideo.vimeoSourceId && (
                <IonRow className="video-player-row">
                    <div className="current" key={popularSymptomVideo.vimeoSourceId} ref={videoRef}>
                        <VideoPlayer 
                            videoId={popularSymptomVideo.vimeoSourceId}
                            mediaId={popularSymptomVideo.entityId.toString()}
                            source={source}
                            onVideoHeightChange={(height) => setVideoHeight(height)}
                            onVideoEnd={handleVideoEnd}
                        />
                    <div className="video-metadata" style={{ marginTop: videoHeight || 0 }}>
                        <div className="tag-share">
                        {canShare && popularSymptomVideo.vimeoSourceId && (
                            <div className="share" onClick={(event) => handleShare(event, popularSymptomVideo.vimeoSourceId, popularSymptomVideo.entityId.toString())}>
                            <p>Share </p>
                            <div className="share-button">
                                <IonIcon icon={arrowRedoOutline} />
                            </div>
                            </div>
                        )}
                        </div>
                        <h3>{popularSymptomVideo.entityTitle}</h3>
                    </div>
                    </div>
                </IonRow>
                )}
                <IonRow>
                    <IonText className="featured-message">{videoData?.featuredMessage}</IonText>
                </IonRow>
                {nextPopularSymptomVideo && nextPopularSymptomVideo.entityTitle && (
                    <IonRow className="suggested-content">
                        <hr />
                        {/* Show the next video in sequence */}
                        <h3>Next Video</h3>
                        <div
                            onClick={() => handleRelatedVideoClick(nextPopularSymptomVideo.vimeoSourceId)}
                            className="related video-item"
                        >
                            <div className="video-thumb-play-container">
                                <img src={nextPopularSymptomVideo.vimeoThumbnail || ''} alt={nextPopularSymptomVideo.entityTitle || ''} />
                                <IonIcon icon={playCircleOutline} className="play-icon" />
                            </div>
                            <h3>{nextPopularSymptomVideo.entityTitle}</h3>
                        </div>
                    </IonRow>
                )}
            </IonContent>
        </IonPage>
    );
};

export default PathDetailPage;
