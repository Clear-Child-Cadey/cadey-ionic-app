import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { initializeOneSignal } from './InitOneSignal';

const OneSignalInitializer: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
        const handleNotificationOpened = (jsonData: any) => {
            console.log('notificationOpenedCallback in OneSignalInitializer.tsx: ', JSON.stringify(jsonData));
            const launchURL = jsonData?.notification?.launchURL;

            if (launchURL) {
                const urlObject = new URL(launchURL);
                const host = urlObject.hostname;
                const path = urlObject.pathname;
                let fullSlug = `/${host}${path}`;

                while (fullSlug.startsWith('//')) {
                    fullSlug = fullSlug.replace('//', '/');
                }
                console.log('Redirecting to: ', fullSlug);
                history.push(fullSlug);
            }
        };

        // Initialize OneSignal (Push Notifications Platform)
        initializeOneSignal(handleNotificationOpened);
    }, [history]);

    return null;  // No rendering required for this component
}

export default OneSignalInitializer;
