import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonLabel, IonThumbnail, IonImg } from '@ionic/react';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
// CSS
import './WebinarList.css';
import { WP_Webinar, getAllWebinars } from '../../api/WordPress/GetArticles';

// Setup the interface
interface WebinarListProps {
  categoryId: number;
  onSelectArticle: (article: WP_Webinar) => void;
}

const WebinarList: React.FC<WebinarListProps> = ({ onSelectArticle }) => {
  const [articles, setArticles] = useState<WP_Webinar[]>([]);
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
        const fetchedArticles = await getAllWebinars();
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
  }, []);

  // Log a user fact and proceed to the next screen
  const handleOnClick = (article: WP_Webinar) => {
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
          {article.featured_image_url && (
            <IonThumbnail slot='start'>
              <IonImg
                src={article.featured_image_url.replace('http://', 'https://')}
                alt={article.title}
                className='thumb-image'
              />
            </IonThumbnail>
          )}
          <IonLabel>
            <h2>{article.title.replace(/&amp;/g, '&')}</h2>
            {/* <p>{stripHtml(article.excerpt.rendered)}</p> */}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default WebinarList;
