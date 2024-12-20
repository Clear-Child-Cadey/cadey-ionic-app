import {
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonRow,
  IonPage,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// CSS
import './WelcomePush.css';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useModalContext } from '../../context/ModalContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import OneSignal from 'onesignal-cordova-plugin';
import { requestNotificationPermission } from '../../api/OneSignal/RequestPermission';
import { logUserFact } from '../../api/UserFacts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

import { setQuizModalOpen as setQuizModalOpenRx } from '../../features/video/slice';

const WelcomePush: React.FC = () => {
  const dispatch = useDispatch();

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId || 0;
  });
  const { apiUrl } = React.useContext(ApiUrlContext);
  const { setCurrentAppPage, setCurrentBasePage } = useAppPage();

  const history = useHistory();

  const { setQuizModalOpen } = useModalContext();

  // When the component loads
  useEffect(() => {
    setCurrentAppPage('Welcome - Push Optin');
    setCurrentBasePage('Welcome - Push Optin');

    // appPageNavigation user fact
    logUserFact({
      cadeyUserId: cadeyUserId,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Welcome - Push Optin',
    });
  }, [apiUrl]);

  const requestNotificationPermission = () => {
    return new Promise((resolve) => {
      OneSignal.getDeviceState((deviceState) => {
        const hasPermission = deviceState.hasNotificationPermission;
        if (hasPermission) {
          // User has already granted permission
          resolve(true);
        } else {
          // Request permission from the user
          OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
            if (accepted) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
      });
    });
  };

  const handlePushSelection = async (optin: boolean) => {
    // Log a user fact
    logUserFact({
      cadeyUserId: cadeyUserId,
      userFactTypeName: 'UserTap',
      appPage: 'Welcome - Push Optin',
      detail1: 'Welcome - Push Optin',
      detail2: optin ? 'Optin Button' : 'Optout Button',
    });

    if (optin) {
      // User opted in, request push notification permission (if we're on a device)

      if (window.cordova) {
        try {
          await requestNotificationPermission();
          // Permission granted or already had permission
        } catch (error) {
          // Permission not granted or an error occurred
          console.log(error);
        }
      }
    }

    // Proceed to open the quiz modal regardless of the push permission state
    setQuizModalOpen(true);
    dispatch(setQuizModalOpenRx(true));
  };

  return (
    <IonPage className='welcome-push'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>Turn on notifications to get the most out of Cadey</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='optin-icon'>
          <img src='assets/svgs/bell.svg' />
        </div>
        <IonRow className='continue-row'>
          <div className='yes continue-container'>
            <IonButton
              className='yes push-button'
              onClick={() => handlePushSelection(true)}
            >
              Enable notifications
            </IonButton>
          </div>
          <div className='no continue-container'>
            <a
              className='no push-button'
              onClick={() => handlePushSelection(false)}
            >
              Not now
            </a>
          </div>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePush;
