// Import our dependencies & styles
import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonLoading,
} from '@ionic/react';
import './ConcernsList.css';
import UserIdContext from '../../context/UserIdContext';
import ApiUrlContext from '../../context/ApiUrlContext';

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
        // Get the UserID from the context
        const user_id = React.useContext(UserIdContext);
        const apiUrl = React.useContext(ApiUrlContext);
        
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
                        symptoms: item.symptoms.map((symptom: any) => ({ id: symptom.id, name: symptom.name })),                };
        });

        // Method to indicate a user has interacted with the app (notably selected a concern)
        const postLogEvent = async () => {
                const url = 'https://a47vhkjc3cup25cpotv37xvcj40depdu.lambda-url.us-west-2.on.aws/';
                const bodyObject = {
                  user_id: user_id,
                  log_event: 'ENTRY',
                  data: ''
                };
                const requestOptions = {
                  method: 'POST',
                  headers: { 
                    Accept: 'application/json', 
                  },
                  body: JSON.stringify(bodyObject)
                };
            
                try {
                  const response = await fetch(url, requestOptions);
                } catch (error) {
                  console.error('Error during API call', error);
                }
        };

        // Call the postLogEvent function whenever a button is clicked and proceed to the next screen
        const handleOnClick = (choice: { concern: string; symptoms: Symptom[] }) => {
                postLogEvent();
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
                                {concerns?.map((choice: { concern: string; symptoms: Symptom[] }, index: number) => (
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
                </IonGrid>
        );
};

export default ConcernsList;