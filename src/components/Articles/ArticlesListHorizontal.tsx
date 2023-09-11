import React, { useEffect, useState } from 'react';
import { getArticlesByIds, WP_Article } from '../../api/WordPress/GetArticles';
import {
    IonList,
    IonItem,
    IonLabel,
    IonLoading,
    IonThumbnail,
    IonImg
} from '@ionic/react';
// CSS
import './ArticlesListHorizontal.css';

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
                            </div>
                        )}
                        <div>
                            <h2 className='article-title'>{decodeHtmlEntities(article.title.rendered)}</h2>
                            {/* <p>{stripHtml(article.excerpt.rendered)}</p> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticlesList;