import React, { useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonLoading,
  IonRow,
} from '@ionic/react';
import Results from '../Results/Results';
import './AgeForm.css';

interface AgeFormProps {
  concerns: string[];
  onAgeFormShown: () => void;
  onRestart: () => void;
  onResultsReceived: (response: any) => void; // Callback that will send the response back to the parent component
}

const AgeForm: React.FC<AgeFormProps> = (props) => { // Pass props here
  const [age, setAge] = useState('');
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { concerns, onAgeFormShown, onRestart, onResultsReceived } = props;

  const handleSubmit = async () => {
    setIsLoading(true);

    const url = 'https://wruaigpff6432iw6mamzxargz40rfkty.lambda-url.us-west-2.on.aws/';
    const bodyObject = {
      client_id: '127001',
      concerns: concerns,
      age: age
    };
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(bodyObject),
    };

    console.log('Request:', bodyObject);

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      setResponse(data);

      // Use the callback to send the response to the parent component
      onResultsReceived(data);

      console.log('Response:', data);

      // Invoke the callback when the response is received
      onAgeFormShown();

      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* {!response.action_content && ( */}
        <>
          <IonItem>
            <IonLabel position="floating">Age</IonLabel>
            <IonInput
              type="number"
              value={age}
              onIonInput={(e) => setAge(e.detail.value!)}
            ></IonInput>
          </IonItem>
          
          <IonRow>
            <IonButton expand="block" onClick={onRestart} color="secondary">
              Start Over
            </IonButton>
            <IonButton expand="block" onClick={handleSubmit}>
              Submit
            </IonButton>
          </IonRow>
          <IonLoading isOpen={isLoading} message={'Please wait...'} />
        </>
      {/* )}
      {response.action_content && <Results response={response} />} */}
    </>
  );
};

export default AgeForm;
