import OneSignal from 'onesignal-cordova-plugin';

export function initializeOneSignal(): void {
    console.log('Initializing OneSignal...');
    // Uncomment to set OneSignal device logging to VERBOSE  
    // OneSignal.setLogLevel(6, 0);

    // Cadey project AppID: 9e338438-0d42-44e8-b8f4-3ae40f3665e0
    // "Test 2" project AppID: e62fefab-7bdd-4b34-8095-235d1b16dcea

    OneSignal.setAppId("9e338438-0d42-44e8-b8f4-3ae40f3665e0");
    // Handler for when a user taps on a notification
    OneSignal.setNotificationOpenedHandler(function(jsonData) {
        console.log('notificationOpenedCallback: ', JSON.stringify(jsonData));
    });
}