import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { App, URLOpenListenerEvent } from '@capacitor/app';

const AppUrlListener: React.FC<any> = () => {
    let history = useHistory();
    useEffect(() => {
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            const urlObject = new URL(event.url);
            const slug = urlObject.pathname;
        
            if (slug) {
                history.push(slug);
                console.log(`Redirecting to ${slug}`);
            }
        });
        
    }, []);
  
    return null;
  };
  
  export default AppUrlListener;