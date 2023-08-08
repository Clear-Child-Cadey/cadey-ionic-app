import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Browser } from '@capacitor/browser';

const RedirectToWeb: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const redirectToBrowser = async () => {
            const fullPath = `https://cadey.co${location.pathname}${location.search}${location.hash}`;
            await Browser.open({ url: fullPath });
        };

        redirectToBrowser();
    }, [location]);

    return null;
};

export default RedirectToWeb;