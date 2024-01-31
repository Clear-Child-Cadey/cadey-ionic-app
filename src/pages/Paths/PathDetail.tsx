import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Share } from '@capacitor/share';
import { 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonText,
    IonIcon,
    IonPage,
 } from '@ionic/react';
 //  Icons
import { arrowRedoOutline, playCircleOutline } from 'ionicons/icons';
//  Contexts
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
import { useAppPage } from '../../context/AppPageContext';
import { usePathContext } from '../../context/PathContext';
import { useModalContext } from '../../context/ModalContext';
//  API
import { logUserFact } from '../../api/UserFacts';
import { getQuiz } from '../../api/Quiz';
import { getPopularSeries } from '../../api/Playlists';
import { getPathDetail } from '../../api/Paths';
// CSS
import './PathDetail.css';
// Components
import VideoPlayer from '../../components/Videos/VideoPlayer';
// Interfaces
import { PathDetail, PathEntity } from '../../api/Paths';

interface PathDetailModalProps {
    
}

const PathDetailPage: React.FC<PathDetailModalProps> = () => {

    // Get all the props from the path context
    const { 
        pathEntity, 
        setPathEntity,
        nextPathEntity,
        setNextPathEntity,
        pathPlaylist, 
        setPathPlaylist, 
        pathPlaylistPosition, 
        setPathPlaylistPosition 
    } = usePathContext();

    // Get props from the modal context (for the quiz modal)
    const { 
        quizModalData, 
        setQuizModalData, 
        isQuizModalOpen, 
        setQuizModalOpen, 
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

    // Get the ID from the URL. The URL path will be /app/paths/PathDetail?id=123
    const location = useLocation(); // Get the current location object
    const searchParams = new URLSearchParams(location.search); // Create a URLSearchParams object from the search string
    // const pathId = Number(searchParams.get('id')); // Get the value of the 'id' query parameter
    const pathId = 1;
    
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

        // Get the video data from the API
        getPopularVideoData(pathId);

        // Set the current app page
        setCurrentAppPage('Path Detail');
        
        // Log a user fact that the user navigated to the popular symptom video detail page
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Path Detail',
            detail1: 'Path ID: ' + pathId,
        });
    }, []);

    // If the path entity changes, update the nextPathEntity value
    useEffect(() => {
        if (pathPlaylist.length > 0 && pathPlaylistPosition <= pathPlaylist.length - 1) {
            setNextPathEntity(pathPlaylist[pathPlaylistPosition + 1]);
        } else {
            setNextPathEntity(null);
        }
    }, [pathEntity, pathPlaylistPosition, pathPlaylist]);

    // If the playlist position changes, update the next value
    useEffect(() => {
        if (pathPlaylist.length > 0 && pathPlaylistPosition < pathPlaylist.length - 1) {
            setNextPathEntity(pathPlaylist[pathPlaylistPosition + 1]);
        } else {
            console.log("No more videos in the playlist");
            setNextPathEntity(null);
        }
    }, [pathPlaylistPosition, pathPlaylist]);

    // Log the pathPlaylist when it changes
    useEffect(() => {
        console.log('Path playlist changed');
        console.log(pathPlaylist);
    }, [pathPlaylist]);

    const getPopularVideoData = async ( pathId: number ) => {
        
        console.log('Getting path detail for path ID ' + pathId);

        // Get the popular symptom playlist from the API
        const pathSeries = await getPathDetail(apiUrl, Number(cadeyUserId), pathId);

        // Set the popular symptom playlist to the videos returned from the API
        setPathPlaylist(pathSeries.entities);

        setPathEntity(pathSeries.entities[0]);
    }

    const requestQuiz = async () => {

        // Get a quiz
        const quizResponse = await getQuiz(
            apiUrl,
            Number(cadeyUserId),
            1,                              // Client Context: Where the user is in the app (1 = VideoDetail)
            1,                              // Entity Type (1 = video)
            Number(pathEntity!.entityId)    // Entity IDs (The ID of the video)
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
        });

        // Share the Vimeo URL
        await Share.share({
        url: `https://vimeo.com/${videoId}`,
        });
    }

    const handlePathEntityClick = async (entity: PathEntity) => {
        
        // Get a quiz
        await requestQuiz();

        // Set the next entity in sequence
        // TODO: Change this to use the entity the user just clicked on
        setPathEntity(entity);
        
        // Set the position in the playlist based on the entity's actual position
        const entityIndex = pathPlaylist.findIndex((entityToIndex) => entityToIndex === entity);
        setPathPlaylistPosition(entityIndex);
        
        // Set the source for logging
        setSource('Path Detail');
    }

    // Define the function that should be called when a video ends
    const handleVideoEnd = async () => {

        // Get a quiz
        await requestQuiz();

        // Increment the playlist position
        const newPosition = pathPlaylistPosition + 1;
        
        // If there's another video, set it as the current video
        if (newPosition < pathPlaylist.length) {
            setPathPlaylistPosition(newPosition);
            setPathEntity(pathPlaylist[newPosition]);
        } else {
            // Handle the end of the playlist if needed
        }
    };

    return (
        <IonPage className="path-detail">
            <IonContent fullscreen ref={contentRef}>
                <IonHeader class="header">
                    <IonToolbar className="header-toolbar">
                        <a href="/App/Paths" className="back-link">Paths</a>
                        <h2>Following directions</h2>
                    </IonToolbar>
                </IonHeader>
                {pathEntity && pathEntity.sourceId && (
                    <IonRow className="video-player-row">
                        <div className="current" key={pathEntity.sourceId} ref={videoRef}>
                            <VideoPlayer 
                                videoId={pathEntity.sourceId}
                                mediaId={pathEntity.entityId.toString()}
                                source={source}
                                onVideoHeightChange={(height) => setVideoHeight(height)}
                                onVideoEnd={handleVideoEnd}
                            />
                            <div className="video-metadata" style={{ marginTop: videoHeight || 0 }}>
                                <div className="tag-share">
                                    {canShare && pathEntity.sourceId && (
                                        <div className="share" onClick={(event) => handleShare(event, pathEntity.sourceId, pathEntity.entityId.toString())}>
                                            <p>Share </p>
                                            <div className="share-button">
                                                <IonIcon icon={arrowRedoOutline} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <h3>{pathEntity.title}</h3>
                            </div>
                        </div>
                    </IonRow>
                )}
                <IonRow>
                    <IonText className="featured-message">{videoData?.featuredMessage}</IonText>
                </IonRow>
                {pathPlaylist && (
                    <IonRow className="path-sequence">
                        {/* Show the next video in sequence */}
                        <h3>All videos in this path</h3>
                        {pathPlaylist.map((entity, index) => (
                            <div
                                onClick={() => handlePathEntityClick(entity)}
                                className={`entity video-item ${entity === pathEntity ? 'current' : ''}`}
                                key={entity.entityId}
                            >
                                <img src={entity.thumbnail || ''} alt={entity.title || ''} />
                                <div className="text-container">
                                    <h3>{entity.title}</h3>
                                    <p className="position">Video {index + 1}</p>
                                </div>
                                <IonIcon icon={playCircleOutline} className="play-icon" />
                            </div>
                        ))}
                    </IonRow>
                )}
            </IonContent>
        </IonPage>
    );
};

export default PathDetailPage;