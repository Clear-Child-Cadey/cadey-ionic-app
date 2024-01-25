import React, { useEffect, useState } from 'react';
import { WP_ArticleDetail, getArticleDetail } from '../../api/WordPress/GetArticleDetail';
import {
    IonContent,
    IonRow,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
// CSS
import './ArticleCategoryListing.css';
// API
import { logUserFact } from '../../api/UserFacts';
import { getCategories } from '../../api/WordPress/GetCategories';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useAppPage } from '../../context/AppPageContext';
import { WP_Category } from '../../api/WordPress/GetCategories';

const ArticleCategoryListingPage: React.FC = () => {

    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);
    const { setCurrentBasePage, currentAppPage, setCurrentAppPage } = useAppPage();
    const [articleCategories, setArticleCategories] = useState<WP_Category[]>([]);

    const history = useHistory();

    // Fetch the article detail when the component loads or the articleId changes
    useEffect(() => {

        // Set the title of the page to the title of the article
        document.title = "Article Categories";
        setCurrentBasePage('Article Categories');
        setCurrentAppPage('Article Categories');
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: 'Article Categories',
          });

        // Get the article categories from the WP API
        const fetchArticleCategories = async () => {
            try {
                const categories: WP_Category[] = await getCategories();
                setArticleCategories(categories);
            } catch (error) {
                console.error("Error fetching article categories:", error);
            }
        };

        fetchArticleCategories();

    }, []);

    const handleCategorySelection = (categoryId: number) => {
        // Log user fact that the user clicked on the tap bar
        // logUserFact({
        //     cadeyUserId: cadeyUserId,
        //     baseApiUrl: apiUrl,
        //     userFactTypeName: 'ArticleCategorySelection',
        //     appPage: currentAppPage,
        //     detail1: categoryId.toString(),
        // });

        history.push(`/App/Library/Articles/Category?id=${categoryId}`);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Article Categories</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Article Categories</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow>
                    {articleCategories && (
                        <div className="article-categories">
                            {articleCategories.map((category) => (
                                <div className="article-category" key={category.id}>
                                    <h2 onClick={() => handleCategorySelection(category.id)}>{category.name}</h2>
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