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
import { WP_Article } from '../../api/WordPress/GetArticles';
// CSS
import './ArticleListing.css';
import { getCategories } from '../../api/WordPress/GetCategories';
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
    const { currentBasePage, setCurrentBasePage, currentAppPage, setCurrentAppPage } = useAppPage();
    // const { cadeyUserId } = React.useContext(CadeyUserContext);

    const cadeyUserId = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  );
    const { apiUrl } = React.useContext(ApiUrlContext);
    
    const categoryId = Number(queryParams.get('id'));
    
    // State for the category name
    const [categoryName, setCategoryName] = useState<string>('');

    const history = useHistory();

    useEffect(() => {
        // Get the category name from the WP API
        const fetchCategoryName = async () => {
            var tempCategoryName = '';
            try {
                const categories = await getCategories();
                tempCategoryName = categories.find(category => category.id === categoryId)?.name || 'Articles';
                setCategoryName(tempCategoryName);

                setCurrentBasePage('Article Listing (' + tempCategoryName + ')');
                setCurrentAppPage('Article Listing (' + tempCategoryName + ')');

                logUserFact({
                    cadeyUserId: cadeyUserId,
                    baseApiUrl: apiUrl,
                    userFactTypeName: 'appPageNavigation',
                    appPage: 'Article Listing',
                    detail1: categoryId.toString(),
                    detail2: tempCategoryName,
                });

            } catch (error) {
                console.error("Error fetching category name:", error);
            }
        };

        fetchCategoryName();

    }, [categoryId]);

    const handleArticleSelection = (article: WP_Article) => {
        // Log user fact that the user clicked on the tap bar
        // logUserFact({
        //     cadeyUserId: cadeyUserId,
        //     baseApiUrl: apiUrl,
        //     userFactTypeName: 'ArticleSelection',
        //     appPage: currentAppPage,
        //     detail1: articleId.toString(),
        // });

        const articleId = article.id;

        history.push(`/App/Library/Articles/Article?id=${articleId}`);
    }

    const handleBack = (route: string) => {
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'UserTap',
            appPage: currentAppPage, 
            detail1: currentBasePage,
            detail2: 'Back Button',
        });

        history.push(route);
    }

    return (
        <IonPage className='article-listing'>
            <IonHeader class="header">
                <IonToolbar className="header-toolbar">
                    <a className="back-link" onClick={() => handleBack("/App/Library/Articles")}>Library</a>
                    <h2>{categoryName} Articles</h2>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRow>
                    <ArticleListing categoryId={categoryId} onSelectArticle={handleArticleSelection} />
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default ArticlesPage;
