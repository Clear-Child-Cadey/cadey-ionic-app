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
import { homeOutline, gridOutline, mailOutline, newspaperOutline, podiumOutline } from 'ionicons/icons';
// Pages
import ConcernsPage from '../../pages/Concerns/Concerns';
import HomePage from '../../pages/Home/Home';
import AdminPage from '../../pages/Admin/Admin';
import MessagesPage from '../../pages/Messages/Messages';
import GoalsPage from '../../pages/Goals/Goals';
import GoalDetailPage from '../../pages/Goals/GoalDetail';
// Components
import AppUrlListener from '../Routing/AppUrlListener';
import RedirectToWeb from './RedirectToWeb';
import OneSignalInitializer from '../../api/OneSignal/OneSignalInitializerComponent';
// Contexts
import { HomeTabVisibilityContext } from '../../context/TabContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';
import UnreadContext from '../../context/UnreadContext';
import { useSpotlight } from '../../context/SpotlightContext';
// API
import { getUserMessages } from '../../api/UserMessages';
import { logTapBarClick } from '../../api/UserFacts';
import { getUserGoals } from '../../api/Goals';
// Interfaces
import { Message } from '../../pages/Messages/Messages';
import { Goal } from '../../pages/Goals/Goals';

const RouterTabs: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('Home');
  const homeTabVisibility = useContext(HomeTabVisibilityContext);
  const isHomeTabVisible = homeTabVisibility?.isHomeTabVisible;
  const { 
    unreadMessagesCount, 
    setUnreadMessagesCount,
    unreadGoals,
    setUnreadGoals,
  } = useContext(UnreadContext); // Get the current unread count

  const { apiUrl } = useContext(ApiUrlContext); // Get the API URL from the context
  const userFactUrl = `${apiUrl}/userfact`;
  const { cadeyUserId } = useContext(CadeyUserContext); // Get the Cadey User ID from the context

  const { showSpotlight } = useSpotlight();
  const [tutorialStep, setTutorialStep] = useState(0);

  const handleTabClick = async (tabName: string) => {
    try {
        await logTapBarClick(cadeyUserId, userFactUrl, tabName, document.title);
    } catch (error) {
        console.error("Error logging tab bar click: ", error);
    }
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
          const goalsData: Goal[] = await getUserGoals(apiUrl, cadeyUserId);
          const unreadGoals = goalsData.filter(goalsData => !goalsData.isNew).length;
          if (unreadGoals > 0) {
            setUnreadGoals?.(true);
          } else {
            setUnreadGoals?.(false);
          }
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
            <Route exact path="/App/Home" render={(routeProps) => {
              const vimeoId = routeProps.location.search.split('video=')[1];
              const articleId = routeProps.location.search.split('article=')[1];

              return (
                  <HomePage 
                      currentTab={currentTab} 
                      tutorialStep={tutorialStep} 
                      setTutorialStep={setTutorialStep} 
                      vimeoIdFromUrl={vimeoId} // Pass extracted videoId to the HomePage component
                      articleIdFromUrl={articleId} // Pass extracted articleId to the HomePage component
                  />
              );
          }} />
            <Route exact path="/">
              {isHomeTabVisible ? (
                <Redirect to="/App/Home" />
              ) : (
                <Redirect to="/App/Concerns" />
              )}
            </Route>
            <Route exact path="/App/Admin" component={AdminPage} />
            <Route exact path="/App/Messages" component={MessagesPage} />       
            <Route exact path="/App/Goals" component={GoalsPage} />  
            <Route exact path="/App/GoalDetail" component={GoalDetailPage} />     
            {/* Catch-all route - redirect to web (cadey.co, articles, contact us, etc) */}
            <Route component={RedirectToWeb} />
          </Switch>
        </IonRouterOutlet>
        {/* Tab Bar */}
        <IonTabBar slot="bottom" className={showSpotlight ? "spotlight-bar" : ""}>
          {/* Show the Home tab if it should be visible */}
          {isHomeTabVisible && (
            <IonTabButton 
              tab="Home" 
              href="/App/Home"
              onClick={() => handleTabClick('Home')}
            >
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
          )}
          
          {/* Show the messages tab if it should be visible (same check as home tab) */}
          {isHomeTabVisible && (
            // Goals
            <IonTabButton 
              tab="Goals" 
              href="/App/Goals"
              onClick={() => handleTabClick('Goals')}
            >
              <IonIcon icon={podiumOutline} />
              <IonLabel>Goals</IonLabel>
              {unreadGoals && (
                <IonBadge 
                  color="danger" 
                  className="unread-messages"
                  key={unreadGoals==true ? 1 : 0}
                >
                </IonBadge>
              )}
            </IonTabButton>
          )}

          <IonTabButton 
            tab="Concerns" 
            href="/App/Concerns" 
            className={showSpotlight ? "spotlight-tab" : ""}
            onClick={() => handleTabClick('Concerns')}
          >
            <IonIcon icon={gridOutline} />
            <IonLabel>Concerns</IonLabel>
          </IonTabButton>

          {isHomeTabVisible && (
            // Messages
            <IonTabButton 
              tab="Messages" 
              href="/App/Messages"
              onClick={() => handleTabClick('Messages')}
            >
              <IonIcon icon={mailOutline} />
              <IonLabel>Messages</IonLabel>
              {unreadMessagesCount > 0 && (
                <IonBadge 
                  color="danger" 
                  className="unread-messages"
                  key={unreadMessagesCount}
                >
                  {unreadMessagesCount}
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
