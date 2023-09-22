import React, { useEffect, useState } from 'react';
import {
    IonLoading,
    IonImg,
    IonIcon,
} from '@ionic/react';
// CSS
import './RelatedArticle.css';
// API & Interface
import { getArticlesByIds, WP_Article } from '../../api/WordPress/GetArticles';
// Icons
import { readerOutline } from 'ionicons/icons';

// Setup the interface
interface ArticlesListProps {
    articleId: number;
    onSelectArticle: (article: WP_Article) => void;
}

const RelatedArticle: React.FC<ArticlesListProps> = ({ articleId, onSelectArticle }) => {
    const [articles, setArticles] = useState<WP_Article[]>();
    const [article, setArticle] = useState<WP_Article>();
    const [isLoading, setIsLoading] = useState(false);

    console.log("Related Article");
    console.log("Article ID: ", articleId); 

    // Fetch the articles from the API when the component is mounted or the categoryId changes
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setIsLoading(true);
                const fetchedArticles = await getArticlesByIds([articleId]);
                setArticle(fetchedArticles[0]);
                console.log("Fetched article: ", article);
                console.log("Article title: ", article!.title.rendered);
            } catch (error) {
                console.error("Error fetching article ID: ", articleId, " error: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    // Log a user fact and proceed to the next screen
    const handleOnClick = (article: WP_Article) => {
        onSelectArticle(article);
    }

    function stripHtml(html: string) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    function decodeHtmlEntities(str: string): string {
        let text = new DOMParser().parseFromString(`<!doctype html><body>${str}`, 'text/html').body.textContent;
        return text || "";
    }
    
    return (
        <div>
            <IonLoading isOpen={isLoading} message={'Loading Articles...'} />
            {article && (
                <div className='related-article'>
                        <div 
                            onClick={() => handleOnClick(article)}
                            className='article-item'
                        >
                            {article.featured_image_url && (
                                <div className='article-image-wrapper'>
                                    <IonImg 
                                        src={article.featured_image_url} 
                                        alt={article.title.rendered} 
                                        className="article-image"
                                    />
                                    <IonIcon icon={readerOutline} className="article-icon" />
                                </div>
                            )}
                            <div className="article-metadata">
                                <p>Article</p>
                                <h3 className='article-title'>{decodeHtmlEntities(article.title.rendered)}</h3>
                            </div>
                        </div>
                </div>
            )}
        </div>
    );
};

export default RelatedArticle;