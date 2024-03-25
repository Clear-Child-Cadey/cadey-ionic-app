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
import ExpiredUser from '../../components/Authentication/ExpiredUser';

const WelcomePage: React.FC = () => {
  // const { cadeyUserId } = React.useContext(CadeyUserContext);
  const cadeyUserId = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  );
  const { apiUrl } = React.useContext(ApiUrlContext);
  const deviceId = useSelector((state: RootState) => {
    return state.deviceIdStatus.deviceId;
  });

  const cadeyUser = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser;
  });

  const history = useHistory();

  // When the component loads
  useEffect(() => {
    if (!cadeyUser || !cadeyUser.cadeyUserId) {
      return;
    }
    // appPageNavigation user fact
    logUserFact({
      cadeyUserId: cadeyUser?.cadeyUserId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Welcome - Intro Screen',
    });
  }, [apiUrl, cadeyUser, cadeyUser?.cadeyUserId]);

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
              Login
            </IonButton>
            <IonButton
              className='continue-button'
              onClick={() => handleContinue('/App/Authentication/Register')}
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
