import React, { useContext, useEffect } from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonText,
  IonRow,
  IonButton,
  IonLoading,
  IonIcon,
} from '@ionic/react';
// Icons
import { 
    play, 
    refresh,
    happyOutline,
} from 'ionicons/icons';
import './PathListing.css';
import { useHistory } from 'react-router-dom';
// Interfaces
import { Symptom } from '../../components/ConcernsList/ConcernsList';
import { PathListing, Path } from '../../api/Paths';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// Modals
import AgeGroupModal from '../../components/Modals/AgeGroupModal/AgeGroupModal';
// API
import { getPathListing } from '../../api/Paths';

const PathListingPage: React.FC = () => {  

    // Get the Cadey User data from the context
    const { cadeyUserId, cadeyUserAgeGroup } = useContext(CadeyUserContext);
    const { apiUrl } = useContext(ApiUrlContext);

    // Create an empty set of PopularSeriesSymptoms to populate
    const [pathListing, setPathListing] = React.useState<PathListing>();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();
    
    // When the component loads
    useEffect(() => {
        const getPaths = async () => {
            // Get the path listing from the API and set it to state
            setPathListing(await getPathListing(apiUrl, Number(cadeyUserId)));

            // Stop the loader
            setIsLoading(false);
        };

        // Start a loader
        setIsLoading(true);

        // Get popular symptoms from the API  
        getPaths();
    }, [apiUrl]);

    const handlePathSelection = async (path: Path) => {
        history.push('/App/Paths/PathDetail?id=' + path.id);
    };

  return (
    <div className="path-list">

        {/* Show a loading state if necessary */}
        {isLoading && (
          <IonLoading isOpen={true} message={'Loading data...'} />
        )}

        <IonRow>
            <IonText className="subcopy">Is your child...</IonText>
        </IonRow>
        
        {/* Create a list of rows with an icon on the left, then text, and a play icon on the right for each path in pathListing */}
        {pathListing && pathListing.paths.map((path: Path) => (
            <IonItem key={path.id} onClick={() => handlePathSelection(path)}>
                <IonIcon icon={happyOutline} />
                <IonLabel>
                    <h2>{path.pathName}</h2>
                    <p>{path.numItemsCompleted} of {path.totalItemsInPath} completed</p>
                </IonLabel>
                <IonIcon icon={play} />
            </IonItem>
        ))}

        {/* Show a button to refresh the page */}
    </div>
  );
};

export default PathListingPage;