import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
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
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import UnreadCountContext from '../../context/UnreadCountContext';
// API
import { getUserMessages } from '../../api/UserMessages';
import { logMessageOnMessagesPageClicked } from '../../api/UserFacts';

export interface Message {
  mediaId: number;
  mediaSourceId: string;
  title: string;
  featuredMessage: string;
  isRead: boolean;
}

const MessagesPage: React.FC<{ currentTab: string }> = ({ currentTab }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
    const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
    const userFactUrl = `${apiUrl}/api/cadeydata/userfact`
    const unreadCount = useContext(UnreadCountContext); // Get the current unread count
    const history = useHistory(); // Initialize the useHistory hook here

    // On component mount: 
    // - Set the page title
    // - Get the user's messages
    useEffect(() => {
      const fetchMessages = async () => {
          try {
            // Getting messages
            const data: Message[] = await getUserMessages(apiUrl, cadeyUserId);
            setMessages(data);
            const unread = data.filter(data => !data.isRead).length;
            unreadCount.setUnreadCount?.(unread);
          } catch (error) {
              console.error("Error fetching video details:", error);
          }
      };
      document.title = 'Messages'; // Set the page title when the component mounts
      fetchMessages(); // Get data when the component mounts
    }, []);

    const handleMessageClick = (mediaId: string, mediaSourceId: string)  => {
      // Log a user fact that the user clicked a message from the messages page
      console.log('User clicked a message from the messages page. Media ID: ' + mediaId);
      logMessageOnMessagesPageClicked(cadeyUserId, userFactUrl, mediaId, mediaSourceId, location.pathname);
      // Redirect to the video detail page
      history.push(`/App/VideoDetail/${mediaSourceId}`);
    }

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
                <IonItem 
                  key={index} 
                  onClick={() => handleMessageClick(message.mediaId.toString(), message.mediaSourceId,)}
                  className={message.isRead ? "read" : "unread"}
                >
                    {/* Render the unread indicator dot if the message is unread, otherwise render a placeholder */}
                    {message.isRead ? 
                        <div className="read-placeholder"></div> :
                        <div className="unread-indicator"></div> 
                    }

                    <IonLabel>
                        <h2>{message.title}</h2>
                        <p>{message.featuredMessage}</p>
                    </IonLabel>
                </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MessagesPage;