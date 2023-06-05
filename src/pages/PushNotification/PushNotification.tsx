import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';

const PushNotification: React.FC = () => {

    const triggerPushNotification = () => {
        const payload = {
            app_id: "9e338438-0d42-44e8-b8f4-3ae40f3665e0",
            contents: {"en": "Hello World!"},
            included_segments: ["All"]
        };
      
        fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Basic MDJiNzZlNmYtMzRiNy00ZGY1LTg1NTUtMjQxM2I0YTc2ZTRl"
            },
            body: JSON.stringify(payload)
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Push Notification</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={triggerPushNotification}>Trigger Push Notification</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default PushNotification;
