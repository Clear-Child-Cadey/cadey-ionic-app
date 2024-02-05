import React, { useState, useContext, useEffect } from 'react';
import { 
    IonContent, 
    IonHeader, 
    IonPage,
} from '@ionic/react';
// Icons

// CSS
import './Library.css';
// Components
import ConcernsList from '../../components/ConcernsList/ConcernsList';
import SymptomsList from '../../components/SymptomsList/SymptomsList';
import { Symptom } from '../../components/ConcernsList/ConcernsList';
import Results from '../../components/Results/Results';
// Contexts
import { HomeTabVisibilityContext } from '../../context/TabContext';
import UnreadContext from '../../context/UnreadContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { getNewGoalsIndicator } from '../../api/Goals';
import { logUserFact } from '../../api/UserFacts';
import { getRecommendations } from '../../api/GetRecommendations';
// Modals
import { useModalContext } from '../../context/ModalContext';
// Routing
import { useHistory } from 'react-router-dom';

// Define the Concerns component
const VideoLibraryPage: React.FC = () => {

    // State variable flags to indicate which component to display
    const [showAgeForm, setShowAgeForm] = useState(false);
    const [showSymptomsList, setShowSymptomsList] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // State variables for storing data
    const [selectedConcern, setSelectedConcern] = useState<{ concern: string; symptoms: Symptom[] } | null>(null);
    const [symptoms, setSymptoms] = useState<Array<Symptom>>([]);
    const [pageTitle, setPageTitle] = useState("Videos");
    const [results, setResults] = useState<any | null>(null);

    // Context variables
    const { setIsHomeTabVisible: setHomeTabVisibility } = useContext(HomeTabVisibilityContext);
    const { unreadGoals, setUnreadGoals } = useContext(UnreadContext);
    const { cadeyUserId, cadeyUserAgeGroup } = useContext(CadeyUserContext);
    const { apiUrl } = useContext(ApiUrlContext);
    const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

    // Other variables
    const history = useHistory();
  
    // Set the title when the component mounts
    useEffect(() => {
        document.title = "Concerns";
        setCurrentBasePage('Concerns');
        setCurrentAppPage('Concerns');
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Concerns',
        });
    }, []);

    // Handler for when the user proceeds from the ConcernsList
    const handleConcernsNext = (choice: { concern: string; symptoms: Symptom[] }) => {
            setPageTitle("Symptoms");
            document.title = "Symptoms";
            setCurrentBasePage('Symptoms');
            setCurrentAppPage('Symptoms');
            logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Symptoms',
        });
        
        setSelectedConcern(choice);
        setShowSymptomsList(true);
    };

    // Handler for when the user proceeds from the SymptomsList
    const handleSymptomsNext = (symptoms: Symptom[]) => {
        
        // Store the symptoms in state
        setSymptoms(symptoms);
        
        // Get recommendations for the user
        getUserRecommendations(cadeyUserAgeGroup, symptoms);
    };

    // getUserRecommendations function
    const getUserRecommendations = async (ageGroup: number, symptoms: Symptom[]) => {
        try {
        console.log("Cadey User Age Group in getUserRecommendations: ", ageGroup);

        const data = await getRecommendations(apiUrl, cadeyUserId, ageGroup, symptoms);

        handleResultsReceived(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Handler for when the results are received from the API
    const handleResultsReceived = (response: any) => {
        setResults(response);
        setShowSymptomsList(false);
        setShowResults(true);
        setHomeTabVisibility(true); // Show the Home tab when results are received

        setPageTitle("Recommendations");
        document.title = "Recommendations";
        setCurrentBasePage('Recommendations');
        setCurrentAppPage('Recommendations');
        logUserFact({
        cadeyUserId: cadeyUserId,
        baseApiUrl: apiUrl,
        userFactTypeName: 'appPageNavigation',
        appPage: 'Recommendations',
        });
    };

    // Set the goals badge
    const setGoalsBadge = async () => {
        const unreadGoalsCount = await getNewGoalsIndicator(apiUrl, cadeyUserId);
        if (unreadGoalsCount > 0) {
        setUnreadGoals?.(true);
        } else {
        setUnreadGoals?.(false);
        }
    }

    // Handler for when the user starts over
    const handleRestart = () => {
            setShowAgeForm(false);
            setShowSymptomsList(false);
            setShowResults(false)
            setSymptoms([]);
            setSelectedConcern(null);
            setResults(null);
            setPageTitle("Concerns");
            document.title = "Concerns";
            setCurrentBasePage('Concerns');
            setCurrentAppPage('Concerns');
            logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Concerns',
        });
        setGoalsBadge();
    };

    // Render the screen
    return (
        <IonPage>
            <IonContent fullscreen>
                <IonHeader class="header">
                    <a href="/App/Library" className="back-link">Library</a>
                    <h2>{pageTitle}</h2>
                </IonHeader>

                {/* Call the renderComponent function to render the correct component */}
                {renderComponent()}
            </IonContent>
        </IonPage>
    );

    // Return the correct component depending on the state
    function renderComponent() {
        if (showResults) {
            return (
                <Results 
                    results={results} 
                    selectedConcern={selectedConcern ? selectedConcern.concern : ''} 
                    onRestart={handleRestart} 
                />
            );
        } else if (showSymptomsList) {
            return (
                <SymptomsList 
                    concern={selectedConcern} 
                    onNext={handleSymptomsNext} 
                    onRestart={handleRestart} 
                />
            );
        } else {
            return (
                <ConcernsList onNext={handleConcernsNext} />
            );
        }
    }
}

export default VideoLibraryPage;
