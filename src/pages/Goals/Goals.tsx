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
import { useHistory } from 'react-router-dom';
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
    const history = useHistory();

    // On component mount, make an API call to get data
    useEffect(() => {
      const fetchGoals = async () => {
        // Set goals to a dummy array of hardcoded goals
        setGoals([
            {
                id: 1,
                title: "Increase positive affirmations",
                symptom: "Cries a lot",
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
                title: "Improve mood",
                symptom: "Sadness",
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

    const onOptin = () => {
        // Optin code
        console.log("Optin");
    }

    const onOptout = () => {
        // Optout code
        console.log("Optout");
    }

    const onForward = (goal: Goal) => {
        console.log("Forward");
        history.push({
          pathname: '/app/GoalDetail',
          state: { goal: goal }
        });
      };

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
            <IonTitle size="large">Choose a Goal</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRow>
            <IonText className="subcopy">Add or remove goals below to get a highly personalized game plan.</IonText>
        </IonRow>
        <hr className="divider" />
        <IonLoading isOpen={isLoading} message={'Loading Goals...'} />
        {/* Create a list of goals */}
        <IonList>
            {goals.map((goal, index) => (                
                <IonItem 
                    key={index} 
                    className={`goal ${goal.optinStatus === 0 ? 'hidden' : ''}`}
                    onClick={goal.optinStatus === null ? undefined : () => onForward(goal)}
                >
                    <IonLabel>
                        <h3>{goal.title}</h3>
                        <p>for {goal.symptom} - {goal.videos.length} videos</p>
                    </IonLabel>

                    {/* Show a Check/X if the optinStatus is null */}
                    {goal.optinStatus === null ? (
                        <div className="optin-status">
                            <IonIcon 
                                icon={checkmarkCircleOutline} 
                                className="check icon" 
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevents IonItem's onClick
                                    onOptin();
                                }}
                            />
                            <IonIcon 
                                icon={closeCircleOutline} 
                                className="x icon"
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevents IonItem's onClick
                                    onOptout();
                                }}
                            />
                        </div>
                    ) : 
                    // Show an arrow if the optinStatus is not null
                        <div className="optin-status">
                            <IonIcon 
                                icon={chevronForwardOutline} 
                                className='forward icon' 
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevents IonItem's onClick
                                    onForward(goal);
                                }}
                            />
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