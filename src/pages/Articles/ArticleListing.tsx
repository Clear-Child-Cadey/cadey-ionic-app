import React, { useEffect } from 'react';
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

const ArticlesPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    const categoryId = Number(queryParams.get('id'));

    const history = useHistory();

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

    return (
        
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Articles</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Articles</IonTitle>
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
