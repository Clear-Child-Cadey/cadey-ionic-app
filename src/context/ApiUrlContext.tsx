import React, { useState } from 'react';

// API URLs
const PRODUCTION_API_URL = 'https://capi.clear-cade.com';
const STAGING_API_URL = 'https://capi-stage.clear-cade.com';
const EDGE_API_URL = 'https://capi-edge.clear-cade.com';

// Change this to the API version
const API_PATH = '/api/cadey290';
// const API_PATH = '/api/cadeydata'; // Base API Version

// Change this to STAGING_API_URL or EDGE_API_URL to test against those environments
const API_FULL_PATH = `${STAGING_API_URL}${API_PATH}`;

type ApiUrlContextType = {
    apiUrl: string;
    setApiUrl: (value: string) => void;
  };

const ApiUrlContext = React.createContext<ApiUrlContextType>({
    apiUrl: API_FULL_PATH, 
    setApiUrl: () => {},
});

export const ApiUrlProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(API_FULL_PATH);

  return (
    <ApiUrlContext.Provider value={{ apiUrl, setApiUrl }}>
      {children}
    </ApiUrlContext.Provider>
  );
};

export default ApiUrlContext;
export { EDGE_API_URL, STAGING_API_URL, PRODUCTION_API_URL, API_FULL_PATH };