import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { initializeOneSignal } from './InitOneSignal';

const OneSignalInitializer: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
        const handleNotificationOpened = (jsonData: any) => {
            const launchURL = jsonData?.notification?.launchURL;

            if (launchURL) {
                const urlObject = new URL(launchURL);
                const host = urlObject.hostname;
                const path = urlObject.pathname;
                let fullSlug = `/${host}${path}`; // Have to add the extra slash for iOS
 
                // iOS and Android build the URL differently, this trims the extra slashes on Android
                while (fullSlug.startsWith('//')) {
                    fullSlug = fullSlug.replace('//', '/');
                }
                history.push(fullSlug);
            }
        };

        // Initialize OneSignal (Push Notifications Platform)
        initializeOneSignal(handleNotificationOpened);
    }, [history]);

    return null;  // No rendering required for this component
}

export default OneSignalInitializer;
