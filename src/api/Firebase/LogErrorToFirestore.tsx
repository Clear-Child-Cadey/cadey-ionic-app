import { addDoc, collection } from "firebase/firestore";
import { firestore } from "./InitializeFirebase";
import { loggingEnabled } from "../../variables/Logging";

export const logErrorToFirestore = async (errorDetails: any) => {
    if (loggingEnabled == true) {
        try {
            await addDoc(collection(firestore, "ErrorLogs"), errorDetails);
            console.log("Error logged to Firestore");
        } catch (error) {
            console.error("Error logging to Firestore:", error);
        }
    } else {
        console.log("Logging is disabled");
    }
};