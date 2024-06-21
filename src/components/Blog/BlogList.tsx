import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonLabel, IonThumbnail, IonImg } from '@ionic/react';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
// CSS
import './BlogList.css';
import {
  WP_Blog,
  getBlogPostsByCategory,
} from '../../api/WordPress/GetArticles';

// Setup the interface
interface BlogListProps {
  categoryId: number;
  onSelectArticle: (article: WP_Blog) => void;
}

const BlogList: React.FC<BlogListProps> = ({ categoryId, onSelectArticle }) => {
  const [articles, setArticles] = useState<WP_Blog[]>([]);
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
        const fetchedArticles = await getBlogPostsByCategory(categoryId);
        console.log('fetchedArticles: ', fetchedArticles);
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
  const handleOnClick = (article: WP_Blog) => {
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
          <IonLabel>
            <h2>{article.title.replace(/&amp;/g, '&')}</h2>
            {/* <p>{stripHtml(article.excerpt.rendered)}</p> */}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default BlogList;
