import React, { createContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonReactRouter } from '@ionic/react-router';
import { Route, useLocation } from 'react-router-dom';
import { IonApp } from '@ionic/react';
// Contexts
import DeviceIdContext from './context/DeviceIdContext';
import ApiUrlContext, { ApiUrlProvider } from './context/ApiUrlContext';
import { TabProvider } from './context/TabContext';
import UnreadContext from './context/UnreadContext';
import { TabBarSpotlightProvider } from './context/SpotlightContext';
import {
  LoadingStateProvider,
  useLoadingState,
} from './context/LoadingStateContext';
import { ModalProvider } from './context/ModalContext';
import { AppPageProvider } from './context/AppPageContext';
import { PathProvider } from './context/PathContext';
// Components
import RouterTabs from './components/Routing/RouterTabs';
// Redux
import { Provider, useDispatch } from 'react-redux';
import store, { RootState } from './store';
import { setDeviceId } from './features/deviceId/slice';

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
import { firebasePerf } from './api/Firebase/InitializeFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { trace } from 'firebase/performance';
import { logErrorToFirestore } from './api/Firebase/LogErrorToFirestore';
import useCadeyAuth from './hooks/useCadeyAuth';

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
  const dispatch = useDispatch(); // Get the dispatch function
  const { apiUrl } = React.useContext(ApiUrlContext);

  const location = useLocation();

  const [cadeyUserId, setCadeyUserId] = useState('');
  const [cadeyUserAgeGroup, setCadeyUserAgeGroup] = useState(0);
  const [minimumSupportedVersion, setMinimumSupportedVersion] = useState('');
  const [oneSignalId, setOneSignalId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadGoals, setUnreadGoals] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);

  const { user, isUserAnonymous } = useCadeyAuth();

  // App startup logic
  useEffect(() => {
    let timeoutId: any;

    const fetchData = async () => {
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

    dispatch(setDeviceId(cadeyUserDeviceId)); // Set the device ID in the Redux store

    fetchData();
  }, [apiUrl]);

  if (isLoading) {
    // return early so other parts of the app don't start calling for data out of turn. Ommitted a loader here as it's super quick and causes a loading flash
    return;
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
      <UnreadContext.Provider
        value={{
          unreadMessagesCount,
          setUnreadMessagesCount,
          unreadGoals,
          setUnreadGoals,
        }}
      >
        <TabBarSpotlightProvider>
          <LoadingStateProvider>
            <ModalProvider>
              <PathProvider>
                <div></div>
                <App />
              </PathProvider>
            </ModalProvider>
          </LoadingStateProvider>
        </TabBarSpotlightProvider>
      </UnreadContext.Provider>
    </CadeyUserContext.Provider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <IonApp>
    <Provider store={store}>
      <ApiUrlProvider>
        <AppPageProvider>
          <IonReactRouter>
            <TabProvider>
              <div></div>
              <RouterTabs />
              <MainComponent />
            </TabProvider>
          </IonReactRouter>
        </AppPageProvider>
      </ApiUrlProvider>
    </Provider>
  </IonApp>,
);
