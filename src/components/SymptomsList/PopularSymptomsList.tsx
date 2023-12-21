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
            setPopularSymptomId(6);
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
            setPopularSymptomId(35);
            playlistVideoIds = [
                "830290291/b29396446b",
                "830289952/54d2700589",
                "830289633/712b888607",
                "830290607/4f5e4a7271",
                "830270250/bc3c2ff029",
                "870785230/5e1eec15f6",
                "830307169/b37a38bc9e",
                "836198015/bd762145bb",
                "838000810/218c7c8d07",
                "840652265/97ea4ba5a0",
                "869250000/3a1731814e",
                "867263757/4f733f37b4",
                "858697691/fa749cfafb",
                "830306966/2eb7e32dbf",
                "859013453/64fab0e72e",
            ];

        } else if (selectedSymptoms.some((s) => s.id === 62)) {
            // Having outbursts
            setPopularSymptomId(62);
            playlistVideoIds = [
                "869249831/a3e00c5445",
                "836629959/6d7d716355",
                "851688703/0cf6b8e9ef",
                "851687328/e1ea022902",
                "880262783/2968fa9a59",
                "855041614/406a6ea534",
                "830290607/4f5e4a7271",
                "871066009/9e432c5508",
                "835517633/6a6031f98d",
                "833404447/3fec9b07f4",
                "880567661/c47c46a762",
                "830306830/ea9976440c",
                "879497563/eb356bb497",
                "882237697/03c63a650d",
                "842960023/da9b9ccbb7",
                "836233537/f122ad9444",
            ];

        } else if (selectedSymptoms.some((s) => s.id === 64)) {
            // Throwing temper tantrums
            setPopularSymptomId(64);
            playlistVideoIds = [
                "835529695/43aec125c6",
                "835519075/941972b4bd",
                "871069391/9cee5e91ac",
                "869249831/a3e00c5445",
                "836629959/6d7d716355",
                "851688703/0cf6b8e9ef",
                "880262783/2968fa9a59",
                "832356701/9165cff4bd",
                "863640207/ebc427a839",
                "870785230/5e1eec15f6",
                "832362367/7eb49b66e5",
                "830270250/bc3c2ff029",
                "830270037/ce58f6c51e",
                "833404222/584cf8dc47",
                "833404677/53d2f677c1",
                "833404447/3fec9b07f4",
            ];
            
        } else if (selectedSymptoms.some((s) => s.id === 63)) {
            // Having mood swings
            setPopularSymptomId(63);
            playlistVideoIds = [
                "877192113/f4399e379d",
                "853409480/81407ca2e1",
                "830290774/98374faf86",
                "855073772/36f428a38d",
                "838728008/3954b52ba9",
                "830307486/362ea9c8ff",
                "836586204/ee176ed0da",
                "833400388/3ec6352552",
                "836215432/6e8e101aad",
                "863640207/ebc427a839",
                "855822095/6cd93f88ff",
                "855821859/836c665a54",
                "855821487/75903e7eb8",
            ];
            
        } else if (selectedSymptoms.some((s) => s.id === 67)) {
            // Not following directions
            setPopularSymptomId(67);
            playlistVideoIds = [
                "830290291/b29396446b",
                "855048900/c5036cbce8",
                "871066009/9e432c5508",
                "867264345/c537d8ffdc",
                "867263823/7fe44c6de1",
                "842960680/53fb4098a9",
                "836587577/0e5ac6e670",
                "870786518/acfd74e322",
                "871066109/ff26940c08",
                "879855013/b1d35146ec",
                "870747322/6d8c25a17b",
                "830269476/e48f40d722",
                "830288735/a5af6c8ea7",
                "876030295/3548445b80",
                "830258872/e2eb553e73",
                "837999787/a3cb413dc0",
                "840171053/3621e13a09",
                "842957946/f8811770ff",
                "842958289/e5038aa729",
            ];
            
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
