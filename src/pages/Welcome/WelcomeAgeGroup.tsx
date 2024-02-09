import { 
    IonModal, 
    IonButton, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonRow,
    IonText,
    IonIcon,
    IonPage,
} from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
// CSS
import './WelcomeAgeGroup.css';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// API
import { postCadeyUserAgeGroup } from '../../api/AgeGroup';
// Icons
import { chevronForwardOutline } from 'ionicons/icons';

const WelcomeAgeGroupSelect: React.FC = () => {
    const { setCadeyUserAgeGroup } = React.useContext(CadeyUserContext);
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);

    const [selectedAgeGroup, setSelectedAgeGroup] = React.useState<number>(0);

    const history = useHistory();

    const handleAgeSelection = async (ageGroup: number) => {
        // Set the age group in the user context
        setCadeyUserAgeGroup(ageGroup);

        try {
            // Record an age group for the user
            await postCadeyUserAgeGroup(apiUrl, cadeyUserId, ageGroup.toString());
        } catch (error) {
            console.error('Exception when calling postCadeyUserAgeGroup: ', error);
        }
        
        // Route the user to the next page
        history.push('/App/Welcome/Push');
    }

    return (
        <IonPage className="welcome-age-group" >
            <IonContent fullscreen>
                <IonHeader class="header">
                    <IonToolbar className="header-toolbar">
                        <h2>How old is your child?</h2>
                    </IonToolbar>
                </IonHeader>
                <IonRow className="age-group-container">
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
                            Next
                        </IonButton>
                    </IonRow>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default WelcomeAgeGroupSelect;