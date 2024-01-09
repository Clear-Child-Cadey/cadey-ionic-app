import { addDoc, collection } from "firebase/firestore";
import { firestore } from "./InitializeFirebase";

export const logErrorToFirestore = async (errorDetails: any) => {
  try {
    await addDoc(collection(firestore, "ErrorLogs"), errorDetails);
    console.log("Error logged to Firestore");
  } catch (error) {
    console.error("Error logging to Firestore:", error);
  }
};
