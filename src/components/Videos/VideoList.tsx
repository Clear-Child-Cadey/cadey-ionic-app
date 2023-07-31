import React, { useState, useContext } from 'react';
import VideoPlayer from '../../components/Videos/VideoPlayer';
import './VideoList.css';
import { Clipboard } from '@capacitor/clipboard';
// Icons
import { IonIcon } from '@ionic/react';
import { shareOutline } from 'ionicons/icons';
// import { useLocation } from 'react-router';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// Functions
import { logShareClick } from '../../api/UserFacts';

interface VideoItem {
  mediaId: string;
  videoId: string;
  title: string;
  audience: string;
}

interface VideoListProps {
  videos: VideoItem[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  // Local state for showing/hiding the tooltip
  const [showTooltip, setShowTooltip] = useState<{videoId: string} | null>(null);
  
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/api/cadeydata/userfact`


  // Function to copy the shareable link to clipboard
  const handleShare = async (event: React.MouseEvent, videoId: string, mediaId: string) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    await Clipboard.write({
      string: `https://vimeo.com/${videoId}`,
    });

    logShareClick(cadeyUserId, userFactUrl, mediaId, location.pathname)
  
    setShowTooltip({ videoId }); // Show the tooltip above the share button
    setTimeout(() => {
      setShowTooltip(null);
    }, 2000);
  }

  return (
    <div className="video-list">
      {videos.map((video) => (
        <div className="video-item" key={video.videoId}>
          <VideoPlayer videoId={video.videoId} mediaId={video.mediaId} />
          <div className="tag-share">
            <p>{video.audience}</p>  
            <div className="share-button">
            <IonIcon icon={shareOutline} onClick={(event) => handleShare(event, video.videoId, video.mediaId)} />
            {showTooltip && showTooltip.videoId === video.videoId &&
                <div className="tooltip">Link copied to clipboard</div>
            }
            </div>
          </div>
          <h3>{video.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default VideoList;