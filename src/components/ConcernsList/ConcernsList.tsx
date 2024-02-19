// Import our dependencies & styles
import React, { useState, useEffect, useContext } from 'react';
import {
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/react';
import './ConcernsList.css';
import { SplashScreen } from '@capacitor/splash-screen';
// Contexts
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
import { useAppPage } from '../../context/AppPageContext';
// API
import { logUserFact } from '../../api/UserFacts';
import { getConcerns } from '../../api/GetConcerns';

// Define a TypeScript interface for the ConcernsList component's props
interface ConcernsListProps {
        onNext: (choice: { concern: string; symptoms: Symptom[] }) => void;
}

// Define a TypeScript interface for the Symptom object
export interface Symptom {
        id: number;
        name: string;
}

// Define the ConcernsList functional component
const ConcernsList: React.FC<ConcernsListProps> = ({ onNext }) => {
        const { apiUrl } = React.useContext(ApiUrlContext);
        const { cadeyUserId, minimumSupportedVersion } = useContext(CadeyUserContext);
        const { currentAppPage } = useAppPage();
        
        const [isLoading, setIsLoading] = useState(false);
        const [concernsList, setConcernsList] = useState<any>(null);

        // Fetch data from API
        useEffect(() => {
                
                const fetchConcerns = async () => {
                        setIsLoading(true);  // Start the loader
                        const response = await getConcerns(apiUrl, cadeyUserId);
                        setConcernsList(response);
                        setIsLoading(false);  // Stop the loader after data has been fetched
                        SplashScreen.hide();  // Hide the splash screen after data has been fetched
                };
                
                // Get the concerns and symptoms from the API
                fetchConcerns();
        }, []);
        
        // Create a list of Concerns by mapping over the payload entries
        const concerns = concernsList?.concerns.map((item: any) => {
                return {
                        concern: item.name,
                        concernId: item.id,
                        symptoms: item.symptoms.map((symptom: any) => ({ id: symptom.id, name: symptom.name })),                };
        });

        // Call the postLogEvent function whenever a button is clicked and proceed to the next screen
        const handleOnClick = (choice: { concern: string; concernId: number; symptoms: Symptom[] }) => {
                logUserFact({
                        cadeyUserId: cadeyUserId,
                        baseApiUrl: apiUrl,
                        userFactTypeName: 'ConcernChosen',
                        appPage: currentAppPage,
                        detail1: choice.concernId.toString(),
                });
                onNext(choice);
        }

        // Render the component 
        return (
                <IonGrid className="concerns-wrapper">
                        <IonRow>
                                <IonText className="subcopy">Make a selection to get started:</IonText>
                        </IonRow>
                        <IonRow>
                                {/* Iterate over the choices and create a button for each concern */} 
                                <div className="video-concerns">
                                        {concerns?.map((choice: { concern: string; concernId: number; symptoms: Symptom[] }, index: number) => (
                                                <div className="video-concern" key={choice.concernId} onClick={() => handleOnClick(choice)}>
                                                        <h2>{choice.concern}</h2>
                                                        <span className="arrow">&gt;</span>
                                                </div>
                                        ))}
                                </div>
                        </IonRow>
                        <IonRow className='privacy'>
                                <a href="https://clearchildpsychology.com/privacy/" target="_blank" rel="noopener noreferrer" style={{ margin: 'auto' }}>Privacy Policy</a>
                        </IonRow>
                </IonGrid>
        );
};

export default ConcernsList;