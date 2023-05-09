import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, alarm } from 'ionicons/icons';
import Concerns from './pages/Concerns';
import PastQueries from './pages/PastQueries';

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/Concerns">
              <Concerns />
            </Route>
            <Route exact path="/PastQueries">
              <PastQueries />
            </Route>
            <Route exact path="/">
              <Redirect to="/Concerns" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="Home" href="/Concerns">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Past Queries" href="/PastQueries">
              <IonIcon aria-hidden="true" icon={alarm} />
              <IonLabel>Past Queries</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
);

export default App;
