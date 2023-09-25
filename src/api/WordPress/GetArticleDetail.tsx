const API_URL = 'https://cadey.co/wp-json/wp/v2';

export interface WP_ArticleDetail {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
    featured_image_url: string;
}

export const getArticleDetail = async (articleId: number): Promise<WP_ArticleDetail> => {
    try {
        const response = await fetch(`${API_URL}/articles/${articleId}?_embed`);
        const fetchedData = await response.json();

        // Map the fetched data to match WP_ArticleDetail structure
        const articleDetail: WP_ArticleDetail = {
            id: fetchedData.id,
            title: fetchedData.title,
            content: fetchedData.content,
            featured_image_url: fetchedData._embedded['wp:featuredmedia'][0].source_url,
        };
        return articleDetail;
    } catch (error) {
        console.error("Error fetching article detail:", error);
        throw error;
    }
};
