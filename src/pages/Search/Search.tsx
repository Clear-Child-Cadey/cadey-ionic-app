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
import { postUserSearch } from '../../api/Search';
// Interfaces
import { VideoItem } from '../../components/Videos/VideoList';

interface SearchResults {
    message: string;
    videos: VideoItem[];
    articleIds: number[];
}

const SearchPage: React.FC<{ currentTab: string }> = ({ currentTab }) => {
    const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
    const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
    const { setCurrentBasePage, setCurrentAppPage } = useAppPage();
    const [isLoading, setIsLoading] = useState(false);
    const [ageGroup, setAgeGroup] = useState(0);
    const [searchResults, setSearchResults] = useState<SearchResults>({
        message: "",
        videos: [],
        articleIds: [],
    });

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

    const handleSearchInput = async (e: React.KeyboardEvent) => {
        const searchTerm = (e.target as HTMLInputElement).value;
        
        if (e.key === "Enter") {

            if (searchTerm.trim() === "") {
                alert("Please enter a search term.");
                return;
            }

            if (ageGroup === 0) {
                alert("Please select an age group.");
                return;
            }

            // Check if searchTerm is not empty before proceeding
            if (searchTerm.trim()) {
                performSearch(searchTerm, ageGroup);
            }
        }
    }

    const performSearch = async (searchTerm: string, ageGroup: number) => {
        try {
            const response = await postUserSearch(apiUrl, cadeyUserId, searchTerm, ageGroup);
            setSearchResults(response);
        } catch (error) {
            console.error("Error performing user search: ", error);
        }
    }

    useEffect(() => {
        console.log("Search Results: ", searchResults);
    }, [searchResults]);

    const handleAgeSelection = (ageGroup: number) => {
        setAgeGroup(ageGroup);
        // Get the current contents of the search field and then perform a search
        const searchField = document.querySelector(".search-bar") as HTMLIonSearchbarElement;
        const searchTerm = searchField.value;
        if (searchTerm && searchTerm.trim() !== "") {
            performSearch(searchTerm, ageGroup);    
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
            <IonSearchbar className="search-bar" onKeyDown={handleSearchInput}></IonSearchbar>

            {/* Age group buttons */}
            <IonRow className="age-group-buttons">
                <IonButton 
                    className={`age-group-button ${ageGroup === 1 ? "selected" : ""}`}
                    onClick={() => handleAgeSelection(1)}
                >
                    0-4
                </IonButton>
                <IonButton 
                    className={`age-group-button ${ageGroup === 2 ? "selected" : ""}`}
                    onClick={() => handleAgeSelection(2)}
                >
                    5-11
                </IonButton>
                <IonButton 
                    className={`age-group-button ${ageGroup === 3 ? "selected" : ""}`}
                    onClick={() => handleAgeSelection(3)}
                >
                    12+
                </IonButton>
            </IonRow>

            {/* Explanatory copy */}
            <IonRow className="search-directions">
                <IonText>
                    <p>Try keywords like 'tantrum', or 'having trouble focusing at school'</p>
                </IonText>
            </IonRow>

            {/* Message (usually indicating no results) */}
            {searchResults.message && (
                <IonRow className="search-message">
                    <IonText>
                        <p>{searchResults.message}</p>
                    </IonText>
                </IonRow>
            )}

            {/* Video Results */}
            {searchResults.videos.length > 0 && (
                <IonList>
                    {searchResults.videos.map((video) => (
                        <IonItem key={video.sourceId}>
                            <IonLabel>{video.title}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>    
            )}

            {/* Article Results */}
            {searchResults.articleIds.length > 0 && (
                <IonList>
                    {searchResults.articleIds.map((articleId) => (
                        <IonItem key={articleId}>
                            <IonLabel>Article {articleId}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>    
            )}
            
        </IonContent>
    </IonPage>
    );
};

export default SearchPage;