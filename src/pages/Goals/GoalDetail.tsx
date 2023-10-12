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
} from '@ionic/react';
// Interfaces
import { Goal } from '../../pages/Goals/Goals';
// Components
import VideoList from '../../components/Videos/VideoList';
// CSS
import './GoalDetail.css';

interface LocationState {
    goal: Goal;
}  

const GoalDetailPage: React.FC = () => {
    const location = useLocation<LocationState>();
    const goal: Goal = location.state?.goal || null;

    return (
        <IonPage className="goal-detail">
            <IonHeader>
                <IonToolbar>
                <IonTitle>How to Help</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">How to Help</IonTitle>
                </IonToolbar>
                </IonHeader>
                {/* <IonRow>
                    <IonText className="subcopy">{goal.title} for {goal.symptom}</IonText>
                </IonRow> */}
                <IonRow>
                    <IonText className="subcopy"><strong>Goal</strong>: {goal.title}</IonText>
                    <IonText className="symptom"><strong>Symptom</strong>: {goal.symptom}</IonText>
                </IonRow>
                <VideoList videos={goal.videos} listType='full' />
            </IonContent>
        </IonPage>
    );
};

export default GoalDetailPage;
