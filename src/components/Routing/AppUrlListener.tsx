import React, { useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { App, URLOpenListenerEvent, AppState } from '@capacitor/app';
import OneSignal from 'onesignal-cordova-plugin';
// Contexts
import UnreadCountContext from '../../context/UnreadContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
// API
import { getUserMessages } from '../../api/UserMessages';
// Interfaces
import { Message } from '../../pages/Messages/Messages';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AppUrlListener: React.FC<any> = () => {
  const history = useHistory();
  const location = useLocation();
  const unreadCount = useContext(UnreadCountContext); // Get the current unread count
  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });

  useEffect(() => {
    // Listener for detecting URL on app open
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.log('DEEP LINK');
      console.log(event.url);
      const urlObject = new URL(event.url);
      const host = urlObject.hostname;
      const path = urlObject.pathname;
      const queryString = urlObject.search; // Grabs the query string
      let fullSlug = `/${host}${path}${queryString}`;

      if (fullSlug) {
        while (fullSlug.startsWith('//')) {
          // iOS and Android handle these differently
          fullSlug = fullSlug.replace('//', '/');
        }
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
            const data: Message[] = await getUserMessages(Number(cadeyUserId));
            const unread = data.filter((data) => !data.isRead).length;
            unreadCount.setUnreadMessagesCount?.(unread);
          } catch (error) {
            console.error('Error fetching video details:', error);
          }
        };
        fetchMessages(); // Get data when the component mounts
      }
    };

    App.addListener('appStateChange', handleAppStateChange);

    // Cleanup when the component unmounts
    return () => {
      App.removeAllListeners();
    };
  }, [history, location]);

  return null;
};

export default AppUrlListener;
