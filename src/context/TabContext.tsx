import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TabContextProps {
  isTabBarVisible: boolean;
  setIsTabBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabContext = createContext<TabContextProps | undefined>(undefined);

interface TabProviderProps {
    children: ReactNode;
}

const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
    const [isTabBarVisible, setIsTabBarVisible] = useState<boolean>(false);

    const contextValue = {
      isTabBarVisible,  
      setIsTabBarVisible,
    };

    return (
        <TabContext.Provider value={contextValue}>
            {children}
        </TabContext.Provider>
    );
};

function useTabContext() {
    const context = useContext(TabContext);
    if (!context) throw new Error("TabContext must be used within a TabProvider");
    return context;
}

export { TabProvider, useTabContext };

