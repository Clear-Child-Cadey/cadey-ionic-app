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

// Define the ResultsProps interface
interface ResultsProps {
  results: {
    recommendations: {
      title: string;
      showMeHow: any[]; // adjust this type when video content becomes available
      tellMeHow: {
        text: string;
      }[];
    }[];
  };
  selectedConcern: string;
  onRestart: () => void;
}

// Define the Results component
// The results data originates in the AgeForm component and is passed to the main Concerns component, then here
const Results: React.FC<ResultsProps> = ({ results, selectedConcern, onRestart }) => {
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
      <IonButton expand="block" onClick={onRestart} color="primary" aria-label="Restart">
          <IonIcon icon={refresh} slot="start" />
          Restart
        </IonButton>
      </IonRow>
    </div>
  );
};


export default Results;
