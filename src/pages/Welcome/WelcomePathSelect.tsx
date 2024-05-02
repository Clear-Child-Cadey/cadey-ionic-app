import React, { useContext, useEffect } from 'react';
import {
  IonLabel,
  IonLoading,
  IonHeader,
  IonToolbar,
  IonContent,
  IonPage,
} from '@ionic/react';
// Icons
import './WelcomePathSelect.css';
import { useHistory } from 'react-router-dom';
// Interfaces
import { PathListing, Path } from '../../api/Paths';
// Contexts
import ApiUrlContext from '../../context/ApiUrlContext';
import { usePathContext } from '../../context/PathContext';
import { useAppPage } from '../../context/AppPageContext';
// API
import { getPathListing } from '../../api/Paths';
import { postPathSelect } from '../../api/Paths';
import { logUserFact } from '../../api/UserFacts';
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import VerificationPage from '../../components/VerificationMessage';
import AppMeta from '../../variables/AppMeta';
import { trileanResolve } from '../../types/Trilean';

const WelcomePathSelect: React.FC = () => {
  const emailVerified = useSelector((state: RootState) => {
    return (
      state.authStatus?.emailVerified ||
      state.authStatus?.userData?.firebaseUser?.emailVerified ||
      false
    );
  });

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId || 0;
  });
  const { apiUrl } = useContext(ApiUrlContext);
  const { currentAppPage, setCurrentAppPage, setCurrentBasePage } =
    useAppPage();

  // Create an empty set of PopularSeriesSymptoms to populate
  const [pathListing, setPathListing] = React.useState<PathListing>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const history = useHistory();

  const { setPathId } = usePathContext();

  // When the component loads
  useEffect(() => {
    const getPaths = async () => {
      // Get the path listing from the API and set it to state
      const pathListingLocal = await getPathListing(Number(cadeyUserId));
      setIsLoading(() => true);

      setPathListing(pathListingLocal);

      // Stop the loader
      setIsLoading(() => false);
    };

    setCurrentAppPage('Welcome - Path Select');
    setCurrentBasePage('Welcome - Path Select');

    // appPageNavigation user fact
    logUserFact({
      cadeyUserId: cadeyUserId || 0,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Welcome - Path Select',
    });

    // Start a loader

    // Get popular symptoms from the API
    getPaths();
  }, [apiUrl]);

  const handlePathSelection = async (path: Path) => {
    setPathId(path.id);
    postPathSelect(Number(cadeyUserId), currentAppPage, path.id, path.pathName);
    history.push('/App/Welcome/AgeGroup');
  };

  if (AppMeta.forceEmailVerification && !trileanResolve(emailVerified)) {
    return <VerificationPage />;
  }

  return (
    <IonPage className='welcome-path-listing'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>Hi there! What is your child struggling with most?</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='path-list'>
          {/* Show a loading state if necessary */}
          {isLoading && (
            <IonLoading isOpen={isLoading} message={'Loading data...'} />
          )}

          {/* Create a list of rows with an icon on the left, then text, and a play icon on the right for each path in pathListing */}
          {pathListing &&
            pathListing.paths.map((path: Path, index) => (
              <div
                className='path'
                key={path.id}
                onClick={() => handlePathSelection(path)}
              >
                <img src={path.pathIconUrl} className='icon paths-icon' />
                <IonLabel className='path-name'>
                  <h2>{path.pathName}</h2>
                </IonLabel>
              </div>
            ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePathSelect;
