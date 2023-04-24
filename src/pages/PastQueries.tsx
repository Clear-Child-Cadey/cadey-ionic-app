import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './PastQueries.css';

const PastQueries: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Past Queries</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Past Queries</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Past Queries" />
      </IonContent>
    </IonPage>
  );
};

export default PastQueries;
