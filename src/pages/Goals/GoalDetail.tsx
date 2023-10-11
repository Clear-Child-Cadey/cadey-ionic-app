import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonText,
    IonLoading,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
} from '@ionic/react';
// Interfaces
import { Goal } from '../../pages/Goals/Goals';
// Components
import VideoList from '../../components/Videos/VideoList';

interface LocationState {
    goal: Goal;
}  

const GoalDetailPage: React.FC = () => {
    const location = useLocation<LocationState>();
    const goal: Goal = location.state?.goal || null;

    useEffect(() => {
        // Log the list of video IDs to the console
        console.log("Goal: ", goal);
        console.log("Videos: ", goal.videos);
      }, [goal]);

    return (
        <IonPage className="goals">
            <IonHeader>
                <IonToolbar>
                <IonTitle>Goal</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Goal</IonTitle>
                </IonToolbar>
                </IonHeader>
                <IonRow>
                    <IonText className="subcopy">{goal.title} for {goal.symptom}</IonText>
                </IonRow>
                <VideoList videos={goal.videos} listType='full' />
            </IonContent>
        </IonPage>
    );
};

export default GoalDetailPage;
