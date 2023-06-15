import React from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.css';
import { IonIcon } from '@ionic/react';
import { playCircleOutline } from 'ionicons/icons';

interface VideoPlayerProps {
  videoId: string;
  onVideoPause?: () => void;
  onVideoEnd?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onVideoPause, onVideoEnd }) => {
  const Player = ReactPlayer as any;

  const onPlay = () => {
    console.log(`Video ${videoId} started playing`);
    // Add your logic here
  };

  const onPause = () => {
    console.log(`Video ${videoId} paused`);
    if (onVideoPause) onVideoPause();
  };

  const onEnded = () => {
    console.log(`Video ${videoId} ended`);
    if (onVideoEnd) onVideoEnd();
  };

  const onClickPreview = () => {
    console.log(`Video ${videoId} thumbnail clicked`);
    // Add your logic here
  }

  const onProgress = (progress: any) => {
    console.log(`Video ${videoId} progress: ${progress.played}`);
    // Add your logic here
  };

  const onError = (error: any) => {
    console.log(`Video ${videoId} error: ${error}`);
    // Add your logic here
  };

  return (
    <div className='player-wrapper'>
      <Player
        className='react-player'
        url={`https://vimeo.com/${videoId}`}
        controls={true}
        light={true}
        playIcon={<IonIcon icon={playCircleOutline} className="playIcon" />}
        playing={true}
        width='100%'
        height='100%'
        progressInterval={10000}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onClickPreview={onClickPreview}
        onError={onError}
        onProgress={onProgress}
      />
    </div>
  );
};

export default VideoPlayer;
