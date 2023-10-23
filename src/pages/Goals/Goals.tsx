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
    IonButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
// Icons
import { chevronForwardOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import UnreadContext from '../../context/UnreadContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { getUserGoals } from '../../api/Goals';
import { postGoalOptIn } from '../../api/Goals';
import { logUserFact } from '../../api/UserFacts';
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
    const { setCurrentBasePage, setCurrentAppPage } = useAppPage();
    const {
        unreadGoals,
        setUnreadGoals
     } = useContext(UnreadContext); // Get the current unread data
    const [isLoading, setIsLoading] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [goalsLoaded, setGoalsLoaded] = useState(false); // Used to determine if the goals have been loaded yet
    const history = useHistory();

    const fetchGoals = async () => {
        try {
            const fetchedGoals = await getUserGoals(apiUrl, cadeyUserId);
            setGoals(fetchedGoals);
        } catch (error) {
            console.error("Error fetching goals:", error);
        }
        setGoalsLoaded(true);
    }

    // On component mount, make an API call to get data
    useEffect(() => {
        setCurrentBasePage('Goals List');
        setCurrentAppPage('Goals List');
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Goals List',
          });
        setUnreadGoals?.(false);
        fetchGoals();
    }, [apiUrl, cadeyUserId]);

    const onOptin = (userGoalId: number) => {
        postGoalOptIn(apiUrl, cadeyUserId, userGoalId, true);
        // Update the optIn value of the goal in state
        // Allows the user to access the goal immediately without a follow up API call
        setGoals(goals.map(goal => {
            if (goal.userGoalId === userGoalId) {
                goal.optIn = true;
            }
            return goal;
        }));
    }

    const onOptout = (userGoalId: number) => {
        postGoalOptIn(apiUrl, cadeyUserId, userGoalId, false);
        // Update the optIn value of the goal in state
        // Hides the goal immediately without a follow up API call
        setGoals(goals.map(goal => {
            if (goal.userGoalId === userGoalId) {
                goal.optIn = false;
            }
            return goal;
        }));
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
        
        {/* Show loading state */}
        <IonLoading isOpen={isLoading} message={'Loading Goals...'} />
        
        {goalsLoaded && (
            <IonRow>
                {(!goals.length || goals.length == 0) && (
                    <IonText className="subcopy">You don't have any goals yet.</IonText>
                )}

                {goals.length > 0 && (
                    <IonText className="subcopy">
                        {!goals.every(goal => goal.optIn === false) ?
                            "Add or remove goals below to get a highly personalized game plan." : 
                            "You don't have any goals yet."
                        }
                    </IonText>
                )}
            </IonRow>
        )}
        
        <hr className="divider" />
        
        {/* Show the no goals content if context dictates */}
        {/* Check if goals are loaded and the user either has no goals (!goals.length) or all goals are hidden (optIn === false)
            // If so, show the no goals content
            // Otherwise, show nothing */}
        {goalsLoaded && (!goals.length || goals.every(goal => goal.optIn === false)) && (
            <IonRow className="no-goals-content">
                <IonText className="subcopy">No goals found. Fill out your Concerns to get goals.</IonText>
                {/* Button that links to /app/concerns */}
                <IonButton routerLink="/app/concerns">Go to Concerns</IonButton>
            </IonRow>
        )}
        
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
                        <p>Symptom: {goal.symptom} - {goal.videos.length} videos</p>
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