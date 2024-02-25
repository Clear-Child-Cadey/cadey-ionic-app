import React, { createContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { IonReactRouter } from "@ionic/react-router";
// Contexts
import DeviceIdContext from "./context/DeviceIdContext";
import ApiUrlContext, { ApiUrlProvider } from "./context/ApiUrlContext";
import { TabProvider } from "./context/TabContext";
import UnreadContext from "./context/UnreadContext";
import { TabBarSpotlightProvider } from "./context/SpotlightContext";
import {
  LoadingStateProvider,
  useLoadingState,
} from "./context/LoadingStateContext";
import { ModalProvider } from "./context/ModalContext";
import { AppPageProvider } from "./context/AppPageContext";
import { PathProvider } from "./context/PathContext";

// API
import getAppData from "./api/AppOpen";
import { logUserFact } from "./api/UserFacts";

// Variables
import { tracingEnabled } from "./variables/Logging";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/main.css";

// UUID Library (Used to generate a unique ID for the device)
import { v4 as uuidv4 } from "uuid";

// Firebase
import { firebasePerf, firestore } from "./api/Firebase/InitializeFirebase";
import { addDoc, collection } from "firebase/firestore";
import { trace } from "firebase/performance";
import { logErrorToFirestore } from "./api/Firebase/LogErrorToFirestore";
import { AuthProvider, useAuth } from "./context/AuthContext";
import store from "./store";
import { Provider } from "react-redux";

// Generate a unique ID for the device
let cadeyUserDeviceId = localStorage.getItem("cadey_user_device_id");
if (!cadeyUserDeviceId) {
  cadeyUserDeviceId = uuidv4();
  localStorage.setItem("cadey_user_device_id", cadeyUserDeviceId);
}

// create context for cadeyUserId and minimumSupportedVersion
export const CadeyUserContext = createContext<{
  cadeyUserId: string;
  cadeyUserAgeGroup: number;
  setCadeyUserAgeGroup: React.Dispatch<React.SetStateAction<number>>;
  minimumSupportedVersion: string;
  oneSignalId: string;
}>({
  cadeyUserId: "",
  cadeyUserAgeGroup: 0,
  setCadeyUserAgeGroup: () => {},
  minimumSupportedVersion: "",
  oneSignalId: "",
});

function MainComponent() {
  const { apiUrl } = React.useContext(ApiUrlContext);

  const [cadeyUserId, setCadeyUserId] = useState("");
  const [cadeyUserAgeGroup, setCadeyUserAgeGroup] = useState(0);
  const [minimumSupportedVersion, setMinimumSupportedVersion] = useState("");
  const [oneSignalId, setOneSignalId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadGoals, setUnreadGoals] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);

  // App startup logic
  useEffect(() => {
    let timeoutId: any;

    const fetchData = async () => {
      var getAppDataTrace: any;
      // Start a Firebase trace
      if (tracingEnabled) {
        getAppDataTrace = trace(firebasePerf, "getAppDataTrace");
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
        console.error("Error fetching app data:", error);
      } finally {
        // Stop the trace
        if (tracingEnabled) {
          getAppDataTrace.stop();
        }

        // Disable the loader
        setIsLoading(false);
      }
    };

    // Start a timer
    // timeoutId = setTimeout(() => {
    //   if (!dataLoaded) {
    //     // TODO: Implement logic for handling long load times

    //     // Log a user fact
    //     logUserFact({
    //       cadeyUserId: cadeyUserId,
    //       baseApiUrl: apiUrl,
    //       userFactTypeName: 'ErrorLog',
    //       appPage: 'App Open',
    //       detail1: 'getAppData call (/appopened) took longer than 10 seconds. Time: ' + new Date().toISOString(),
    //     });

    //     logErrorToFirestore({
    //       userID: cadeyUserId,
    //       timestamp: new Date().toISOString(),
    //       error: 'getAppData call (/appopened) took longer than 10 seconds',
    //       context: "Fetching App Data"
    //     });

    //     setIsLoading(false); // Optionally stop the loader
    //   }
    // }, 10000); // Set timeout for 10 seconds

    fetchData();
  }, [apiUrl]);

  // const { loading: firebaseAuthLoading } = useAuth();
  // if (isLoading || firebaseAuthLoading) {
  if (isLoading) {
    // return early so other parts of the app don't start calling for data out of turn. Ommitted a loader here as it's super quick and causes a loading flash
    return;
  }

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  // <React.StrictMode>
  // <AuthProvider>
  <ApiUrlProvider>
    <MainComponent />
  </ApiUrlProvider>,
  // </AuthProvider>,
  // </React.StrictMode>
);
