import React, { useEffect, useState } from 'react';
import {
  getArticlesListByCategory,
  WP_Article,
} from '../../api/Articles/GetArticles';
import { IonList, IonItem, IonLabel, IonThumbnail, IonImg } from '@ionic/react';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
// CSS
import './ArticlesList.css';

// Setup the interface
interface ArticlesListProps {
  categoryId: number;
  onSelectArticle: (article: WP_Article) => void;
}

const ArticlesList: React.FC<ArticlesListProps> = ({
  categoryId,
  onSelectArticle,
}) => {
  const [articles, setArticles] = useState<WP_Article[]>([]);
  // Load the loading state from the context
  const { state: loadingState, dispatch } = useLoadingState();

  // Fetch the articles from the API when the component is mounted or the categoryId changes
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        dispatch({
          type: 'SET_LOADING',
          payload: { key: 'articleDetail', value: true },
        });
        const fetchedArticles = await getArticlesListByCategory(categoryId);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        dispatch({
          type: 'SET_LOADING',
          payload: { key: 'articleDetail', value: false },
        });
      }
    };

    fetchArticles();
  }, [categoryId]);

  // Log a user fact and proceed to the next screen
  const handleOnClick = (article: WP_Article) => {
    // TODO: Log user fact
    onSelectArticle(article);
  };

  function stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  return (
    <IonList className='article-listing'>
      {articles.map((article, index) => (
        <IonItem key={index} onClick={() => handleOnClick(article)}>
          {article.wordPressArticleIcon && (
            <IonThumbnail slot='start'>
              <IonImg
                src={article.wordPressArticleIcon}
                alt={article.wordPressArticleTitle}
                className='thumb-image'
              />
            </IonThumbnail>
          )}
          <IonLabel>
            <h2>{article.wordPressArticleTitle}</h2>
            {/* <p>{stripHtml(article.excerpt.rendered)}</p> */}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default ArticlesList;
