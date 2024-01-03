import React, { useEffect } from 'react';
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
} from '@ionic/react';
// CSS
import './WelcomeModal.css';
// Contexts
import { useModalContext } from '../../../context/ModalContext';
import { CadeyUserContext } from '../../../main';
import ApiUrlContext from '../../../context/ApiUrlContext';
// API
import { postQuizResponse } from '../../../api/Quiz';
// Icons
import { chevronForwardOutline } from 'ionicons/icons';

const WelcomeModal: React.FC = ({ }) => {

    const { 
        isWelcomeModalOpen, 
        setWelcomeModalOpen,
        setQuizModalOpen,
    } = useModalContext();
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);

    const handleContinue = () => {
        setWelcomeModalOpen(false);
        setQuizModalOpen(true);
    }

    return (
        <IonModal isOpen={isWelcomeModalOpen} className="quiz-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle style={{ textAlign: 'left', paddingLeft: 16 }}>Welcome</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRow className="welcome-content">
                    <IonRow className="welcome-image">
                        <img src="assets/images/welcome.png" />
                    </IonRow>
                    <IonRow className="welcome-text">
                        Parenting support from licensed psychologists
                    </IonRow>
                    <IonRow className="continue-row">
                        <IonButton 
                            className="continue-button" 
                            onClick={() => handleContinue()}
                        >
                            Next <IonIcon icon={chevronForwardOutline} className="forward-icon" />
                        </IonButton>
                    </IonRow>
                </IonRow>
            </IonContent>
        </IonModal>
    );
};

export default WelcomeModal;
