import React, { useState, useContext, useEffect } from 'react';
import VideoPlayer from '../../components/Videos/VideoPlayer';
import './VideoList.css';
import { Share } from '@capacitor/share';
// Icons
import { IonIcon } from '@ionic/react';
import { arrowRedoOutline } from 'ionicons/icons';
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
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/api/cadeydata/userfact`
  const [canShare, setCanShare] = useState(false);

  // Check if the user's device has sharing capabilities
  useEffect(() => {
    Share.canShare().then((res: {value: boolean}) => setCanShare(res.value));
  }, []);


  // Function to copy the shareable link to clipboard
  const handleShare = async (event: React.MouseEvent, videoId: string, mediaId: string) => {
    // Log a user fact that the user tapped on Share
    logShareClick(cadeyUserId, userFactUrl, mediaId, location.pathname)

    // Share the Vimeo URL
    await Share.share({
      url: `https://vimeo.com/${videoId}`,
    });
  }

  return (
    <div className="video-list">
      {videos.map((video) => (
        <div className="video-item" key={video.videoId}>
          <VideoPlayer videoId={video.videoId} mediaId={video.mediaId} />
          <div className="tag-share">
            <p>{video.audience}</p>  
            {canShare && (
              <div className="share" onClick={(event) => handleShare(event, video.videoId, video.mediaId)}>
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