import axios from '../../config/AxiosConfig';
import AppMeta from '../../variables/AppMeta';

export interface WP_Category {
  id: number;
  wordPressId: number;
  name: string;
}

const url = `${AppMeta.baseApiUrl}/wpcategories`;

export const getCategories = async (): Promise<WP_Category[]> => {
  try {
    let categories: WP_Category[] = [];

    const response = await axios.get(url, {
      headers: {
        accept: 'text/plain',
        apiKey: AppMeta.cadeyApiKey,
      },
    });

    categories = await response.data;

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
