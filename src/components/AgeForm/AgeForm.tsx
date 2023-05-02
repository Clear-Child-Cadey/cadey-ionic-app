import React, { useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/react';
import './AgeForm.css';

const AgeForm: React.FC = () => {
  const [age, setAge] = useState('');

  // LEFT OFF HERE, AND ALSO HAVEN'T UPDATED THE App.tsx FILE TO INCLUDE THE ROUTING
  // ASK CHATGPT WHY WE NEED TO ADD THE AGE ROUTE TO THE App.tsx FILE IF WE'RE ONLY SHOWING ROUTING FOR HOME AND PAST QUERIES IN THAT VIEW
  // Move handleSubmit from QuestionForm to AgeForm and remove age-related parts from QuestionForm
  const handleSubmit = () => {
    //...
  };

  return (
    <>
      <IonItem>
        <IonLabel position="floating">Age</IonLabel>
        <IonInput
          type="number"
          value={age}
          onIonChange={(e) => setAge(e.detail.value!)}
        ></IonInput>
      </IonItem>
      <IonButton expand="block" onClick={handleSubmit}>
        Submit
      </IonButton>
    </>
  );
};

export default AgeForm;
