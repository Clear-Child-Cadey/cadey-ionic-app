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
import { refresh } from 'ionicons/icons';
import './SymptomsList.css';
import { useHistory } from 'react-router-dom';
// Interfaces
import { Symptom } from '../ConcernsList/ConcernsList';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
import { useModalContext } from '../../context/ModalContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// Modals
import AgeGroupModal from '../../components/Modals/AgeGroupModal/AgeGroupModal';
// API
import { getVideoDetailData } from '../../api/VideoDetail';

// Define an interface for the popular symptom playlist. This should be an array with the following information per item: Title, VimeoID, Thumbnail
export interface PopularSymptomVideo {
    title: string;
    vimeoId: string;
    mediaId: string;
    thumbnail: string;
}

const PopularSymptomsList: React.FC = () => {  

    // Get the Cadey User data from the context
    const { cadeyUserId, cadeyUserAgeGroup } = useContext(CadeyUserContext);
    const { apiUrl } = useContext(ApiUrlContext);
  
    // Define the symptoms [TODO: Replace with API call]
    const symptoms: Symptom[] = [
        { id: 6, name: 'Easily upset' },
        { id: 35, name: 'Often angry' },
        { id: 62, name: 'Having outbursts' },
        { id: 64, name: 'Throwing temper tantrums' },
        { id: 63, name: 'Having mood swings' },
        { id: 67, name: 'Not following directions' },
    ];

    // Get all the props from the modal context
    const { 
        isAgeGroupModalOpen,
        setAgeGroupModalOpen,
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

        // Check if the user has an age group
        if (cadeyUserAgeGroup === 0) {
            // Open the age group modal
            setAgeGroupModalOpen(true);
            // Return early - the callback on age group seletion will call this function again
            return;
        }

        getPopularVideoData();
    };

    const getPopularVideoData = async () => {
        // Start the loader - will be dismissed in the VideoPlayer component when the video is ready
        setIsLoading(true);
        
        // TODO: Replace this with an API call to get the video ID and next video ID
        
        var playlistVideoIds: string[] = [];

        if (selectedSymptoms.some((s) => s.id === 6)) {
            // Easily upset
            playlistVideoIds = [
                "832356701/9165cff4bd", //46
                "869249831/a3e00c5445", //227
                "836629959/6d7d716355", //96
                "836198406/611defad41", //118
                "888828525/eb2d524e1a", //263
                "871066009/9e432c5508", //202
                "851688703/0cf6b8e9ef", //167
                "851687328/e1ea022902", //169
                "842960023/da9b9ccbb7", //148
                "833401150/c5fb685731", //39
                "835501783/cc646b1c66", //75
                "833404677/53d2f677c1", //53
                "879855013/b1d35146ec", //251
            ];
        } else if (selectedSymptoms.some((s) => s.id === 35)) {
            // Often angry

        } else if (selectedSymptoms.some((s) => s.id === 62)) {
            // Having outbursts

        } else if (selectedSymptoms.some((s) => s.id === 64)) {
            // Throwing temper tantrums
            
        } else if (selectedSymptoms.some((s) => s.id === 63)) {
            // Having mood swings
            
        } else if (selectedSymptoms.some((s) => s.id === 67)) {
            // Not following directions
            
        }

        await addVideosToPlaylist(playlistVideoIds);

        setIsLoading(false);

        // Open the video detail modal
        setIsPopularSymptomVideoModalOpen(true);
    }

    const addVideosToPlaylist = async (videoIds: string[]) => {
        const tempVideos = [];
    
        for (const videoId of videoIds) {
            try {
                // Get video data
                const response = await getVideoDetailData(apiUrl, videoId);
                const videoData = {
                    title: response.title,
                    vimeoId: response.sourceId,
                    mediaId: response.mediaId,
                    thumbnail: response.thumbnail,
                };
                tempVideos.push(videoData);
    
                // Wait for 100ms before continuing to the next iteration
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error('Error fetching video data:', error);
                // Optionally handle errors, e.g., by continuing to the next videoId
            }
        }
    
        // Set the popular symptom playlist
        setPopularSymptomPlaylist(tempVideos);
    };

    const onAgeGroupSelected = async (selectedAgeGroup: number) => {
        getPopularVideoData();
    }

    // Log selected symptoms anytime they change
    useEffect(() => {
        console.log('Selected symptoms:', selectedSymptoms);
    }, [selectedSymptoms]);
    

  return (
    <div className="container">

        {/* Show a loading state if necessary */}
        {isLoading && (
          <IonLoading isOpen={true} message={'Loading data...'} />
        )}

        {/* Show an age group modal if context dictates */}
        <AgeGroupModal isOpen={isAgeGroupModalOpen} onAgeGroupSelected={onAgeGroupSelected} />
        <IonRow>
            <IonText className="subcopy">Is your child...</IonText>
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
