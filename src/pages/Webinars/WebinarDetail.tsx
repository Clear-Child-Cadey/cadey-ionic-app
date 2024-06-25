import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router';
import {
  IonContent,
  IonRow,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
// CSS
import './WebinarDetail.css';
// API
import { logUserFact } from '../../api/UserFacts';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
import { useAppPage } from '../../context/AppPageContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  WP_WebinarDetail,
  getWebinarById,
} from '../../api/WordPress/GetArticleDetail';

const WebinarDetailPage: React.FC = () => {
  const [article, setArticle] = useState<WP_WebinarDetail | null>(null);
  const { state: loadingState, dispatch } = useLoadingState();

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });

  const {
    currentBasePage,
    setCurrentBasePage,
    currentAppPage,
    setCurrentAppPage,
  } = useAppPage();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Get the article ID from the URL
  const articleId = Number(queryParams.get('id'));

  // Fetch the article detail when the component loads or the articleId changes
  useEffect(() => {
    const fetchWebinarDetail = async () => {
      try {
        dispatch({
          type: 'SET_LOADING',
          payload: { key: 'webinarDetail', value: true },
        });
        const detail = await getWebinarById(articleId);
        detail.content.rendered = stripYouTubeEmbeds(detail.content.rendered);
        setArticle(detail);
        // Log a user fact
        logUserFact({
          cadeyUserId: cadeyUserId || 0,
          userFactTypeName: 'OpenedArticle',
          appPage: 'Webinar Detail',
          detail1: articleId.toString(),
          detail2: detail.title.rendered,
        });

        logUserFact({
          cadeyUserId: cadeyUserId || 0,
          userFactTypeName: 'appPageNavigation',
          appPage: 'Webinar Detail',
          detail1: articleId.toString(),
          detail2: detail.title.rendered,
        });
      } catch (error) {
        console.error('Error fetching article detail:', error);
      } finally {
        dispatch({
          type: 'SET_LOADING',
          payload: { key: 'webinarDetail', value: false },
        });
      }
    };

    setCurrentBasePage('Webinar Detail');
    setCurrentAppPage('Webinar Detail');

    fetchWebinarDetail();

    // Set the title of the page to the title of the article
    document.title = article ? article.title.rendered : 'Webinar Detail';
  }, [articleId]);

  /**
   * Removes YouTube iframe embeds from the provided HTML string.
   * @param html The HTML string potentially containing YouTube iframe embeds.
   * @return The HTML string without YouTube iframe embeds.
   */
  function stripYouTubeEmbeds(html: string): string {
    // This regular expression targets iframes with YouTube URLs
    const regex =
      /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/[^"]*"[^>]*><\/iframe>/g;
    return html.replace(regex, '');
  }

  function decodeHtmlEntities(str: string): string {
    const text = new DOMParser().parseFromString(
      `<!doctype html><body>${str}`,
      'text/html',
    ).body.textContent;
    return text || '';
  }

  const handleBack = (route: string) => {
    logUserFact({
      cadeyUserId: cadeyUserId || 0,
      userFactTypeName: 'UserTap',
      appPage: currentAppPage,
      detail1: currentBasePage,
      detail2: 'Back Button',
    });

    history.push(route);
  };

  return (
    <IonPage>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <a
            className='back-link'
            onClick={() => handleBack('/App/Library/Webinars')}
          >
            Webinars
          </a>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          {article && (
            <div className='article-detail'>
              <h1>{decodeHtmlEntities(article.title.rendered)}</h1>
              {article.featured_image_url && (
                <img
                  src={article.featured_image_url}
                  alt={decodeHtmlEntities(article.title.rendered)}
                  className='featured-image'
                />
              )}
              <div
                className='article-detail-content'
                dangerouslySetInnerHTML={{ __html: article.content.rendered }}
              ></div>
            </div>
          )}
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default WebinarDetailPage;
