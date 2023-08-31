import React, { createContext, useContext, useState } from 'react';

type SpotlightContextType = {
  showSpotlight: boolean;
  setShowSpotlight: React.Dispatch<React.SetStateAction<boolean>>;
};

const SpotlightContext = createContext<SpotlightContextType | undefined>(undefined);

export const useSpotlight = () => {
    const context = useContext(SpotlightContext);
    if (!context) {
        throw new Error('useSpotlight must be used within a SpotlightProvider');
    }
    return context;
};

type TabBarSpotlightProviderProps = {
    children: React.ReactNode;
};

export const TabBarSpotlightProvider: React.FC<TabBarSpotlightProviderProps> = ({ children }) => {  
    const [showSpotlight, setShowSpotlight] = useState(false);
  
    return (
        <SpotlightContext.Provider value={{ showSpotlight, setShowSpotlight }}>
            {children}
        </SpotlightContext.Provider>
    );
};
