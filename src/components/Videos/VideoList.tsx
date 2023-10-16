import React, { useState, useContext, useEffect } from 'react';
import { Share } from '@capacitor/share';
// Icons
import { IonIcon } from '@ionic/react';
import { arrowRedoOutline, playCircleOutline } from 'ionicons/icons';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useLoadingState } from '../../context/LoadingStateContext';
import { useModalContext } from '../../context/ModalContext';
// Functions
import { logShareClick } from '../../api/UserFacts';
// CSS
import './VideoList.css';

export interface VideoItem {
  mediaId: string;
  sourceId: string;
  title: string;
  audience: string;
  videoType: string;
  thumbnail: string;
}

interface VideoListProps {
  videos: VideoItem[];
  listType: string;
}

const VideoList: React.FC<VideoListProps> = ({ videos, listType }) => {
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/userfact`
  const [canShare, setCanShare] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  
  // Get all the props from the modal context
  const { 
    setVideoModalOpen, 
    setArticleDetailModalOpen,
    setCurrentVimeoId,
    setCurrentVideoType,
  } = useModalContext();

  // Get the loading state from the context
  const { state: loadingState, dispatch } = useLoadingState();

  // Check if the user's device has sharing capabilities
  useEffect(() => {
    Share.canShare().then((res: {value: boolean}) => setCanShare(res.value));
  }, []);

  // Function to copy the shareable link to clipboard
  const handleShare = async (event: React.MouseEvent, sourceId: string, mediaId: string, videoType: string) => {
    // Log a user fact that the user tapped on Share
    logShareClick(cadeyUserId, userFactUrl, mediaId, videoType, document.title)

    // Share the Vimeo URL
    await Share.share({
      url: `https://vimeo.com/${sourceId}`,
    });
  }

  const handleThumbnailClick = (video: VideoItem) => {
    // Start the loader - will be dismissed in the VideoPlayer component when the video is ready
    dispatch({ type: 'SET_LOADING', payload: { key: 'videoDetail', value: true } });
    setSelectedVideo(video);
    setCurrentVimeoId(video.sourceId);
    setCurrentVideoType(video.videoType);
    setArticleDetailModalOpen(false);
    setVideoModalOpen(true);
  }

  return (
    <div className={`video-list ${listType === 'full' ? 'full' : ''} ${listType === 'horizontal' ? 'horizontal' : ''}`}>
      {videos.map((video) => (
        <div className="video-item" key={video.sourceId}>
          <div className="video-thumb-play-container">
            <img 
              src={video.thumbnail}
              alt={video.title} 
              onClick={() => handleThumbnailClick(video)} 
            />
            <IonIcon icon={playCircleOutline} className="play-icon" />
          </div>
          <div className="tag-share">
            <p>Video</p>  
            {canShare && (
              <div className="share" onClick={(event) => handleShare(event, video.sourceId, video.mediaId, video.videoType)}>
                <p>Share </p>
                <div className="share-button">
                  <IonIcon icon={arrowRedoOutline} />
                </div>
              </div>
            )}
          </div>
          <h3>{video.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default VideoList;