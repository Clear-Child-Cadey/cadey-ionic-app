import OneSignal from "onesignal-cordova-plugin";

export function requestNotificationPermission(): void {
    // Prompts the user for notification permissions.
    OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: ", accepted);
    });
}