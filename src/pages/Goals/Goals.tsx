import React, { useEffect, useState, useContext } from 'react';
import './Goals.css';
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
// Icons
import { chevronForwardOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import UnreadCountContext from '../../context/UnreadCountContext';
import { useModalContext } from '../../context/ModalContext';
// API

interface Video {
    mediaId: string;
    videoId: string;
    title: string;
    audience: string;
    videoType: string;
    thumbnail: string;
}

export interface Goal {
    id: number;
    title: string;
    symptom: string;
    optinStatus: number | null;
    videos: Video[];
}

const GoalsPage: React.FC<{ currentTab: string }> = ({ currentTab }) => {
    const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
    const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
    const userFactUrl = `${apiUrl}/userfact`
    const unreadCount = useContext(UnreadCountContext); // Get the current unread count
    const [isLoading, setIsLoading] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);

    // On component mount, make an API call to get data
    useEffect(() => {
      const fetchGoals = async () => {
        // Set goals to a dummy array of hardcoded goals
        setGoals([
            {
                id: 1,
                title: "Goal 1",
                symptom: "Symptom 1",
                optinStatus: 1,
                videos: [
                {
                    mediaId: "8",
                    videoId: "830290291/b29396446b",
                    title: "Active listening parenting pitfall: losing your patience",
                    audience: "For Parents",
                    videoType: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1704982845-30247d28a9306c40decc54c0877f6b0f93e8ee255717d72ad371882cf0299003-d_1920x1080?r=pad"
                },
                {
                    mediaId: "8",
                    videoId: "830290291/b29396446b",
                    title: "Active listening parenting pitfall: losing your patience",
                    audience: "For Parents",
                    videoType: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1704982845-30247d28a9306c40decc54c0877f6b0f93e8ee255717d72ad371882cf0299003-d_1920x1080?r=pad"
                }
                ]
            },
            {
                id: 2,
                title: "Goal 2",
                symptom: "Symptom 2",
                optinStatus: 0,
                videos: [
                {
                    mediaId: "8",
                    videoId: "830290291/b29396446b",
                    title: "Active listening parenting pitfall: losing your patience",
                    audience: "For Parents",
                    videoType: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1704982845-30247d28a9306c40decc54c0877f6b0f93e8ee255717d72ad371882cf0299003-d_1920x1080?r=pad"
                },
                {
                    mediaId: "8",
                    videoId: "830290291/b29396446b",
                    title: "Active listening parenting pitfall: losing your patience",
                    audience: "For Parents",
                    videoType: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1704982845-30247d28a9306c40decc54c0877f6b0f93e8ee255717d72ad371882cf0299003-d_1920x1080?r=pad"
                }
                ]
            },
            {
                id: 2,
                title: "Goal 3",
                symptom: "Symptom 3",
                optinStatus: null,
                videos: [
                {
                    mediaId: "8",
                    videoId: "830290291/b29396446b",
                    title: "Active listening parenting pitfall: losing your patience",
                    audience: "For Parents",
                    videoType: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1704982845-30247d28a9306c40decc54c0877f6b0f93e8ee255717d72ad371882cf0299003-d_1920x1080?r=pad"
                },
                {
                    mediaId: "8",
                    videoId: "830290291/b29396446b",
                    title: "Active listening parenting pitfall: losing your patience",
                    audience: "For Parents",
                    videoType: "1",
                    thumbnail: "https://i.vimeocdn.com/video/1704982845-30247d28a9306c40decc54c0877f6b0f93e8ee255717d72ad371882cf0299003-d_1920x1080?r=pad"
                }
                ]
            }
        ]);
      }
      fetchGoals();
    }, [apiUrl, cadeyUserId]);

    const handleGoalClick = (goalId: number)  => {
    // Log a user fact
    }

  return (
    <IonPage className="goals">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Goals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Goals</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRow>
            <IonText className="subcopy">Here are your goals.</IonText>
        </IonRow>
        <IonLoading isOpen={isLoading} message={'Loading Goals...'} />
        {/* Create a list of goals */}
        <IonList>
            {goals.map((goal, index) => (
                <IonItem 
                    key={index} 
                    onClick={() => handleGoalClick(goal.id)}
                    className={`goal ${goal.optinStatus === 0 ? 'hidden' : ''}`}
                >
                    <IonLabel>
                        <h2>{goal.title}</h2>
                        <p>{goal.symptom}</p>
                    </IonLabel>

                    {/* Show a Check/X if the optinStatus is null */}
                    {goal.optinStatus === null ? (
                        <div className="optin-status">
                            <IonIcon icon={checkmarkCircleOutline} className="check" />
                            <IonIcon icon={closeCircleOutline} className="x" />
                        </div>
                    ) : 
                    // Show an arrow if the optinStatus is not null
                        <div className="optin-status">
                            <IonIcon icon={chevronForwardOutline} />
                        </div>
                    }
                </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default GoalsPage;