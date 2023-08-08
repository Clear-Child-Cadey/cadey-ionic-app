import React, { useState, useContext } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
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
          {/* Establish routes */}
          <Route path="/Concerns" component={ConcernsPage} exact />
          <Route path="/Home" render={() => <HomePage currentTab={currentTab} />} exact />
          {/* On app open, route user to Concerns if they don't have a Home tab */}
          <Route exact path="/">
            {isHomeTabVisible && (
              <Redirect to="/Home" />
            )}
            {!isHomeTabVisible && (
              <Redirect to="/Concerns" />
            )}
          </Route>
          <Route exact path="/admin" component={AdminPage} />
          <Route exact path="/Messages" component={MessagesPage} />
          <Route path="/VideoDetail/:id1/:id2" component={VideoDetailPage} />
        </IonRouterOutlet>
        {/* Tab Bar */}
        <IonTabBar slot="bottom">
          {/* Show the Home tab if it should be visible */}
          {isHomeTabVisible && (
            <IonTabButton tab="Home" href="/Home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
          )}
          <IonTabButton tab="Concerns" href="/Concerns">
            <IonIcon icon={gridOutline} />
            <IonLabel>Concerns</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Messages" href="/Messages">
            <IonIcon icon={mailOutline} />
            <IonLabel>Messages</IonLabel>
            {unreadMessages > 0 && (
              <IonBadge color="danger" className="unread-messages">{unreadMessages}</IonBadge>
            )}
          </IonTabButton>
          {/* <IonTabButton tab="Admin" href="/admin">
            <IonIcon icon={gridOutline} />
            <IonLabel>Admin</IonLabel>
          </IonTabButton> */}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

export default RouterTabs;
