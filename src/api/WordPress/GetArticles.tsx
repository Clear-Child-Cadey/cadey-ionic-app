import axios from '../../config/AxiosConfig';

export interface WP_Article {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
  featured_image_url: string;
}

const API_URL = 'https://cadey.co/wp-json/wp/v2';

export const getArticlesByCategory = async (
  categoryId: number,
): Promise<WP_Article[]> => {
  const url = `${API_URL}/articles?categories=${categoryId}&_embed&per_page=100`;
  const response = await axios.get(url);

  const fetchedDataArray = await response.data;

  // Map the fetched data to match the WP_Article interface
  const articlesArray: WP_Article[] = fetchedDataArray.map(
    (articleData: any) => ({
      id: articleData.id,
      title: articleData.title,
      excerpt: articleData.excerpt,
      categories: articleData.categories,
      featured_image_url: articleData._embedded['wp:featuredmedia']
        ? articleData._embedded['wp:featuredmedia'][0].source_url
        : '', // Check if wp:featuredmedia exists first
    }),
  );

  return articlesArray;
};

export const getArticleById = async (
  articleId: number,
): Promise<WP_Article> => {
  const url = `${API_URL}/articles?include=${articleId}&_embed`;
  const response = await axios.get(url);

  const fetchedDataArray = await response.data;

  // Map the fetched data to match the WP_Article interface
  const article: WP_Article = fetchedDataArray.map((articleData: any) => ({
    id: articleData.id,
    title: articleData.title,
    excerpt: articleData.excerpt,
    categories: articleData.categories,
    featured_image_url: articleData._embedded['wp:featuredmedia']
      ? articleData._embedded['wp:featuredmedia'][0].source_url
      : '', // Check if wp:featuredmedia exists first
  }));

  return article;
};

export const getArticlesByIds = async (
  articleIds: number[],
): Promise<WP_Article[]> => {
  // Convert the array of IDs into a comma-separated string
  const idsString = articleIds.join(',');
  const getArticlesUrl = `${API_URL}/articles?include=${idsString}&_embed`;

  const response = await axios.get(getArticlesUrl);
  const fetchedDataArray = await response.data;

  // Map the fetched data to match the WP_Article interface
  const articlesArray: WP_Article[] = fetchedDataArray.map(
    (articleData: any) => ({
      id: articleData.id,
      title: articleData.title,
      excerpt: articleData.excerpt,
      categories: articleData.categories,
      featured_image_url: articleData._embedded['wp:featuredmedia']
        ? articleData._embedded['wp:featuredmedia'][0].source_url
        : '', // Check if wp:featuredmedia exists first
    }),
  );

  return articlesArray;
};
