import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import UserIdContext from './context/UserIdContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/main.css';

// UUID Library (Used to generate a unique ID for the user)
import { v4 as uuidv4 } from 'uuid';

// Generate a unique ID for the user
let userId = localStorage.getItem('user_id');
if (!userId) {
  userId = uuidv4();
  localStorage.setItem('user_id', userId);
}

// API call to indicate a user has opened the app
const postLogEvent = async () => {
  const url = 'https://a47vhkjc3cup25cpotv37xvcj40depdu.lambda-url.us-west-2.on.aws/';
  const bodyObject = {
    user_id: userId,
    log_event: 'OPEN',
    data: ''
  };
  const requestOptions = {
    method: 'POST',
    headers: { 
      Accept: 'application/json', 
    },
    body: JSON.stringify(bodyObject)
  };

  try {
    const response = await fetch(url, requestOptions);
  } catch (error) {
    console.error('Error during API call', error);
  }
};

postLogEvent();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <UserIdContext.Provider value={userId}>
      <App />
    </UserIdContext.Provider>
  </React.StrictMode>
);