import {
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { MouseEventHandler } from "react";
import { useSelector } from "react-redux";
import { errorSlice } from "../../features/error/slice";

const HttpErrorModal: React.FC<object> = () => {
  const error = useSelector(({ error }: { error: errorSlice }) => error);

  const { httpError, httpErrorData } = error;
  const { title, body, buttonAction, buttonText } = httpErrorData;

  return (
    <IonModal isOpen={httpError} backdropDismiss={false}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div>{body}</div>

        <IonButton
          expand="full"
          onClick={buttonAction as MouseEventHandler<HTMLIonButtonElement>}
        >
          {buttonText}
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default HttpErrorModal;
