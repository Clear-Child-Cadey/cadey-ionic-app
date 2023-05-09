// Results.tsx
import React from 'react';
import { 
  IonContent,
  IonItem, 
  IonLabel, 
  IonButton
} from '@ionic/react';
import './Results.css';

interface ResultsProps {
  // Type the Results object properly
  results: {
    action_content: {
      title: string;
      body: {
        [key: string]: string[];
      };
    };
  };
  onRestart: () => void;
}

// Define the Results component
// The results data originates in the AgeForm component and is passed to the main Concerns component, then here
const Results: React.FC<ResultsProps> = ({ results, onRestart }) => {
  return (
    <div>
      <IonItem>
        <IonLabel>
          <h2>{results.action_content.title}</h2>
        </IonLabel>
        <ol>
          {Object.entries(results.action_content.body).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>
              <ul>
                {value.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </IonItem>
      <IonButton expand="block" onClick={onRestart} color="secondary">
        Start Over
      </IonButton>
    </div>
  );
};

export default Results;
