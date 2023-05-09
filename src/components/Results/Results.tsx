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
  results: any; // Get the results from the main Concerns component
  onRestart: () => void;
}

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
