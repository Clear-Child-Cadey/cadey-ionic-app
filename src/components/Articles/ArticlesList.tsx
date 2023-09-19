import React, { useEffect, useState } from 'react';
import { getArticlesByCategory, WP_Article } from '../../api/WordPress/GetArticles';
import {
    IonList,
    IonItem,
    IonLabel,
    IonLoading,
    IonThumbnail,
    IonImg
} from '@ionic/react';

// Setup the interface
interface ArticlesListProps {
    categoryId: number;
    onSelectArticle: (article: WP_Article) => void;
}

const ArticlesList: React.FC<ArticlesListProps> = ({ categoryId, onSelectArticle }) => {
    const [articles, setArticles] = useState<WP_Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch the articles from the API when the component is mounted or the categoryId changes
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                const fetchedArticles = await getArticlesByCategory(categoryId);
                setArticles(fetchedArticles);
                console.log("Fetched articles:", fetchedArticles); 
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [categoryId]);

    // Log a user fact and proceed to the next screen
    const handleOnClick = (article: WP_Article) => {
        // TODO: Log user fact
        onSelectArticle(article);
    }

    function stripHtml(html: string) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    return (
        <div>
            <IonLoading isOpen={isLoading} message={'Loading Articles...'} />
            <IonList>
                {articles.map((article, index) => (
                    <IonItem 
                        key={index}
                        onClick={() => handleOnClick(article)}
                    >
                        {article.featured_image_url && (
                            <IonThumbnail slot="start">
                                <IonImg src={article.featured_image_url} alt={article.title.rendered} />
                            </IonThumbnail>
                        )}
                        <IonLabel>
                            <h2>{article.title.rendered}</h2>
                            <p>{stripHtml(article.excerpt.rendered)}</p>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default ArticlesList;