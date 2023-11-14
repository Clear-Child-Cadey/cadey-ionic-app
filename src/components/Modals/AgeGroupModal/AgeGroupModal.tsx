import { 
    IonModal, 
    IonButton, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonRow,
    IonText,
} from '@ionic/react';
import React from 'react';
// CSS
import './AgeGroupModal.css';
// Contexts
import { useModalContext } from '../../../context/ModalContext';
import { CadeyUserContext } from '../../../main';
import ApiUrlContext from '../../../context/ApiUrlContext';
// API
import { postCadeyUserAgeGroup } from '../../../api/AgeGroup';

interface AgeGroupModalProps {
    isOpen: boolean;
    onAgeGroupSelected: (ageGroup: number) => void;
}

const AgeGroupModal: React.FC<AgeGroupModalProps> = ({ isOpen, onAgeGroupSelected }) => {
    const { isAgeGroupModalOpen, setAgeGroupModalOpen } = useModalContext();
    const { setCadeyUserAgeGroup } = React.useContext(CadeyUserContext);
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);

    const [selectedAgeGroup, setSelectedAgeGroup] = React.useState<number>(0);

    function handleAgeSelection(ageGroup: number) {
        // Set the age group in the user context
        setCadeyUserAgeGroup(ageGroup);

        try {
            // Record a popular symptom age group for the user
            postCadeyUserAgeGroup(apiUrl, cadeyUserId, ageGroup.toString());
        } catch (error) {
            console.error('Exception when calling postCadeyUserAgeGroup: ', error);
        }

        // Call the callback function with the selected age group
        onAgeGroupSelected(ageGroup);
        
        // Close the modal
        handleClose();
    }

    function handleClose() {
        // Close the modal
        setAgeGroupModalOpen(false);
    }

    return (
        <IonModal isOpen={isAgeGroupModalOpen} className="age-group-modal" onDidDismiss={handleClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle style={{ textAlign: 'left', paddingLeft: 16 }}>Age</IonTitle>
                    <IonButton className="close-button" slot="end" onClick={() => handleClose()}>
                        Close
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRow className="age-group-container">
                    <IonText className="child-age-text">Please select your child's age for personalized goals: </IonText>
                    <IonRow className="age-buttons-row">
                        <IonButton 
                            className={`age-group-button ${selectedAgeGroup === 1 ? "selected" : ""}`}
                            onClick={() => setSelectedAgeGroup(1)}
                        >
                            0-4
                        </IonButton>
                        <IonButton 
                            className={`age-group-button ${selectedAgeGroup === 2 ? "selected" : ""}`}
                            onClick={() => setSelectedAgeGroup(2)}
                        >
                            5-11
                        </IonButton>
                        <IonButton 
                            className={`age-group-button ${selectedAgeGroup === 3 ? "selected" : ""}`}
                            onClick={() => setSelectedAgeGroup(3)}
                        >
                            12+
                        </IonButton>
                    </IonRow>
                    <IonRow className="continue-row">
                        <IonButton 
                            className="continue-button" 
                            disabled={selectedAgeGroup === 0}
                            onClick={() => handleAgeSelection(selectedAgeGroup)}
                        >
                            Continue
                        </IonButton>
                    </IonRow>
                </IonRow>
            </IonContent>
        </IonModal>
    );
};

export default AgeGroupModal;
