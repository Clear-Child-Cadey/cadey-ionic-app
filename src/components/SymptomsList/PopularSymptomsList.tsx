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
import { useHistory } from 'react-router-dom';
// Interfaces
import { Symptom } from '../ConcernsList/ConcernsList';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
import { useModalContext } from '../../context/ModalContext';

const PopularSymptomsList: React.FC = () => {  
  
    // Define the symptoms [TODO: Replace with API call]
    const symptoms: Symptom[] = [
        { id: 35, name: 'Angry' },
        { id: 36, name: 'Bullying peers' },
        { id: 37, name: 'Bites, kicks, or hits' },
        { id: 38, name: 'Yells' },
        { id: 39, name: 'Easily irritable' },
        { id: 40, name: 'Curses' },
    ];

    // Get all the props from the modal context
    const { 
        setVideoModalOpen, 
        setArticleDetailModalOpen,
        setCurrentVimeoId,
        setCurrentVideoType,
    } = useModalContext();

    // Get the loading state from the context
    const { state: loadingState, dispatch } = useLoadingState();

    const history = useHistory();
    const [selectedSymptoms, setSelectedSymptoms] = React.useState<Symptom[]>([]);

    const handleSymptomChange = (symptom: Symptom, checked: boolean) => {
        if (checked) {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        } else {
            setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptom.id));
        }
    };

    const onViewAllSymptoms = () => {
        setSelectedSymptoms([]);
        // Navigate to the Concerns page
        history.push('/App/Concerns');
    };

    const handlePopularSymptomSelection = (selectedSymptoms: Symptom[]) => {
        // TODO: Replace this with an API call to get the video ID and next video ID

        // Set the correct vimeoId for the video detail modal depending on which symptom(s) were selected
        if (selectedSymptoms.some((s) => s.id === 35)) {
            // Angry
            setCurrentVimeoId("830270250/bc3c2ff029");
        } else if (selectedSymptoms.some((s) => s.id === 36)) {
            // Bullying peers
            setCurrentVimeoId("830270250/bc3c2ff029");
        } else if (selectedSymptoms.some((s) => s.id === 37)) {
            // Bites, kicks, or hits
            setCurrentVimeoId("830270250/bc3c2ff029");
        } else if (selectedSymptoms.some((s) => s.id === 38)) {
            // Yells
            setCurrentVimeoId("830270250/bc3c2ff029");
        } else if (selectedSymptoms.some((s) => s.id === 39)) {
            // Easily irritable
            setCurrentVimeoId("830270250/bc3c2ff029");
        } else if (selectedSymptoms.some((s) => s.id === 40)) {
            // Curses
            setCurrentVimeoId("830270250/bc3c2ff029");
        }

        // Start the loader - will be dismissed in the VideoPlayer component when the video is ready
        dispatch({ type: 'SET_LOADING', payload: { key: 'videoDetail', value: true } });

        // Open the video detail modal
        setVideoModalOpen(true);
    };

  return (
    <div className="container">
      <IonRow>
        <IonText className="subcopy">What’s most troubling? Choose up to 2.</IonText>
      </IonRow>
      {symptoms.map((symptom) => (
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
        <IonButton expand="block" onClick={onViewAllSymptoms} color="secondary" aria-label="Restart">
          View All Symptoms
        </IonButton>
        <IonButton 
          expand="block" 
          onClick={() => handlePopularSymptomSelection(selectedSymptoms)}
          disabled={selectedSymptoms.length === 0}
        >
          Continue
        </IonButton>
      </IonRow>
    </div>
  );
};

export default PopularSymptomsList;
