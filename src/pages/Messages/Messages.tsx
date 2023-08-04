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
        { title: "Video 1", description: "Description 1 lorem ipsum dolor", path: "/VideoDetail/824105229/68feae4566", visibility: "unread" },
        { title: "Video 2", description: "Description 2 consectetur sit amet", path: "/VideoDetail/824102840/39a57cdeec", visibility: "read" },
        { title: "Video 3", description: "Description 3 lorem ipsum dolor", path: "/VideoDetail/824100882/8cebb364bf", visibility: "read" },
        { title: "Video 4", description: "Description 4 consectetur sit amet", path: "/VideoDetail/822097592/44878cd162", visibility: "read" },
        { title: "Video 5", description: "Description 5 lorem ipsum dolor", path: "/VideoDetail/822073557/a9efd31aab", visibility: "read" },
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