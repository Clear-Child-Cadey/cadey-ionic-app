import React from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonText,
  IonRow,
  IonButton,
} from '@ionic/react';

interface SymptomsListProps {
  concern: { concern: string; symptoms: string[] } | null;
  onNext: (symptoms: string[]) => void;
  onRestart: () => void;
}

const SymptomsList: React.FC<SymptomsListProps> = ({ concern, onNext, onRestart }) => {  
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    }
  };

  // If there is no concern or symptoms, display an error message
  if (!concern || !concern.symptoms) {
    return <div>Error: No concern or symptoms provided</div>;
  }

  return (
    <div className="container">
      <IonText color="primary" padding>
        <p>Select Symptoms</p>
      </IonText>
      {concern.symptoms.map((symptom, index) => (
        <IonItem key={index}>
          <IonLabel>{symptom}</IonLabel>
          <IonCheckbox
            slot="start"
            checked={selectedSymptoms.includes(symptom)}
            onIonChange={(e) =>
              handleSymptomChange(symptom, e.detail.checked)
            }
            disabled={
              selectedSymptoms.length >= 2 && !selectedSymptoms.includes(symptom)
            }
          />
        </IonItem>
      ))}
      
      <IonRow>
        <IonButton expand="block" onClick={onRestart} color="secondary">
          Start Over
        </IonButton>
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
