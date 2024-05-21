import axios from '../../config/AxiosConfig';
import AppMeta from '../../variables/AppMeta';
import { WP_ArticleDetail } from './GetArticleDetail';

export interface Category_Articles {
  categoryId: number;
  wordPressCategoryId: number;
  wordPressCategoryName: string;
  articles: WP_Article[];
}

export interface WP_Article {
  articleId: number;
  wordPressArticleId: number;
  wordPressArticleTitle: string;
  wordPressArticleIcon: string;
  //   title: { rendered: string };
  //   excerpt: { rendered: string };
  //   categories: number[];
  //   featured_image_url: string;
}

export const getArticlesListByCategory = async (
  categoryId: number,
): Promise<WP_Article[]> => {
  const url = `${AppMeta.baseApiUrl}/wpcategoryarticles?wpCategoryId=${categoryId}`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  const fetchedDataArray = await response.data;

  // Map the fetched data to match the WP_Article interface
  const articlesArray: WP_Article[] = fetchedDataArray.articles.map(
    (articleData: WP_Article) => ({
      articleId: articleData.articleId,
      wordPressArticleId: articleData.wordPressArticleId,
      wordPressArticleTitle: articleData.wordPressArticleTitle,
      wordPressArticleIcon: articleData.wordPressArticleIcon,
    }),
  );

  return articlesArray;
};

export const getArticlesListByIds = async (
  articleIds: number[],
): Promise<WP_Article[]> => {
  const url = `${AppMeta.baseApiUrl}/articles`;
  const bodyObject = {
    articleIds: articleIds,
  };

  const response = await axios.post(url, bodyObject, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  const fetchedDataArray = await response.data;
  const articleDetailArray = fetchedDataArray.articles;

  // Map the fetched data to match the WP_Article interface
  const articles: WP_Article[] = articleDetailArray.map(
    (articleData: WP_ArticleDetail) => ({
      articleId: articleData.id,
      wordPressArticleId: articleData.wordPressId,
      wordPressArticleTitle: articleData.title,
      wordPressArticleIcon: articleData.featuredImageUrl,
    }),
  );

  return articles;
};
