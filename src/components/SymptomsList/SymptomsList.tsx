import React from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonText,
  IonRow,
  IonButton,
  IonIcon
} from '@ionic/react';
import { refresh } from 'ionicons/icons';
import './SymptomsList.css';
import { Symptom } from '../ConcernsList/ConcernsList';

interface SymptomsListProps {
  concern: { concern: string; symptoms: Symptom[] } | null;
  onNext: (symptoms: Symptom[]) => void;
  onRestart: () => void;
}

const SymptomsList: React.FC<SymptomsListProps> = ({ concern, onNext, onRestart }) => {  
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<Symptom[]>([]);

  const handleSymptomChange = (symptom: Symptom) => {
    if (selectedSymptoms.some(s => s.id === symptom.id)) {
      // If the symptom is already selected, remove it from the list
      setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptom.id));
    } else if (selectedSymptoms.length < 2) {
      // Add the symptom to the list if less than 2 symptoms are selected
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    } else {
      // If there are already 2 symptoms selected, do nothing
    }
  };

  // If there is no concern or symptoms, display an error message
  if (!concern || !concern.symptoms) {
    return <div>Error: No concern or symptoms provided</div>;
  }

  return (
    <div className="symptoms-container">
      <IonRow>
        <IonText className="subcopy">What’s most troubling? Choose up to 2.</IonText>
      </IonRow>
      <IonRow className='symptom-items'>
        {concern.symptoms.map((symptom) => (
          <div 
            className={`symptom-item ${selectedSymptoms.some(s => s.id === symptom.id) ? 'selected' : ''}`}
            key={symptom.id} 
            onClick={() => handleSymptomChange(symptom)}
          >
            <h2>{symptom.name}</h2>
          </div>
        ))}
      </IonRow>  
      <IonRow className="bottom-row">
        <IonButton 
          expand="block" 
          onClick={() => onNext(selectedSymptoms)}
          disabled={selectedSymptoms.length === 0}
        >
          Next
        </IonButton>
      </IonRow>
    </div>
  );
};

export default SymptomsList;
