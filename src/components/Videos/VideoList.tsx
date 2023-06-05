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
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <div className="video-item" key={video.videoId}>
          <VideoPlayer videoId={video.videoId} />
          <p>{video.audience}</p>
          <h3>{video.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default VideoList;