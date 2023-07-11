import React from 'react';

// TODO: Setup .env files for different environments

// Production API URL
// export const API_BASE_URL = 'https://capi.clear-cade.com';

// Stage API URL
export const API_BASE_URL = 'https://capi-stage.clear-cade.com';

var NEW_API_BASE_URL = '';

// Define the API URL based on the environment
if (window.location.hostname === 'cadey-stage.web.app') { 
    NEW_API_BASE_URL = 'https://capi-stage.clear-cade.com';
} else if (window.location.hostname === 'cadey.web.app') {
    NEW_API_BASE_URL = 'https://capi.clear-cade.com';
} else {
    // This handles the app, and unfortunately needs to be hardcoded and swapped for each build
    // Production API URL
    NEW_API_BASE_URL = 'https://capi.clear-cade.com';

    // Stage API URL
    NEW_API_BASE_URL = 'https://capi-stage.clear-cade.co';
}

const ApiUrlContext = React.createContext(API_BASE_URL);

export default ApiUrlContext