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
// Components
import ArticleListing from '../../components/Articles/ArticlesList';
// Interfaces
import { WP_Article } from '../../api/Articles/GetArticles';
// CSS
import './ArticleListing.css';
// import { getCategories } from '../../api/WordPress/GetCategories';
import { getCategories } from '../../api/Articles/GetCategories';
// Contexts
import { useAppPage } from '../../context/AppPageContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// API
import { logUserFact } from '../../api/UserFacts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ArticlesPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const {
    currentBasePage,
    setCurrentBasePage,
    currentAppPage,
    setCurrentAppPage,
  } = useAppPage();

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });
  const { apiUrl } = React.useContext(ApiUrlContext);

  const categoryId = Number(queryParams.get('id'));
  const categoryName = String(queryParams.get('categoryName'));

  const history = useHistory();

  useEffect(() => {
    try {
      setCurrentBasePage('Article Listing (' + categoryName + ')');
      setCurrentAppPage('Article Listing (' + categoryName + ')');

      logUserFact({
        cadeyUserId: cadeyUserId || 0,
        userFactTypeName: 'appPageNavigation',
        appPage: 'Article Listing',
        detail1: categoryId.toString(),
        detail2: categoryName,
      });
    } catch (error) {
      console.error('Error loading Article Listing page:', error);
    }
  }, []);

  const handleArticleSelection = (article: WP_Article) => {
    const articleId = article.wordPressArticleId;

    history.push(`/App/Library/Articles/Article?id=${articleId}`);
  };

  const handleBack = (route: string) => {
    logUserFact({
      cadeyUserId: cadeyUserId || 0,
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
          <a
            className='back-link'
            onClick={() => handleBack('/App/Library/Articles')}
          >
            Library
          </a>
          <h2>{categoryName} Articles</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <ArticleListing
            categoryId={categoryId}
            onSelectArticle={handleArticleSelection}
          />
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default ArticlesPage;
