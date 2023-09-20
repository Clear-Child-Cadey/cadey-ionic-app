import React, { useEffect, useState } from 'react';
import { WP_ArticleDetail, getArticleDetail } from '../../api/WordPress/GetArticleDetail';
import {
    IonContent,
    IonLoading,
    IonRow,
    IonButton,
    IonIcon
} from '@ionic/react';
import { refresh } from 'ionicons/icons';
// CSS
import './ArticleDetail.css';

// Setup the interface
interface ArticleDetailProps {
    articleId: number;
    onRestart: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId, onRestart }) => {
    const [article, setArticle] = useState<WP_ArticleDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the article detail when the component loads or the articleId changes
    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                const detail = await getArticleDetail(articleId);
                setArticle(detail);
            } catch (error) {
                console.error("Error fetching article detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticleDetail();
    }, [articleId]);

    function stripHtml(html: string) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    function decodeHtmlEntities(str: string): string {
        let text = new DOMParser().parseFromString(`<!doctype html><body>${str}`, 'text/html').body.textContent;
        return text || "";
    }

    return (
        <IonContent>
            <IonLoading isOpen={isLoading} message={'Loading Article...'} />
            {article && (
                <div className="article-detail">
                    <h2>{article.title.rendered}</h2>
                    {article.featured_image_url && (
                        <img src={article.featured_image_url} alt={decodeHtmlEntities(article.title.rendered)} className="featured-image" />
                    )}
                    <div className="article-detail-content" dangerouslySetInnerHTML={{ __html: article.content.rendered }}></div>
                </div>
            )}
            <IonRow class="bottom-row single-button">
                <IonButton expand="block" onClick={onRestart} color="primary" aria-label="Read Another Article">
                    <IonIcon icon={refresh} slot="start" />
                    Read Another Article
                </IonButton>
            </IonRow>
        </IonContent>
    );
};

export default ArticleDetail;
