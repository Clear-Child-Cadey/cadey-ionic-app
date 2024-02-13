import React, { useEffect } from 'react';
import { 
    IonButton, 
    IonContent, 
    IonRow,
    IonPage,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
// CSS
import './Welcome.css';
// Contexts
import { useModalContext } from '../../context/ModalContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { logUserFact } from '../../api/UserFacts';
// Icons


const WelcomePage: React.FC = ({ }) => {

    const { 
        setQuizModalOpen,
    } = useModalContext();
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);
    const { setCurrentAppPage, setCurrentBasePage } = useAppPage();

    const history = useHistory();

    // When the component loads
    useEffect(() => {

        setCurrentAppPage("Welcome - Intro Screen");
        setCurrentBasePage("Welcome - Intro Screen");

        // appPageNavigation user fact
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Welcome - Intro Screen',
        });
    }, [apiUrl]);

    const handleContinue = () => {
        history.push('/App/Welcome/Path');
    }

    return (
        <IonPage className="welcome">
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
        </IonPage>
    );
};

export default WelcomePage;
