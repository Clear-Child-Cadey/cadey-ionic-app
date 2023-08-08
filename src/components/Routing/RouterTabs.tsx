import React, { useState, useContext } from 'react';
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
// Contexts
import { HomeTabVisibilityContext } from '../../context/TabContext';

const RouterTabs: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('Home');
  const homeTabVisibility = useContext(HomeTabVisibilityContext);
  const isHomeTabVisible = homeTabVisibility?.isHomeTabVisible;

  // TODO: Replace with actual API call
  const unreadMessages = 5;

  return (
    <IonReactRouter>
      {/* Handle routing */}
      <AppUrlListener></AppUrlListener>
      <IonTabs onIonTabsDidChange={(e: CustomEvent) => setCurrentTab(e.detail.tab)}>
        <IonRouterOutlet>
        <Switch>
            {/* Define all of the specific routes */}
            <Route exact path="/App/Concerns" component={ConcernsPage} />
            <Route exact path="/App/Home" render={() => <HomePage currentTab={currentTab} />} />
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
        <IonTabBar slot="bottom">
          {/* Show the Home tab if it should be visible */}
          {isHomeTabVisible && (
            <IonTabButton tab="Home" href="/App/Home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
          )}
          <IonTabButton tab="Concerns" href="/App/Concerns">
            <IonIcon icon={gridOutline} />
            <IonLabel>Concerns</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Messages" href="/App/Messages">
            <IonIcon icon={mailOutline} />
            <IonLabel>Messages</IonLabel>
            {unreadMessages > 0 && (
              <IonBadge color="danger" className="unread-messages">{unreadMessages}</IonBadge>
            )}
          </IonTabButton>
          {/* <IonTabButton tab="Admin" href="/App/Admin">
            <IonIcon icon={gridOutline} />
            <IonLabel>Admin</IonLabel>
          </IonTabButton> */}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

export default RouterTabs;
