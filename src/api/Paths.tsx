const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export interface PathListing {
    userId: number;
    paths: Path[];
}

export interface Path {
    id: number;
    pathName: string;
    userSubscribed: boolean;
    numItemsCompleted: number;
    totalItemsInPath: number;
    pathIconUrl: string;
}

export interface PathDetail {
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

export const getPathListing = async (apiUrl: string, userId: number) => {
    const url = `${apiUrl}/paths/${userId}`;

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

    // Map data to the Path Listing interface
    const pathListing: PathListing = {
        userId: userId,
        paths: data.paths.map((path: Path) => ({
            id: path.id,
            pathName: path.pathName,
            userSubscribed: path.userSubscribed,
            numItemsCompleted: path.numItemsCompleted,
            totalItemsInPath: path.totalItemsInPath,
            pathIconUrl: path.pathIconUrl,
        })),
    };
    
    return pathListing;
};

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

    // Map data to the Path Detail interface
    const pathDetail: PathDetail = {
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
    
    return pathDetail;
};