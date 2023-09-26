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

const ArticlesList: React.FC<ArticlesListProps> = ({ articleIds }) => {
    const [articles, setArticles] = useState<WP_Article[]>([]);
    // Load the loading state from the context
    const { state: loadingState, dispatch } = useLoadingState();

    // Fetch the articles from the API when the component is mounted or the categoryId changes
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: { key: 'articleLists', value: true } });
                const fetchedArticles = await getArticlesByIds(articleIds);
                setArticles(fetchedArticles);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: { key: 'articleLists', value: false } });
            }
        };

        fetchArticles();
    }, [articleIds]);
    
    return (
        <div>
            <div className='article-list'>
                {articles.map((article, index) => (
                    <ArticleItem articleId={article.id} key={index} />
                ))}
            </div>
        </div>
    );
};

export default ArticlesList;