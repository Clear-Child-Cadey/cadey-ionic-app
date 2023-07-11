import React, { createContext, useState, useEffect } from 'react';
import { IonLoading, isPlatform } from '@ionic/react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Contexts
import DeviceIdContext from './context/DeviceIdContext';
import ApiUrlContext from './context/ApiUrlContext';
import { HomeTabVisibilityContext } from './context/TabContext';
// Functions
import getAppData from './api/AppOpen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/main.css';

// OneSignal Library (Used for Push Notifications)
import OneSignal from 'onesignal-cordova-plugin';

// UUID Library (Used to generate a unique ID for the device)
import { v4 as uuidv4 } from 'uuid';

// Generate a unique ID for the device
let cadeyUserDeviceId = localStorage.getItem('cadey_user_device_id');
if (!cadeyUserDeviceId) {
  cadeyUserDeviceId = uuidv4();
  localStorage.setItem('cadey_user_device_id', cadeyUserDeviceId);
}

// create context for cadeyUserId and minimumSupportedVersion
export const CadeyUserContext = createContext<{
  cadeyUserId: string;
  minimumSupportedVersion: string;
}>({
  cadeyUserId: "",
  minimumSupportedVersion: "",
});

// --------------------------------------------------
// Initialize Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getPerformance } from "firebase/performance";
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration information
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase Web Config
const firebaseWebConfig = {
  apiKey: "AIzaSyBcqwDAbWGh25wog7XpbV9gtjV4HEA_Fys",
  authDomain: "cadeylite.firebaseapp.com",
  projectId: "cadeylite",
  storageBucket: "cadeylite.appspot.com",
  messagingSenderId: "743363017370",
  appId: "1:743363017370:web:3e1d427d4c85895e73bd23",
  measurementId: "G-G2QZMXWEVS"
};

// Firebase iOS Config
const firebaseIosConfig = {
  apiKey: "AIzaSyBcqwDAbWGh25wog7XpbV9gtjV4HEA_Fys",
  authDomain: "cadeylite.firebaseapp.com",
  projectId: "cadeylite",
  storageBucket: "cadeylite.appspot.com",
  messagingSenderId: "743363017370",
  appId: "1:743363017370:ios:889dbed9707252a473bd23",
  measurementId: "G-G2QZMXWEVS"
};

// Firebase Android Config
const firebaseAndroidConfig = {
  apiKey: "AIzaSyBcqwDAbWGh25wog7XpbV9gtjV4HEA_Fys",
  authDomain: "cadeylite.firebaseapp.com",
  projectId: "cadeylite",
  storageBucket: "cadeylite.appspot.com",
  messagingSenderId: "743363017370",
  appId: "1:743363017370:android:a2df0faaa1378f9673bd23",
  measurementId: "G-G2QZMXWEVS"
};

// Initialize Firebase
const webApp = initializeApp(firebaseWebConfig, "web");
const iosApp = initializeApp(firebaseIosConfig, "ios");
const androidApp = initializeApp(firebaseAndroidConfig, "android");
const webAnalytics = getAnalytics(webApp);
const iosAnalytics = getAnalytics(iosApp);
const androidAnalytics = getAnalytics(androidApp);

// Initialize Performance Monitoring and get a reference to the service
// const webPerf = getPerformance(webApp);
// const iosPerf = getPerformance(iosApp);
// const androidPerf = getPerformance(androidApp);

// TODO: Crashlytics - this still isn't working
// Best link I've found so far: https://github.com/capacitor-community/firebase-crashlytics
// Ran into dependency issues with the above link though

// --------------------------------------------------

// --------------------------------------------------
// // OneSignal Library (Used for Push Notifications)
// // Check if the app is running in a browser or on a device
// if (window.cordova) {
//   // Cordova plugins are ready
//   // Initialize OneSignal (Push Notifications Platform)
//   OneSignalInit();

//   // Call this function when your app starts
//   function OneSignalInit(): void {
//     // Uncomment to set OneSignal device logging to VERBOSE  
//     // OneSignal.setLogLevel(6, 0);

//     OneSignal.setAppId("9e338438-0d42-44e8-b8f4-3ae40f3665e0");
//     OneSignal.setNotificationOpenedHandler(function(jsonData) {
//         console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
//     });

//     // Prompts the user for notification permissions.
//     // TODO: Since this shows a generic native prompt, we recommend instead 
//     // using an In-App Message to prompt for notification permission (See step 7) 
//     // to better communicate to your users what notifications they will get.
//     OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
//         console.log("User accepted notifications: " + accepted);
//     });
//   }
// } else {
//   // Don't load OneSignal (which relies on Cordova)
// }
// --------------------------------------------------

function MainComponent() {
  const apiUrl = React.useContext(ApiUrlContext);

  const [cadeyUserId, setCadeyUserId] = useState("");
  const [minimumSupportedVersion, setMinimumSupportedVersion] = useState("");
  const [newVideos, setNewVideos] = useState<any[]>([]);
  const [playedVideos, setPlayedVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHomeTabVisible, setIsHomeTabVisible] = useState(false);

  // call API to get user details, app version info and video data the first time the app loads
  useEffect(() => {
    const fetchData = async () => {
      await getAppData(setCadeyUserId, setMinimumSupportedVersion, apiUrl, setIsHomeTabVisible);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <IonLoading isOpen={true} message="Loading" />; 
  }

  return (
    <CadeyUserContext.Provider value={{ cadeyUserId, minimumSupportedVersion }}>
      <DeviceIdContext.Provider value={cadeyUserDeviceId}>
        <HomeTabVisibilityContext.Provider value={{ isHomeTabVisible, setIsHomeTabVisible }}>
          <App />
        </HomeTabVisibilityContext.Provider>
      </DeviceIdContext.Provider>
    </CadeyUserContext.Provider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <MainComponent />
  </React.StrictMode>
);