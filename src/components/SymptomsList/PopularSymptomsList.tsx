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
import { CadeyUserContext } from '../../main';
// Modals
import AgeGroupModal from '../../components/Modals/AgeGroupModal/AgeGroupModal';

// Define an interface for the popular symptom playlist. This should be an array with the following information per item: Title, VimeoID, Thumbnail
export interface PopularSymptomVideo {
    title: string;
    vimeoId: string;
    mediaId: string;
    thumbnail: string;
}

const PopularSymptomsList: React.FC = () => {  

    // Get the Cadey User data from the context
    const { cadeyUserId, cadeyUserAgeGroup } = React.useContext(CadeyUserContext);
  
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
        isAgeGroupModalOpen,
        setAgeGroupModalOpen,
        setIsPopularSymptomVideoModalOpen, 
        popularSymptomVideo,
        setPopularSymptomVideo,
        popularSymptomPlaylist,
        setPopularSymptomPlaylist,
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

    // If the popularSymptomPlaylist changes, set the popular symptom video ID
    React.useEffect(() => {
        if (popularSymptomPlaylist.length > 0) {
            setPopularSymptomVideo(popularSymptomPlaylist[0]);
        }
        console.log('popularSymptomPlaylist changed: ', popularSymptomPlaylist);
    }, [popularSymptomPlaylist]);

    // Log the value of popularSymptomVimeoId
    React.useEffect(() => {
        console.log('Popular Symptom Video: ', popularSymptomVideo);
    }, [popularSymptomVideo]);

    const handlePopularSymptomSelection = (selectedSymptoms: Symptom[]) => {

        // TODO: Replace this with an API call to get the video ID and next video ID

        // Set the correct vimeoId for the video detail modal depending on which symptom(s) were selected
        if (selectedSymptoms.some((s) => s.id === 35)) {
            // Angry
            setPopularSymptomPlaylist([
                {
                    title: "Angry 1",
                    vimeoId: "832356701/9165cff4bd",
                    mediaId: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1687817867-b1ced55d03e223fb711833bccc5b40a26fc87f0025168823f7bc7d4c8e945a47-d_1920x1080?r=pad",
                },
                {
                    title: "Angry 2",
                    vimeoId: "838726442/a3002cd2db",
                    mediaId: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1687817867-b1ced55d03e223fb711833bccc5b40a26fc87f0025168823f7bc7d4c8e945a47-d_1920x1080?r=pad",
                },
                {
                    title: "Angry 3",
                    vimeoId: "838726442/a3002cd2db",
                    mediaId: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1687817867-b1ced55d03e223fb711833bccc5b40a26fc87f0025168823f7bc7d4c8e945a47-d_1920x1080?r=pad",
                },
            ]);
        } else if (selectedSymptoms.some((s) => s.id === 36)) {
            // Bullying peers
            
        } else if (selectedSymptoms.some((s) => s.id === 37)) {
            // Bites, kicks, or hits
            
        } else if (selectedSymptoms.some((s) => s.id === 38)) {
            // Yells
            
        } else if (selectedSymptoms.some((s) => s.id === 39)) {
            // Easily irritable
            
        } else if (selectedSymptoms.some((s) => s.id === 40)) {
            // Curses
            
        }

        // Check if the user has an age group
        if (cadeyUserAgeGroup === 0) {
            // Open the age group modal
            setAgeGroupModalOpen(true);
            // Return early
            return;
        }

        // Start the loader - will be dismissed in the VideoPlayer component when the video is ready
        dispatch({ type: 'SET_LOADING', payload: { key: 'videoDetail', value: true } });

        // Open the video detail modal
        setIsPopularSymptomVideoModalOpen(true);
    };

    const onAgeGroupSelected = async (selectedAgeGroup: number) => {
        // Start the loader - will be dismissed in the VideoPlayer component when the video is ready
        dispatch({ type: 'SET_LOADING', payload: { key: 'videoDetail', value: true } });

        // Open the video detail modal
        setIsPopularSymptomVideoModalOpen(true);
    }

  return (
    <div className="container">
        {/* Show an age group modal if context dictates */}
        <AgeGroupModal isOpen={isAgeGroupModalOpen} onAgeGroupSelected={onAgeGroupSelected} />
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
