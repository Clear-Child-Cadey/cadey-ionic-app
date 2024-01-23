import React, { useEffect, useState, useContext } from 'react';
import './Home.css';
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
    IonButton,
} from '@ionic/react';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import UnreadCountContext from '../../context/UnreadContext';
import { useModalContext } from '../../context/ModalContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { getUserMessages } from '../../api/UserMessages';
import { logUserFact } from '../../api/UserFacts';

export interface Message {
  mediaId: number;
  mediaSourceId: string;
  title: string;
  featuredMessage: string;
  isRead: boolean;
}

const HomePage: React.FC<{ }> = ({  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
    const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
    const userFactUrl = `${apiUrl}/userfact`
    const unreadCount = useContext(UnreadCountContext); // Get the current unread count
    const [messagesLoaded, setMessagesLoaded] = useState(false); // Used to determine if the messages have been loaded yet
    const { setCurrentBasePage, currentAppPage, setCurrentAppPage } = useAppPage();

    const {
      isVideoModalOpen,
      setVideoModalOpen,
      isArticleDetailModalOpen,
      setCurrentVimeoId,
    } = useModalContext();

    // On component mount & isVideoModalOpen change
    useEffect(() => {
      const fetchMessages = async () => {
          try {
            // Start the loader
            setIsLoading(true);
            // Getting messages
            const data: Message[] = await getUserMessages(apiUrl, cadeyUserId);
            setMessages(data);
            const unread = data.filter(data => !data.isRead).length;
            unreadCount.setUnreadMessagesCount?.(unread);
          } catch (error) {
              console.error("Error fetching video details:", error);
          }
          // Clear the loader
          setIsLoading(false);
          setMessagesLoaded(true);
      };
      document.title = 'Messages';
      if (!isVideoModalOpen && !isArticleDetailModalOpen) {
        setCurrentBasePage('Messages');
        setCurrentAppPage('Messages');
        logUserFact({
          cadeyUserId: cadeyUserId,
          baseApiUrl: apiUrl,
          userFactTypeName: 'appPageNavigation',
          appPage: 'Messages',
        });
      }
      fetchMessages();
    }, [isVideoModalOpen]);

    const handleMessageClick = (mediaId: string, mediaSourceId: string)  => {
      // Log a user fact that the user clicked a message from the messages page
      logUserFact({
        cadeyUserId: cadeyUserId,
        baseApiUrl: apiUrl,
        userFactTypeName: 'MessageClickedOnMessagesPage',
        appPage: currentAppPage,
        detail1: mediaId,
        detail2: mediaSourceId,
      });
      setCurrentVimeoId(mediaSourceId);
      setVideoModalOpen(true);
    }

  return (
    <IonPage className="home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRow>
          <IonButton routerLink='/App/Paths'>Resume paths</IonButton>
          <IonButton routerLink='/App/Library'>Explore library</IonButton>
        </IonRow>
        {messagesLoaded && (
          <IonRow>
              {/* "subcopy" that changes depending on whether the user has messages or not */}
              <IonText className="subcopy">{messages.length ? 
                "Your personalized messages" : 
                "You have no messages"
              }</IonText>
          </IonRow>
        )}
        
        <hr className="divider" />

        <IonLoading isOpen={isLoading} message={'Loading Messages...'} />
        {messagesLoaded && !messages.length && (
            <IonRow className="no-messages-content">
                <IonText className="subcopy">When you watch videos, your daily personalized messages will appear here.</IonText>
                <IonButton routerLink='/App/Home'>Watch Videos</IonButton>
            </IonRow>
        )}
        {messagesLoaded && !isLoading && (
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
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;