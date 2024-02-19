import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { firebaseApp, firestore } from "./InitializeFirebase";
import { loggingEnabled } from "../../variables/Logging";
import AppMeta from "../../variables/AppMeta";

export const logErrorToFirestore = async (errorDetails: any) => {
  if (loggingEnabled) {
    const auth = getAuth();
    const user = auth.currentUser;
    try {
      await addDoc(collection(firestore, AppMeta.firestoreCollection), {
        ...errorDetails,
        firebaseUser: user ? user.uid : "anonymous",
        timestamp: new Date().toISOString(),
      });
      console.log("Error logged to Firestore");
    } catch (error) {
      console.error("Error logging to Firestore:", error);
    }
  } else {
    console.log("Logging is disabled");
  }
};
