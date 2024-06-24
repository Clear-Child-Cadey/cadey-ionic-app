import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  IonContent,
  IonRow,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
// Interfaces
import { WP_Webinar } from '../../api/WordPress/GetArticles';
// CSS
import './WebinarListing.css';
// Contexts
import { useAppPage } from '../../context/AppPageContext';
import ApiUrlContext from '../../context/ApiUrlContext';
// API
import { logUserFact } from '../../api/UserFacts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import WebinarList from '../../components/Webinars/WebinarList';

const WebinarPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const {
    currentBasePage,
    setCurrentBasePage,
    currentAppPage,
    setCurrentAppPage,
  } = useAppPage();

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId || 0;
  });
  const { apiUrl } = React.useContext(ApiUrlContext);

  const categoryId = Number(queryParams.get('id'));
  const categoryName = String(queryParams.get('categoryName'));

  const history = useHistory();

  useEffect(() => {
    try {
      setCurrentBasePage('Webinar Listing');
      setCurrentAppPage('Webinar Listing');

      logUserFact({
        cadeyUserId: cadeyUserId,
        userFactTypeName: 'appPageNavigation',
        appPage: 'Webinar Listing',
        detail1: categoryId.toString(),
        detail2: categoryName,
      });
    } catch (error) {
      console.error('Error loading Webinar Listing page:', error);
    }
  }, []);

  const handleArticleSelection = (webinar: WP_Webinar) => {
    history.push(`/App/Library/Webinars/Article?id=${webinar.id}`);
  };

  const handleBack = (route: string) => {
    logUserFact({
      cadeyUserId: cadeyUserId,
      userFactTypeName: 'UserTap',
      appPage: currentAppPage,
      detail1: currentBasePage,
      detail2: 'Back Button',
    });

    history.push(route);
  };

  return (
    <IonPage className='article-listing'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <a className='back-link' onClick={() => handleBack('/App/Library/')}>
            Library
          </a>
          <h2>Webinars</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <WebinarList
            categoryId={categoryId}
            onSelectArticle={handleArticleSelection}
          />
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default WebinarPage;
