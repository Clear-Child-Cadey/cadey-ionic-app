import React, { useState, useContext, useEffect } from 'react';
import { Share } from '@capacitor/share';
// Icons
import { IonIcon } from '@ionic/react';
import { arrowRedoOutline, playCircleOutline } from 'ionicons/icons';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// Functions
import { logShareClick } from '../../api/UserFacts';
// CSS
import './VideoList.css';
// Components
import VideoDetailModal from '../Modals/VideoDetailModal/VideoDetailModal';

interface VideoItem {
  mediaId: string;
  videoId: string;
  title: string;
  audience: string;
  videoType: string;
  thumbnail: string;
}

interface VideoListProps {
  videos: VideoItem[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/userfact`
  const [canShare, setCanShare] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if the user's device has sharing capabilities
  useEffect(() => {
    Share.canShare().then((res: {value: boolean}) => setCanShare(res.value));
  }, []);

  // Function to copy the shareable link to clipboard
  const handleShare = async (event: React.MouseEvent, videoId: string, mediaId: string, videoType: string) => {
    // Log a user fact that the user tapped on Share
    logShareClick(cadeyUserId, userFactUrl, mediaId, videoType, document.title)

    // Share the Vimeo URL
    await Share.share({
      url: `https://vimeo.com/${videoId}`,
    });
  }

  const handleThumbnailClick = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  }

  console.log("Video list: ", videos)

  return (
    <div className="video-list">
      {videos.map((video) => (
        <div className="video-item" key={video.videoId}>
          <div className="video-thumb-play-container">
            <img 
              src={video.thumbnail}
              alt={video.title} 
              onClick={() => handleThumbnailClick(video)} 
            />
            <IonIcon icon={playCircleOutline} className="play-icon" />
          </div>
          <div className="tag-share">
            <p>{video.audience}</p>  
            {canShare && (
              <div className="share" onClick={(event) => handleShare(event, video.videoId, video.mediaId, video.videoType)}>
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

      {selectedVideo && (
        <VideoDetailModal 
          vimeoId={selectedVideo.videoId} 
          videoType={selectedVideo.videoType}
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
};

export default VideoList;