import React, { useContext, useEffect } from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonText,
  IonRow,
  IonButton,
  IonLoading,
} from '@ionic/react';
import { play, refresh } from 'ionicons/icons';
import './SymptomsList.css';
import { useHistory } from 'react-router-dom';
// Interfaces
import { Symptom } from '../ConcernsList/ConcernsList';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
import { useModalContext } from '../../context/ModalContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// API
import { getPopularSeries, getPopularSeriesSymptoms } from '../../api/Playlists';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export interface PopularSymptomSeries {
    symptomId: number;
    symptomName: string;
    items: PopularSymptomVideo[];
}

// Define an interface for the popular symptom playlist. This should be an array with the following information per item: Title, VimeoID, Thumbnail
export interface PopularSymptomVideo {
    entityId: number;
    entityType: number;
    entityTitle: string;
    vimeoSourceId: string;
    vimeoThumbnail: string;
}

const PopularSymptomsList: React.FC = () => {  

    // Get the Cadey User data from the context
    const { cadeyUserAgeGroup } = useContext(CadeyUserContext);
    const cadeyUserId = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  );

    const userAgeGroup =
    cadeyUserAgeGroup > 0
        ? cadeyUserAgeGroup
        : useSelector(
            (state: RootState) =>
            state?.authStatus?.userData?.cadeyUser?.ageGroup,
        );
    const { apiUrl } = useContext(ApiUrlContext);

    // Create an empty set of PopularSeriesSymptoms to populate
    const [popularSeriesSymptoms, setPopularSeriesSymptoms] = React.useState<Symptom[]>([]);

    // When the component loads
    useEffect(() => {
        const getSymptoms = async () => {
            setPopularSeriesSymptoms(await getPopularSeriesSymptoms(apiUrl, cadeyUserId));
        };

        // Get popular symptoms from the API  
        getSymptoms();
    }, [apiUrl]);

    // Get all the props from the modal context
    const { 
        isAgeGroupModalOpen,
        setAgeGroupModalOpen,
        setPopularSymptomId,
        isPopularSymptomVideoModalOpen,
        setIsPopularSymptomVideoModalOpen, 
        popularSymptomVideo,
        setPopularSymptomVideo,
        popularSymptomPlaylist,
        setPopularSymptomPlaylist,
    } = useModalContext();

    // Get the loading state from the context
    const { state: loadingState, dispatch } = useLoadingState();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

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

    // If the popularSymptomPlaylist changes, set the popular symptom video to the first item in the playlist
    useEffect(() => {
        if (popularSymptomPlaylist.length > 0) {
            setPopularSymptomVideo(popularSymptomPlaylist[0]);
        }
        
    }, [popularSymptomPlaylist]);

    const handlePopularSymptomSelection = async (selectedSymptoms: Symptom[]) => {

        setPopularSymptomId(selectedSymptoms[0].id);

        // Check if the user has an age group
        if (userAgeGroup === 0) {
            // Open the age group modal
            setAgeGroupModalOpen(true);
            // Return early - the callback on age group seletion will call this function again
            return;
        }

        getPopularVideoData();
    };

    const getPopularVideoData = async () => {        
        
        // Get the popular symptom playlist from the API
        const popularSeries = await getPopularSeries(apiUrl, cadeyUserId, selectedSymptoms[0].id);

        // Set the popular symptom playlist to the videos returned from the API
        setPopularSymptomPlaylist(popularSeries.items);

        // Open the video detail modal
        setIsPopularSymptomVideoModalOpen(true);

        // Clear symptom selections so the user can select a new symptom when they return
        setSelectedSymptoms([]);
    }

    const onAgeGroupSelected = async (selectedAgeGroup: number) => {
        getPopularVideoData();
    }

  return (
    <div className="symptoms-container">

        {/* Show a loading state if necessary */}
        {isLoading && (
          <IonLoading isOpen={true} message={'Loading data...'} />
        )}

        <IonRow>
            <IonText className="subcopy">Is your child...</IonText>
        </IonRow>
        {popularSeriesSymptoms.map((symptom) => (
            <IonItem className="symptom-item" lines="none" key={symptom.id}>
            <IonLabel className="symptom-label">{symptom.name}</IonLabel>
            <IonCheckbox
                mode="ios"
                className="symptom-checkbox"
                slot="start"
                checked={selectedSymptoms.some((s) => s.id === symptom.id)}
                onIonChange={(e) => handleSymptomChange(symptom, e.detail.checked)}
                disabled={selectedSymptoms.length >= 1 && !selectedSymptoms.some((s) => s.id === symptom.id)}
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