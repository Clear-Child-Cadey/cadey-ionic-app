import React, { useState } from 'react';
import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { iconLibrary, IconName } from '../../icons/iconLibrary';
import './FalseDoorModal.css';

// TODO: Update this to use icons from S3 bucket
interface ModalProps {
  iconUrl: string;
  copy: string;
  yesResponse: string;
  noResponse: string;
  thankYouIconUrl: string;
  thankYouCopy: string;
  thankYouButtonText: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onUserResponse: (userResponse: boolean) => void;
}

const FalseDoorModal: React.FC<ModalProps> = ({ iconUrl, copy, yesResponse, noResponse, thankYouIconUrl, thankYouCopy, thankYouButtonText, isOpen, setIsOpen, onUserResponse }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleUserResponse = (userChoice: boolean) => {
    setShowConfirmation(true);
    onUserResponse(userChoice);
  };

  const handleClose = () => {
    setIsOpen(false);
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
            <object data={iconUrl} type="image/svg+xml" className="falseDoorIcon" style={{ width: "108px", height: "108px" }}>
              <p>Icon</p>
            </object>
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
            <object data={thankYouIconUrl} type="image/svg+xml" className="falseDoorIcon" style={{ width: "108px", height: "108px" }}>
              <p>Icon</p>
            </object>
            <p>{thankYouCopy}</p>
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
