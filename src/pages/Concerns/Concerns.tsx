import React, { useState, useContext, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonProgressBar,
  IonIcon,
} from '@ionic/react';
// Icons
import { checkmarkOutline } from 'ionicons/icons';
// CSS
import './Concerns.css';
// Components
import ConcernsList from '../../components/ConcernsList/ConcernsList';
import SymptomsList from '../../components/SymptomsList/SymptomsList';
import { Symptom } from '../../components/ConcernsList/ConcernsList';
import AgeForm from '../../components/AgeForm/AgeForm';
import Results from '../../components/Results/Results';
// Contexts
import { HomeTabVisibilityContext } from '../../context/TabContext';
import UnreadContext from '../../context/UnreadContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
// Interfaces
import { Goal } from '../../pages/Goals/Goals';
// API
import { getNewGoalsIndicator } from '../../api/Goals';
import { logUserFact } from '../../api/UserFacts';

// Define the Concerns component
const ConcernsPage: React.FC = () => {

  // State variable flags to indicate which component to display
  const [showAgeForm, setShowAgeForm] = useState(false);
  const [showSymptomsList, setShowSymptomsList] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // State variables for storing data
  const [selectedConcern, setSelectedConcern] = useState<{ concern: string; symptoms: Symptom[] } | null>(null);
  const [symptoms, setSymptoms] = useState<Array<Symptom>>([]);
  const [pageTitle, setPageTitle] = useState("Concerns");
  const [results, setResults] = useState<any | null>(null);

  // Context variables
  const { setIsHomeTabVisible: setHomeTabVisibility } = useContext(HomeTabVisibilityContext);
  const { unreadGoals, setUnreadGoals } = useContext(UnreadContext);
  const { cadeyUserId } = useContext(CadeyUserContext);
  const { apiUrl } = useContext(ApiUrlContext);
  const { setCurrentBasePage, setCurrentAppPage } = useAppPage();
  
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
    setShowSymptomsList(false);
    setShowAgeForm(true);
    setSymptoms(symptoms);
    setPageTitle("Age");
    document.title = "Age";
    setCurrentBasePage('Age');
    setCurrentAppPage('Age');
    logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Age',
    });
  };

  // Handler for when the AgeForm is submitted
  const handleSubmit = () => {
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

  // Handler for when the results are received from the API
  const handleResultsReceived = (response: any) => {
    setResults(response);
    setShowResults(true);
    setShowAgeForm(false);
    setShowSymptomsList(false);
    setHomeTabVisibility(true); // Show the Home tab when results are received
  };

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
    } else if (showAgeForm) {
      return (
        <AgeForm 
          symptoms={symptoms} 
          onAgeFormShown={handleSubmit} 
          onRestart={handleRestart} 
          onResultsReceived={handleResultsReceived} 
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
      return <ConcernsList onNext={handleConcernsNext} />;
    }
  }
}

export default ConcernsPage;
