// src/api/axiosConfig.js
import axios from 'axios';
import AppMeta from '../variables/AppMeta';
import db from '../firebaseConfig';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: `${AppMeta.baseApiUrl}`, // Set your API base URL here
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);
    const errorLog = {
      timestamp: new Date(),
      message: error.message,
      status: error.response ? error.response.status : 'No response',
      endpoint: error.config ? error.config.url : 'No endpoint',
    };

    // Log the error to Firestore
    await db.collection('apiErrors').add(errorLog);

    return Promise.reject(error);
  },
);

export default axiosInstance;
