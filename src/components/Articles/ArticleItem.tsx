import React, { useEffect, useState } from 'react';
import { 
    IonImg, 
    IonIcon, 
} from '@ionic/react';
// CSS
import './ArticleItem.css';
// API & Interface
import { WP_Article } from '../../api/WordPress/GetArticles';
import { getQuiz } from '../../api/Quiz';
// Icons
import { readerOutline } from 'ionicons/icons';
// Contexts
import { useModalContext } from '../../context/ModalContext';
import ApiUrlContext from '../../context/ApiUrlContext';
import { CadeyUserContext } from '../../main';


// Setup the interface
interface ArticleProps {
    article: WP_Article;
    videoId?: number;
}

const ArticleItem: React.FC<ArticleProps> = ({ article, videoId }) => {
    const [selectedArticle, setSelectedArticle] = useState<WP_Article | null>(null);
    const { apiUrl } = React.useContext(ApiUrlContext);
    const { cadeyUserId } = React.useContext(CadeyUserContext);
    
    // Get all the props from the modal context
    const { 
        isVideoModalOpen,
        setArticleDetailModalOpen,
        setCurrentArticleId,
        setQuizModalOpen,
        setQuizModalData,
    } = useModalContext();

    // Log a user fact and proceed to the next screen
    const handleArticleClick = (article: WP_Article) => {        
        setSelectedArticle(article);
        setCurrentArticleId(article.id);
        if (isVideoModalOpen) {
            // Change source to Video Detail Modal
        }
        requestQuiz();
        setArticleDetailModalOpen(true);
    }

    function decodeHtmlEntities(str: string): string {
        let text = new DOMParser().parseFromString(`<!doctype html><body>${str}`, 'text/html').body.textContent;
        return text || "";
    }

    const requestQuiz = async () => {
        const quizResponse = await getQuiz(
          apiUrl,
          Number(cadeyUserId),
          1,                            // Client Context: Where the user is in the app (1 = VideoDetail)
          1,                            // Entity Type (1 = video)
          Number(videoId)               // Entity IDs (The ID of the video)
        );
    
        if (quizResponse.question !== null && quizResponse.question.id > 0) {
          // Set the quiz data
          setQuizModalData(quizResponse);
    
          // Open the quiz modal
          setQuizModalOpen(true);
        }
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
        </div>
    );
};

export default ArticleItem;