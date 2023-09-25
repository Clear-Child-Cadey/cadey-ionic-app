import React, { useState, useEffect, useContext } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
// CSS
import './VideoPlayer.css';
// Icons
import { IonIcon } from '@ionic/react';
import { playCircleOutline } from 'ionicons/icons';
// Components
import FalseDoorModal from '../Modals/FalseDoorModal/FalseDoorModal';
// API
import { logVideoFinish, logVideoPause, logVideoPlay, logVideoProgress } from '../../api/UserFacts';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useLoadingState } from '../../context/LoadingStateContext';

interface VideoPlayerProps {
  videoId: string;
  mediaId: string;
  videoType: string;
  source: string;
  onVideoHeightChange?: (height: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, mediaId, videoType, source, onVideoHeightChange }) => {

  const mediaIdStr = String(mediaId);

  const location = useLocation(); // Get the route so we can update the button text dynamically
  const [buttonText, setButtonText] = useState(''); // State to update the button text dynamically

  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/userfact`

  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal visibility
  const [userResponse, setUserResponse] = useState<'yes' | 'no' | null>(null); // Store the user's response

  const [falseDoorData, setFalseDoorData] = useState<any>(null); // Hold the data for the false door

  const [logged25, setLogged25] = useState(false);
  const [logged50, setLogged50] = useState(false);
  const [logged75, setLogged75] = useState(false);
  const [logged100, setLogged100] = useState(false);
  
  const [videoProgress, setVideoProgress] = useState(0);

  const { state: loadingState, dispatch } = useLoadingState();

  const handleVideoReady = () => {
    const videoElement = document.querySelector('.react-player');
    if (videoElement) {
      const videoHeight = videoElement.clientHeight;
      if (onVideoHeightChange) {
        onVideoHeightChange(videoHeight);
      }
    }
    // Dismiss the loader when the player is ready
    dispatch({ type: 'SET_LOADING', payload: { key: 'videoDetail', value: false } });
  };

  useEffect(() => {
      setButtonText('Close');
  }, [location]);
  
  const Player = ReactPlayer as any;

  const onPlay = () => {
    logVideoPlay(cadeyUserId, userFactUrl, mediaIdStr, videoType, source);
  };

  const onPause = async () => {
    const response = await logVideoPause(
        cadeyUserId, 
        userFactUrl, 
        mediaIdStr, 
        String(videoProgress).substring(0, 4), 
        videoType, 
        source
      );

    if (response.falseDoorQuestionId !== 0) {
      setFalseDoorData(response);
      setIsModalOpen(true);
    }
  };

  const onEnded = async () => {
    const response = await logVideoFinish(cadeyUserId, userFactUrl, mediaIdStr, videoType, source);

    if (response.falseDoorQuestionId !== 0) {
      setFalseDoorData(response);
      setIsModalOpen(true);
    }
  };

  const onClickPreview = () => {
    // Unused currently
  }

  const onProgress = (progress: any) => {
    setVideoProgress(progress.played);
    if (progress.played >= 1 && !logged100) {
      logVideoProgress(cadeyUserId, userFactUrl, mediaIdStr, "1.00", videoType, source);
      setLogged100(true);
    } else if (progress.played >= 0.75 && !logged75) {
      logVideoProgress(cadeyUserId, userFactUrl, mediaIdStr, "0.75", videoType, source);
      setLogged75(true);
    } else if (progress.played >= 0.5 && !logged50) {
      logVideoProgress(cadeyUserId, userFactUrl, mediaIdStr, "0.5", videoType, source);
      setLogged50(true);
    } else if (progress.played >= 0.25 && !logged25) {
      logVideoProgress(cadeyUserId, userFactUrl, mediaIdStr, "0.25", videoType, source);
      setLogged25(true);
    }
};

  const onError = (error: any) => {
    // Currently unused
  };

  return (
    <div className="video-item" key={videoId}>
      <div className='player-wrapper'>
        <Player
          className='react-player'
          url={`https://vimeo.com/${videoId}`}
          controls={true}
          light={false} // Set to true to show just the video thumbnail, which loads the full player on click
          playIcon={<IonIcon icon={playCircleOutline} className="play-icon" />}
          playing={true} // Set to true to autoplay the video
          playsInline={true}
          width='100%'
          height='100%'
          progressInterval={5000}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
          onClickPreview={onClickPreview}
          onError={onError}
          onProgress={onProgress}
          onReady={handleVideoReady}
        />
        <FalseDoorModal 
          falseDoorQuestionId={falseDoorData?.falseDoorQuestionId || 0}
          iconUrl={falseDoorData?.questionIcon || ''}
          copy={falseDoorData?.questionText || ''}
          yesResponse="Yes, sign me up!"
          noResponse="No thanks, not interested"
          thankYouIconUrlYes={falseDoorData?.questionResponseYesIcon || ''}
          thankYouIconUrlNo={falseDoorData?.questionResponseNoIcon || ''}
          thankYouCopyYes={falseDoorData?.questionResponseYesText || ''}
          thankYouCopyNo={falseDoorData?.questionResponseNoText || ''}
          thankYouButtonText={buttonText}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
