//MG not sure how build works, so instead of using env variables, using this
//MG to store the variables that are used in the app
//MG this should be refactored into env variables

const AppMeta = {
  forceEmailVerification: true,
  firestoreCollection: 'ErrorLogs2024',
  cadeyApiKey: 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
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
  emailVerificationMessage:
    'You need to verify your email address. On this device, click on the link we just emailed you. This process helps keep your account secure.',
  expiredUserMessage: 'Your trial period has expired.',
};

export default AppMeta;
