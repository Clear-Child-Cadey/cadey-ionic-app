import React, { useEffect, useState } from 'react';
import { WP_ArticleDetail, getArticleDetail } from '../../api/WordPress/GetArticleDetail';
import {
    IonContent,
    IonLoading,
    IonRow,
    IonButton,
    IonIcon,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
} from '@ionic/react';
import { refresh } from 'ionicons/icons';
// CSS
import './ArticleDetail.css';
// API
import { logOpenedArticle } from '../../api/UserFacts';
// Contexts
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
import { useLoadingState } from '../../context/LoadingStateContext';
import { useAppPage } from '../../context/AppPageContext';

// Setup the interface
interface ArticleDetailProps {
    articleId: number;
}

const ArticleDetailPage: React.FC<ArticleDetailProps> = ({ articleId }) => {
    const [article, setArticle] = useState<WP_ArticleDetail | null>(null);
    const { state: loadingState, dispatch } = useLoadingState();

    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);
    const userFactUrl = `${apiUrl}/userfact`;
    const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

    // Fetch the article detail when the component loads or the articleId changes
    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: true } });
                const detail = await getArticleDetail(articleId);
                detail.content.rendered = stripYouTubeEmbeds(detail.content.rendered);
                setArticle(detail);
                // Log a user fact
                logOpenedArticle(cadeyUserId, userFactUrl, articleId, document.title);
            } catch (error) {
                console.error("Error fetching article detail:", error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: false } });
            }
        };

        fetchArticleDetail();

        // Set the title of the page to the title of the article
        document.title = article ? article.title.rendered : "Article Detail";
        setCurrentBasePage('Article Detail');
        setCurrentAppPage('Article Detail');
    }, [articleId]);

    /**
     * Removes YouTube iframe embeds from the provided HTML string.
     * @param html The HTML string potentially containing YouTube iframe embeds.
     * @return The HTML string without YouTube iframe embeds.
     */
    function stripYouTubeEmbeds(html: string): string {
        // This regular expression targets iframes with YouTube URLs
        const regex = /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/[^"]*"[^>]*><\/iframe>/g;
        return html.replace(regex, '');
    }

    function decodeHtmlEntities(str: string): string {
        let text = new DOMParser().parseFromString(`<!doctype html><body>${str}`, 'text/html').body.textContent;
        return text || "";
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{article ? decodeHtmlEntities(article.title.rendered) : "Article Detail"}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{article ? decodeHtmlEntities(article.title.rendered) : "Article Detail"}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow>
                    {article && (
                        <div className="article-detail">
                            <h2>{decodeHtmlEntities(article.title.rendered)}</h2>
                            {article.featured_image_url && (
                                <img src={article.featured_image_url} alt={decodeHtmlEntities(article.title.rendered)} className="featured-image" />
                            )}
                            <div className="article-detail-content" dangerouslySetInnerHTML={{ __html: article.content.rendered }}></div>
                        </div>
                    )}
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default ArticleDetailPage;