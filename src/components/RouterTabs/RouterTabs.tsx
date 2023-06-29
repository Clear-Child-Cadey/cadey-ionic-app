import React, { useState, useContext } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { 
  IonTabs, 
  IonRouterOutlet, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel 
} from '@ionic/react';
// Ionicons
import { homeOutline, gridOutline } from 'ionicons/icons';
// Pages
import ConcernsPage from '../../pages/Concerns/Concerns';
import HomePage from '../../pages/Home/Home';
// Contexts
import { HomeTabVisibilityContext } from '../../context/TabContext';

const RouterTabs: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('Home');
  const homeTabVisibility = useContext(HomeTabVisibilityContext);
  const isHomeTabVisible = homeTabVisibility?.isHomeTabVisible;

  return (
    <IonReactRouter>
      <IonTabs onIonTabsDidChange={(e: CustomEvent) => setCurrentTab(e.detail.tab)}>
        <IonRouterOutlet>
          {/* Establish routes */}
          <Route path="/Concerns" component={ConcernsPage} exact />
          <Route path="/Home" render={() => <HomePage currentTab={currentTab} />} exact />
          <Route exact path="/">
            {isHomeTabVisible && (
              <Redirect to="/Home" />
            )}
            {!isHomeTabVisible && (
              <Redirect to="/Concerns" />
            )}
          </Route>
        </IonRouterOutlet>
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
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

export default RouterTabs;
