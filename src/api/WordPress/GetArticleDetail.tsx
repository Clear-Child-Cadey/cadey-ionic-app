import axios from '../../config/AxiosConfig';

export interface WP_WebinarDetail {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_image_url: string;
}

const API_URL = 'https://cadey.co/wp-json/wp/v2';

// export const getBlogDetail = async (id: number): Promise<WP_BlogDetail> => {
//   if (!id) {
//     throw new Error('No id provided');
//   }
//   const url = `${API_URL}/blog/${id}?_embed`;

//   const response = await axios.get(url);
//   const fetchedData = await response.data;

//   // Map the fetched data to match WP_ArticleDetail structure
//   const blogDetail: WP_BlogDetail = {
//     id: fetchedData.id,
//     title: fetchedData.title,
//     content: fetchedData.content,
//     featured_image_url: fetchedData._embedded['wp:featuredmedia'][0].source_url,
//   };
//   return blogDetail;
// };

export const getWebinarById = async (id: number): Promise<WP_WebinarDetail> => {
  if (!id) {
    throw new Error('No id provided');
  }

  const url = `${API_URL}/webinar/${id}?_embed`;

  const response = await axios.get(url);
  const fetchedData = await response.data;

  const webinarDetail: WP_WebinarDetail = {
    id: fetchedData.id,
    title: fetchedData.title,
    content: fetchedData.content,
    featured_image_url: fetchedData.yoast_head_json.og_image[0].url,
  };

  return webinarDetail;
};

export const getBlogById = async (id: number): Promise<WP_WebinarDetail> => {
  if (!id) {
    throw new Error('No id provided');
  }

  const url = `${API_URL}/posts/${id}?_embed`;

  const response = await axios.get(url);
  const fetchedData = await response.data;

  const webinarDetail: WP_WebinarDetail = {
    id: fetchedData.id,
    title: fetchedData.title,
    content: fetchedData.content,
    featured_image_url: fetchedData.yoast_head_json.og_image[0].url,
  };

  return webinarDetail;
};
