import React, { useEffect, useState } from 'react';
import {
    IonLoading,
    IonImg,
    IonIcon,
} from '@ionic/react';
// CSS
import './ArticlesListHorizontal.css';
// Icons
import { readerOutline } from 'ionicons/icons';
// API
import { getArticlesByIds, WP_Article } from '../../api/WordPress/GetArticles';

// Setup the interface
interface ArticlesListProps {
    articleIds: number[];
    onSelectArticle: (article: WP_Article) => void;
}

const ArticlesList: React.FC<ArticlesListProps> = ({ articleIds, onSelectArticle }) => {
    const [articles, setArticles] = useState<WP_Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch the articles from the API when the component is mounted or the categoryId changes
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                const fetchedArticles = await getArticlesByIds(articleIds);
                setArticles(fetchedArticles);
                console.log("Fetched articles:", fetchedArticles); 
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [articleIds]);

    // Log a user fact and proceed to the next screen
    const handleOnClick = (article: WP_Article) => {
        // TODO: Log user fact
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
            <div className='article-list'>
                {articles.map((article, index) => (
                    <div 
                        key={index}
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
                ))}
            </div>
        </div>
    );
};

export default ArticlesList;