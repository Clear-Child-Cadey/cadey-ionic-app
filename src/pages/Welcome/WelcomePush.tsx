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
    IonPage,
} from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
// CSS
import './WelcomePush.css';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useModalContext } from '../../context/ModalContext';
// API
import { postCadeyUserAgeGroup } from '../../api/AgeGroup';
import OneSignal from 'onesignal-cordova-plugin';
import { requestNotificationPermission } from '../../api/OneSignal/RequestPermission';
// Icons

const WelcomePush: React.FC = () => {
    
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);

    const history = useHistory();

    const { setQuizModalOpen } = useModalContext();

    const requestNotificationPermission = () => {
        console.log('Processing notification permission request');
        return new Promise((resolve) => {
            OneSignal.getDeviceState((deviceState) => {
                const hasPermission = deviceState.hasNotificationPermission;
                console.log('Device state: ', deviceState);
                if (hasPermission) {
                    // User has already granted permission
                    resolve(true);
                    console.log("Notification permission already granted.");
                } else {
                    console.log("Notification permission not granted. Prompting user.");
                    // Request permission from the user
                    OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
                        if (accepted) {
                            console.log("Notification permission granted.");
                            resolve(true);
                        } else {
                            console.log("Notification permission not granted.");
                            resolve(false);
                        }
                    });
                }
            });
        });
    };

    const handlePushSelection = async (optin: boolean) => {
        console.log('Starting push selection. Optin: ', optin);
        if (optin) {
            // User opted in, request push notification permission (if we're on a device)
            
            console.log('Checking for cordova');

            if (window.cordova) {
                try {

                    console.log('Requesting notification permission');
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
    };

    return (
        <IonPage className="welcome-push" >
            <IonContent fullscreen>
                <IonHeader class="header">
                    <IonToolbar className="header-toolbar">
                        <h2>Turn on notifications to get the most out of Cadey</h2>
                    </IonToolbar>
                </IonHeader>
                <div className='optin-icon'>
                    <img src="assets/svgs/bell.svg" />
                </div>
                <IonRow className="continue-row">
                    <div className='yes continue-container'>
                        <IonButton 
                            className='yes push-button'
                            onClick={() => handlePushSelection(true)}
                        >
                            Enable notifications
                        </IonButton>
                    </div>
                    <div className='no continue-container'>
                        <IonButton 
                            className='no push-button'
                            onClick={() => handlePushSelection(false)}
                        >
                            Not now
                        </IonButton>
                    </div>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default WelcomePush;
