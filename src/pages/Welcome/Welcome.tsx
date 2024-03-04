import React, { useEffect } from 'react';
import { IonButton, IonContent, IonRow, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
// CSS
import './Welcome.css';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// API
import { logUserFact } from '../../api/UserFacts';
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const WelcomePage: React.FC = () => {
  const { cadeyUserId } = React.useContext(CadeyUserContext);
  const { apiUrl } = React.useContext(ApiUrlContext);
  const deviceId = useSelector(
    (state: RootState) => state.deviceIdStatus.deviceId,
  );

  const history = useHistory();

  // When the component loads
  useEffect(() => {
    // appPageNavigation user fact
    logUserFact({
      deviceId: deviceId,
      cadeyUserId: cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Welcome - Intro Screen',
    });
  }, [apiUrl]);

  const handleContinue = (url: string) => {
    history.push(url);
  };

  return (
    <IonPage className='welcome'>
      <IonContent fullscreen>
        <IonRow className='welcome-content'>
          <IonRow className='logo'>
            <img src='assets/svgs/cadey.svg' />
          </IonRow>
          <IonRow className='welcome-text'>
            Parenting support from licensed psychologists
          </IonRow>
          <IonRow className='continue-row'>
            <IonButton
              className='continue-button'
              onClick={() => handleContinue('/App/Authentication/Login')}
            >
              Log In Test
            </IonButton>
            <IonButton
              className='continue-button'
              onClick={() => handleContinue('/App/Authentication/Signup')}
            >
              Signup
            </IonButton>
          </IonRow>
        </IonRow>
        <IonRow className='welcome-image'>
          <img src='assets/images/welcome.png' />
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
