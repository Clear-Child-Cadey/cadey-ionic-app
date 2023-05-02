import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import QuestionForm from '../components/QuestionForm/QuestionForm';
import AgeForm from '../components/AgeForm/AgeForm';

const Home: React.FC = () => {
  const [showAgeForm, setShowAgeForm] = useState(false);

  const handleNext = () => {
    setShowAgeForm(true);
  };

  return (
    <IonPage>
      {/* Main Header */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Collapsed header after scroll */}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <QuestionForm onNext={handleNext} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
