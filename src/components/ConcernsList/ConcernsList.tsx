// Import our dependencies & styles
import React, { useState, useEffect, useContext } from 'react';
import {
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonLoading,
} from '@ionic/react';
import './ConcernsList.css';
import { SplashScreen } from '@capacitor/splash-screen';
// Contexts
import DeviceIdContext from '../../context/DeviceIdContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
// Functions
import { logConcernClick } from '../../api/UserFacts';

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
        const device_id = React.useContext(DeviceIdContext);
        const { apiUrl } = React.useContext(ApiUrlContext);
        const { cadeyUserId, minimumSupportedVersion } = useContext(CadeyUserContext);
        const userFactUrl = `${apiUrl}/api/cadeydata/userfact`;
        
        const [isLoading, setIsLoading] = useState(false);
        const [concernsList, setConcernsList] = useState<any>(null);

        // Fetch data from API
        useEffect(() => {
                setIsLoading(true);  // Start the loader here
                
                // Get the concerns and symptoms from the API
                const url = `${apiUrl}/api/cadeydata/getconcerns`;

                fetch(url, {
                method: 'GET',
                headers: {
                        'accept': 'text/plain',
                        'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
                },
                })
                .then(response => response.json())
                .then(data => {
                        setConcernsList(data);
                        setIsLoading(false);  // Stop the loader after data has been fetched
                        SplashScreen.hide();  // Hide the splash screen after data has been fetched
                })
                .catch(error => {
                        console.error('Error:', error);
                        setIsLoading(false);  // Stop the loader in case of error
                });
        
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
                logConcernClick(cadeyUserId, userFactUrl, choice.concernId.toString(), location.pathname);
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
                                {concerns?.map((choice: { concern: string; concernId: number; symptoms: Symptom[] }, index: number) => (
                                        <IonCol size="6" key={index}>
                                                {/* When a button is clicked, call the onNext function with the chosen concern */}
                                                <IonButton
                                                className="concern"
                                                color="light"
                                                expand="block"
                                                size="large"
                                                onClick={() => handleOnClick(choice)}                                                >
                                                {choice.concern}
                                                </IonButton>
                                        </IonCol>
                                ))}
                        </IonRow>
                        <IonRow className='privacy'>
                                <a href="https://clearchildpsychology.com/privacy/" target="_blank" rel="noopener noreferrer" style={{ margin: 'auto' }}>Privacy Policy</a>
                        </IonRow>
                </IonGrid>
        );
};

export default ConcernsList;