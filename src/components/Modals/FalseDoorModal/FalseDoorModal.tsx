import React, { useState, useContext } from 'react';
import { 
  IonModal, 
  IonButton, 
  IonContent 
} from '@ionic/react';
import './FalseDoorModal.css';
import { logFalseDoorResponse } from '../../../api/UserFacts';
import { CadeyUserContext } from '../../../main';
import ApiUrlContext from '../../../context/ApiUrlContext';

interface ModalProps {
  falseDoorQuestionId: string;
  iconUrl: string;
  copy: string;
  yesResponse: string;
  noResponse: string;
  thankYouIconUrlYes: string;
  thankYouIconUrlNo: string;
  thankYouCopyYes: string;
  thankYouCopyNo: string;
  thankYouButtonText: string;

  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onUserResponse: (userResponse: boolean) => void;
}

const FalseDoorModal: React.FC<ModalProps> = ({ falseDoorQuestionId, iconUrl, copy, yesResponse, noResponse, thankYouIconUrlYes, thankYouIconUrlNo, thankYouCopyYes, thankYouCopyNo, thankYouButtonText, isOpen, setIsOpen, onUserResponse }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userChoice, setUserChoice] = useState<boolean | null>(null); // Store the user's choice

  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const apiUrl = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/api/cadeydata/userfact`

  const handleUserResponse = (userChoice: boolean) => {
    setUserChoice(userChoice); // Store the user's choice in state
    setShowConfirmation(true); // Show the confirmation screen
    
    // Invoke the 'onUserResponse' callback passed from the parent component for whatever it needs to do
    onUserResponse(userChoice); 
    
    // Log the user's response
    const userChoiceStr = userChoice ? 'yes' : 'no';
    const falseDoorQuestionIdStr = String(falseDoorQuestionId);
    logFalseDoorResponse(cadeyUserId, userFactUrl, falseDoorQuestionIdStr, userChoiceStr);
  };

  const handleClose = () => {
    setIsOpen(false); // Close the modal
    setUserChoice(null); // Reset user choice
    setShowConfirmation(false); // Reset to initial state
  }

  return (
    <IonModal 
      isOpen={isOpen}
      backdropDismiss={false}
    >
      <IonContent className="ion-padding modal-container">
        {!showConfirmation ? (
          <>
            <img 
              src={iconUrl} 
              alt="False Door Icon"
              className="falseDoorIcon"
              style={{ width: "108px", height: "108px" }}
            />
            <p>{copy}</p>
            <div className="modal-button-container">
              <IonButton 
                expand="block" 
                onClick={() => handleUserResponse(true)}>{yesResponse}
              </IonButton>
              <IonButton 
                fill="clear" 
                expand="block" 
                onClick={() => handleUserResponse(false)}>{noResponse}
              </IonButton>
            </div>
          </>
        ) : (
          <>
            <img 
              src={userChoice ? thankYouIconUrlYes : thankYouIconUrlNo} 
              alt="False Door Icon"
              className="falseDoorIcon"
              style={{ width: "108px", height: "108px" }}
            />
            <p>{userChoice ? thankYouCopyYes : thankYouCopyNo}</p>
            <div className="modal-button-container">
              <IonButton 
                expand="block" 
                onClick={handleClose}>{thankYouButtonText}
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonModal>
  );
};

export default FalseDoorModal;
