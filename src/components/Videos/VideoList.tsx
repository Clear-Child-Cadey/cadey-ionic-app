import React from 'react';
import VideoPlayer from '../../components/Videos/VideoPlayer';
import './VideoList.css';
import { IonContent } from '@ionic/react';

interface VideoItem {
  videoId: string;
  title: string;
  audience: string;
}

interface VideoListProps {
  videos: VideoItem[];
  onVideoPause?: () => void;
  onVideoEnd?: () => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onVideoPause, onVideoEnd }) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <div className="video-item" key={video.videoId}>
          <VideoPlayer videoId={video.videoId} onVideoPause={onVideoPause} onVideoEnd={onVideoEnd} />
          <p>{video.audience}</p>
          <h3>{video.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default VideoList;