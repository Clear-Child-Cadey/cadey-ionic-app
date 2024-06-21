import axios from '../../config/AxiosConfig';

export interface WP_BlogDetail {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_image_url: string;
}

const API_URL = 'https://cadey.co/wp-json/wp/v2';

export const getBlogDetail = async (id: number): Promise<WP_BlogDetail> => {
  if (!id) {
    throw new Error('No id provided');
  }
  const url = `${API_URL}/blog/${id}?_embed`;

  const response = await axios.get(url);
  const fetchedData = await response.data;

  // Map the fetched data to match WP_ArticleDetail structure
  const blogDetail: WP_BlogDetail = {
    id: fetchedData.id,
    title: fetchedData.title,
    content: fetchedData.content,
    featured_image_url: fetchedData._embedded['wp:featuredmedia'][0].source_url,
  };
  return blogDetail;
};
