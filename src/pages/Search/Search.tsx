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
    IonButton,
    IonSearchbar
} from '@ionic/react';
// Icons
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
import { useModalContext } from '../../context/ModalContext';
// API
import { logUserFact } from '../../api/UserFacts';
import { postUserSearch } from '../../api/Search';
// Interfaces
import { VideoItem } from '../../components/Videos/VideoList';
// Components
import VideoList from '../../components/Videos/VideoList';
import ArticleItem from '../../components/Articles/ArticleItem';
import { WP_Article, getArticlesByIds } from '../../api/WordPress/GetArticles';
// Modals
import AgeGroupModal from '../../components/Modals/AgeGroupModal/AgeGroupModal';

interface SearchResults {
    message: string;
    videos: VideoItem[];
    articleIds: number[];
}

const SearchPage: React.FC<{ currentTab: string }> = ({ currentTab }) => {
    const { apiUrl } = useContext(ApiUrlContext);                               // Get the API URL from the context
    const { cadeyUserId, cadeyUserAgeGroup } = useContext(CadeyUserContext);    // Get the Cadey User ID from the context
    const { isAgeGroupModalOpen, setAgeGroupModalOpen } = useModalContext();    // Get the age group modal state from the context

    const [userQuery, setUserQuery] = useState<string>("");
    const { setCurrentBasePage, setCurrentAppPage } = useAppPage();
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResults>({
        message: "",
        videos: [],
        articleIds: [],
    });
    const [articleResults, setArticleResults] = useState<WP_Article[]>([]);

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

    const handleInputChange = (e: any) => {
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

            // Check if the user has an age group
            if (cadeyUserAgeGroup === 0) {
                // Store the query in state so we can perform it after the user selects an age group
                setUserQuery(searchTerm);
                // Open the age group modal
                setAgeGroupModalOpen(true);
                // Return early
                return;
            }

            // Perform the search for the user
            performSearch(searchTerm, cadeyUserAgeGroup);
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
            if (response.articleIds.length > 0) {
                setArticleResults(await getArticlesByIds(response.articleIds));
            }
        } catch (error) {
            console.error("Error performing user search: ", error);
        }
        // Clear loading state
        setIsLoading(false);
    }

    const onAgeGroupSelected = async (selectedAgeGroup: number) => {
        // Perform the search for the user
        performSearch(userQuery, selectedAgeGroup);
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

            {/* Show an age group modal if context dictates */}
            <AgeGroupModal isOpen={isAgeGroupModalOpen} onAgeGroupSelected={onAgeGroupSelected} />
            
            <IonRow className="search-container">
                {/* Search bar */}
                <IonSearchbar 
                    className="search-bar" 
                    onIonChange={handleInputChange}
                    onKeyDown={handleSearchInput}
                    mode="ios"
                ></IonSearchbar>
            </IonRow>

            {/* Explanatory copy */}
            <IonRow className="search-directions">
                {/* Text that changes based on whether there are any search results */}
                {(searchResults.videos.length > 0 || searchResults.articleIds.length > 0) ? (
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
            {articleResults.length > 0 && (
                <IonRow className="article-list-row search-results">
                    <IonText><h2>Articles</h2></IonText>
                    <IonList>
                        {articleResults.map((article) => (
                            <ArticleItem article={article} key={article.id} />
                        ))}
                    </IonList>
                </IonRow>
            )}
            
        </IonContent>
    </IonPage>
    );
};

export default SearchPage;