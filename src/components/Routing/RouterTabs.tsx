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
  IonTab,
  IonBadge,
  IonTitle,
  IonItem,
  IonRow,
  IonLoading,
  IonRouterLink,
} from '@ionic/react';
// CSS
import './RouterTabs.css';
// Ionicons
import { homeOutline, gridOutline, mailOutline } from 'ionicons/icons';
// Pages
import ConcernsPage from '../../pages/Concerns/Concerns';
import HomePage from '../../pages/Home/Home';
import AdminPage from '../../pages/Admin/Admin';
import VideoDetailPage from '../../pages/Videos/VideoDetail';
import MessagesPage from '../../pages/Messages/Messages';
// Components
import AppUrlListener from '../Routing/AppUrlListener';
import RedirectToWeb from './RedirectToWeb';
import OneSignalInitializer from '../../api/OneSignal/OneSignalInitializerComponent';
// Contexts
import { HomeTabVisibilityContext } from '../../context/TabContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
import UnreadCountContext from '../../context/UnreadCountContext';
import { useSpotlight } from '../../context/SpotlightContext';
// API
import { getUserMessages } from '../../api/UserMessages';
// Interfaces
import { Message } from '../../pages/Messages/Messages';

const RouterTabs: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('Home');
  const homeTabVisibility = useContext(HomeTabVisibilityContext);
  const isHomeTabVisible = homeTabVisibility?.isHomeTabVisible;
  const unreadCount = useContext(UnreadCountContext); // Get the current unread count

  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context

  const { showSpotlight } = useSpotlight();
  const [tutorialStep, setTutorialStep] = useState(0);

  // On component mount: 
  // - Set the page title
  // - Get the user's messages
  useEffect(() => {
    const fetchMessages = async () => {
        try {
          // Getting messages
          const data: Message[] = await getUserMessages(apiUrl, cadeyUserId);
          const unread = data.filter(data => !data.isRead).length;
          unreadCount.setUnreadCount?.(unread);
        } catch (error) {
            console.error("Error fetching video details:", error);
        }
    };
    fetchMessages(); // Get data when the component mounts
  }, []);

  return (
    <IonReactRouter>
      {/* Listen for App URLs */}
      <AppUrlListener></AppUrlListener>
      {/* Initialize OneSignal and listen for OneSignal callbacks */}
      {window.cordova && <OneSignalInitializer />}
      {/* Conditionally show the spotlight */}
      {showSpotlight && 
        <div className="spotlight">
          <p>You can get personalized videos anytime by tapping here</p>
        </div>
      }
      {/* Handle routing */}
      <IonTabs onIonTabsDidChange={(e: CustomEvent) => setCurrentTab(e.detail.tab)} className={showSpotlight ? "dim-overlay" : ""}>
        <IonRouterOutlet>
          <Switch>
            {/* Define all of the specific routes */}
            <Route exact path="/App/Concerns" component={ConcernsPage} />
            <Route exact path="/App/Home" render={() => 
              <HomePage 
                currentTab={currentTab} 
                tutorialStep={tutorialStep} 
                setTutorialStep={setTutorialStep} 
              />
            } />
            <Route exact path="/">
              {isHomeTabVisible ? (
                <Redirect to="/App/Home" />
              ) : (
                <Redirect to="/App/Concerns" />
              )}
            </Route>
            <Route exact path="/App/Admin" component={AdminPage} />
            <Route exact path="/App/Messages" component={MessagesPage} />
            <Route path="/App/VideoDetail/:id1/:id2" component={VideoDetailPage} />
            
            {/* Catch-all route - redirect to web (cadey.co, articles, contact us, etc) */}
            <Route component={RedirectToWeb} />
          </Switch>
        </IonRouterOutlet>
        {/* Tab Bar */}
        <IonTabBar slot="bottom" className={showSpotlight ? "spotlight-bar" : ""}>
          {/* Show the Home tab if it should be visible */}
          {isHomeTabVisible && (
            <IonTabButton tab="Home" href="/App/Home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
          )}
          <IonTabButton tab="Concerns" href="/App/Concerns" className={showSpotlight ? "spotlight-tab" : ""}>
            <IonIcon icon={gridOutline} />
            <IonLabel>Concerns</IonLabel>
          </IonTabButton>
          {/* Show the messages tab if it should be visible (same check as home tab) */}
          {isHomeTabVisible && (
            <IonTabButton tab="Messages" href="/App/Messages">
              <IonIcon icon={mailOutline} />
              <IonLabel>Messages</IonLabel>
              {unreadCount.unreadCount > 0 && (
                <IonBadge 
                  color="danger" 
                  className="unread-messages"
                  key={unreadCount.unreadCount}
                >
                  {unreadCount.unreadCount}
                </IonBadge>
              )}
            </IonTabButton>
          )}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

export default RouterTabs;
