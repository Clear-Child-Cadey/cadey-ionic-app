import React, { useState, useContext, useEffect } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
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
// Ionicons
import { homeOutline, libraryOutline, walkOutline } from 'ionicons/icons';
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
// Components
import AppUrlListener from '../Routing/AppUrlListener';
import RedirectToWeb from './RedirectToWeb';
import OneSignalInitializer from '../../api/OneSignal/OneSignalInitializerComponent';
// Contexts
import { HomeTabVisibilityContext } from '../../context/TabContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
import UnreadContext from '../../context/UnreadContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { getUserMessages } from '../../api/UserMessages';
import { getNewGoalsIndicator } from '../../api/Goals';
// Interfaces
import MessagesPage, { Message } from '../../pages/Messages/Messages';
import { logUserFact } from '../../api/UserFacts';
import ArticlesList from '../Articles/ArticlesList';
import ArticleDetail from '../Articles/ArticleDetail';

const RouterTabs: React.FC = () => {
  const homeTabVisibility = useContext(HomeTabVisibilityContext);
  const isHomeTabVisible = homeTabVisibility?.isHomeTabVisible;
  const { 
    unreadMessagesCount, 
    setUnreadMessagesCount,
    unreadGoals,
    setUnreadGoals,
  } = useContext(UnreadContext); // Get the current unread count

  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context
  const { currentAppPage } = useAppPage();

  const handleTabClick = async (tabName: string) => {
    // Log user fact that the user clicked on the tap bar
    logUserFact({
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'TapBarNavClick',
      appPage: currentAppPage,
      detail1: tabName,
    });
  };

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

  return (
    <IonReactRouter>
      {/* Listen for App URLs */}
      <AppUrlListener></AppUrlListener>

      {/* Initialize OneSignal and listen for OneSignal callbacks */}
      {window.cordova && <OneSignalInitializer />}

      {/* Handle routing */}
      <IonTabs>
        <IonRouterOutlet>
          <Switch>
            {/* Define all of the specific routes */}

            {/* Home routes */}
            <Route exact path="/App/Home" component={HomePage} />
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

            {/* Catch-all route - redirect to web (cadey.co, articles, contact us, etc) */}
            <Route component={RedirectToWeb} />
          </Switch>
        </IonRouterOutlet>
        {/* Tab Bar */}
        <IonTabBar slot="bottom" className="">
          <IonTabButton 
            tab="Home" 
            href="/App/Home"
            onClick={() => handleTabClick('Home')}
          >
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          
          {/* Paths */}
          <IonTabButton 
            tab="Paths" 
            href="/App/Paths/"
            onClick={() => handleTabClick('Paths')}
          >
            <IonIcon icon={walkOutline} />
            <IonLabel>Paths</IonLabel>
          </IonTabButton>

          {/* Library */}
          <IonTabButton 
            tab="Library" 
            href="/App/Library"
            onClick={() => handleTabClick('Library')}
          >
            <IonIcon icon={libraryOutline} />
            <IonLabel>Library</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

export default RouterTabs;
