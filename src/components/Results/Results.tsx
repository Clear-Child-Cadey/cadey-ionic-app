// Results.tsx
import React, { useState } from 'react';
import { 
  IonButton,
  IonText,
  IonRow,
  IonIcon
} from '@ionic/react';
import './Results.css';
import { refresh } from 'ionicons/icons';
// Components
import VideoList from '../Videos/VideoList';
// Contexts
import { useModalContext } from '../../context/ModalContext';
// modals
import VideoDetailModal from '../Modals/VideoDetailModal/VideoDetailModal';

// Define the ResultsProps interface
interface ResultsProps {
  results: {
    recommendations: {
      title: string;
      showMeHow: {
        mediaId: string;
        audience: string;
        mediaType: number;
        title: string;
        description: string | null;
        sourceUrl: string | null;
        thumbnail: string | null;
        sourceId: string;
      }[];
      tellMeHow: {
        text: string;
      }[];
    }[];
  };
  selectedConcern: string;
  onRestart: () => void;
}
// Define the Results component
// The results data originates in the AgeForm component and is passed to the main Concerns page, then here
const Results: React.FC<ResultsProps> = ({ results, selectedConcern, onRestart }) => {
  
  // Get modal context props
  const {
    isVideoModalOpen,  
    currentVimeoId,
  } = useModalContext();
  
  return (
    <div className="container recommendations">
      <IonRow>
        <IonText className="subcopy">Here are a few suggestions, based on your concerns about {selectedConcern}</IonText>
      </IonRow>
      <IonRow>
        {results.recommendations.map((recommendation, index) => (
          <div key={index} className="recommendation">
            <hr />
            <h2>{recommendation.title}</h2>
            {recommendation.showMeHow.length > 0 && (
              <>
                <h3>Show Me How</h3>
                <VideoList 
                  videos={recommendation.showMeHow.map(video => ({
                    title: video.title,
                    audience: video.audience || 'No Description',
                    videoId: video.sourceId,
                    mediaId: video.mediaId,
                    videoType: "Recommendation",
                    thumbnail: video.thumbnail || '',
                  }))}
                />
              </>
            )}
            <h3>Tell Me How</h3>
            <ul>
              {recommendation.tellMeHow.map((item, index) => (
                <li key={index}>{item.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </IonRow>
      <IonRow class="bottom-row single-button">
        <IonButton expand="block" onClick={onRestart} color="primary" aria-label="New Concern">
          <IonIcon icon={refresh} slot="start" />
          New Concern
        </IonButton>
      </IonRow>
    </div>
  );
};

export default Results;