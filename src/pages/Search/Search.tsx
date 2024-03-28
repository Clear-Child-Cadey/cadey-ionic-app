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
// Routing
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SearchResults {
    message: string;
    videos: VideoItem[];
    articleIds: number[];
}

interface LocationState {
    query?: string;
  }

const SearchPage: React.FC<{ currentTab: string }> = ({ currentTab }) => {
    const { apiUrl } = useContext(ApiUrlContext);                               // Get the API URL from the context
    // const { cadeyUserAgeGroup } = useContext(CadeyUserContext);    // Get the Cadey User ID from the context
    const cadeyUserId = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  );
  const cadeyUserAgeGroup = useSelector(
    (state: RootState) => state?.authStatus?.userData?.cadeyUser?.ageGroup,
  );

    const location = useLocation();
    const history = useHistory();

    const { currentBasePage, setCurrentBasePage, currentAppPage, setCurrentAppPage } = useAppPage();
    const [isLoading, setIsLoading] = useState(false);
    const [userQuery, setUserQuery] = useState<string>("");
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
        console.log("Logging user fact for appPageNavigation");
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Search',
        });
        
        // Check if we already have a query via state or query params
        var query = "";

        const queryFromState = (location.state as LocationState)?.query;
        const queryParams = new URLSearchParams(location.search);
        const queryFromParams = queryParams.get('query');
        
        if (queryFromState) {
            query = queryFromState;
        } else if (queryFromParams) {
            query = queryFromParams;
        }
        
        // If so, perform the search
        if (query && query !== "") {
            // Add the query to the search bar
            const searchField = document.querySelector(".search-bar") as HTMLIonSearchbarElement;
            searchField.value = query;

            // Perform the search for the user
            performSearch(query, cadeyUserAgeGroup);
        }
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
        setArticleResults([]);

        // Set loading state
        setIsLoading(true);
        
        // Get new results
        try {
            const response = await postUserSearch(apiUrl, cadeyUserId, searchTerm, ageGroup);
            setSearchResults(response);
            if (response.articleIds.length > 0) {
                setArticleResults(await getArticlesByIds(response.articleIds));
            }

            // Clear the search term from state
            setUserQuery('');

            // Replace the current entry in the history stack without the query parameter
            history.replace({
                pathname: location.pathname, // keep the current pathname
                search: '', // clear out the query string
            });

        } catch (error) {
            console.error("Error performing user search: ", error);
        }
        
        // Clear loading state
        setIsLoading(false);
    }

    const handleBack = ( route: string ) => {
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'UserTap',
            appPage: currentAppPage,
            detail1: currentBasePage,
            detail2: 'Back Button',
        });

        history.push(route);
    }

    return (
        <IonPage className="article-category-listing">
            <IonHeader class="header">
                <IonToolbar className="header-toolbar">
                    <a className="back-link" onClick={() => handleBack("/App/Library")}>Library</a>
                    <h2>Search</h2>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
            
                {/* Show loading state */}
                <IonLoading isOpen={isLoading} message={'Loading Results...'} />
                
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
                    {/* Show results copy if there are results */}
                    {(searchResults.videos.length == 0 && searchResults.articleIds.length == 0 && searchResults.message == "") && (
                        <IonText>
                            <p>Try keywords like 'tantrum', or 'having trouble focusing at school'.</p>
                        </IonText>
                    )}
                    {(searchResults.videos.length > 0 || searchResults.articleIds.length > 0)  && (
                        <IonText>
                            <p>Here are a few suggestions, based on your search:</p>
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