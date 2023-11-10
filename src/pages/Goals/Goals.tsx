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
    IonModal,
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
import { getUserGoals, postGoalOptIn, popularGoals, popularSymptomAge } from '../../api/Goals';
import { getUserSymptoms } from '../../api/UserSymptoms';
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
    
    const [goals, setGoals] = useState<Goal[]>([]);
    const [ageGroup, setAgeGroup] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [goalsLoaded, setGoalsLoaded] = useState(false); // Used to determine if the goals have been loaded yet
    const [userHasSymptoms, setUserHasSymptoms] = useState(false); // Used to determine if the user has any symptoms
    const [showAgeGroupModal, setShowAgeGroupModal] = useState(false);
    const [currentUserGoalId, setCurrentUserGoalId] = useState(0);

    const history = useHistory();

    const fetchGoals = async () => {
        try {
            setIsLoading(true);
            
            // Check if the user has any symptoms & update their flag if so
            var userSymptoms = await getUserSymptoms(apiUrl, cadeyUserId);
            if (userSymptoms.length > 0) {
                setUserHasSymptoms(true);
            }

            var fetchedGoals = await getUserGoals(apiUrl, cadeyUserId);
            if (fetchedGoals.length == 0) {
                const popularGoalsResponse = await popularGoals(apiUrl, cadeyUserId);
                if (popularGoalsResponse.status === 200) {
                    fetchedGoals = await getUserGoals(apiUrl, cadeyUserId);
                } else {
                    console.error('Error fetching popular goals:', popularGoalsResponse);
                }
            }
            setGoals(fetchedGoals);
        } catch (error) {
            console.error("Error fetching goals:", error);
        } finally {
            setIsLoading(false);
        }
        setGoalsLoaded(true);
    }

    // On component mount, make an API call to get goals
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

    const onOptin = async (userGoalId: number) => {
        if (!userHasSymptoms) {
            // Store this in state for later use
            setCurrentUserGoalId(userGoalId); 

            // Show the modal for the user to select the age group
            setShowAgeGroupModal(true); 
            
            // Exit early since we don't want to opt-in until after age group selection
            return; 
        }
        
        console.log('Opting in to goal:', userGoalId);
        // Opt the user into the goal on the back end
        await postGoalOptIn(apiUrl, cadeyUserId, userGoalId, true);

        // Set the user's symptom flag
        setUserHasSymptoms(true);

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
        // Opt the user out of the goal on the back end
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

    const handleAgeSelection = async (selectedAgeGroup: number) => {
        setAgeGroup(selectedAgeGroup);

        setIsLoading(true); // Show loading indicator while fetching
    
        try {
            // Record a popular symptom age group for the user
            await popularSymptomAge(apiUrl, cadeyUserId, selectedAgeGroup.toString());
        } catch (error) {
            console.error('Exception when calling popularGoals:', error);
            // Handle exception, such as updating UI to show an error message
        } finally {
            setUserHasSymptoms(true); // Set the user's symptom flag
            console.log('Optin to goal:', currentUserGoalId);
            
            try {
                // Opt the user into the goal on the back end
                await postGoalOptIn(apiUrl, cadeyUserId, currentUserGoalId, true);
            } catch (error) {
                console.error('Exception when calling postGoalOptIn:', error);
            } finally {
                // Set the user's symptom flag
                setUserHasSymptoms(true);

                // Update the optIn value of the goal in state
                // Allows the user to access the goal immediately without a follow up API call
                setGoals(goals.map(goal => {
                    if (goal.userGoalId === currentUserGoalId) {
                        goal.optIn = true;
                    }
                    return goal;
                }));

                setShowAgeGroupModal(false); // Close the modal

                setIsLoading(false); // Hide loading indicator after fetching
            }
        }
    }

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

        <IonModal isOpen={showAgeGroupModal} className="age-group-modal">
            <IonHeader>
                <IonToolbar>
                <IonTitle>Select Age Group</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRow className="age-group-container">
                    <IonText className="child-age-text">Please select your child's age for personalized goals: </IonText>
                    <IonRow className="age-buttons-row">
                        <IonButton 
                            className={`age-group-button ${ageGroup === 1 ? "selected" : ""}`}
                            onClick={() => handleAgeSelection(1)}
                        >
                            0-4
                        </IonButton>
                        <IonButton 
                            className={`age-group-button ${ageGroup === 2 ? "selected" : ""}`}
                            onClick={() => handleAgeSelection(2)}
                        >
                            5-11
                        </IonButton>
                        <IonButton 
                            className={`age-group-button ${ageGroup === 3 ? "selected" : ""}`}
                            onClick={() => handleAgeSelection(3)}
                        >
                            12+
                        </IonButton>
                    </IonRow>
                </IonRow>
            </IonContent>
        </IonModal>

        {goalsLoaded && (
            <IonRow>
                {goals.length > 0 && (
                    <IonText className="subcopy">
                        {!goals.every(goal => goal.optIn === false) ?
                            "Add or remove goals below to get a highly personalized game plan." : 
                            "Didn't see anything you like?"
                        }
                    </IonText>
                )}
            </IonRow>
        )}
        
        {/* Create a list of goals */}
        {(goals.length > 0) && (    
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
        )}
        <IonRow className="concerns-promo">
            <IonText className="subcopy">Fill out your Concerns for more personalized goals.</IonText>
            {/* Button that links to /app/concerns */}
            <IonButton routerLink="/app/concerns">Go to Concerns</IonButton>
        </IonRow>

      </IonContent>
    </IonPage>
  );
};

export default GoalsPage;