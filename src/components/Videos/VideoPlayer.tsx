import React, { useState, useEffect, useContext } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
import './VideoPlayer.css';
import { IonIcon } from '@ionic/react';
import { playCircleOutline } from 'ionicons/icons';
import FalseDoorModal from '../Modals/FalseDoorModal/FalseDoorModal';
import { logVideoFinish, logVideoPause, logVideoPlay, logVideoProgress } from '../../api/UserFacts';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';

interface VideoPlayerProps {
  videoId: string;
  mediaId: string;
  videoType: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, mediaId, videoType }) => {

  const mediaIdStr = String(mediaId);

  const location = useLocation(); // Get the route so we can update the button text dynamically
  const [buttonText, setButtonText] = useState(''); // State to update the button text dynamically

  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/api/cadeydata/userfact`

  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal visibility
  const [userResponse, setUserResponse] = useState<'yes' | 'no' | null>(null); // Store the user's response

  const [falseDoorData, setFalseDoorData] = useState<any>(null); // Hold the data for the false door

  const [logged25, setLogged25] = useState(false);
  const [logged50, setLogged50] = useState(false);
  const [logged75, setLogged75] = useState(false);
  const [logged100, setLogged100] = useState(false);
  
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    if (location.pathname === '/Home' || location.pathname === '/' || location.pathname === '/home') {
      setButtonText('Back to Home');
    } else if (location.pathname === '/Concerns' || location.pathname === '/concerns') {
      setButtonText('Back to Concerns');
    } else {
      setButtonText('Close');
    }
  }, [location]);
  
  const Player = ReactPlayer as any;

  const onPlay = () => {
    // Unused currently
  };

  const onPause = async () => {
    const response = await logVideoPause(
        cadeyUserId, 
        userFactUrl, 
        mediaIdStr, 
        String(videoProgress).substring(0, 4), 
        videoType, 
        location.pathname
      );

    if (response.falseDoorQuestionId !== 0) {
      setFalseDoorData(response);
      setIsModalOpen(true);
    }
  };

  const onEnded = async () => {
    const response = await logVideoFinish(cadeyUserId, userFactUrl, mediaIdStr, videoType, location.pathname);

    if (response.falseDoorQuestionId !== 0) {
      setFalseDoorData(response);
      setIsModalOpen(true);
    }
  };

  const onClickPreview = () => {
    logVideoPlay(cadeyUserId, userFactUrl, mediaIdStr, videoType, location.pathname);
  }

  const onProgress = (progress: any) => {
    setVideoProgress(progress.played);
    if (progress.played >= 1 && !logged100) {
      logVideoProgress(cadeyUserId, userFactUrl, mediaIdStr, "1.00", videoType, location.pathname);
      setLogged100(true);
    } else if (progress.played >= 0.75 && !logged75) {
      logVideoProgress(cadeyUserId, userFactUrl, mediaIdStr, "0.75", videoType, location.pathname);
      setLogged75(true);
    } else if (progress.played >= 0.5 && !logged50) {
      logVideoProgress(cadeyUserId, userFactUrl, mediaIdStr, "0.5", videoType, location.pathname);
      setLogged50(true);
    } else if (progress.played >= 0.25 && !logged25) {
      logVideoProgress(cadeyUserId, userFactUrl, mediaIdStr, "0.25", videoType, location.pathname);
      setLogged25(true);
    }
};

  const onError = (error: any) => {
    // Currently unused
  };

  return (
    <div className='player-wrapper'>
      <Player
        className='react-player'
        url={`https://vimeo.com/${videoId}`}
        controls={true}
        light={true}
        playIcon={<IonIcon icon={playCircleOutline} className="playIcon" />}
        playing={false}
        width='100%'
        height='100%'
        progressInterval={5000}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onClickPreview={onClickPreview}
        onError={onError}
        onProgress={onProgress}
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
  );
};

export default VideoPlayer;
