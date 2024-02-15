import React, { useContext, useEffect } from 'react';
import {
    IonItem,
    IonLabel,
    IonText,
    IonRow,
    IonLoading,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonContent,
    IonPage,
} from '@ionic/react';
// Icons
import { 
    play, 
} from 'ionicons/icons';
import './PathListing.css';
import { useHistory } from 'react-router-dom';
// Interfaces
import { PathListing, Path } from '../../api/Paths';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { usePathContext } from '../../context/PathContext';
// API
import { getPathListing } from '../../api/Paths';
import { postPathSelect } from '../../api/Paths';
import { logUserFact } from '../../api/UserFacts';
import { useAppPage } from '../../context/AppPageContext';

const PathListingPage: React.FC = () => {  

    // Get the Cadey User data from the context
    const { cadeyUserId, cadeyUserAgeGroup } = useContext(CadeyUserContext);
    const { apiUrl } = useContext(ApiUrlContext);
    const { currentAppPage, setCurrentAppPage } = useAppPage();

    // Create an empty set of PopularSeriesSymptoms to populate
    const [pathListing, setPathListing] = React.useState<PathListing>();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const { setPathId } = usePathContext();
    
    // When the component loads
    useEffect(() => {
        const getPaths = async () => {
            // Get the path listing from the API and set it to state
            setPathListing(await getPathListing(apiUrl, Number(cadeyUserId)));

            // Stop the loader
            setIsLoading(false);
        };

        // Set the current app page
        setCurrentAppPage('Path Listing');
        
        // Log a user fact that the user navigated to the popular symptom video detail page
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Path Listing',
        });

        // Start a loader
        setIsLoading(true);

        // Get popular symptoms from the API  
        getPaths();
    }, [apiUrl]);

    const handlePathSelection = async (path: Path) => {
        setPathId(path.id);
        postPathSelect(apiUrl, Number(cadeyUserId), currentAppPage, path.id, path.pathName);
        history.push('/App/Paths/PathDetail?id=' + path.id);
    };

  return (
    <IonPage className="path-listing">
        <IonHeader class="header">
            <IonToolbar className="header-toolbar">
                <h2>Paths</h2>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <div className="path-list">

                {/* Show a loading state if necessary */}
                {isLoading && (
                <IonLoading isOpen={true} message={'Loading data...'} />
                )}

                <IonRow>
                    <IonText className="subcopy">Pick up where you left off, or explore new paths</IonText>
                </IonRow>
                
                {/* Create a list of rows with an icon on the left, then text, and a play icon on the right for each path in pathListing */}
                {pathListing && pathListing.paths.map((path: Path, index) => (
                    <div className="path" key={path.id} onClick={() => handlePathSelection(path)}>
                        <img src={path.pathIconUrl} className='icon paths-icon' />
                        <IonLabel className='path-name'>
                            <h2>{path.pathName}</h2>
                            <p>{path.numItemsCompleted} of {path.totalItemsInPath} completed</p>
                        </IonLabel>
                        <div className='play-icon-wrapper'>
                            <IonIcon icon={play} className='play-icon' />
                        </div>
                    </div>
                ))}
            </div>
        </IonContent>
    </IonPage>
  );
};

export default PathListingPage;