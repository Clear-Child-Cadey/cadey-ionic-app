import { App } from '@capacitor/app';
import axios from '../../config/AxiosConfig';
import { WP_Category } from './GetCategories';
import AppMeta from '../../variables/AppMeta';

export interface WP_ArticleDetail {
  id: number;
  wordPressId: number;
  title: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  modified: string;
  categories: WP_Category[];
}

const API_URL = AppMeta.baseApiUrl;

export const getArticleDetail = async (
  articleId: number,
): Promise<WP_ArticleDetail> => {
  if (!articleId) {
    throw new Error('No articleId provided');
  }
  const url = `${API_URL}/articles`;
  const bodyObject = {
    articleIds: [articleId],
  };

  const response = await axios.post(url, bodyObject, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  const fetchedDataArray = await response.data;
  const articleDetailArray = fetchedDataArray.articles;

  // Grab the first article detail from the array
  // NOTE: There should only ever be one article because we are fetching by a single articleId
  const fetchedData = articleDetailArray[0];

  // Map the fetched data to match WP_ArticleDetail structure
  const articleDetail: WP_ArticleDetail = {
    id: fetchedData.id,
    wordPressId: fetchedData.wordPressId,
    title: fetchedData.title,
    excerpt: fetchedData.excerpt,
    content: fetchedData.content,
    featuredImageUrl: fetchedData.featuredImageUrl,
    modified: fetchedData.modified,
    categories: fetchedData.categories,
  };
  return articleDetail;
};
