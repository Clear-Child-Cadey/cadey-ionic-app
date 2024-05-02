import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

const headers = {
  accept: 'text/plain',
  apiKey: AppMeta.cadeyApiKey,
  'Content-Type': 'application/json',
};

interface LogUserFactOptions {
  cadeyUserId: number;
  userFactTypeName: string;
  appPage: string;
  detail1?: string;
  detail2?: string;
  detail3?: string;
  detail4?: string;
  detail5?: string;
  detail6?: string;
  detail7?: string;
  detail8?: string;
  detail9?: string;
}

export const logUserFact = async ({
  cadeyUserId,
  userFactTypeName,
  appPage,
  detail1 = '',
  detail2 = '',
  detail3 = '',
  detail4 = '',
  detail5 = '',
  detail6 = '',
  detail7 = '',
  detail8 = '',
  detail9 = '',
}: LogUserFactOptions) => {
  const url = `${AppMeta.baseApiUrl}/userfact`;
  const bodyObject = {
    userid: cadeyUserId,
    userFactTypeName: userFactTypeName,
    appPage: appPage,
    detail1,
    detail2,
    detail3,
    detail4,
    detail5,
    detail6,
    detail7,
    detail8,
    detail9,
  };

  const response = await axios.post(url, bodyObject, {
    headers,
  });

  return await response.data;
};
