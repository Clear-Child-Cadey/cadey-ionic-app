// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  User,
} from "firebase/auth";
import { firebaseApp } from "../api/Firebase/InitializeFirebase"; // Adjust the import path as needed

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultState: AuthContextType = {
  user: null,
  loading: true,
  setUser: () => {},
  setLoading: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, or was just signed in.
        setUser(user);
        setLoading(false);
      } else {
        // No user is signed in, try to sign in anonymously
        signInAnonymously(auth)
          .then((result) => {
            // Signed in
            setUser(result.user); // This might be redundant if onAuthStateChanged picks it up
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(
              `Error signing in anonymously: ${errorCode}`,
              errorMessage,
            );
            setLoading(false); // Ensure loading is set to false even if sign-in fails
          });
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
