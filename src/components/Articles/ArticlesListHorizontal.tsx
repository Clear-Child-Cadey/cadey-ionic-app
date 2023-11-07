import React, { useEffect, useState } from 'react';
// CSS
import './ArticlesListHorizontal.css';
// API
import { getArticlesByIds, WP_Article } from '../../api/WordPress/GetArticles';
// Components
import ArticleItem from './ArticleItem';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';

// Setup the interface
interface ArticlesListProps {
    articleIds: number[];
}

const ArticlesList: React.FC<ArticlesListProps & { onLoaded?: () => void }> = ({ articleIds, onLoaded }) => {
    const [articles, setArticles] = useState<WP_Article[]>([]);
    // Load the loading state from the context
    const { state: loadingState, dispatch } = useLoadingState();

    // Fetch the articles from the API when the component is mounted or the categoryId changes
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const fetchedArticles = await getArticlesByIds(articleIds);
                setArticles(fetchedArticles);
                // If onLoaded is passed as a prop, call it. This indicates to any parent components that articles have been loaded
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                console.log('Articles loaded', articles);
                if (onLoaded) {
                    console.log('Calling onLoaded (so the loader can be dismissed)');
                    onLoaded();
                }
            }
        };
        fetchArticles();
    }, [articleIds]);
    
    return (
        <div>
            <div className='article-list'>
                {articles.map((article, index) => (
                    <ArticleItem article={article} key={index} />
                ))}
            </div>
        </div>
    );
};

export default ArticlesList;