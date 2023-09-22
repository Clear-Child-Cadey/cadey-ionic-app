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
        const response = await fetch(`${API_URL}/articles?categories=${categoryId}&_embed&per_page=100`);
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
        console.error("Error fetching articles (by category):", error);
        throw error;
    }
};

export const getArticleById = async (articleId: number): Promise<WP_Article> => {
    try {
        // Convert the array of IDs into a comma-separated string
        const getArticlesUrl = `${API_URL}/articles?include=${articleId}&_embed`;

        const response = await fetch(getArticlesUrl);
        const fetchedDataArray = await response.json();

        // Map the fetched data to match the WP_Article interface
        const article: WP_Article = fetchedDataArray.map((articleData: any) => ({
            id: articleData.id,
            title: articleData.title,
            excerpt: articleData.excerpt,
            categories: articleData.categories,
            featured_image_url: articleData._embedded['wp:featuredmedia'] ? articleData._embedded['wp:featuredmedia'][0].source_url : '', // Check if wp:featuredmedia exists first
        }));

        console.log("Article from GetArticles.tsx: ", article)
        return article;
    } catch (error) {
        console.error("Error fetching articles (by IDs):", error);
        throw error;
    }
};

export const getArticlesByIds = async (articleIds: number[]): Promise<WP_Article[]> => {
    try {
        // Convert the array of IDs into a comma-separated string
        const idsString = articleIds.join(',');
        const getArticlesUrl = `${API_URL}/articles?include=${idsString}&_embed`;

        const response = await fetch(getArticlesUrl);
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
        console.error("Error fetching articles (by IDs):", error);
        throw error;
    }
};