import { Capacitor } from "@capacitor/core";
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { firebaseApp } from "../api/Firebase/InitializeFirebase";

const decoratedGetAuth = () => {
  let auth;
  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(firebaseApp, {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    auth = getAuth(firebaseApp);
  }
  return auth;
};

export default decoratedGetAuth;
