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
import { useHistory } from 'react-router-dom';
// CSS
import './QuizModal.css';
// Contexts
import { useModalContext } from '../../../context/ModalContext';
import { CadeyUserContext } from '../../../main';
import ApiUrlContext from '../../../context/ApiUrlContext';
import { useTabContext } from '../../../context/TabContext';
import { usePathContext } from '../../../context/PathContext';
// API
import { postQuizResponse } from '../../../api/Quiz';
// Icons
import { chevronForwardOutline } from 'ionicons/icons';

export interface QuizModalData {
    quizRequest: QuizRequest;
    nextQuestionPossible: boolean | null;
    previousQuestionInfo: {
        previousQuestionId: number;
        responseUserFactId: number;
    } | null;
    question: QuizModalQuestion;
}

interface QuizRequest {
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
    subCopy: string | null;
}

interface QuizModalQuestionOption {
    displayOrder: number;
    id: number;
    label: string;
    optionType: number; // 1 = select, 2 = text
    displayIfOptionIdSelected: string | null;
    imageUrl: string | null;
}

export interface QuizResponse {
    optionId: number;
    isSelected: boolean;
    textResponse: string;
}

export interface QuizSubmissionResponse {
    entityId: number;
    entityType: number;
    quizRequestResponseModel: QuizModalData;
}

const QuizModal: React.FC = ({ }) => {

    const { isQuizModalOpen, setQuizModalOpen, quizModalData, setQuizModalData } = useModalContext();
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);
    const { pathId } = usePathContext();

    const [userResponse, setUserResponse] = React.useState<string[]>([]);
    const [selectedOptionIds, setSelectedOptionIds] = React.useState<number[]>([]);
    const [textResponses, setTextResponses] = React.useState<{ [key: number]: string }>({}); // Key = optionId, Value = text response
    const [quizResponse, setQuizResponse] = React.useState<QuizResponse[]>([]);

    const history = useHistory();

    const { setIsTabBarVisible } = useTabContext();

    const handleSelection = (response: string) => {
        // If the user has already selected this response, remove it from the userResponse array
        if (userResponse.includes(response)) {
            setUserResponse(userResponse.filter(item => item !== response));

            setSelectedOptionIds(selectedOptionIds.filter(item => item !== quizModalData!.question.options.find(option => option.label === response)!.id));
            
            // return early
            return;
        }
        
        if (quizModalData!.question.maxChoices <= 1) {
            setUserResponse([response]);
        } else {
            setUserResponse([...userResponse, response]);
        }
    }

    const handleTextChange = (optionId: number, text: string) => {
        
        // Trim the text to 300 characters
        if (text.length > 300) {
            text = text.slice(0, 300);
        }

        setTextResponses({
            ...textResponses,
            [optionId]: text
        });
    };

    const isAnyTextInputFilled = () => {
        return Object.values(textResponses).some(text => text.trim() !== '');
    };

    useEffect(() => {
        console.log('quizModalData', quizModalData);
        console.log('userResponse', userResponse);
    }, [quizModalData, userResponse]);
    

    const handleSubmission = async () => {
        // Create an updated responses array based on the current question's options
        const updatedResponses = quizModalData!.question.options.map(option => {
            if (option.optionType === 1) {
                return {
                    optionId: option.id,
                    isSelected: userResponse.includes(option.label),
                    textResponse: option.label
                };
            } else if (option.optionType === 2) {
                return {
                    optionId: option.id,
                    isSelected: textResponses[option.id] !== undefined,
                    textResponse: textResponses[option.id] || ''
                };
            } else {
                // Return null for unhandled option types
                return null;
            }
        }).filter(response => response !== null); // Filter out null responses
    
        // Merge the new responses with the existing ones in quizResponse
        const mergedResponses = [...quizResponse];
        updatedResponses.forEach(newResponse => {
            const existingIndex = mergedResponses.findIndex(r => r.optionId === newResponse!.optionId);
            if (existingIndex > -1) {
                // Update existing response
                mergedResponses[existingIndex] = newResponse!;
            } else {
                // Add new response
                mergedResponses.push(newResponse!);
            }
        });
    
        // Set the updated quizResponse state
        setQuizResponse(mergedResponses);
    
        // Send the user's response to the API 
        await sendQuizResponse(false, false, mergedResponses);
    };

    const sendQuizResponse = async (skipped: boolean, cancelled: boolean, response: QuizResponse[]) => {
        // Send the user's response to the API
        try {
            const quizSubmissionResponse: QuizSubmissionResponse = await postQuizResponse(
                apiUrl,                                     // API URL
                Number(cadeyUserId),                        // Cadey User ID
                quizModalData!.quizRequest.clientContext,   // Client Context: Where the user is in the app (1 = VideoDetail)
                quizModalData!.quizRequest.entityId,        // Entity ID (The ID of the video)
                quizModalData!.quizRequest.entityType,      // Entity type (1 = video)
                quizModalData!.question.quizId,             // Quiz ID
                quizModalData!.question.id,                 // Question ID
                skipped,                                    // Question was skipped
                cancelled,                                  // Question was cancelled
                response                                    // User's response                                  
            );

            console.log('quizSubmissionResponse: ', quizSubmissionResponse);
            // console.log('Quiz response question ID: ', quizSubmissionResponse.quizRequestResponse.question.id);

            // Depending on the API response, update the quiz modal with a new question or complete the quiz
            if (quizSubmissionResponse.quizRequestResponseModel.question !== null && quizSubmissionResponse.quizRequestResponseModel.question !== undefined && quizSubmissionResponse.quizRequestResponseModel.question.id !== 0) {
                console.log('Got a new question!');
                // Update the quiz modal with a new question
                setQuizModalData(quizSubmissionResponse.quizRequestResponseModel);
            } else {
                console.log('Quiz complete!');
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
        
        // If the user just completed the welcome sequence, route them to the home page
        if (quizModalData?.question.quizId === 6) {
            setIsTabBarVisible(true);

            history.push('/App/Paths/PathDetail?id=' + pathId);
        }

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
        setTextResponses({});
    
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
                        {quizModalData.question.subCopy && (
                            <IonRow className="response-explanation">
                                <IonText className="response-explanation-text">
                                    {quizModalData.question.subCopy}
                                </IonText>
                            </IonRow>    
                        )}
                        <IonRow className="responses">
                            {quizModalData.question.options.map((option, index) => {
                                // Check the type of option and render accordingly
                                if (option.optionType === 1) {
                                    // If the option type is 1, show a button. If there is an image, show the image as well
                                    return (
                                        <IonButton
                                            key={index}
                                            className={`response ion-text-wrap ${userResponse.includes(option.label) ? 'selected' : ''}`}
                                            onClick={() => handleSelection(option.label)}
                                        >
                                            {/* If there's an image, show it here */}
                                            {option.imageUrl && (
                                                <img src={option.imageUrl} className="response-image" />
                                            )}
                                            <div className="button-text">{option.label}</div>
                                        </IonButton>
                                    );
                                } else if (option.optionType === 2 && option.displayIfOptionIdSelected === null) {
                                    // If the option type is 2, and displayIfOptionIdSelected is null, show a text input
                                    return (
                                        <IonRow key={index} className="text-input-row">
                                            <textarea
                                                className="text-input"
                                                placeholder={option.label}
                                                onFocus={(e) => e.target.placeholder = ''}
                                                onBlur={(e) => e.target.placeholder = option.label}
                                                onChange={(e) => handleTextChange(option.id, e.target.value)}
                                            />
                                        </IonRow>
                                    );
                                } else if (option.optionType === 2 && option.displayIfOptionIdSelected !== null) {
                                    // If the option type is 2, and displayIfOptionIdSelected is not null, display a text field if selectedOptionIds includes one of the displayIfOptionIdSelected values
                                    // displayIfOptionIdSelected is a comma-separated string of option IDs
                                    const displayIfOptionIds = option.displayIfOptionIdSelected.split(',').map(id => Number(id));
                                    if (displayIfOptionIds.some(id => selectedOptionIds.includes(id))) {
                                        return (
                                            <IonRow key={index} className="text-input-row">
                                                <textarea
                                                    className="text-input"
                                                    placeholder={option.label}
                                                    onFocus={(e) => e.target.placeholder = ''}
                                                    onBlur={(e) => e.target.placeholder = option.label}
                                                    onChange={(e) => handleTextChange(option.id, e.target.value)}
                                                />
                                            </IonRow>
                                        );
                                    }
                                }

                                // Return null for unhandled option types
                                return null;
                            })}
                        </IonRow>

                        <IonRow className="continue-row">
                            <IonButton 
                                className="continue-button" 
                                disabled={userResponse.length === 0 && !isAnyTextInputFilled()}
                                onClick={() => handleSubmission()}
                            >
                                {quizModalData.nextQuestionPossible ? (
                                    <>
                                        Next
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
