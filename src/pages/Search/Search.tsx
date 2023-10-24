import React, { useEffect, useState, useContext } from 'react';
import './Search.css';
import { 
    IonPage, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonText,
    IonLoading,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonSearchbar
} from '@ionic/react';
// Icons
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { logUserFact } from '../../api/UserFacts';

const SearchPage: React.FC<{ currentTab: string }> = ({ currentTab }) => {
    const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
    const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
    const { setCurrentBasePage, setCurrentAppPage } = useAppPage();
    const [isLoading, setIsLoading] = useState(false);

    // On component mount, make an API call to get data
    useEffect(() => {
        setCurrentBasePage('Search');
        setCurrentAppPage('Search');
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Search',
          });
    }, [apiUrl, cadeyUserId]);

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const searchTerm = (e.target as HTMLInputElement).value;
    
            // Check if searchTerm is not empty before proceeding
            if (searchTerm.trim()) {
                console.log("User submitted the search query: ", searchTerm);
                
                // ... other logic related to processing the search ...
            }
        }
    }

    return (
    <IonPage className="search">
        <IonHeader>
        <IonToolbar>
            <IonTitle>Search</IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
                <IonToolbar>
                <IonTitle size="large">Search</IonTitle>
                </IonToolbar>
            </IonHeader>
        
            {/* Show loading state */}
            <IonLoading isOpen={isLoading} message={'Loading Results...'} />
            
            {/* Search bar */}
            <IonSearchbar className="search-bar" onKeyDown={handleSearch}></IonSearchbar>

            {/* Explanatory copy */}
            <IonRow className="search-directions">
                <IonText>
                    <p>Try keywords like 'tantrum', or 'having trouble focusing at school'</p>
                </IonText>
            </IonRow>
        </IonContent>
    </IonPage>
    );
};

export default SearchPage;