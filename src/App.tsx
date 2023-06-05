import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ConcernsPage from './pages/Concerns/Concerns';
import VideoPage from './pages/Videos/Videos';
import PushNotification from './pages/PushNotification/PushNotification';
import { videocamOutline, helpCircleOutline, mailUnreadOutline } from 'ionicons/icons';

setupIonicReact();

// Basic setup only showing the Concerns page
const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/Concerns/Concerns">
          <ConcernsPage />
        </Route>
        <Route exact path="/">
          <Redirect to="/Concerns/Concerns" />
        </Route>
      </IonReactRouter>
    </IonApp>
  );
};

// Tab bar setup with a tab for Concerns and a tab for Videos
// const App: React.FC = () => {
//   return (
//     <IonApp>
//       <IonReactRouter>
//         <IonTabs>
//           <IonRouterOutlet>
//             <Route path="/Concerns" component={ConcernsPage} exact />
//             <Route path="/Videos" component={VideoPage} exact />
//             <Route path="/Message" component={PushNotification} exact />
//             <Route exact path="/">
//               <Redirect to="/Concerns" />
//             </Route>
//           </IonRouterOutlet>
//           <IonTabBar slot="bottom">
//             <IonTabButton tab="Concerns" href="/Concerns">
//               <IonIcon icon={helpCircleOutline} />
//               <IonLabel>Concerns</IonLabel>
//             </IonTabButton>
//             <IonTabButton tab="Videos" href="/Videos">
//               <IonIcon icon={videocamOutline} />
//               <IonLabel>Videos</IonLabel>
//             </IonTabButton>
//             <IonTabButton tab="Message" href="/Message">
//               <IonIcon icon={mailUnreadOutline} />
//               <IonLabel>Messages</IonLabel>
//             </IonTabButton>
//           </IonTabBar>
//         </IonTabs>
//       </IonReactRouter>
//     </IonApp>
//   );
// };

export default App;
