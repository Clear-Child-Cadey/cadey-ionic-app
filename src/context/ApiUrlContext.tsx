import React, { useState } from 'react';

// API URLs
const PRODUCTION_API_URL = 'https://capi.clear-cade.com';
const STAGING_API_URL = 'https://capi-stage.clear-cade.com';
const EDGE_API_URL = 'https://capi-edge.clear-cade.com';

type ApiUrlContextType = {
    apiUrl: string;
    setApiUrl: (value: string) => void;
  };

const ApiUrlContext = React.createContext<ApiUrlContextType>({
    apiUrl: STAGING_API_URL, 
    setApiUrl: () => {},
});

export const ApiUrlProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(STAGING_API_URL);

  return (
    <ApiUrlContext.Provider value={{ apiUrl, setApiUrl }}>
      {children}
    </ApiUrlContext.Provider>
  );
};

export default ApiUrlContext;
export { EDGE_API_URL, STAGING_API_URL, PRODUCTION_API_URL };