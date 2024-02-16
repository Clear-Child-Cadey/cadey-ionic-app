import {
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useModalContext } from "../../context/ModalContext";

export interface GenericModalData {
  title: string;
  body: string;
  buttonText: string;
  buttonAction: Function;
}

const GenericModal: React.FC<GenericModalData | {}> = () => {
  const { isGenericModalOpen, genericModalData } = useModalContext();
  const { title, body, buttonText, buttonAction } = genericModalData || {};
  return (
    <IonModal isOpen={isGenericModalOpen} backdropDismiss={false}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>{body}</p>
        <IonButton expand="full" onClick={() => buttonAction && buttonAction()}>
          {buttonText}
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default GenericModal;
