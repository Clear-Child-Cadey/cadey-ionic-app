const API_URL = 'https://cadey.co/wp-json/wp/v2';

export interface WP_Category {
    id: number;
    name: string;
    slug: string;
    count: number;
    parent: number;
}

export const getCategories = async (): Promise<WP_Category[]> => {
    try {
        let categories: WP_Category[] = [];
        // WordPress only returns 10 results by default, so we need to loop through all pages
        // Set values to 1 and override them later
        let page = 1;
        let totalPages = 1;

        // Request categories until we get through all the pages
        do {
            // Request 100 results per page to reduce the number of requests
            const response = await fetch(`${API_URL}/categories?per_page=100&page=${page}`);
            
            // Update total pages only on the first request
            if (page === 1) {
                totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
            }

            const data: WP_Category[] = await response.json();
            categories = categories.concat(data);

            page += 1;
        } while (page <= totalPages);

        // We only want the top-level parent categories, and want to omit the "Uncategorized" category
        categories = categories.filter(category => category.parent === 0 && category.name !== "Uncategorized");

        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};