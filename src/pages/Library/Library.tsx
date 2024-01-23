import React, { useState, useContext, useEffect } from 'react';
import { 
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonProgressBar,
    IonIcon,
    IonSearchbar,
    IonRow,
} from '@ionic/react';
// Icons
import { checkmarkOutline } from 'ionicons/icons';
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
import AgeGroupModal from '../../components/Modals/AgeGroupModal/AgeGroupModal';
// Routing
import { useHistory } from 'react-router-dom';

// Define the Concerns component
const ConcernsPage: React.FC = () => {

    // State variable flags to indicate which component to display
    const [showAgeForm, setShowAgeForm] = useState(false);
    const [showSymptomsList, setShowSymptomsList] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // State variables for storing data
    const [selectedConcern, setSelectedConcern] = useState<{ concern: string; symptoms: Symptom[] } | null>(null);
    const [symptoms, setSymptoms] = useState<Array<Symptom>>([]);
    const [pageTitle, setPageTitle] = useState("Library");
    const [results, setResults] = useState<any | null>(null);

    // Context variables
    const { setIsHomeTabVisible: setHomeTabVisibility } = useContext(HomeTabVisibilityContext);
    const { unreadGoals, setUnreadGoals } = useContext(UnreadContext);
    const { cadeyUserId, cadeyUserAgeGroup } = useContext(CadeyUserContext);
    const { isAgeGroupModalOpen, setAgeGroupModalOpen } = useModalContext(); // Get the modal state from the context
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

    useEffect(() => {
    console.log("Cadey User Age Group: ", cadeyUserAgeGroup);
    }, [cadeyUserAgeGroup]);

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

        // If the user has not selected an age group, open the age group modal
        if (cadeyUserAgeGroup == 0) {
        // Open the age group modal
        setAgeGroupModalOpen(true);

        // Return early
        return;
        }
        
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

    // Handler for when the user selects an age group
    const onAgeGroupSelected = async (selectedAgeGroup: number) => {
        // Get recommendations for the user
        getUserRecommendations(selectedAgeGroup, symptoms);
        console.log("Age group selected: ", selectedAgeGroup);
    }

    // Determine the progress bar value
    const determineProgress = () => {
        if (showResults) {
        return 1; // 100%, but unused. We hide the progress bar when results are visible
        } else if (showAgeForm) {
        return 1; // 100%
        } else if (showSymptomsList) {
        return 0.50; // 50%
        } else {
        return 0; // 0%
        }
    };

    const handleInputChange = (e: any) => {
        
        // Restrict input to 100 characters
        const inputValue = e.detail.value;
        if (inputValue.length > 100) {
            const limitedValue = inputValue.slice(0, 100);
            e.target.value = limitedValue;
        }
    }

    const handleSearchInput = async (e: React.KeyboardEvent) => {
        
        const searchTerm = (e.target as HTMLInputElement).value;
        
        if (e.key === "Enter") {
    
            // Check if the user has entered a search term
            if (searchTerm.trim() === "") {
                alert("Please enter a search term.");
                return;
            }
    
            // Route the user to the search page
            history.push({
                pathname: '/App/Library/Search',
                search: `?query=${encodeURIComponent(searchTerm)}`, // Optional if you want the term in the URL
                state: { query: searchTerm }
            });
        }
    }

    // Render the screen
    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonTitle>{pageTitle}</IonTitle>
            </IonToolbar>
        </IonHeader>        
        
        {/* Display the progress bar only if showResults is false */}
        {!showResults && (
            <div className="progress-container">
            <IonProgressBar value={determineProgress()}></IonProgressBar>
            <div 
                className="progress-step" 
                style={{ left: 'calc(0% + 28px)' }}
            >
                {showSymptomsList || showAgeForm || showResults ? <IonIcon icon={checkmarkOutline} /> : '1'}
            </div>
            <div 
                className={`progress-step ${!showAgeForm && !showResults && !showSymptomsList ? "incomplete" : ""}`} 
                style={{ left: '50%' }}
            >
                {showAgeForm || showResults ? <IonIcon icon={checkmarkOutline} /> : '2'}
            </div>
            <div 
                className={`progress-step ${!showResults && !showAgeForm ? "incomplete" : ""}`} 
                style={{ left: 'calc(100% - 28px)' }}
            >
                {showResults ? <IonIcon icon={checkmarkOutline} /> : '3'}
            </div>
            </div>
        )}

        <IonContent fullscreen>
            <IonHeader collapse="condense">
            <IonToolbar>
                <IonTitle size="large">{pageTitle}</IonTitle>
            </IonToolbar>
            </IonHeader>

            {/* Show an age group modal if context dictates */}
            <AgeGroupModal isOpen={isAgeGroupModalOpen} onAgeGroupSelected={onAgeGroupSelected} />

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
                <IonRow className="library-home">
                    <IonRow className="search-container">
                        {/* Search bar */}
                        <IonSearchbar 
                            className="search-bar" 
                            onIonChange={handleInputChange}
                            onKeyDown={handleSearchInput}
                            mode="ios"
                        ></IonSearchbar>
                    </IonRow>
                    <ConcernsList onNext={handleConcernsNext} />
                </IonRow>
            );
        }
    }
}

export default ConcernsPage;
