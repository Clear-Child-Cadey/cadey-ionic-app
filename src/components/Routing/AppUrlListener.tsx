import React, { useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { App, URLOpenListenerEvent, AppState } from '@capacitor/app';
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
                document.title = 'Messages'; // Set the page title when the component mounts
                fetchMessages(); // Get data when the component mounts
                

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