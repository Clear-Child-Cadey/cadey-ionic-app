//MG not sure how build works, so instead of using env variables, using this
//MG to store the variables that are used in the app
//MG this should be refactored into env variables

const PRODUCTION_API_URL = 'https://capi.clear-cade.com';
const STAGING_API_URL = 'https://capi-stage.clear-cade.com';
const EDGE_API_URL = 'https://capi-edge.clear-cade.com';
const API_PATH = '/api/cadey290';

const AppMeta = {
  // baseApiUrl: PRODUCTION_API_URL + API_PATH,
  baseApiUrl: STAGING_API_URL + API_PATH,
  version: '3.4.0',
  forceEmailVerification: true,
  enforceTrialUser: true,
  firestoreCollection: 'ErrorLogs2024',
  cadeyApiKey: 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
  slowRequestThreshold: 5000, // milliseconds
  fetchTimeout: -1,
  httpErrorModalData: {
    title: 'Error',
    body: "We're sorry, but we couldn't load the data for this page. Please try again later.",
    buttonText: 'Retry',
    actionType: 'RELOAD_PAGE',
  },
  httpErrorModalDataFirebaseTooManyRequests: {
    title: 'Error',
    body: 'We are experiencing high traffic. Please try again later.',
    buttonText: 'Retry',
    actionType: 'RELOAD_PAGE',
  },
  nonLoggedInUsersAllowedPaths: [
    '/App/Authentication/Login',
    '/App/Authentication/Register',
    '/App/Authentication',
    '/App/Welcome',
  ],
  emailVerificationMessage: '',
  publicAppleRevenueCatApiKey: 'appl_XgCjJkycTNHhDxDzvoLsWtdIEww',
  publicGoogleRevenueCatApiKey: 'goog_RBSPQIotYbFSobVvLmEKcTlePEW',
};

export default AppMeta;
