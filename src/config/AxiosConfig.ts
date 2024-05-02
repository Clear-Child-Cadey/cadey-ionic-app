import axios from 'axios';
import AppMeta from '../variables/AppMeta';
import { firestore } from '../api/Firebase/InitializeFirebase';
import { collection, addDoc } from 'firebase/firestore'; // Import collection and addDoc functions
import { loggingEnabled } from '../variables/Logging';
import { getAuth } from 'firebase/auth';
import getDeviceId from '../utils/getDeviceId';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: `${AppMeta.baseApiUrl}`, // Set your API base URL here
});

let requestStartedAt = 0;
let duration = 0;

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  // Attach a timestamp to the request config
  requestStartedAt = new Date().getTime();
  return config;
});

async function logRequestDetails(
  errorLog: object,
  url = '',
  duration = 0,
  isSlow = false,
) {
  if (loggingEnabled) {
    const auth = getAuth();
    const user = auth.currentUser;
    const deviceId = await getDeviceId();
    try {
      await addDoc(collection(firestore, AppMeta.firestoreCollection), {
        firebaseUser: user ? user.uid : 'anonymous',
        timestamp: new Date().toISOString(), // We pass this explicitly to Firestore so we can sort by it. The error log also has a timestamp field.
        deviceId: deviceId,
        duration: duration,
        isSlow: isSlow,
        endpoint: url,
        errorLog: errorLog,
      });
      console.log('Request logged to Firestore');
    } catch (error) {
      console.error('Error logging to Firestore:', error);
    }
  } else {
    console.log('Logging is disabled');
  }
}

// Response interceptor
axiosInstance.interceptors.response.use(
  async (response) => {
    if (requestStartedAt !== 0) {
      duration = new Date().getTime() - requestStartedAt;
      console.log(`Request to ${response.config.url} took ${duration} ms`);
    }
    if (duration > AppMeta.slowRequestThreshold) {
      // Log slow requests to Firestore
      console.warn(
        `Slow API call detected: ${response.config.url} took ${duration} ms`,
      );

      const errorLog = {
        message: `Slow API call detected: ${response.config.url} took ${duration} ms`,
        status: response.status,
      };

      logRequestDetails(errorLog, response.config.url, duration, true);
    }
    return response;
  },
  async (error) => {
    console.error('API Error:', error);
    if (requestStartedAt !== 0) {
      duration = new Date().getTime() - requestStartedAt;
    }
    const errorLog = {
      message: error.message,
      status: error.response ? error.response.status : 'No response',
    };

    logRequestDetails(errorLog, error.config.url, duration, false);

    return Promise.reject(error);
  },
);

export default axiosInstance;
