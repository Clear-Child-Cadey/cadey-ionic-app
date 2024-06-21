import axios from '../../config/AxiosConfig';

export interface WP_Blog {
  id: number;
  title: string;
  // featured_image_url: string;
}

const API_URL = 'https://cadey.co/wp-json/wp/v2';

// https://cadey.co/wp-admin/term.php?taxonomy=member-tag&tag_ID=181&post_type=post

export const getBlogPostsByCategory = async (
  categoryId: number,
): Promise<WP_Blog[]> => {
  // const url = `${API_URL}/member-tag?categories=${categoryId}&_embed&per_page=100`;
  const url = `${API_URL}/member-tag?tag-id=${categoryId}&_embed&per_page=100`;
  const response = await axios.get(url);

  const fetchedDataArray = await response.data;

  // Map the fetched data to match the WP_Blog interface
  // id: number;
  // title: { rendered: string };
  // featured_image_url: string;
  const blogPostsArray: WP_Blog[] = fetchedDataArray.map(
    (blogPostData: any) => ({
      id: blogPostData.id,
      title: blogPostData.name,
      // featured_image_url: blogPostData._embedded['wp:featuredmedia']
      //   ? blogPostData._embedded['wp:featuredmedia'][0].source_url
      //   : '', // Check if wp:featuredmedia exists first
    }),
  );

  return blogPostsArray;
};

export const getBlogById = async (id: number): Promise<WP_Blog> => {
  const url = `${API_URL}/blog?include=${id}&_embed`;
  const response = await axios.get(url);

  const fetchedDataArray = await response.data;

  // Map the fetched data to match the WP_Article interface
  const blogPost: WP_Blog = fetchedDataArray.map((blogPostData: any) => ({
    id: blogPostData.id,
    title: blogPostData.title,
    // featured_image_url: blogPostData._embedded['wp:featuredmedia']
    //   ? blogPostData._embedded['wp:featuredmedia'][0].source_url
    //   : '', // Check if wp:featuredmedia exists first
  }));

  return blogPost;
};

export const getBlogPostsByIds = async (ids: number[]): Promise<WP_Blog[]> => {
  // Convert the array of IDs into a comma-separated string
  const idsString = ids.join(',');
  const getBlogPostsUrl = `${API_URL}/blog?include=${idsString}&_embed`;

  const response = await axios.get(getBlogPostsUrl);
  const fetchedDataArray = await response.data;

  // Map the fetched data to match the WP_Article interface
  const blogPostsArray: WP_Blog[] = fetchedDataArray.map(
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
