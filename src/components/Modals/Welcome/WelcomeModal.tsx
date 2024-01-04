import React, { useEffect } from 'react';
import { 
    IonModal, 
    IonButton, 
    IonContent, 
    IonRow,
} from '@ionic/react';
// CSS
import './WelcomeModal.css';
// Contexts
import { useModalContext } from '../../../context/ModalContext';
import { CadeyUserContext } from '../../../main';
import ApiUrlContext from '../../../context/ApiUrlContext';
// API

// Icons


const WelcomeModal: React.FC = ({ }) => {

    const { 
        isWelcomeModalOpen, 
        setWelcomeModalOpen,
        setQuizModalOpen,
    } = useModalContext();
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);

    const handleContinue = () => {

        setQuizModalOpen(true);
        setWelcomeModalOpen(false);
    }

    return (
        <IonModal isOpen={isWelcomeModalOpen} className="welcome-modal">
            <IonContent fullscreen>
                <IonRow className="welcome-content">
                    <IonRow className="logo">
                        <img src="assets/svgs/cadey.svg" />
                    </IonRow>
                    <IonRow className="welcome-text">
                        Parenting support from licensed psychologists
                    </IonRow>
                    <IonRow className="continue-row">
                        <IonButton 
                            className="continue-button" 
                            onClick={() => handleContinue()}
                        >
                            Get Started
                        </IonButton>
                    </IonRow>
                </IonRow>
                <IonRow className="welcome-image">
                    <img src="assets/images/welcome.png" />
                </IonRow>
            </IonContent>
        </IonModal>
    );
};

export default WelcomeModal;
