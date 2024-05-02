import axios from '../../config/AxiosConfig';

export interface WP_ArticleDetail {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_image_url: string;
}

const API_URL = 'https://cadey.co/wp-json/wp/v2';

export const getArticleDetail = async (
  articleId: number,
): Promise<WP_ArticleDetail> => {
  if (!articleId) {
    throw new Error('No articleId provided');
  }
  const url = `${API_URL}/articles/${articleId}?_embed`;

  const response = await axios.get(url);
  const fetchedData = await response.data;

  // Map the fetched data to match WP_ArticleDetail structure
  const articleDetail: WP_ArticleDetail = {
    id: fetchedData.id,
    title: fetchedData.title,
    content: fetchedData.content,
    featured_image_url: fetchedData._embedded['wp:featuredmedia'][0].source_url,
  };
  return articleDetail;
};
