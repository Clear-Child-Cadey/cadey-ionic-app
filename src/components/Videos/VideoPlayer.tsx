import React, { useState, useContext, useRef, useEffect } from 'react';
import Player from '@vimeo/player';
// CSS
import './VideoPlayer.css';
// Components
// API
import { logUserFact } from '../../api/UserFacts';
// Contexts
// import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useLoadingState } from '../../context/LoadingStateContext';
import { useModalContext } from '../../context/ModalContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import useRequestQuiz from '../../hooks/useRequestQuiz';
import { check } from 'prettier';

interface VideoPlayerProps {
  videoId: string;
  mediaId: string;
  source: string;
  onVideoHeightChange?: (height: number) => void;
  onVideoEnd?: () => void;
  on75PercentProgress?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  mediaId,
  source,
  onVideoHeightChange,
  onVideoEnd,
  on75PercentProgress,
}) => {
  const vimeoVideoId = videoId.split('/')[0];
  const vimeoHashParameter = videoId.split('/')[1];
  const vimeoUrl = `https://player.vimeo.com/video/${vimeoVideoId}?h=${vimeoHashParameter}&autoplay=1`;

  const mediaIdStr = String(mediaId);

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });
  const quizModalOpenRx = useSelector(
    (state: RootState) => state.video.quizModalOpen,
  );

  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  // const userFactUrl = `${apiUrl}/userfact`; not being used currently

  // const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal visibility, not being used currently

  const playerRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [logged25, setLogged25] = useState(false);
  const [logged50, setLogged50] = useState(false);
  const [logged75, setLogged75] = useState(false);
  const [callback75, setCallback75] = useState(false);
  const [logged100, setLogged100] = useState(false);

  const { dispatch } = useLoadingState();

  const screenWidth = document.documentElement.clientWidth;
  const { requestQuiz } = useRequestQuiz({
    clientContext: 1,
    entityType: 1,
    entityId: Number(mediaIdStr),
  });

  const { currentVideoType, isQuizModalOpen, isPopularSymptomVideoModalOpen } =
    useModalContext();

  const player = useRef<Player | null>(null);

  const checkQuizModalStatus = () => {
    return quizModalOpenRx;
  };

  useEffect(() => {
    if (playerRef.current && !player.current) {
      // Initialize the player only once
      player.current = new Player(playerRef.current);

      player.current.on('loaded', () => {
        handleVideoReady();

        const currentQuizModalStatus = checkQuizModalStatus();

        if (!currentQuizModalStatus) {
          player.current?.play(); // Explicitly play the video once it is loaded
        }
      });

      player.current.on('play', () => {
        onPlay();
      });

      player.current.on('pause', (data) => {
        setVideoProgress(data.percent);
        onPause(data.percent);
      });

      player.current.on('ended', () => {
        onEnded();
        player.current?.exitFullscreen(); // Exit fullscreen when the video ends
      });

      player.current.on('timeupdate', (data) => {
        onProgress(data);
      });
    }
  }, [playerRef]);

  useEffect(() => {
    // Use the existing player instance to pause/play based on isQuizModalOpen
    if (isQuizModalOpen) {
      player.current?.pause();
    } else {
      player.current?.play();
    }
  }, [isQuizModalOpen]); // Run this effect when isQuizModalOpen changes

  const handleVideoReady = () => {
    const videoElement = document.querySelector('.video-player');
    if (videoElement) {
      const videoHeight = videoElement.clientHeight;
      if (onVideoHeightChange) {
        onVideoHeightChange(videoHeight);
      }
    }
    // Dismiss the loader when the player is ready
    dispatch({
      type: 'SET_LOADING',
      payload: { key: 'videoDetail', value: false },
    });
  };

  const onPlay = () => {
    logUserFact({
      cadeyUserId: cadeyUserId || 0,
      userFactTypeName: 'StartedMedia',
      appPage: source,
      detail1: mediaIdStr,
      detail2: currentVideoType,
    });
  };

  const onPause = async (progress: number) => {
    // If the popularSymptomVideoModal is open, end early
    if (isPopularSymptomVideoModalOpen) {
      return;
    }
    // Commenting out for now - videos are not being paused for quizzes. Need to fix that bug and then uncomment this code.
    // requestQuiz();
  };

  const onEnded = async () => {
    await logUserFact({
      cadeyUserId: cadeyUserId || 0,
      userFactTypeName: 'FinishedMedia',
      appPage: source,
      detail1: mediaIdStr,
      detail2: currentVideoType,
    });

    // Invoke the callback if it exists
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  // const onClickPreview = () => {
  //   // Unused currently
  // };

  useEffect(() => {
    if (on75PercentProgress && videoProgress >= 0.75 && callback75 === false) {
      on75PercentProgress();
      setCallback75(true);
    }

    // Report video progress
    if (videoProgress >= 1 && !logged100) {
      setLogged100(true);
      logUserFact({
        cadeyUserId: cadeyUserId || 0,
        userFactTypeName: 'InProgressMedia',
        appPage: source,
        detail1: mediaIdStr,
        detail2: '1.00',
        detail3: currentVideoType,
      });
    } else if (videoProgress >= 0.75 && !logged75) {
      setLogged75(true);
      logUserFact({
        cadeyUserId: cadeyUserId || 0,
        userFactTypeName: 'InProgressMedia',
        appPage: source,
        detail1: mediaIdStr,
        detail2: '0.75',
        detail3: currentVideoType,
      });
    } else if (videoProgress >= 0.5 && !logged50) {
      setLogged50(true);
      logUserFact({
        cadeyUserId: cadeyUserId || 0,
        userFactTypeName: 'InProgressMedia',
        appPage: source,
        detail1: mediaIdStr,
        detail2: '0.5',
        detail3: currentVideoType,
      });
    } else if (videoProgress >= 0.25 && !logged25) {
      setLogged25(true);
      logUserFact({
        cadeyUserId: cadeyUserId || 0,
        userFactTypeName: 'InProgressMedia',
        appPage: source,
        detail1: mediaIdStr,
        detail2: '0.25',
        detail3: currentVideoType,
      });
    }
  }, [videoProgress]); // This effect will run every time videoProgress changes.

  const onProgress = (progress: any) => {
    setVideoProgress(progress.percent);
  };

  // const onError = (error: any) => {
  //   // Currently unused
  // };

  return (
    <div className='video-item' key={videoId}>
      <div className='player-wrapper'>
        <div
          ref={playerRef}
          data-vimeo-url={`${vimeoUrl}`}
          data-vimeo-width={`${screenWidth}`}
          className='video-player'
        ></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
