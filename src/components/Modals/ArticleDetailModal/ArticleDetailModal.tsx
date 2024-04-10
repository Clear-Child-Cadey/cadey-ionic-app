import React, { useEffect, useState } from 'react';
import { WP_ArticleDetail, getArticleDetail } from '../../../api/WordPress/GetArticleDetail';
import {
    IonContent,
    IonRow,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonModal,
    IonButton,
} from '@ionic/react';
// CSS
import './ArticleDetailModal.css';
// API
import { logUserFact } from '../../../api/UserFacts';
// Contexts
import { CadeyUserContext } from '../../../main';
import ApiUrlContext from '../../../context/ApiUrlContext';
import { useLoadingState } from '../../../context/LoadingStateContext';
import { useModalContext } from '../../../context/ModalContext';
import { useAppPage } from '../../../context/AppPageContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

// Setup the interface
interface ArticleDetailProps {
    
}

const ArticleDetailModal: React.FC<ArticleDetailProps> = () => {
    const [article, setArticle] = useState<WP_ArticleDetail | null>(null);
    const { state: loadingState, dispatch } = useLoadingState();
    // Get all the props from the modal context
    const { 
        isVideoModalOpen, 
        setVideoModalOpen, 
        isArticleDetailModalOpen, 
        setArticleDetailModalOpen,
        currentArticleId,
        setCurrentArticleId,
        setCurrentVimeoId,
    } = useModalContext();

    const { currentBasePage, currentAppPage, setCurrentAppPage } = useAppPage();

    // const { cadeyUserId } = React.useContext(CadeyUserContext);

    const cadeyUserId = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  );
    const { apiUrl } = React.useContext(ApiUrlContext);
    const userFactUrl = `${apiUrl}/userfact`;

    useEffect(() => {
        // Log user fact that the user opened an article
        if (isVideoModalOpen && currentArticleId) {
            // Set the video detail as the source if the video detail modal was open
            logUserFact({
                cadeyUserId: cadeyUserId,
                baseApiUrl: apiUrl,
                userFactTypeName: 'OpenedArticle',
                appPage: 'Video Detail',
                detail1: currentArticleId.toString()
            });
        } else if (currentArticleId) {
            // Otherwise use the document title as the source
            logUserFact({
                cadeyUserId: cadeyUserId,
                baseApiUrl: apiUrl,
                userFactTypeName: 'OpenedArticle',
                appPage: currentAppPage,
                detail1: currentArticleId.toString()
            });
        }
        
        if (isArticleDetailModalOpen && isVideoModalOpen) {
            setVideoModalOpen(false); // Close Video Modal - we don't want both open at the same time
        }
    
        // Cleanup actions when ArticleDetailModal closes
        if (!isArticleDetailModalOpen) {
            setCurrentArticleId(null);
            setCurrentVimeoId(null);
        }
    }, [isArticleDetailModalOpen]);

    // Fetch the article detail when the component loads or the currentArticleId changes
    useEffect(() => {
        let isMounted = true; // To avoid state updates on unmounted component
        
        const fetchArticleDetail = async () => {
            if(!currentArticleId) return; // Early return if no articleId is present
            
            try {
                dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: true } });
                
                const detail = await getArticleDetail(currentArticleId);
                detail.content.rendered = stripYouTubeEmbeds(detail.content.rendered);
                
                if(isMounted) setArticle(detail); // Update state only if component is mounted
            } catch (error) {
                console.error("Error fetching article detail:", error);
            } finally {
                if(isMounted) dispatch({ type: 'SET_LOADING', payload: { key: 'articleDetail', value: false } });
            }
        };

        if (isArticleDetailModalOpen && currentArticleId) {
            setCurrentAppPage('Article Detail');
            logUserFact({
                cadeyUserId: cadeyUserId,
                baseApiUrl: apiUrl,
                userFactTypeName: 'appPageNavigation',
                appPage: 'Article Detail',
              });
            fetchArticleDetail();
        }
    
        return () => { isMounted = false }; // Cleanup to avoid state updates on unmounted component
    }, [isArticleDetailModalOpen, currentArticleId]);    

    /**
     * Removes YouTube iframe embeds from the provided HTML string.
     * @param html The HTML string potentially containing YouTube iframe embeds.
     * @return The HTML string without YouTube iframe embeds.
     */
    function stripYouTubeEmbeds(html: string): string {
        // This regular expression targets iframes with YouTube URLs
        const regex = /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/[^"]*"[^>]*><\/iframe>/g;
        return html.replace(regex, '');
    }

    function decodeHtmlEntities(str: string): string {
        let text = new DOMParser().parseFromString(`<!doctype html><body>${str}`, 'text/html').body.textContent;
        return text || "";
    }

    function handleClose() {
        setCurrentAppPage(currentBasePage);
        logUserFact({
            cadeyUserId: cadeyUserId,
            baseApiUrl: apiUrl,
            userFactTypeName: 'appPageNavigation',
            appPage: currentBasePage,
          });
        setArticleDetailModalOpen(false);
    }

    return (
        <IonModal isOpen={isArticleDetailModalOpen} onDidDismiss={() => handleClose()}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle style={{ textAlign: 'left', paddingLeft: 16 }}>
                        Read Now
                    </IonTitle>
                    <IonButton className="close-button" slot="end" onClick={() => handleClose()}>Close</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRow>
                    {article && (
                        <div className="article-detail-modal">
                            <h2>{decodeHtmlEntities(article.title.rendered)}</h2>
                            {article.featured_image_url && (
                                <img src={article.featured_image_url} alt={decodeHtmlEntities(article.title.rendered)} className="featured-image" />
                            )}
                            <div className="article-detail-content" dangerouslySetInnerHTML={{ __html: article.content.rendered }}></div>
                        </div>
                    )}
                </IonRow>
            </IonContent>
        </IonModal>
    );
};

export default ArticleDetailModal;