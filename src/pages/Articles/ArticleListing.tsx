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

const ArticlesPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    const categoryId = Number(queryParams.get('id'));
    
    // State for the category name
    const [categoryName, setCategoryName] = useState<string>('');

    const history = useHistory();

    useEffect(() => {
        // Get the category name from the WP API
        const fetchCategoryName = async () => {
            try {
                const categories = await getCategories();
                setCategoryName(categories.find(category => category.id === categoryId)?.name || 'Articles');
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

    // Add a new function to update the category name
    const updateCategoryName = (name: string) => {
        setCategoryName(name);
    }

    return (
        
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{categoryName}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{categoryName}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow>
                    <ArticleListing categoryId={categoryId} onSelectArticle={handleArticleSelection} />
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default ArticlesPage;
