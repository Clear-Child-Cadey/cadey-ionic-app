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
import './AgeForm.css';
import { refresh } from 'ionicons/icons';
// Contexts
import DeviceIdContext from '../../context/DeviceIdContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
// Symptoms
import { Symptom } from '../ConcernsList/ConcernsList';
// API
import { logAgeScreenReached } from '../../api/UserFacts';

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
  const device_id = React.useContext(DeviceIdContext);
  const { apiUrl } = useContext(ApiUrlContext);
  const userFactUrl = `${apiUrl}/userfact`;
  const { cadeyUserId, minimumSupportedVersion } = useContext(CadeyUserContext);

  let ageGroup: number;

  // Create a ref to the age input field
  const inputRef = useRef<HTMLIonInputElement>(null);

  // Give focus to the age field once the component is rendered (after a safe delay)
  useEffect(() => {
    setTimeout(() => inputRef.current?.setFocus(),150);
    // Log user fact that the user reached the age screen
    logAgeScreenReached(cadeyUserId, userFactUrl, document.title);
  }, []);
  
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

    // Get recommendations from the API
    const url = `${apiUrl}/getrecommendations?cadeyUserId=${cadeyUserId}&ageGroup=${ageGroup}&symptomIds=${symptoms.map(symptom => symptom.id).join('&symptomIds=')}`;

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
