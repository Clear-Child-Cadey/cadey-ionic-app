import React, { useState, useContext, useEffect } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import { 
  IonTabs, 
  IonRouterOutlet, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel, 
  IonBadge,
} from '@ionic/react';
// CSS
import './RouterTabs.css';
// Icons
import { homeOutline, libraryOutline, walkOutline } from 'ionicons/icons';
import { HomeIcon } from '../../svgs/NavHome';
import { PathsIcon } from '../../svgs/NavPaths';
import { LibraryIcon } from '../../svgs/NavLibrary';
// Pages
import HomePage from '../../pages/Home/Home';
import AdminPage from '../../pages/Admin/Admin';
import LibraryPage from '../../pages/Library/Library';
import SearchPage from '../../pages/Search/Search';
import PathListingPage from '../../pages/Paths/PathListing';
import PathDetailPage from '../../pages/Paths/PathDetail';
import ArticleCategoryListingPage from '../../pages/Articles/ArticleCategoryListing';
import ArticlesPage from '../../pages/Articles/ArticleListing';
import ArticleDetailPage from '../../pages/Articles/ArticleDetail';
import VideoLibraryPage from '../../pages/Library/VideoLibrary';
import WelcomePage from '../../pages/Welcome/Welcome';
import WelcomePathSelect from '../../pages/Welcome/WelcomePathSelect';
import WelcomeAgeGroupSelect from '../../pages/Welcome/WelcomeAgeGroup';
import WelcomePush from '../../pages/Welcome/WelcomePush';
// Components
import AppUrlListener from '../Routing/AppUrlListener';
import RedirectToWeb from './RedirectToWeb';
import OneSignalInitializer from '../../api/OneSignal/OneSignalInitializerComponent';
// Contexts
import { useTabContext } from '../../context/TabContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
import UnreadContext from '../../context/UnreadContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { getUserMessages } from '../../api/UserMessages';
// Interfaces
import MessagesPage, { Message } from '../../pages/Messages/Messages';
import { logUserFact } from '../../api/UserFacts';

const RouterTabs: React.FC = () => {
  // Tab bar visibility
  const { isTabBarVisible, setIsTabBarVisible } = useTabContext();

  const { 
    unreadMessagesCount, 
    setUnreadMessagesCount,
    unreadGoals,
    setUnreadGoals,
  } = useContext(UnreadContext); // Get the current unread count

  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { currentAppPage } = useAppPage();
  const location = useLocation();
  const history = useHistory();
  const [isWelcomeSequence, setIsWelcomeSequence] = useState(false);

  // Use effect to update setIsWelcomeSequence
  useEffect(() => {
    // Update the state based on the current path
    setIsWelcomeSequence(location.pathname.startsWith('/App/Welcome'));
  }, [location]);

  // On component mount: 
  // - Set the page title
  // - Get the user's messages
  useEffect(() => {
    const fetchMessages = async () => {
        try {
          // Getting messages
          const messagesData: Message[] = await getUserMessages(apiUrl, cadeyUserId);
          const unreadMessages = messagesData.filter(messagesData => !messagesData.isRead).length;
          setUnreadMessagesCount?.(unreadMessages);
        } catch (error) {
            console.error("Error fetching video details:", error);
        }
    };
    // Get data when the component mounts
    fetchMessages();
  }, []);

  const handleTabClick = async (tabName: string, route: string) => {
    // Log user fact that the user clicked on the tap bar
    logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'TapBarNavClick',
      appPage: currentAppPage,
      detail1: tabName,
    });

    history.push(route);
  };

  // Determine if a tab should be highlighted based on the current path
  const isTabActive = (tabPath: string): boolean => {
    // You might need more sophisticated logic depending on your routes
    return location.pathname.startsWith(tabPath);
  };

  return (
    <>
      {/* Listen for App URLs */}
      <AppUrlListener></AppUrlListener>

      {/* Initialize OneSignal and listen for OneSignal callbacks */}
      {window.cordova && <OneSignalInitializer />}

      {/* If the tab bar is not visible, the user is in the welcome sequence and should not see tabs */}
      {!isTabBarVisible && (
        <IonRouterOutlet>
          <Switch>
            {/* If the user is in the welcome sequence, show the welcome page */}
            <Route exact path="/App/Welcome" component={WelcomePage} />

            <Route exact path="/">
              <Redirect to="/App/Welcome" />
            </Route>

            {/* Welcome sequence routes */}
            <Route exact path="/App/Welcome/Path" component={WelcomePathSelect} />
            <Route exact path="/App/Welcome/AgeGroup" component={WelcomeAgeGroupSelect} />
            <Route exact path="/App/Welcome/Push" component={WelcomePush} />

            {/* Miscellaneous routes */}
            <Route exact path="/App/Admin" component={AdminPage} />
          </Switch>
        </IonRouterOutlet>
      )}

      {isTabBarVisible && (
        // If the tab bar is visible, show the tabs
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
              {/* Define all of the specific routes */}

              {/* Home routes */}
              <Route exact path="/App/Home" render={(routeProps) => {
                const vimeoId = routeProps.location.search.split('video=')[1];
                const articleId = routeProps.location.search.split('article=')[1];

                return (
                  
                    <HomePage 
                      vimeoIdFromUrl={vimeoId} // Pass extracted videoId to the HomePage component
                      articleIdFromUrl={articleId} // Pass extracted articleId to the HomePage component
                    />
                );
              }} />
              <Route exact path="/">
                  <Redirect to="/App/Home" />
              </Route>
              <Route exact path="/App/Home/Messages" component={MessagesPage} />
              
              {/* Library routes */}
              <Route exact path="/App/Library" component={LibraryPage} />
              <Route exact path="/App/Library/Search" component={SearchPage} />
              <Route exact path="/App/Library/Articles" component={ArticleCategoryListingPage} />
              <Route exact path="/App/Library/Articles/Category" component={ArticlesPage} />
              <Route exact path="/App/Library/Articles/Article" component={ArticleDetailPage} />
              <Route exact path="/App/Library/Videos" component={VideoLibraryPage} />
              
              {/* Paths routes */}
              <Route exact path="/App/Paths">
                <Redirect to="/App/Paths/PathListing" />
              </Route>
              <Route exact path="/App/Paths/PathListing" component={PathListingPage} />
              <Route exact path="/App/Paths/PathDetail" component={PathDetailPage} />
              
              {/* Miscellaneous routes */}
              <Route exact path="/App/Admin" component={AdminPage} />

              {/* Re-route any route with "/App/Welcome" to the home screen */}
              <Route path="/App/Welcome">
                <Redirect to="/App/Home" />
              </Route>

              {/* Catch-all route - redirect to web (cadey.co, articles, contact us, etc) */}
              <Route component={RedirectToWeb} />
            </Switch>
          </IonRouterOutlet>
          {/* Tab Bar */}
          <IonTabBar slot="bottom" className={`tab-bar ${isWelcomeSequence ? 'welcome' : ''}`}>
            <IonTabButton 
              tab="Home" 
              onClick={() => handleTabClick('Home', '/App/Home')}
              selected={isTabActive('/App/Home')}
            >
              <HomeIcon />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            
            {/* Paths */}
            <IonTabButton 
              tab="Paths" 
              onClick={() => handleTabClick('Path Listing', '/App/Paths')}
              selected={isTabActive('/App/Paths')}
            >
              <PathsIcon />
              <IonLabel>Paths</IonLabel>
            </IonTabButton>

            {/* Library */}
            <IonTabButton 
              tab="Library" 
              onClick={() => handleTabClick('Library', '/App/Library')}
              selected={isTabActive('/App/Library')}
            >
              <LibraryIcon />
              <IonLabel>Library</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>  
      )}
    </>
  );
}

export default RouterTabs;
