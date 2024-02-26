import {
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { MouseEventHandler } from 'react';
import { useSelector } from 'react-redux';
import { httpErrorSlice } from '../../features/httpError/slice';

const HttpErrorModal: React.FC<object> = () => {
  const { error, errorModalData } = useSelector(
    (state: { httpError: httpErrorSlice }) => {
      return state.httpError;
    },
  );

  const { title, body, actionType, buttonText } = errorModalData;
  const buttonAction = () => {
    switch (actionType) {
      case 'RELOAD_PAGE':
        history.go(0);
        break;

      default:
        break;
    }
  };
  return (
    <IonModal isOpen={error} backdropDismiss={false}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <div>{body}</div>

        <IonButton
          expand='full'
          onClick={buttonAction as MouseEventHandler<HTMLIonButtonElement>}
        >
          {buttonText}
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default HttpErrorModal;
