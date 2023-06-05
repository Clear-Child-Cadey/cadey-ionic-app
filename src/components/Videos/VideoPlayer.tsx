import React from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.css';
import { IonIcon } from '@ionic/react';
import { playCircleOutline } from 'ionicons/icons';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const Player = ReactPlayer as any;

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
      />
    </div>
  );
};

export default VideoPlayer;
