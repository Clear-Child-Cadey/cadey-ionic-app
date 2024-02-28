/**
 * If nescessary, extracts out the error message from the error thrown by Firebase
 * @param errorMessage
 * @returns
 */
const maybeExtractErrorCode = (errorMessage: string) => {
  const regex = /Firebase: Error \((.*?)\)/;
  const matches = errorMessage.match(regex);
  if (matches && matches.length > 1) {
    // The actual error code is in the second element of the array
    return matches[1];
  } else {
    // Return undefined or any fallback error code
    return errorMessage;
  }
};

/**
 * Maps the error code to a human-readable error message
 * @param error
 */

const firebaseErrorMapper = (error: string) => {
  const errorCode = maybeExtractErrorCode(error);
  const dictionary = {
    'auth/invalid-login-credentials': 'Invalid login credentials.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/user-disabled':
      'The user account has been disabled by an administrator.',
    'auth/user-not-found':
      'There is no user record corresponding to this identifier. The user may have been deleted.',
    'auth/wrong-password':
      'The password is invalid or the user does not have a password.',
    'auth/email-already-in-use':
      'The email address is already in use by another account.',
    'auth/weak-password': 'The password is not strong enough.',
    'auth/operation-not-allowed':
      'Email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.',
    'auth/too-many-requests':
      'We have blocked all requests from this device due to unusual activity. Try again later.',
    'auth/account-exists-with-different-credential':
      'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.',
    'auth/auth-domain-config-required':
      'Authentication domain configuration is required.',
    'auth/credential-already-in-use':
      'This credential is already associated with a different user account.',
    'auth/operation-not-supported-in-this-environment':
      'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https, or chrome-extension and web storage must be enabled.',
    'auth/timeout': 'The operation has timed out.',
    'auth/missing-android-pkg-name':
      'An Android Package Name must be provided if the Android App is required to be installed.',
    'auth/missing-continue-uri':
      'A continue URL must be provided in the request.',
    'auth/missing-ios-bundle-id':
      'An iOS Bundle ID must be provided if an App Store ID is provided.',
    'auth/invalid-continue-uri':
      'The continue URL provided in the request is invalid.',
    'auth/unauthorized-continue-uri':
      'The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console.',
  };
  return dictionary[errorCode as keyof typeof dictionary] || error;
};

export default firebaseErrorMapper;
