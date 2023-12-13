import React, { useEffect } from 'react';
import { 
    IonModal, 
    IonButton, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonRow,
    IonText,
    IonIcon,
} from '@ionic/react';
// CSS
import './QuizModal.css';
// Contexts
import { useModalContext } from '../../../context/ModalContext';
import { CadeyUserContext } from '../../../main';
import ApiUrlContext from '../../../context/ApiUrlContext';
// API
import { postQuizResponse } from '../../../api/Quiz';
// Icons
import { chevronForwardOutline } from 'ionicons/icons';

export interface QuizModalData {
    quizRequest: quizRequest;
    nextQuestionPossible: boolean;
    previousQuestionInfo: any;
    question: QuizModalQuestion;
}

interface quizRequest {
    cadeyUserId: number;
    clientContext: number;
    entityType: number;
    entityId: number;
}

interface QuizModalQuestion {
    apiOnly_NextQuestion: boolean;
    id: number;
    introMessage: string;
    isRequired: boolean;
    maxChoices: number;
    minChoices: number;
    options: QuizModalQuestionOption[];
    quizId: number;
    text: string;
}

interface QuizModalQuestionOption {
    displayOrder: number;
    id: number;
    label: string;
    optionType: number; // 1 = select, 2 = text
}

export interface QuizResponse {
    optionId: number;
    isSelected: boolean;
    textResponse: string;
}

const QuizModal: React.FC = ({ }) => {

    const { isQuizModalOpen, setQuizModalOpen, quizModalData, setQuizModalData } = useModalContext();
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);

    const [userResponse, setUserResponse] = React.useState<string[]>([]);
    const [quizResponse, setQuizResponse] = React.useState<QuizResponse[]>([]);

    const handleSelection = (response: string) => {
        // If the user has already selected this response, remove it from the userResponse array
        if (userResponse.includes(response)) {
            setUserResponse(userResponse.filter(item => item !== response));
            // return early
            return;
        }
        
        if (quizModalData!.question.maxChoices <= 1) {
            setUserResponse([response]);
        } else {
            setUserResponse([...userResponse, response]);
        }
    }

    const handleSubmission = async () => {
        // For each quiz option, update the quiz response with the user's selection
        // Create an updated responses array based on the current question's options
        const updatedResponses = quizModalData!.question.options.map(option => ({
            optionId: option.id,
            isSelected: userResponse.includes(option.label),
            textResponse: option.label
        }));

        // Merge the new responses with the existing ones in quizResponse
        // This ensures that existing responses are updated, and new ones are added
        const mergedResponses = [...quizResponse];
        updatedResponses.forEach(newResponse => {
            const existingIndex = mergedResponses.findIndex(r => r.optionId === newResponse.optionId);
            if (existingIndex > -1) {
                // Update existing response
                mergedResponses[existingIndex] = newResponse;
            } else {
                // Add new response
                mergedResponses.push(newResponse);
            }
        });

        // Set the updated quizResponse state
        setQuizResponse(mergedResponses);

        // Send the user's response to the API 
        await sendQuizResponse(false, false, mergedResponses);
    }

    const sendQuizResponse = async (skipped: boolean, cancelled: boolean, response: QuizResponse[]) => {
        // Send the user's response to the API
        try {
            const quizSubmissionResponse = await postQuizResponse(
                apiUrl,                                 // API URL
                Number(cadeyUserId),                    // Cadey User ID
                1,                                      // Client Context: Where the user is in the app (1 = VideoDetail)
                quizModalData!.quizRequest.entityId,    // Entity ID (The ID of the video)
                1,                                      // Entity type (1 = video)
                quizModalData!.question.quizId,         // Quiz ID
                quizModalData!.question.id,             // Question ID
                skipped,                                // Question was skipped
                cancelled,                              // Question was cancelled
                response                                // User's response                                  
            );

            // Depending on the API response, update the quiz modal with a new question or complete the quiz
            if (quizSubmissionResponse.quizQuestion !== null) {
                // Update the quiz modal with a new question
                setQuizModalData(quizSubmissionResponse);
            } else {
                // Close the modal
                handleClose();
            }
        } catch (error) {
            console.error('Exception when sending quiz response to the API: ', error);
        }
    }

    function handleClose() {
        // Clear the quiz data
        setQuizModalData(null);
        
        // Close the modal
        setQuizModalOpen(false);
    }

    const handleSkipQuestion = async () => {
        // Send the user's response to the API 
        await sendQuizResponse(true, false, []);
    }

    const handleCancelQuiz = async () => {
        // Send the user's response to the API
        await sendQuizResponse(false, true, []);
    }

    useEffect(() => {
        // Reset user responses and quiz responses when new quiz data is loaded
        setUserResponse([]);
        setQuizResponse([]);
    
        // Optional: Log the new quiz data
        if (quizModalData) {
            console.log("QuizModalData: ", quizModalData);
        }
    }, [quizModalData]);

    return (
        <IonModal isOpen={isQuizModalOpen} className="quiz-modal" onDidDismiss={handleClose}>
            {quizModalData && quizModalData.question.id !== 0 && (
                <IonContent>
                    <IonRow className="quiz-content">
                        {quizModalData.question.isRequired !== true && (
                            <IonToolbar>
                                <IonText className="cancel" slot="start" onClick={() => handleCancelQuiz()}>
                                    Cancel
                                </IonText>
                                <IonText className="skip" slot="end" onClick={() => handleSkipQuestion()}>
                                    Skip question
                                </IonText>
                            </IonToolbar>
                        )}
                        <IonRow className="explanation">
                            <IonText className="explanation-text">{quizModalData.question.introMessage}</IonText>
                        </IonRow>
                        <IonRow className="question">
                            <IonText className="question-text">{quizModalData.question.text}</IonText>
                        </IonRow>
                        <IonRow className="response-explanation">
                            <IonText className="response-explanation-text">{(quizModalData.question.maxChoices > 1) ? "Choose all that apply" : "Choose one"}</IonText>
                        </IonRow>
                        <IonRow className="responses">
                            {quizModalData.question.options.map((option, index) => (
                                <IonButton
                                    key={index}
                                    className={`response ion-text-wrap ${userResponse.includes(option.label) ? 'selected' : ''}`}
                                    onClick={() => handleSelection(option.label)}
                                >
                                    {option.label}
                                </IonButton>
                            ))}
                        </IonRow>
                        <IonRow className="continue-row">
                            <IonButton 
                                className="continue-button" 
                                disabled={userResponse.length === 0}
                                onClick={() => handleSubmission()}
                            >
                                {quizModalData.nextQuestionPossible ? (
                                    <>
                                        Next <IonIcon icon={chevronForwardOutline} className="forward-icon" />
                                    </>
                                ) : (
                                    'Finish'
                                )}
                            </IonButton>
                        </IonRow>
                    </IonRow>
                </IonContent>
            )}
        </IonModal>
    );
};

export default QuizModal;
