const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export interface Path {
    pathId: number;
    pathName: string;
    entities: PathEntity[];
}

export interface PathEntity {
    pathEntityId: number;
    entityType: number;
    entityId: number;
    entityOrder: number;
    sourceId: string;
    thumbnail: string;
    title: string;
    description: string;
    isComplete: boolean;
    isCurrent: boolean;
}

export const getPathDetail = async (apiUrl: string, userId: number, pathId: number) => {
    const url = `${apiUrl}/pathdetail/${userId}/${pathId}`;

    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Map data to the Path interface
    const path = {
        pathId: pathId,
        pathName: data.pathName,
        entities: data.entities.map((entity: PathEntity) => ({
            pathEntityId: entity.pathEntityId,
            entityType: entity.entityType,
            entityId: entity.entityId,
            entityOrder: entity.entityOrder,
            sourceId: entity.sourceId,
            thumbnail: entity.thumbnail,
            title: entity.title,
            description: entity.description,
            isComplete: entity.isComplete,
            isCurrent: entity.isCurrent,
        })),
    };
    
    return path;
};


