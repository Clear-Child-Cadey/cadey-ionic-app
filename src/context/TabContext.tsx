// import React, { useContext } from 'react';

// type HomeTabVisibilityContextType = {
//     isHomeTabVisible: boolean;
//     setIsHomeTabVisible: React.Dispatch<React.SetStateAction<boolean>>;
// };

// export const HomeTabVisibilityContext = React.createContext<HomeTabVisibilityContextType | undefined>(undefined);

import React, { useContext, useState, ReactNode } from 'react';

type HomeTabVisibilityContextType = {
  isHomeTabVisible: boolean;
  setIsHomeTabVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue: HomeTabVisibilityContextType = {
  isHomeTabVisible: false,
  setIsHomeTabVisible: () => {},
};

export const HomeTabVisibilityContext = React.createContext<HomeTabVisibilityContextType>(defaultValue);

interface HomeTabVisibilityProviderProps {
  children: ReactNode;
}

export const HomeTabVisibilityProvider: React.FC<HomeTabVisibilityProviderProps> = ({ children }) => {
  const [isHomeTabVisible, setIsHomeTabVisible] = useState(false);

  return (
    <HomeTabVisibilityContext.Provider value={{ isHomeTabVisible, setIsHomeTabVisible }}>
      {children}
    </HomeTabVisibilityContext.Provider>
  );
};



