import React, { useEffect, useState } from 'react';
import { WP_ArticleDetail, getArticleDetail } from '../../../api/WordPress/GetArticleDetail';
import {
    IonContent,
    IonRow,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonModal,
    IonButton,
} from '@ionic/react';
// CSS
import './ArticleDetailModal.css';
// API
import { logOpenedArticle } from '../../../api/UserFacts';
// Contexts
import { CadeyUserContext } from '../../../main';
import ApiUrlContext from '../../../context/ApiUrlContext';
import { useLoadingState } from '../../../context/LoadingStateContext';

// Setup the interface
interface ArticleDetailProps {
    articleId: number;
    isOpen: boolean;
    onClose: () => void;
}

const ArticleDetailModal: React.FC<ArticleDetailProps> = ({ articleId, isOpen, onClose }) => {
    const [article, setArticle] = useState<WP_ArticleDetail | null>(null);
    const [currentArticleId, setCurrentArticleId] = useState<number | null>(null);
    const { state: loadingState, dispatch } = useLoadingState();

    const { cadeyUserId } = React.useContext(CadeyUserContext);
    const { apiUrl } = React.useContext(ApiUrlContext);
    const userFactUrl = `${apiUrl}/userfact`;

    // Whenever the modal is opened, set the currentVimeoId to the vimeoId prop
    useEffect(() => {
        if (isOpen) {
        setCurrentArticleId(articleId);
        }
    }, [isOpen, articleId]);  

    // Fetch the article detail when the component loads or the currentArticleId changes
    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                {{currentArticleId &&
                    dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: true } });
                    const detail = await getArticleDetail(currentArticleId!);
                    detail.content.rendered = stripYouTubeEmbeds(detail.content.rendered);
                    setArticle(detail);
                    // Log a user fact
                    logOpenedArticle(cadeyUserId, userFactUrl, currentArticleId!, document.title);
                }}
            } catch (error) {
                console.error("Error fetching article detail:", error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: false } });
            }
        };

        fetchArticleDetail();

        // Set the title of the page to the title of the article
        document.title = article ? article.title.rendered : "Article Detail";
    }, [currentArticleId]);

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
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    {/* <IonTitle>{article ? decodeHtmlEntities(article.title.rendered) : "Article Detail"}</IonTitle> */}
                    <IonTitle style={{ textAlign: 'left', paddingLeft: 0 }}>Read Now</IonTitle>
                    <IonButton className="close-button" slot="end" onClick={onClose}>Close</IonButton>
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
        </IonModal>
    );
};

export default ArticleDetailModal;