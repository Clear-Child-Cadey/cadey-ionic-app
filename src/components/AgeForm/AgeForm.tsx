import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  IonItem,
  IonInput,
  IonButton,
  IonLoading,
  IonRow,
  IonText,
  IonIcon
} from '@ionic/react';
import Results from '../Results/Results';
import './AgeForm.css';
import { refresh } from 'ionicons/icons';
import UserIdContext from '../../context/UserIdContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { Symptom } from '../ConcernsList/ConcernsList';

interface AgeFormProps {
  symptoms: Symptom[];
  onAgeFormShown: () => void;
  onRestart: () => void;
  onResultsReceived: (response: any) => void; // Callback that will send the response back to the parent component
}

const AgeForm: React.FC<AgeFormProps> = (props) => { // Pass props here
  const [age, setAge] = useState<number | null>(null);
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { symptoms, onAgeFormShown, onRestart, onResultsReceived } = props;
  const user_id = React.useContext(UserIdContext);
  const apiUrl = useContext(ApiUrlContext);

  let ageGroup: number;

  // Create a ref to the age input field
  const inputRef = useRef<HTMLIonInputElement>(null);

  // Give focus to the age field once the component is rendered (after a safe delay)
  useEffect(() => {
    setTimeout(() => inputRef.current?.setFocus(),150);
  }, []);

  // Logging request to indicate that the user has submitted their age
  const postLogSubmitEvent = async () => {
    const logSubmitUrl = 'https://a47vhkjc3cup25cpotv37xvcj40depdu.lambda-url.us-west-2.on.aws/';
    
    // Extract the symptom IDs from the symptoms array
    const symptomIds = symptoms.map((symptom) => symptom.id);
    
    const logSubmitBodyObject = {
      user_id: user_id,
      log_event: 'SUBMIT',
      data: {
        'Symptom IDs': symptomIds,
        'Age Group': ageGroup
      }
    };
    const logSubmitRequestOptions = {
      method: 'POST',
      headers: { 
        Accept: 'application/json', 
      },
      body: JSON.stringify(logSubmitBodyObject)
    };

    try {
      const logSubmitResponse = await fetch(logSubmitUrl, logSubmitRequestOptions);
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  // Send logging request to log the response received
  const postLogResponseEvent = async (recommendationsResponse: any) => {
    const logResponseUrl = 'https://a47vhkjc3cup25cpotv37xvcj40depdu.lambda-url.us-west-2.on.aws/';
    
    // Extract the symptom IDs from the symptoms array
    const symptomIds = symptoms.map((symptom) => symptom.id);
    
    const logResponseBodyObject = {
      user_id: user_id,
      log_event: 'RESPONSE',
      data: {
        'UserInput': {
          'Symptom IDs': symptomIds,
          'Age Group': ageGroup
        },
        'Recommendations': recommendationsResponse
      }
    };
    const logResponseRequestOptions = {
      method: 'POST',
      headers: { 
        Accept: 'application/json', 
      },
      body: JSON.stringify(logResponseBodyObject)
    };

    try {
      const logResponseResponse = await fetch(logResponseUrl, logResponseRequestOptions);
    } catch (error) {
      console.error('Error during API call', error);
    }
  };
  
  // Handle submission of the age form
  const handleSubmit = async () => {
    // Prevent submission if age is empty
    if (!age) {
      alert("Please enter an age.");
      return;
    }

    // Check if the age is a valid whole number, positive integer
    if (!Number.isInteger(age) || age < 0) {
      alert("Please enter a valid age (whole number only, greater than 0).");
      return;
    }

    setIsLoading(true);

    // Determine AgeGroup based on age
    if (age <= 4) {
      ageGroup = 1;
    } else if (age <= 11) {
      ageGroup = 2;
    } else {
      ageGroup = 3;
    }

    // Send the log event
    await postLogSubmitEvent();

    // Get recommendations from the API
    const url = `${apiUrl}/api/cadeydata/getrecommendations?ageGroup=${ageGroup}&symptomIds=${symptoms.map(symptom => symptom.id).join('&symptomIds=')}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        accept: 'text/plain',
        apiKey: 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
      },
    };

    try {
      const recommendationsResponse = await fetch(url, requestOptions);
      const data = await recommendationsResponse.json();
      setResponse(data);

      // Use the callback to send the response to the parent component
      onResultsReceived(data);

      // Invoke the callback when the response is received
      onAgeFormShown();

      setIsLoading(false);

      // Log the response
      await postLogResponseEvent(data);

    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container age">
      <IonRow>
        <IonText className="subcopy">This helps personalize your results</IonText>
      </IonRow>

      <div className="input-shadow">
        <IonItem className="age-input-area">
          <IonInput
            type="number"
            // pattern="[0-9]*"
            // inputMode="numeric"
            placeholder="Enter Age (in years)"
            color="medium"
            value={age}
            min="0"
            step="1"
            clearInput={true}
            enterkeyhint="go"
            className="age-input"
            onIonInput={(e) => setAge(Number(e.detail.value!))}
            ref={inputRef} // Bind the ref to the input field
            onKeyPress={(e) => { 
              if (e.key === 'Enter') handleSubmit() // Allow the enter button to submit

              // Prevent non-numeric characters from being entered
              const keyValue = e.key;
              if (!/\d/.test(keyValue))
                e.preventDefault();
            }}
            ></IonInput>
        </IonItem>
      </div>
      
      <IonRow class="bottom-row">
        <IonButton expand="block" onClick={onRestart} color="secondary" aria-label="Restart">
          <IonIcon icon={refresh} slot="start" />
          Restart
        </IonButton>
        <IonButton expand="block" onClick={handleSubmit} disabled={age === null}
>
          Continue
        </IonButton>
      </IonRow>
      <IonLoading isOpen={isLoading} message={'Please wait...'} />
    </div>
  );
};

export default AgeForm;
