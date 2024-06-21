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
import { WP_Blog } from '../../api/WordPress/GetArticles';
// CSS
import './BlogListing.css';
// Contexts
import { useAppPage } from '../../context/AppPageContext';
import ApiUrlContext from '../../context/ApiUrlContext';
// API
import { logUserFact } from '../../api/UserFacts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import BlogList from '../../components/Blog/BlogList';

const BlogPage: React.FC = () => {
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
      setCurrentBasePage('Blog Listing (' + categoryName + ')');
      setCurrentAppPage('Blog Listing (' + categoryName + ')');

      logUserFact({
        cadeyUserId: cadeyUserId,
        userFactTypeName: 'appPageNavigation',
        appPage: 'Blog Listing',
        detail1: categoryId.toString(),
        detail2: categoryName,
      });
    } catch (error) {
      console.error('Error loading Blog Listing page:', error);
    }
  }, []);

  const handleArticleSelection = (blog: WP_Blog) => {
    history.push(`/App/Library/Blog/Article?id=${blog.id}`);
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
          <BlogList
            categoryId={categoryId}
            onSelectArticle={handleArticleSelection}
          />
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default BlogPage;
