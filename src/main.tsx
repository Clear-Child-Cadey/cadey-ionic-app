import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
// Commented out all non used imports, can be commented out again when used or deleted
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonReactRouter } from '@ionic/react-router';
import { IonApp } from '@ionic/react';
// Contexts
// import DeviceIdContext from './context/DeviceIdContext';
import { ApiUrlProvider } from './context/ApiUrlContext';
import { TabProvider } from './context/TabContext';
import UnreadContext from './context/UnreadContext';
import { LoadingStateProvider } from './context/LoadingStateContext';
import { ModalProvider } from './context/ModalContext';
import { AppPageProvider } from './context/AppPageContext';
import { PathProvider } from './context/PathContext';
// import { useTabContext } from './context/TabContext';
// import { useModalContext } from './context/ModalContext';
// Components
import RouterTabs from './components/Routing/RouterTabs';
// Redux
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState } from './store';
// import { setDeviceId } from './features/deviceId/slice';

// // API

// import { logUserFact } from './api/UserFacts';
// import { postUserAuth } from './api/Authentication';

// // Variables
// import { tracingEnabled } from './variables/Logging';

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
// import { v4 as uuidv4 } from 'uuid';

// Firebase
// import { firebasePerf } from './api/Firebase/InitializeFirebase';
// import { addDoc, collection } from 'firebase/firestore';
// import { trace } from 'firebase/performance';
// import { logErrorToFirestore } from './api/Firebase/LogErrorToFirestore';
import useCadeyAuth from './hooks/useCadeyAuth';
import { trileanResolve } from './types/Trilean';
import HttpErrorModal from './components/Modals/HttpErrorModal';
import getDeviceId from './utils/getDeviceId';
import useAppOpened from './hooks/useAppOpened';
import { setHttpErrorModalData } from './features/httpError/slice';
import AppMeta from './variables/AppMeta';
import useRequestQuiz from './hooks/useRequestQuiz';

// Make sure we generate a unique ID for the device

// create context for cadeyUserId and minimumSupportedVersion
export const CadeyUserContext = createContext<{
  cadeyUserId: number;
  cadeyUserAgeGroup: number;
  setCadeyUserAgeGroup: React.Dispatch<React.SetStateAction<number>>;
  minimumSupportedVersion: string;
  oneSignalId: string;
}>({
  cadeyUserId: 0,
  cadeyUserAgeGroup: 0,
  setCadeyUserAgeGroup: () => {},
  minimumSupportedVersion: '',
  oneSignalId: '',
});

getDeviceId();

function MainComponent() {
  const { appOpenAction } = useAppOpened();
  useCadeyAuth();
  const dispatch = useDispatch();
  const { requestQuiz } = useRequestQuiz({
    clientContext: 3,
    entityType: 0,
    entityId: 0,
    shouldHaveEmailVerified: AppMeta.forceEmailVerification,
  });
  const history = useHistory();

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        const { grandfatherSignup } = await appOpenAction();
        if (grandfatherSignup) {
          return history.push('/App/Grandfather');
        }
        // if data has a company name = "Grandfather", reroute the user to /App/Grandfather
      } catch {
        dispatch(setHttpErrorModalData(AppMeta.httpErrorModalData));
      }
    };
    asyncFunction();
  }, []);

  const cadeyUserId = useSelector(
    (state: RootState) => state?.authStatus?.userData?.cadeyUser?.cadeyUserId,
  );

  const userResolved = useSelector(
    (state: RootState) =>
      trileanResolve(state.authStatus.cadeyResolved) &&
      trileanResolve(state.authStatus.firebaseResolved),
  );

  const [cadeyUserAgeGroup, setCadeyUserAgeGroup] = useState(0);
  const [minimumSupportedVersion, setMinimumSupportedVersion] = useState('');
  const [oneSignalId, setOneSignalId] = useState('');

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadGoals, setUnreadGoals] = useState(false);

  useEffect(() => {
    if (userResolved) {
      requestQuiz();
    }
  }, [userResolved]);

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
          <HttpErrorModal />
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
        <HttpErrorModal />
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
