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
import { HomeTabVisibilityContext } from '../../../context/TabContext';
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
    const { setIsHomeTabVisible } = React.useContext(HomeTabVisibilityContext);

    const handleContinue = () => {
        // Show the tab bar
        setIsHomeTabVisible(true);

        setQuizModalOpen(true);
        setWelcomeModalOpen(false);
    }

    return (
        <IonModal isOpen={isWelcomeModalOpen} className="welcome-modal">
            {/* <IonHeader>
                <IonToolbar>
                    <IonTitle style={{ textAlign: 'left', paddingLeft: 16 }}>Welcome</IonTitle>
                </IonToolbar>
            </IonHeader> */}
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
                    <IonRow className="welcome-image">
                        <img src="assets/images/welcome.png" />
                    </IonRow>
                </IonRow>
            </IonContent>
        </IonModal>
    );
};

export default WelcomeModal;
