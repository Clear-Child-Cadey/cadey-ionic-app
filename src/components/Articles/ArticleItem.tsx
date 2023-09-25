import React, { useEffect, useState } from 'react';
import {
    IonLoading,
    IonImg,
    IonIcon,
} from '@ionic/react';
// CSS
import './ArticleItem.css';
// API & Interface
import { getArticlesByIds, WP_Article } from '../../api/WordPress/GetArticles';
// Icons
import { readerOutline } from 'ionicons/icons';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
// Modals
import ArticleDetailModal from '../Modals/ArticleDetailModal/ArticleDetailModal';

// Setup the interface
interface ArticlesListProps {
    articleId: number;
}

const ArticleItem: React.FC<ArticlesListProps> = ({ articleId }) => {
    const [article, setArticle] = useState<WP_Article>();
    const [selectedArticle, setSelectedArticle] = useState<WP_Article | null>(null);
    // Load the loading state from the context
    const { state: loadingState, dispatch } = useLoadingState();
    const [isArticleDetailModalOpen, setIsArticleDetailModalOpen] = useState(false);

    // Fetch the articles from the API when the component is mounted or the categoryId changes
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: true } });
                const fetchedArticles = await getArticlesByIds([articleId]);
                setArticle(fetchedArticles[0]);
            } catch (error) {
                console.error("Error fetching article ID: ", articleId, " error: ", error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: false } });
            }
        };

        fetchArticle();
    }, [articleId]);

    // Log a user fact and proceed to the next screen
    const handleArticleClick = (article: WP_Article) => {
        // Start the loader - will be dismissed in the ArticleDetail component
        dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: true } });
        setSelectedArticle(article);
        setIsArticleDetailModalOpen(true);
    }

    const handleArticleModalClose = () => {
        setIsArticleDetailModalOpen(false);
    };

    function decodeHtmlEntities(str: string): string {
        let text = new DOMParser().parseFromString(`<!doctype html><body>${str}`, 'text/html').body.textContent;
        return text || "";
    }
    
    return (
        <div>
            {article && (
                <div className='related-article'>
                    <div 
                        onClick={() => handleArticleClick(article)}
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

            {selectedArticle && (
                <ArticleDetailModal 
                    articleId={selectedArticle.id}
                    isOpen={isArticleDetailModalOpen} 
                    onClose={() => handleArticleModalClose()}
                />
            )}

        </div>
    );
};

export default ArticleItem;