import React, { useEffect, useState } from 'react';
import {
    IonLoading,
} from '@ionic/react';
import { useHistory } from 'react-router';
// CSS
import './ArticlesListHorizontal.css';
// API
import { getArticlesByIds, WP_Article } from '../../api/WordPress/GetArticles';
// Component
import ArticleItem from './ArticleItem';

// Setup the interface
interface ArticlesListProps {
    articleIds: number[];
    onSelectArticle: (article: WP_Article) => void;
}

const ArticlesList: React.FC<ArticlesListProps> = ({ articleIds, onSelectArticle }) => {
    const [articles, setArticles] = useState<WP_Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

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

    const handleArticleSelect = (selectedArticle: WP_Article) => {
        history.push(`/App/ArticleDetail/${selectedArticle.id}`);
    };
    
    return (
        <div>
            {/* <IonLoading isOpen={isLoading} message={'Loading Articles...'} /> */}
            <div className='article-list'>
                {articles.map((article, index) => (
                    <ArticleItem 
                        articleId={article.id}
                        onSelectArticle={handleArticleSelect}
                  />
                ))}
            </div>
        </div>
    );
};

export default ArticlesList;