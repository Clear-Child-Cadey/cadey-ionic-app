import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Concerns.css';
import ConcernsList from '../components/ConcernsList/ConcernsList';
import SymptomsList from '../components/SymptomsList/SymptomsList';
import AgeForm from '../components/AgeForm/AgeForm';
import Results from '../components/Results/Results';

// Define the Concerns component
const Concerns: React.FC = () => {
  // State variable flags to indicate which component to display
  const [showAgeForm, setShowAgeForm] = useState(false);
  const [showSymptomsList, setShowSymptomsList] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // State variables for storing data
  const [selectedConcern, setSelectedConcern] = useState<{ concern: string; symptoms: string[] } | null>(null);
  const [concerns, setConcerns] = useState<Array<string>>([]);
  const [pageTitle, setPageTitle] = useState("Concerns");
  const [results, setResults] = useState<any | null>(null);

  // Handler for when the user proceeds from the ConcernsList
  const handleConcernsNext = (choice: { concern: string; symptoms: string[] }) => {
    setSelectedConcern(choice);
    setPageTitle("Symptoms");
    setShowSymptomsList(true);
  };

  // Handler for when the user proceeds from the SymptomsList
  const handleSymptomsNext = (symptoms: string[]) => {
    setShowSymptomsList(false);
    setShowAgeForm(true);
    setConcerns(symptoms);
    setPageTitle("Age");
  };

  // Handler for when the AgeForm is submitted
  const handleSubmit = () => {
    setPageTitle("Results");
  };

  // Handler for when the user starts over
  const handleRestart = () => {
    setShowAgeForm(false);
    setShowSymptomsList(false);
    setShowResults(false)
    setConcerns([]);
    setSelectedConcern(null);
    setResults(null);
    setPageTitle("Concerns");
  };

  // Handler for when the results are received from the API
const handleResultsReceived = (response: any) => {
  setResults(response);
  setShowResults(true);
  setShowAgeForm(false);
  setShowSymptomsList(false);
};
  
  // Render the screen
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
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
      return <Results results={results} onRestart={handleRestart} />;
    } else if (showAgeForm) {
      return <AgeForm concerns={concerns} onAgeFormShown={handleSubmit} onRestart={handleRestart} onResultsReceived={handleResultsReceived} />;
    } else if (showSymptomsList) {
      return <SymptomsList concern={selectedConcern} onNext={handleSymptomsNext} onRestart={handleRestart} />;
    } else {
      return <ConcernsList onNext={handleConcernsNext} />;
    }
  }
};

export default Concerns;
