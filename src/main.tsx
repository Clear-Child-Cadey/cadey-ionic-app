import React, { createContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonReactRouter } from '@ionic/react-router';
// Contexts
import DeviceIdContext from './context/DeviceIdContext';
import ApiUrlContext, { ApiUrlProvider } from './context/ApiUrlContext';
import { TabProvider } from './context/TabContext';
import UnreadContext from './context/UnreadContext';
import { TabBarSpotlightProvider } from './context/SpotlightContext';
import {
  LoadingStateProvider,
  useLoadingState,
} from "./context/LoadingStateContext";
import { ModalProvider } from "./context/ModalContext";
import { AppPageProvider } from "./context/AppPageContext";
import { PathProvider } from "./context/PathContext";
// Components
import LoginScreen from "./components/Authentication/Login";
import RegisterScreen from "./components/Authentication/Register";

// API
import getAppData from './api/AppOpen';
import { logUserFact } from './api/UserFacts';

// Variables
import { tracingEnabled } from './variables/Logging';

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

// UUID Library (Used to generate a unique ID for the device)
import { v4 as uuidv4 } from 'uuid';

// Firebase
import {
  firebasePerf,
  firestore,
  auth,
} from './api/Firebase/InitializeFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { trace } from 'firebase/performance';
import { logErrorToFirestore } from './api/Firebase/LogErrorToFirestore';
import { AuthProvider, useAuth } from './context/AuthContext';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import store from './store';
import { Provider } from 'react-redux';

// Generate a unique ID for the device
let cadeyUserDeviceId = localStorage.getItem('cadey_user_device_id');
if (!cadeyUserDeviceId) {
  cadeyUserDeviceId = uuidv4();
  localStorage.setItem('cadey_user_device_id', cadeyUserDeviceId);
}

// create context for cadeyUserId and minimumSupportedVersion
export const CadeyUserContext = createContext<{
  cadeyUserId: string;
  cadeyUserAgeGroup: number;
  setCadeyUserAgeGroup: React.Dispatch<React.SetStateAction<number>>;
  minimumSupportedVersion: string;
  oneSignalId: string;
}>({
  cadeyUserId: '',
  cadeyUserAgeGroup: 0,
  setCadeyUserAgeGroup: () => {},
  minimumSupportedVersion: '',
  oneSignalId: '',
});

function MainComponent() {
  const { apiUrl } = React.useContext(ApiUrlContext);

  const [user, setUser]: any = useState(null); // Add this line to manage user state

  const [cadeyUserId, setCadeyUserId] = useState('');
  const [cadeyUserAgeGroup, setCadeyUserAgeGroup] = useState(0);
  const [minimumSupportedVersion, setMinimumSupportedVersion] = useState('');
  const [oneSignalId, setOneSignalId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadGoals, setUnreadGoals] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);

  // App startup logic
  useEffect(() => {
    let timeoutId: any;

    const fetchData = async () => {
      // Authenticate with Firebase
      // signInAnonymously(auth)
      // .then(() => {
      //   console.log("Signed in anonymously");
      // })
      // .catch((error) => {
      //   console.error("Error signing in anonymously:", error);
      // });

      let getAppDataTrace: any;
      // Start a Firebase trace
      if (tracingEnabled) {
        getAppDataTrace = trace(firebasePerf, 'getAppDataTrace');
        await getAppDataTrace.start();
      }

      try {
        await getAppData(
          setCadeyUserId,
          setCadeyUserAgeGroup,
          setMinimumSupportedVersion,
          setOneSignalId,
          apiUrl,
        );
        setDataLoaded(true); // Indicate that data has been loaded
        clearTimeout(timeoutId); // Clear the timeout if data is loaded in time
      } catch (error) {
        console.error('Error fetching app data:', error);
      } finally {
        // Stop the trace
        if (tracingEnabled) {
          getAppDataTrace.stop();
        }

        // Disable the loader
        setIsLoading(false);
      }
    };

    fetchData();

    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // User is signed in, you can add additional logic here if needed
    //     console.log("User is signed in anonymously, UID: ", user.uid);
    //   } else {
    //     // User is signed out
    //     console.log("User is signed out");
    //   }
    // });

    // Auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user state based on auth state
    });

    return () => unsubscribe(); // Cleanup subscription on unmount

  }, [apiUrl, auth]);

  // const { loading: firebaseAuthLoading } = useAuth();
  // if (isLoading || firebaseAuthLoading) {
  if (isLoading) {
    // return early so other parts of the app don't start calling for data out of turn. Ommitted a loader here as it's super quick and causes a loading flash
    return;
  }

  if (!user) {
    // User is not signed in, show login or registration screen
    return (
    <IonReactRouter>
      <LoginScreen />
      <RegisterScreen />
    </IonReactRouter>
    );
  }

  return (
    <CadeyUserContext.Provider
      value={{
        cadeyUserId,
        cadeyUserAgeGroup,
        setCadeyUserAgeGroup,
        minimumSupportedVersion,
        oneSignalId,
      }}
    >
      <DeviceIdContext.Provider value={cadeyUserDeviceId}>
        <TabProvider>
          <UnreadContext.Provider
            value={{
              unreadMessagesCount,
              setUnreadMessagesCount,
              unreadGoals,
              setUnreadGoals,
            }}
          >
            <AppPageProvider>
              <TabBarSpotlightProvider>
                <LoadingStateProvider>
                  <ModalProvider>
                    <PathProvider>
                      <IonReactRouter>
                        <App />
                      </IonReactRouter>
                    </PathProvider>
                  </ModalProvider>
                </LoadingStateProvider>
              </TabBarSpotlightProvider>
            </AppPageProvider>
          </UnreadContext.Provider>
        </TabProvider>
      </DeviceIdContext.Provider>
    </CadeyUserContext.Provider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  // <React.StrictMode>
  // <AuthProvider>
  <Provider store={store}>
    <ApiUrlProvider>
      <MainComponent />
    </ApiUrlProvider>
  </Provider>,
  // </AuthProvider>,
  // </React.StrictMode>
);
