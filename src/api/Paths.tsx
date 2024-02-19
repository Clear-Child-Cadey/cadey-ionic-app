import fetchWithTimeout from "../utils/fetchWithTimeout";

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

let response;

export const getPathListing = async (apiUrl: string, cadeyUserId: number) => {
    const url = `${apiUrl}/paths/${cadeyUserId}`;

    try {
        response = await fetchWithTimeout(
          url,
          {
            method: "GET",
            headers: {
              accept: "text/plain",
              apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
            },
          },
          { cadeyUserId, requestName: "getPathListing" },
        );
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    const data = await response.json();

    // Map data to the Path Listing interface
    const pathListing: PathListing = {
        userId: cadeyUserId,
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

export const getPathDetail = async (apiUrl: string, cadeyUserId: number, pathId: number) => {
    const url = `${apiUrl}/pathdetail/${cadeyUserId}/${pathId}`;

    try {
        response = await fetchWithTimeout(
          url,
          {
            method: "GET",
            headers: {
              accept: "text/plain",
              apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
            },
          },
          { cadeyUserId, requestName: "getPathDetail" },
        );
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }
    
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

export const postPathSelect = async (apiUrl: string, cadeyUserId: number, appPage: string, pathId: number, pathName: string) => {
        
        const url = `${apiUrl}/pathselect/${cadeyUserId}`;

        try {
            response = await fetchWithTimeout(
              url,
              {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    appPage: appPage,
                    pathId: pathId,
                    pathName: pathName,
                }),
              },
              { cadeyUserId, requestName: "postPathSelect" },
            );
        } catch (error) {
            throw new Error(`HTTP error! status: ${error}`);
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return await response.json();
    };