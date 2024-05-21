import React, { useState } from 'react';
import { IonImg, IonIcon } from '@ionic/react';
// CSS
import './ArticleItem.css';
// API & Interface
import { WP_Article } from '../../api/Articles/GetArticles';
// Icons
import { readerOutline } from 'ionicons/icons';
// Contexts
import { useModalContext } from '../../context/ModalContext';
import useRequestQuiz from '../../hooks/useRequestQuiz';

// Setup the interface
interface ArticleProps {
  article: WP_Article;
  videoId?: number;
}

const ArticleItem: React.FC<ArticleProps> = ({ article, videoId }) => {
  const [selectedArticle, setSelectedArticle] = useState<WP_Article | null>(
    null,
  );
  const { requestQuiz } = useRequestQuiz({
    clientContext: 1,
    entityType: 1,
    entityId: Number(videoId),
  });
  // Get all the props from the modal context
  const { isVideoModalOpen, setArticleDetailModalOpen, setCurrentArticleId } =
    useModalContext();

  // Log a user fact and proceed to the next screen
  const handleArticleClick = (article: WP_Article) => {
    setSelectedArticle(article);
    setCurrentArticleId(article.wordPressArticleId);
    if (isVideoModalOpen) {
      // Change source to Video Detail Modal
    }
    requestQuiz();
    setArticleDetailModalOpen(true);
  };

  function decodeHtmlEntities(str: string): string {
    const text = new DOMParser().parseFromString(
      `<!doctype html><body>${str}`,
      'text/html',
    ).body.textContent;
    return text || '';
  }

  return (
    <div>
      {article && (
        <div className='related-article'>
          <div
            onClick={() => handleArticleClick(article)}
            className='article-item'
          >
            {article.wordPressArticleIcon && (
              <div className='article-image-wrapper'>
                <IonImg
                  src={article.wordPressArticleIcon}
                  alt={article.wordPressArticleTitle}
                  className='article-image'
                />
                <IonIcon icon={readerOutline} className='article-icon' />
              </div>
            )}
            <div className='article-metadata'>
              <p>Article</p>
              <h3 className='article-title'>
                {decodeHtmlEntities(article.wordPressArticleTitle)}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleItem;
