import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

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

export const getPathListing = async (cadeyUserId: number) => {
  const url = `${AppMeta.baseApiUrl}/paths/${cadeyUserId}`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  const data = await response.data;

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

export const getPathDetail = async (cadeyUserId: number, pathId: number) => {
  const url = `${AppMeta.baseApiUrl}/pathdetail/${cadeyUserId}/${pathId}`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  const data = await response.data;

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

export const postPathSelect = async (
  cadeyUserId: number,
  appPage: string,
  pathId: number,
  pathName: string,
) => {
  const url = `${AppMeta.baseApiUrl}/pathselect/${cadeyUserId}`;
  const bodyObject = {
    appPage: appPage,
    pathId: pathId,
    pathName: pathName,
  };

  const response = await axios.post(url, bodyObject, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  return await response.data;
};
