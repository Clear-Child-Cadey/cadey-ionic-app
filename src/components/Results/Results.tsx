// Results.tsx
import React from 'react';
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
  
  return (
    <div className="container recommendations">
      <IonRow>
        <IonText className="subcopy">Here are a few suggestions, based on your concerns about {selectedConcern}</IonText>
      </IonRow>
      <IonRow>
      <div className="divider">
        <hr />
      </div>
        {results.recommendations.map((recommendation, index) => (
          <div key={index} className="recommendation">
            <h2>{recommendation.title}</h2>
            {recommendation.showMeHow.length > 0 && (
              <VideoList 
                videos={recommendation.showMeHow.map(video => ({
                  title: video.title,
                  audience: video.audience || 'No Description',
                  sourceId: video.sourceId,
                  mediaId: video.mediaId,
                  videoType: "Recommendation",
                  thumbnail: video.thumbnail || '',
                }))}
                listType='horizontal'
              />
            )}
          </div>
        ))}
      </IonRow>
    </div>
  );
};

export default Results;