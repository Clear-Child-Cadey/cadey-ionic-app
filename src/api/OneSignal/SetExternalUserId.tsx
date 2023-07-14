import OneSignal from 'onesignal-cordova-plugin';

export function setExternalUserId(userId: string): void {
    // Send our userId to OneSignal
    let externalUserId = userId; 

    // Setting External User Id with Callback Available in SDK Version 2.11.2+
    OneSignal.setExternalUserId(externalUserId, (results) => {
        // The results will contain push and email success statuses
        console.log('Results of setting external user id');
        console.log(results);
    });
}