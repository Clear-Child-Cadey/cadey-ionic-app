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
import './BlogCategoryListing.css';
// API
import { logUserFact } from '../../api/UserFacts';
import {
  WP_Category_From_WordPress,
  getMemberTagsFromWordPress,
} from '../../api/WordPress/GetCategories';
// Contexts
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const BlogCategoryListingPage: React.FC = () => {
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
  const [blogCategories, setBlogCategories] = useState<
    WP_Category_From_WordPress[]
  >([]);

  const history = useHistory();

  // Fetch the article detail when the component loads or the articleId changes
  useEffect(() => {
    // Set the title of the page to the title of the article
    document.title = 'Blog Categories';
    setCurrentBasePage('Blog Categories');
    setCurrentAppPage('Blog Categories');
    logUserFact({
      cadeyUserId: cadeyUserId || 0,
      userFactTypeName: 'appPageNavigation',
      appPage: 'Blog Categories',
    });

    // Get the article categories from the WP API
    const fetchBlogMemberTags = async () => {
      try {
        const categories: WP_Category_From_WordPress[] =
          await getMemberTagsFromWordPress();
        setBlogCategories(categories);
      } catch (error) {
        console.error('Error fetching article categories:', error);
      }
    };

    fetchBlogMemberTags();
  }, []);

  const handleCategorySelection = (
    categoryId: number,
    categoryName: string,
  ) => {
    history.push(
      `/App/Library/Blog/Category?id=${categoryId}&categoryName=${categoryName}`,
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
          <h2>Blog Categories</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          {blogCategories && (
            <div className='article-categories'>
              {blogCategories.map((category) => (
                <div
                  className='article-category'
                  key={category.id}
                  onClick={() =>
                    handleCategorySelection(category.id, category.name)
                  }
                >
                  <h2>{category.name.replace(/&amp;/g, '&')}</h2>
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

export default BlogCategoryListingPage;
