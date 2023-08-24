import { useContext } from 'react';
import OneSignal from 'onesignal-cordova-plugin';
import { setExternalUserId } from './SetExternalUserId';
import { CadeyUserContext } from '../../main';

export function initializeOneSignal(onNotificationOpened: (data: any) => void): void {
    console.log('Initializing OneSignal...');
    // Uncomment to set OneSignal device logging to VERBOSE  
    // OneSignal.setLogLevel(6, 0); // 6 = VERBOSE, 0 = NONE

    // Cadey project AppID: 9e338438-0d42-44e8-b8f4-3ae40f3665e0
    // "Test 2" project AppID: e62fefab-7bdd-4b34-8095-235d1b16dcea

    OneSignal.setAppId("9e338438-0d42-44e8-b8f4-3ae40f3665e0");
    // Handler for when a user taps on a notification
    console.log('Setting notificationOpenedHandler...');
    if (window.cordova) {
        OneSignal.setNotificationOpenedHandler(function(jsonData) {
            console.log('notificationOpenedCallback: ', JSON.stringify(jsonData));
            onNotificationOpened(jsonData);
        });
    }

    const { oneSignalId } = useContext(CadeyUserContext);

    // Check if the app is running in a browser or on a device
    if (window.cordova) {
        // Set the external user ID for OneSignal
        setExternalUserId(oneSignalId.toString());
    } else {
        // Don't interact with OneSignal (which relies on Cordova)
    }
}