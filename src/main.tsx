import React, { createContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonReactRouter } from '@ionic/react-router';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { IonApp } from '@ionic/react';
// Contexts
import DeviceIdContext from './context/DeviceIdContext';
import ApiUrlContext, { ApiUrlProvider } from './context/ApiUrlContext';
import { TabProvider } from './context/TabContext';
import UnreadContext from './context/UnreadContext';
import {
  LoadingStateProvider,
  useLoadingState,
} from './context/LoadingStateContext';
import { ModalProvider } from './context/ModalContext';
import { AppPageProvider } from './context/AppPageContext';
import { PathProvider } from './context/PathContext';
import { useTabContext } from './context/TabContext';
import { useModalContext } from './context/ModalContext';
// Components
import RouterTabs from './components/Routing/RouterTabs';
// Redux
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState } from './store';
import { setDeviceId } from './features/deviceId/slice';

// API
import getAppData from './api/AppOpen';
import { logUserFact } from './api/UserFacts';
import { getQuiz } from './api/Quiz';
import { postUserAuth } from './api/Authentication';

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
import { trileanResolve } from './types/Trilean';
import HttpErrorModal from './components/Modals/HttpErrorModal';

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
  const dispatch = useDispatch();
  const cadeyAuth = useCadeyAuth();

  const userResolved = useSelector(
    (state: RootState) =>
      trileanResolve(state.authStatus.cadeyResolved) &&
      trileanResolve(state.authStatus.firebaseResolved),
  );

  const { apiUrl } = React.useContext(ApiUrlContext);
  const { setIsTabBarVisible } = useTabContext();
  const { setQuizModalData } = useModalContext();
  const location = useLocation();
  const history = useHistory();

  const [cadeyUserId, setCadeyUserId] = useState('');
  const [cadeyUserAgeGroup, setCadeyUserAgeGroup] = useState(0);
  const [minimumSupportedVersion, setMinimumSupportedVersion] = useState('');
  const [oneSignalId, setOneSignalId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadGoals, setUnreadGoals] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    const requestQuiz = async () => {
      const quizResponse = await getQuiz(
        apiUrl,
        Number(cadeyUserId),
        3, // Client Context: Where the user is in the app (3 = Onboarding sequence)
        0, // Entity Type (1 = video)
        0, // Entity IDs (The ID of the video)
      );

      debugger;

      // If the user has not completed the welcome sequence, take them to the welcome sequence
      if (quizResponse.question !== null && quizResponse.question.id > 0) {
        // Set the quiz data
        setQuizModalData(quizResponse);

        // Hide the tab bar
        setIsTabBarVisible(false);

        // Redirect user to Welcome sequence - Path selection
        history.push('/App/Welcome/Path');
      } else {
        // Show the tab bar and redirect to the home page
        setIsTabBarVisible(true);
        history.push('/App/Home');
      }
    };
    requestQuiz();
  }, [userResolved]);

  // App startup logic
  useEffect(() => {
    const fetchData = async () => {
      let getAppDataTrace: any;
      // Start a Firebase trace
      if (tracingEnabled) {
        getAppDataTrace = trace(firebasePerf, 'getAppDataTrace');
        await getAppDataTrace.start();
      }

      try {
        setIsLoading(true); // Enable the loader
        await getAppData(
          setCadeyUserId,
          setCadeyUserAgeGroup,
          setMinimumSupportedVersion,
          setOneSignalId,
          apiUrl,
        );
        setDataLoaded(true); // Indicate that data has been loaded
      } catch (error) {
        console.error('Error fetching app data:', error);
      } finally {
        // Stop the trace
        // Disable the loader
        setIsLoading(false);
        if (tracingEnabled) {
          getAppDataTrace.stop();
        }
      }
    };

    dispatch(setDeviceId(cadeyUserDeviceId)); // Set the device ID in the Redux store

    fetchData();
  }, [apiUrl]);

  if (!userResolved) {
    // return early so other parts of the app don't start calling for data out of turn. Ommitted a loader here as it's super quick and causes a loading flash
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
          <LoadingStateProvider>
            <p>Loading!</p>
          </LoadingStateProvider>
        </UnreadContext.Provider>
      </CadeyUserContext.Provider>
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
      <UnreadContext.Provider
        value={{
          unreadMessagesCount,
          setUnreadMessagesCount,
          unreadGoals,
          setUnreadGoals,
        }}
      >
        <LoadingStateProvider>
          <RouterTabs />
          <App />
        </LoadingStateProvider>
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
              <ModalProvider>
                <PathProvider>
                  <HttpErrorModal />
                  <MainComponent />
                </PathProvider>
              </ModalProvider>
            </TabProvider>
          </IonReactRouter>
        </AppPageProvider>
      </ApiUrlProvider>
    </Provider>
  </IonApp>,
);
