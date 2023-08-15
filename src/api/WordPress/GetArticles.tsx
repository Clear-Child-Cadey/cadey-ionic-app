const API_URL = 'https://cadey.co/wp-json/wp/v2';

export interface WP_Article {
    id: number;
    title: { rendered: string };
    excerpt: { rendered: string };
    categories: number[];
    featured_image_url: string;
}

export const getArticlesByCategory = async (categoryId: number): Promise<WP_Article[]> => {
    try {
        const response = await fetch(`${API_URL}/articles?categories=${categoryId}&_embed`);
        const fetchedDataArray = await response.json();

        // Map the fetched data to match the WP_Article interface
        const articlesArray: WP_Article[] = fetchedDataArray.map((articleData: any) => ({
            id: articleData.id,
            title: articleData.title,
            excerpt: articleData.excerpt,
            categories: articleData.categories,
            featured_image_url: articleData._embedded['wp:featuredmedia'] ? articleData._embedded['wp:featuredmedia'][0].source_url : '', // Check if wp:featuredmedia exists first
        }));

        return articlesArray;
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
    }
};
