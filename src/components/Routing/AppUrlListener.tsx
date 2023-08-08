import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { App, URLOpenListenerEvent, AppState } from '@capacitor/app';

const AppUrlListener: React.FC<any> = () => {
    let history = useHistory();
    const location = useLocation();

    useEffect(() => {
        // Listener for detecting URL on app open
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            const urlObject = new URL(event.url);
            const slug = urlObject.pathname;
        
            if (slug) {
                history.push(slug);
            }
        });

        // Listener for the appStateChange event
        const handleAppStateChange = (state: AppState) => {
            // If app becomes active
            if (state.isActive) {
                // Redirect traffic to the Home screen if the route doesn't match an App route
                // This will happen when the user opens a link to the website in the app, then closes the app browser
                if (!location.pathname.includes("/App/")) {
                    history.push('/App/Home');
                }
            }
        };
        
        App.addListener('appStateChange', handleAppStateChange);
        
        // Cleanup when the component unmounts
        return () => {
            App.removeAllListeners();
        }
        
    }, [history, location]);
  
    return null;
  };
  
  export default AppUrlListener;