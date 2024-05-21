import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonRow,
  IonPage,
  IonHeader,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
// CSS
import './ArticleCategoryListing.css';
// API
import { logUserFact } from '../../api/UserFacts';
import { getCategories } from '../../api/Articles/GetCategories';
// Contexts
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
import { WP_Category } from '../../api/Articles/GetCategories';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ArticleCategoryListingPage: React.FC = () => {
  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });
  const { apiUrl } = React.useContext(ApiUrlContext);
  const {
    currentBasePage,
    setCurrentBasePage,
    currentAppPage,
    setCurrentAppPage,
  } = useAppPage();
  const [articleCategories, setArticleCategories] = useState<WP_Category[]>([]);

  const history = useHistory();

  // Fetch the article detail when the component loads or the articleId changes
  useEffect(() => {
    // Set the title of the page to the title of the article
    document.title = 'Article Categories';
    setCurrentBasePage('Article Categories');
    setCurrentAppPage('Article Categories');
    logUserFact({
      cadeyUserId: cadeyUserId || 0,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Article Categories',
    });

    // Get the article categories from the WP API
    const fetchArticleCategories = async () => {
      try {
        const categories: WP_Category[] = await getCategories();
        setArticleCategories(categories);
        console.log('Article categories:', categories);
      } catch (error) {
        console.error('Error fetching article categories:', error);
      }
    };

    fetchArticleCategories();
  }, []);

  const handleCategorySelection = (
    categoryId: number,
    categoryName: string,
  ) => {
    history.push(
      `/App/Library/Articles/Category?id=${categoryId}&categoryName=${categoryName}`,
    );
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
    <IonPage className='article-category-listing'>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <a className='back-link' onClick={() => handleBack('/App/Library/')}>
            Library
          </a>
          <h2>Article Categories</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          {articleCategories && (
            <div className='article-categories'>
              {articleCategories.map((category) => (
                <div
                  className='article-category'
                  key={category.id}
                  onClick={() =>
                    handleCategorySelection(category.wordPressId, category.name)
                  }
                >
                  <h2>{category.name}</h2>
                  <span className='arrow'>&gt;</span>
                </div>
              ))}
            </div>
          )}
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default ArticleCategoryListingPage;
