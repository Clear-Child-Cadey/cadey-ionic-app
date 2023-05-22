import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Concerns from './pages/Concerns';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/Concerns">
          <Concerns />
        </Route>
        <Route exact path="/">
          <Redirect to="/Concerns" />
        </Route>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
