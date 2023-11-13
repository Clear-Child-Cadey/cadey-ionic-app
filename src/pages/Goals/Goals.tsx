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
import { chevronForwardOutline, checkmarkCircleOutline, closeCircleOutline, caretDownOutline } from 'ionicons/icons';
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
    const [selectedAgeGroup, setSelectedAgeGroup] = useState(0);
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

        setIsLoading(true); // Show loading indicator while fetching
    
        try {
            // Record a popular symptom age group for the user
            await popularSymptomAge(apiUrl, cadeyUserId, selectedAgeGroup.toString());
        } catch (error) {
            console.error('Exception when calling popularGoals:', error);
            // Handle exception, such as updating UI to show an error message
        } finally {
            setUserHasSymptoms(true); // Set the user's symptom flag
            
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

    const handleClose = () => {
        setShowAgeGroupModal(false);
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
                            <IonTitle style={{ textAlign: 'left', paddingLeft: 16 }}>Age</IonTitle>
                            <IonButton className="close-button" slot="end" onClick={() => handleClose()}>
                                Close
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonRow className="age-group-container">
                            <IonText className="child-age-text">Please select your child's age for personalized goals: </IonText>
                            <IonRow className="age-buttons-row">
                                <IonButton 
                                    className={`age-group-button ${selectedAgeGroup === 1 ? "selected" : ""}`}
                                    onClick={() => setSelectedAgeGroup(1)}
                                >
                                    0-4
                                </IonButton>
                                <IonButton 
                                    className={`age-group-button ${selectedAgeGroup === 2 ? "selected" : ""}`}
                                    onClick={() => setSelectedAgeGroup(2)}
                                >
                                    5-11
                                </IonButton>
                                <IonButton 
                                    className={`age-group-button ${selectedAgeGroup === 3 ? "selected" : ""}`}
                                    onClick={() => setSelectedAgeGroup(3)}
                                >
                                    12+
                                </IonButton>
                            </IonRow>
                            <IonRow className="continue-row">
                                <IonButton 
                                    className="continue-button" 
                                    disabled={selectedAgeGroup === 0}
                                    onClick={() => handleAgeSelection(selectedAgeGroup)}
                                >
                                    Continue
                                </IonButton>
                            </IonRow>
                        </IonRow>
                    </IonContent>
                </IonModal>
                
                {/* Create a list of goals */}
                {(goals.length > 0) && (
                    <>
                        {(goals.filter(goal => goal.optIn === true).length > 0) && (
                            <>
                                <IonRow className="goals-header">
                                    <IonText className="subcopy">LOREM IPSUM DOLOR Goals you're working on</IonText>
                                </IonRow>
                            
                                {/* Goals you've taken action on (optIn is not null) */}
                                <IonList>
                                    {goals.filter(goal => goal.optIn !== null).map((goal, index) => (
                                        <IonItem 
                                        key={index} 
                                        className={`goal ${goal.optIn === false ? 'hidden' : ''}`}
                                        onClick={() => onForward(goal)}
                                        >
                                        <IonLabel>
                                            <h3>{goal.title}</h3>
                                            <p>Symptom: {goal.symptom} - {goal.videos.length} videos</p>
                                        </IonLabel>
                                        <IonIcon 
                                            icon={chevronForwardOutline} 
                                            className='forward icon' 
                                        />
                                        </IonItem>
                                    ))}
                                </IonList>
                            </>
                        )}

                        {(goals.filter(goal => goal.optIn === null).length > 0) && (
                            <>
                                <IonRow className="goals-header">
                                    <IonText className="subcopy">LOREM IPSUM DOLOR Goals you haven't taken action on</IonText>
                                </IonRow>
                            
                                {/* Goals you have not taken action on (optIn is null) */}
                                <IonList>
                                    {goals.filter(goal => goal.optIn === null).map((goal, index) => (
                                        <IonItem key={index} className="goal">
                                        <IonLabel>
                                            <h3>{goal.title}</h3>
                                            <p>Symptom: {goal.symptom} - {goal.videos.length} videos</p>
                                        </IonLabel>
                                        <div className="optin-status">
                                            <IonIcon 
                                            icon={checkmarkCircleOutline} 
                                            className="check icon" 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents IonItem's onClick
                                                onOptin(goal.userGoalId);
                                            }}
                                            />
                                            <IonIcon 
                                            icon={closeCircleOutline} 
                                            className="x icon"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents IonItem's onClick
                                                onOptout(goal.userGoalId);
                                            }}
                                            />
                                        </div>
                                        </IonItem>
                                    ))}
                                </IonList>    
                            </>    
                        )}
                    </>
                )}

                
                {/* If there are no goals, show copy and a CTA to Concerns */}
                {goalsLoaded && goals.every(goal => goal.optIn === false) && (
                    <IonRow className="concerns-promo">
                        <IonText className="subcopy">Fill out your Concerns for more personalized goals.</IonText>
                        {/* Button that links to /app/concerns */}
                        <IonButton routerLink="/app/concerns">Go to Concerns</IonButton>
                    </IonRow>
                )}

                <IonRow className="concerns-indicator">
                    <IonText className="subcopy">Nothing doing? Check out the concerns tab</IonText>
                    {/* Down arrow pointing at concerns */}
                    <IonIcon icon={caretDownOutline} className="down-icon" />
                </IonRow>
                
            </IonContent>
        </IonPage>
    );
};

export default GoalsPage;