import React, { useState } from 'react';

type AppPageContextType = {
  currentAppPage: string;
  currentBasePage: string;
  setCurrentAppPage: React.Dispatch<React.SetStateAction<string>>;
  setCurrentBasePage: React.Dispatch<React.SetStateAction<string>>;
};

const AppPageContext = React.createContext<AppPageContextType | null>(null);

export function useAppPage() {
  const context = React.useContext(AppPageContext);
  if (!context) {
    throw new Error("useAppPage must be used within an AppPageProvider");
  }
  return context;
}


export function AppPageProvider({ children }: { children: React.ReactNode }) {
  const [currentAppPage, setCurrentAppPage] = useState("");
  const [currentBasePage, setCurrentBasePage] = useState("");

  return (
    <AppPageContext.Provider value={{ currentAppPage, setCurrentAppPage, currentBasePage, setCurrentBasePage }}>
      {children}
    </AppPageContext.Provider>
  );
}