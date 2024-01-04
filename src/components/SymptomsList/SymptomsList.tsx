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

  const handleSymptomChange = (symptom: Symptom, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptom.id));
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
      {concern.symptoms.map((symptom) => (
        <IonItem className="symptom-item" lines="none" key={symptom.id}>
          <IonLabel className="symptom-label">{symptom.name}</IonLabel>
          <IonCheckbox
            mode="ios"
            className="symptom-checkbox"
            slot="start"
            checked={selectedSymptoms.some((s) => s.id === symptom.id)}
            onIonChange={(e) => handleSymptomChange(symptom, e.detail.checked)}
            disabled={selectedSymptoms.length >= 2 && !selectedSymptoms.some((s) => s.id === symptom.id)}
          />
        </IonItem>
      ))}
      
      <IonRow className="bottom-row">
        <IonButton expand="block" onClick={onRestart} color="secondary" aria-label="Restart">
          <IonIcon icon={refresh} slot="start" />
          Restart
        </IonButton>
        <IonButton 
          expand="block" 
          onClick={() => onNext(selectedSymptoms)}
          disabled={selectedSymptoms.length === 0}
        >
          Continue
        </IonButton>
      </IonRow>
    </div>
  );
};

export default SymptomsList;
