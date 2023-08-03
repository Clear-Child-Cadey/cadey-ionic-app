import React, { useEffect, useState } from 'react';
import './Messages.css';
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
} from '@ionic/react';

interface Message {
    title: string;
    description: string;
    path: string;
    visibility: string;
}

const MessagesPage: React.FC<{ currentTab: string }> = ({ currentTab }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    // TODO: Replace with an API call

    const dummyData = [
        { title: "Title 1", description: "Description 1", path: "/VideoDetail/824105229/68feae4566", visibility: "unread" },
        { title: "Title 2", description: "Description 2", path: "/VideoDetail/824102840/39a57cdeec", visibility: "read" },
        // Add more dummy data as needed
    ];

    useEffect(() => {
        setIsLoading(true);
        try {
            setMessages(dummyData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false); // Stop the loader after data has been fetched
        }
    }, []);

  return (
    <IonPage className="messages">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Messages</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Messages</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRow>
            <IonText className="subcopy">Here are your messages.</IonText>
        </IonRow>
        <IonLoading isOpen={isLoading} message={'Loading Messages...'} />
        <IonList>
            {messages.map((message, index) => (
                <IonItem key={index} href={message.path} className={message.visibility}>
                    <IonLabel>
                        <h2>{message.title}</h2>
                        <p>{message.description}</p>
                    </IonLabel>
                </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MessagesPage;