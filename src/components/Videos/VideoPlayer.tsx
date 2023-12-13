import React, { useState, useContext, useRef, useEffect } from 'react';
import Player from '@vimeo/player';
// CSS
import './VideoPlayer.css';
// Components
import FalseDoorModal from '../Modals/FalseDoorModal/FalseDoorModal';
// API
import { logUserFact } from '../../api/UserFacts';
import { getQuiz } from '../../api/Quiz';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useLoadingState } from '../../context/LoadingStateContext';
import { useModalContext } from '../../context/ModalContext';

interface VideoPlayerProps {
  videoId: string;
  mediaId: string;
  source: string;
  onVideoHeightChange?: (height: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, mediaId, source, onVideoHeightChange }) => {

  const vimeoVideoId = videoId.split('/')[0];
  const vimeoHashParameter = videoId.split('/')[1];
  const vimeoUrl = `https://player.vimeo.com/video/${vimeoVideoId}?h=${vimeoHashParameter}&autoplay=1`;

  const mediaIdStr = String(mediaId);

  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/userfact`

  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal visibility

  const [falseDoorData, setFalseDoorData] = useState<any>(null); // Hold the data for the false door
  
  const playerRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [logged25, setLogged25] = useState(false);
  const [logged50, setLogged50] = useState(false);
  const [logged75, setLogged75] = useState(false);
  const [logged100, setLogged100] = useState(false);

  const { state: loadingState, dispatch } = useLoadingState();

  const screenWidth = document.documentElement.clientWidth;

  const { 
    currentVideoType,
    isQuizModalOpen,
    setQuizModalOpen,
    setQuizModalData,
  } = useModalContext();

  useEffect(() => {
    if (playerRef.current) {
      const player = new Player(playerRef.current);

      player.on('loaded', () => {
        handleVideoReady();
        if (!isQuizModalOpen) {
          player.play(); // Explicitly play the video once it is loaded
        }
      });

      player.on('play', () => {
        onPlay();
      });

      player.on('pause', (data) => {
        setVideoProgress(data.percent);
        onPause(data.percent);
      });

      player.on('ended', () => {
        onEnded();
        player.exitFullscreen(); // Exit fullscreen when the video ends
      });

      player.on('timeupdate', (data) => {
        onProgress(data);
      });
    }
  }, [playerRef]);

  const handleVideoReady = () => {
    const videoElement = document.querySelector('.video-player');
    if (videoElement) {
      const videoHeight = videoElement.clientHeight;
      if (onVideoHeightChange) {
        onVideoHeightChange(videoHeight);
      }
    }
    // Dismiss the loader when the player is ready
    dispatch({ type: 'SET_LOADING', payload: { key: 'videoDetail', value: false } });
  };

  const onPlay = () => {

    // userid: cadeyUserId,
    // userFactTypeName: "StartedMedia",
    // appPage: source,
    // detail1: mediaId,
    // detail2: mediaType,

    logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'StartedMedia',
      appPage: source,
      detail1: mediaIdStr,
      detail2: currentVideoType
    });
  };

  const onPause = async (progress: number) => {

    // userid: cadeyUserId,
    // userFactTypeName: "PausedMedia",
    // appPage: source,
    // detail1: mediaId,
    // detail2: mediaProgress,
    // detail3: mediaType,

    const falseDoorResponse = await logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'PausedMedia',
      appPage: source,
      detail1: mediaIdStr,
      detail2: String(progress),
      detail3: currentVideoType
    });

    if (falseDoorResponse.falseDoorQuestionId !== 0) {
      setFalseDoorData(falseDoorResponse);
      setIsModalOpen(true);
    }

    await requestQuiz();
  };

  const onEnded = async () => {
    const response = await logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'FinishedMedia',
      appPage: source,
      detail1: mediaIdStr,
      detail2: currentVideoType
    });

    if (response.falseDoorQuestionId !== 0) {
      setFalseDoorData(response);
      setIsModalOpen(true);
    }
  };

  const onClickPreview = () => {
    // Unused currently
  }

  const requestQuiz = async () => {
    const quizResponse = await getQuiz(
      apiUrl,
      Number(cadeyUserId),
      1,                    // Client Context: Where the user is in the app (1 = VideoDetail)
      1,                    // Entity Type (1 = video)
      Number(mediaIdStr)    // Entity IDs (The ID of the video)
    );

    if (quizResponse.question !== null && quizResponse.question.id > 0) {
      // Set the quiz data
      setQuizModalData(quizResponse);

      // Open the quiz modal
      setQuizModalOpen(true);
    }
  }

  useEffect(() => {
    if (videoProgress >= 1 && !logged100) {
      setLogged100(true);
      logUserFact({
        cadeyUserId: cadeyUserId,
        baseApiUrl: apiUrl,
        userFactTypeName: 'InProgressMedia',
        appPage: source,
        detail1: mediaIdStr,
        detail2: '1.00',
        detail3: currentVideoType
      });

    } else if (videoProgress >= 0.75 && !logged75) {
      setLogged75(true);
      logUserFact({
        cadeyUserId: cadeyUserId,
        baseApiUrl: apiUrl,
        userFactTypeName: 'InProgressMedia',
        appPage: source,
        detail1: mediaIdStr,
        detail2: '0.75',
        detail3: currentVideoType
      });
    } else if (videoProgress >= 0.5 && !logged50) {
      setLogged50(true);
      logUserFact({
        cadeyUserId: cadeyUserId,
        baseApiUrl: apiUrl,
        userFactTypeName: 'InProgressMedia',
        appPage: source,
        detail1: mediaIdStr,
        detail2: '0.5',
        detail3: currentVideoType
      });
    } else if (videoProgress >= 0.25 && !logged25) {
      setLogged25(true);
      logUserFact({
        cadeyUserId: cadeyUserId,
        baseApiUrl: apiUrl,
        userFactTypeName: 'InProgressMedia',
        appPage: source,
        detail1: mediaIdStr,
        detail2: '0.25',
        detail3: currentVideoType
      });
    }
  }, [videoProgress]); // This effect will run every time videoProgress changes.  

  const onProgress = (progress: any) => {
    setVideoProgress(progress.percent);
  };

  const onError = (error: any) => {
    // Currently unused
  };

  return (
    <div className="video-item" key={videoId}>
      <div className='player-wrapper'>
        <div 
          ref={playerRef} 
          data-vimeo-url={`${vimeoUrl}`} 
          data-vimeo-width={`${screenWidth}`}
          className="video-player"
        >
        </div>

        <FalseDoorModal 
          source={source}
          falseDoorQuestionId={falseDoorData?.falseDoorQuestionId || 0}
          iconUrl={falseDoorData?.questionIcon || ''}
          copy={falseDoorData?.questionText || ''}
          yesResponse="Yes, sign me up!"
          noResponse="No thanks, not interested"
          thankYouIconUrlYes={falseDoorData?.questionResponseYesIcon || ''}
          thankYouIconUrlNo={falseDoorData?.questionResponseNoIcon || ''}
          thankYouCopyYes={falseDoorData?.questionResponseYesText || ''}
          thankYouCopyNo={falseDoorData?.questionResponseNoText || ''}
          thankYouButtonText="Close"
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
