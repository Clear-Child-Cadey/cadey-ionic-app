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
// Components
import VideoList from '../../components/Videos/VideoList';
import ArticleItem from '../../components/Articles/ArticleItem';
import { search } from 'ionicons/icons';

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
        // Clear any current search results
        setSearchResults({
            message: "",
            videos: [],
            articleIds: [],
        });
        // Set loading state
        setIsLoading(true);
        // Get new results
        try {
            const response = await postUserSearch(apiUrl, cadeyUserId, searchTerm, ageGroup);
            setSearchResults(response);
        } catch (error) {
            console.error("Error performing user search: ", error);
        }
        // Clear loading state
        setIsLoading(false);
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
            
            <IonRow className="search-container">
                {/* Search bar */}
                <IonSearchbar className="search-bar" onKeyDown={handleSearchInput}></IonSearchbar>

                {/* Age group buttons */}
                <IonRow className="age-group-container">
                    <IonText className="child-age-text">My child is: </IonText>
                    <IonRow className="age-buttons-row">
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
                </IonRow>
            </IonRow>

            {/* Explanatory copy */}
            <IonRow className="search-directions">
                {/* Text that changes based on whether there are any search results */}
                {(searchResults.message || searchResults.videos.length > 0 || searchResults.articleIds.length > 0) ? (
                    <IonText>
                        <p>Here are a few suggestions, based on your search:</p>
                    </IonText>
                ) : (
                    <IonText>
                        <p>Try keywords like 'tantrum', or 'having trouble focusing at school'</p>
                    </IonText>
                )}
            </IonRow>

            {/* Message (usually indicating no results) */}
            {searchResults.message && (
                <IonRow className="search-message search-results">
                    <IonText>
                        <p>{searchResults.message}</p>
                    </IonText>
                    <IonButton
                        onClick={() => {
                            setSearchResults({
                                message: "",
                                videos: [],
                                articleIds: [],
                            });
                            const searchField = document.querySelector(".search-bar") as HTMLIonSearchbarElement;
                            searchField.setFocus();
                        }}
                    >Try Again</IonButton>
                </IonRow>
            )}

            {/* Video Results */}
            {searchResults.videos.length > 0 && (
                <IonRow className="video-list-row search-results">
                    <h2>Videos</h2>
                    <VideoList videos={searchResults.videos} listType='vertical' />
                </IonRow>  
            )}

            {/* Article Results */}
            {searchResults.articleIds.length > 0 && (
                <IonRow className="article-list-row search-results">
                    <IonText><h2>Articles</h2></IonText>
                    <IonList>
                        {searchResults.articleIds.map((articleId) => (
                            <ArticleItem articleId={articleId} key={articleId} />
                        ))}
                    </IonList>
                </IonRow>
            )}
            
        </IonContent>
    </IonPage>
    );
};

export default SearchPage;