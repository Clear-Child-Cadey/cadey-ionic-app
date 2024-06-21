import axios from '../../config/AxiosConfig';

export interface WP_Category_From_WordPress {
  id: number;
  count: number;
  description: string;
  name: string;
  parent: number;
}

const API_URL = 'https://cadey.co/wp-json/wp/v2';

export const getMemberTagsFromWordPress = async (): Promise<
  WP_Category_From_WordPress[]
> => {
  try {
    let memberTags: WP_Category_From_WordPress[] = [];
    // WordPress only returns 10 results by default, so we need to loop through all pages
    // Set values to 1 and override them later
    let page = 1;
    let totalPages = 1;

    // Request member tags until we get through all the pages
    do {
      // Request 100 results per page to reduce the number of requests
      const response = await axios.get(
        `${API_URL}/member-tag?per_page=100&page=${page}`,
      );

      // Update total pages only on the first request
      if (page === 1) {
        totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
      }

      const data: WP_Category_From_WordPress[] = await response.data;
      memberTags = memberTags.concat(data);

      page += 1;
    } while (page <= totalPages);

    return memberTags;
  } catch (error) {
    console.error('Error fetching member tags:', error);
    throw error;
  }
};
