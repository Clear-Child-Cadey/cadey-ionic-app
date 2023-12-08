import React from 'react';
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
import { postCadeyUserAgeGroup } from '../../../api/AgeGroup';
// Icons
import { chevronForwardOutline } from 'ionicons/icons';

interface QuizModalProps {
    questionExplanation: string;
    question: string;
    responseExplanation: string;
    options: string[];
    questionType: string;
}

const QuizModal: React.FC<QuizModalProps> = ({
    questionExplanation,
    question,
    responseExplanation,
    options,
    questionType,
}) => {

    const { isQuizModalOpen, setQuizModalOpen } = useModalContext();
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);

    const [userResponse, setUserResponse] = React.useState<string[]>([]);
    const [anotherQuestion, setAnotherQuestion] = React.useState<boolean>(true);

    const handleSelection = (response: string) => {
        // If the user has already selected this response, remove it from the userResponse array
        if (userResponse.includes(response)) {
            setUserResponse(userResponse.filter(item => item !== response));
            // return early
            return;
        }
        
        if (questionType === 'single') {
            setUserResponse([response]);
        } else {
            setUserResponse([...userResponse, response]);
        }
    }

    function handleSubmission() {
        // Send the user's response to the API
        try {
            //await postCadeyUserAgeGroup(apiUrl, cadeyUserId, ageGroup.toString());
        } catch (error) {
            console.error('Exception when sending quiz response to the API: ', error);
        }

        // Depending on the API response, update the quiz modal with a new question or complete the quiz
        if (1 === 1) {
            setAnotherQuestion(true);
        }

        if (anotherQuestion === true) {
            // Update the quiz modal with a new question
        } else {
            // Close the modal
            handleClose();
        }
    }

    function handleClose() {
        // Close the modal
        setQuizModalOpen(false);
    }

    function handleSkipQuestion() {
        // Ask the API what to do next
        // If the API says to show another question, update the quiz modal with a new question
        // If the API says to end the quiz, call the callback function with the selected age group
        // Close the modal
        handleClose();
    }

    return (
        <IonModal isOpen={isQuizModalOpen} className="quiz-modal" onDidDismiss={handleClose}>
            <IonContent>
                <IonRow className="quiz-content">
                    <IonToolbar>
                        <IonText className="cancel" slot="start" onClick={() => handleClose()}>
                            Cancel
                        </IonText>
                        <IonText className="skip" slot="end" onClick={() => handleSkipQuestion()}>
                            Skip question
                        </IonText>
                    </IonToolbar>
                    <IonRow className="explanation">
                        <IonText className="explanation-text">{questionExplanation}</IonText>
                    </IonRow>
                    <IonRow className="question">
                        <IonText className="question-text">{question}</IonText>
                    </IonRow>
                    <IonRow className="response-explanation">
                        <IonText className="response-explanation-text">{responseExplanation}</IonText>
                    </IonRow>
                    <IonRow className="responses">
                        {options.map((option, index) => (
                            <IonButton
                                key={index}
                                className={`response ${userResponse.includes(option) ? 'selected' : ''}`}
                                onClick={() => handleSelection(option)}
                            >
                                {option}
                            </IonButton>
                        ))}
                    </IonRow>
                    <IonRow className="continue-row">
                        <IonButton 
                            className="continue-button" 
                            disabled={userResponse.length === 0}
                            onClick={() => handleSubmission()}
                        >
                            {/* "Next >"" button */}
                            Next <IonIcon icon={chevronForwardOutline} className="forward-icon" />
                        </IonButton>
                    </IonRow>
                </IonRow>
            </IonContent>
        </IonModal>
    );
};

export default QuizModal;
