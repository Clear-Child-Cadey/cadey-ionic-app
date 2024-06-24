import axios from '../../config/AxiosConfig';

export interface WP_Webinar {
  id: number;
  title: string;
  featured_image_url: string;
}

const API_URL = 'https://cadey.co/wp-json/wp/v2';

export const getBlogPostsByIds = async (
  ids: number[],
): Promise<WP_Webinar[]> => {
  // Convert the array of IDs into a comma-separated string
  const idsString = ids.join(',');
  const getBlogPostsUrl = `${API_URL}/blog?include=${idsString}&_embed`;

  const response = await axios.get(getBlogPostsUrl);
  const fetchedDataArray = await response.data;

  // Map the fetched data to match the WP_Article interface
  const blogPostsArray: WP_Webinar[] = fetchedDataArray.map(
    (blogPostData: any) => ({
      id: blogPostData.id,
      title: blogPostData.title,
      // featured_image_url: blogPostData._embedded['wp:featuredmedia']
      //   ? blogPostData._embedded['wp:featuredmedia'][0].source_url
      //   : '', // Check if wp:featuredmedia exists first
    }),
  );

  return blogPostsArray;
};

export const getAllWebinars = async (): Promise<WP_Webinar[]> => {
  // const url = `${API_URL}/member-tag?categories=${categoryId}&_embed&per_page=100`;
  const url = `${API_URL}/webinar?_embed&per_page=100`;
  const response = await axios.get(url);

  const fetchedDataArray = await response.data;

  const WebinarsArray: WP_Webinar[] = fetchedDataArray.map(
    (webinarsData: any) => ({
      id: webinarsData.id,
      title: webinarsData.title.rendered,
      featured_image_url: webinarsData.yoast_head_json.og_image[0].url,
    }),
  );

  return WebinarsArray;
};

export const getBlogPostsByMemberTag = async (
  memberTagId: number,
): Promise<WP_Webinar[]> => {
  // const url = `${API_URL}/member-tag?categories=${categoryId}&_embed&per_page=100`;
  const url = `${API_URL}/posts?member-tag=${memberTagId}&_embed&per_page=100`;
  const response = await axios.get(url);

  const fetchedDataArray = await response.data;

  const blogPostsArray: WP_Webinar[] = fetchedDataArray.map(
    (blogPostData: any) => ({
      id: blogPostData.id,
      title: blogPostData.title.rendered,
      featured_image_url: blogPostData.yoast_head_json.og_image[0].url,
    }),
  );

  return blogPostsArray;
};
