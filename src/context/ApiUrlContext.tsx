// import React from 'react';

// // TODO: Setup .env files for different environments

// // Production API URL
// // export const API_BASE_URL = 'https://capi.clear-cade.com';

// // Stage API URL
// export const API_BASE_URL = 'https://capi-stage.clear-cade.com';

// const ApiUrlContext = React.createContext(API_BASE_URL);

// export default ApiUrlContext

// ------------------------------

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
    apiUrl: PRODUCTION_API_URL, 
    setApiUrl: () => {},
});

export const ApiUrlProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(PRODUCTION_API_URL);

  return (
    <ApiUrlContext.Provider value={{ apiUrl, setApiUrl }}>
      {children}
    </ApiUrlContext.Provider>
  );
};

export default ApiUrlContext;
export { EDGE_API_URL, STAGING_API_URL, PRODUCTION_API_URL };