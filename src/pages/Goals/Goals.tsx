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
import UnreadContext from '../../context/UnreadContext';
// API
import { getUserGoals } from '../../api/Goals';
import { postGoalOptIn } from '../../api/Goals';
// Interfaces
import { VideoItem } from '../../components/Videos/VideoList';

export interface Goal {
    userGoalId: number;
    title: string;
    symptom: string;
    optIn: boolean | null;
    isNew: boolean;
    videos: VideoItem[];
}

const GoalsPage: React.FC<{ currentTab: string }> = ({ currentTab }) => {
    const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
    const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
    const userFactUrl = `${apiUrl}/userfact`
    const {
        unreadGoals,
        setUnreadGoals
     } = useContext(UnreadContext); // Get the current unread data
    const [isLoading, setIsLoading] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const history = useHistory();

    // On component mount, make an API call to get data
    useEffect(() => {
      const fetchGoals = async () => {
        // Set goals to a dummy array of hardcoded goals
        setGoals(await getUserGoals(apiUrl, cadeyUserId));

          const unreadGoals = goals.filter(goals => !goals.isNew).length;
          if (unreadGoals > 0) {
            setUnreadGoals?.(true);
          } else {
            setUnreadGoals?.(false);
          }
      }
      fetchGoals();
    }, [apiUrl, cadeyUserId]);

    const onOptin = (userGoalId: number) => {
        postGoalOptIn(apiUrl, cadeyUserId, userGoalId, true);
    }

    const onOptout = (userGoalId: number) => {
        postGoalOptIn(apiUrl, cadeyUserId, userGoalId, false);
    }

    const onForward = (goal: Goal) => {
        history.push({
          pathname: '/app/GoalDetail',
          state: { goal: goal }
        });
      };

  return (
    <IonPage className="goals">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Choose a Goal</IonTitle>
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
                    className={`goal ${goal.optIn === false ? 'hidden' : ''}`}
                    onClick={goal.optIn === null ? undefined : () => onForward(goal)}
                >
                    <IonLabel>
                        <h3>{goal.title}</h3>
                        <p>for {goal.symptom} - {goal.videos.length} videos</p>
                    </IonLabel>

                    {/* Show a Check/X if the optIn is null */}
                    {goal.optIn === null ? (
                        <div className="optin-status">
                            <IonIcon 
                                icon={checkmarkCircleOutline} 
                                className="check icon" 
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevents IonItem's onClick
                                    onOptin(goal.userGoalId);
                                }}
                            />
                            <IonIcon 
                                icon={closeCircleOutline} 
                                className="x icon"
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevents IonItem's onClick
                                    onOptout(goal.userGoalId);
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