import React, { useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { App, URLOpenListenerEvent, AppState } from '@capacitor/app';
import OneSignal from 'onesignal-cordova-plugin';
// Contexts
import UnreadCountContext from '../../context/UnreadCountContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
// API
import { getUserMessages } from '../../api/UserMessages';
// Interfaces
import { Message } from '../../pages/Messages/Messages';

const AppUrlListener: React.FC<any> = () => {
    let history = useHistory();
    const location = useLocation();
    const unreadCount = useContext(UnreadCountContext); // Get the current unread count
    const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
    const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context

    useEffect(() => {
        // Listener for detecting URL on app open
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            console.log('App opened with URL: ', event.url);
            const urlObject = new URL(event.url);
            const host = urlObject.hostname;
            const path = urlObject.pathname;
            var fullSlug = `/${host}${path}`;
            
            if (fullSlug) {
                while (fullSlug.startsWith('//')) {
                    // iOS and Android handle these differently
                    console.log('Removing extra slash: ' + fullSlug);
                    fullSlug = fullSlug.replace('//', '/');
                }
                console.log('Redirecting to: ', fullSlug);
                history.push(fullSlug);
            }
        });

        // Listener for the appStateChange event
        const handleAppStateChange = (state: AppState) => {
            // If app becomes active
            if (state.isActive) {
                // Get latest messages and update the unread count
                const fetchMessages = async () => {
                    try {
                      // Getting messages
                      const data: Message[] = await getUserMessages(apiUrl, cadeyUserId);
                      const unread = data.filter(data => !data.isRead).length;
                      unreadCount.setUnreadCount?.(unread);
                    } catch (error) {
                        console.error("Error fetching video details:", error);
                    }
                };
                fetchMessages(); // Get data when the component mounts
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