import React, { useEffect } from 'react';
import { IonButton, IonContent, IonRow, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
// CSS
import './Welcome.css';
// Contexts
import ApiUrlContext from '../../context/ApiUrlContext';
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import useDeviceFacts from '../../hooks/useDeviceFacts';
import getDeviceId from '../../utils/getDeviceId';
import { useAppPage } from '../../context/AppPageContext';

const WelcomePage: React.FC = () => {
  const { apiUrl } = React.useContext(ApiUrlContext);
  const { logDeviceFact } = useDeviceFacts();
  const deviceId = getDeviceId();
  const { currentBasePage } = useAppPage();

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
    logDeviceFact({
      deviceId: deviceId,
      baseApiUrl: apiUrl,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Welcome - Intro Screen',
    });
  }, [apiUrl, cadeyUser, cadeyUser?.cadeyUserId]);

  const handleLogin = () => {
    logDeviceFact({
      deviceId: deviceId,
      userFactTypeName: 'UserTap',
      appPage: 'Welcome - Intro Screen',
      detail1: currentBasePage,
      detail2: 'Login Button',
    });

    history.push('/App/Authentication/Login');
  };

  const handleRegister = () => {
    logDeviceFact({
      deviceId: deviceId,
      userFactTypeName: 'UserTap',
      appPage: 'Welcome - Intro Screen',
      detail1: currentBasePage,
      detail2: 'Signup Button',
    });

    history.push('/App/Authentication/Register-Select');
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
              onClick={() => handleLogin()}
            >
              Login
            </IonButton>
            <IonButton
              className='continue-button'
              onClick={() => handleRegister()}
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
