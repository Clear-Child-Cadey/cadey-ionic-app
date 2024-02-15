import React, { useState, useContext, useEffect } from 'react';
import { 
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonProgressBar,
    IonIcon,
    IonSearchbar,
    IonRow,
    IonButton,
} from '@ionic/react';
// Icons
import { checkmarkOutline } from 'ionicons/icons';
// CSS
import './Library.css';
// Components
import { Symptom } from '../../components/ConcernsList/ConcernsList';
// Contexts
import UnreadContext from '../../context/UnreadContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { getNewGoalsIndicator } from '../../api/Goals';
import { logUserFact } from '../../api/UserFacts';
import { getRecommendations } from '../../api/GetRecommendations';
// Routing
import { useHistory } from 'react-router-dom';

const LibraryPage: React.FC = () => {

    // State variable flags to indicate which component to display
    const [showSymptomsList, setShowSymptomsList] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // State variables for storing data
    const [pageTitle, setPageTitle] = useState("Library");
    const [results, setResults] = useState<any | null>(null);

    // Context variables
    const { unreadGoals, setUnreadGoals } = useContext(UnreadContext);
    const { cadeyUserId, cadeyUserAgeGroup } = useContext(CadeyUserContext);
    const { apiUrl } = useContext(ApiUrlContext);
    const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

    // Other variables
    const history = useHistory();
  
    // Set the title when the component mounts
    useEffect(() => {
        document.title = "Library";
        setCurrentBasePage('Library');
        setCurrentAppPage('Library');
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Library',
        });
    }, []);

    const handleInputChange = (e: any) => {
        
        // Restrict input to 100 characters
        const inputValue = e.detail.value;
        if (inputValue.length > 100) {
            const limitedValue = inputValue.slice(0, 100);
            e.target.value = limitedValue;
        }
    }

    const handleSearchInput = async (e: React.KeyboardEvent) => {
        
        const searchTerm = (e.target as HTMLInputElement).value;
        
        if (e.key === "Enter") {
    
            // Check if the user has entered a search term
            if (searchTerm.trim() === "") {
                alert("Please enter a search term.");
                return;
            }
    
            // Route the user to the search page
            history.push({
                pathname: '/App/Library/Search',
                search: `?query=${encodeURIComponent(searchTerm)}`, // Optional if you want the term in the URL
                state: { query: searchTerm }
            });
        }
    }

    const handleButtonClick = (route: string) => {
        // Log user fact that the user clicked on the button
        // logUserFact({
        //   cadeyUserId: cadeyUserId,
        //   baseApiUrl: apiUrl,
        //   userFactTypeName: 'TapBarNavClick',
        //   appPage: 'Home',
        //   detail1: pageName,
        // });
        
        // Navigate to the page
        history.push('/App' + route);
    }
    

    // Render the screen
    return (
        <IonPage className='library'>
            <IonContent fullscreen>
                <IonHeader class="header">
                    <h2>Library</h2>
                </IonHeader>
                <IonRow className="library-home">
                    <IonRow className="search-container">
                        {/* Search bar */}
                        <IonSearchbar 
                            className="search-bar" 
                            onIonChange={handleInputChange}
                            onKeyDown={handleSearchInput}
                            mode="ios"
                        ></IonSearchbar>
                    </IonRow>
                    
                    <div className='library-buttons'>
                        <div className='library-button' onClick={() => handleButtonClick("/Library/Videos")}>
                            <img src="assets/svgs/icn-video.svg" className='' />
                            <div className='library-button-text'>
                                <h3>How-to videos</h3>
                                <p>Search by topic, behavior, or condition.</p>
                            </div>
                        </div>
                        <div className='library-button' onClick={() => handleButtonClick("/Library/Articles")}>
                            <img src="assets/svgs/icn-articles.svg" className='' />
                            <div className='library-button-text'>
                                <h3>Articles</h3>
                                <p>Explore clinically-proven recommendations to try with your child.</p>
                            </div>
                        </div>
                    </div>
                </IonRow>
            </IonContent>
        </IonPage>
    );
}

export default LibraryPage;
