import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const DeleteAccount = async (cadeyUserId: string) => {
  const url = `${AppMeta.baseApiUrl}/deleteaccount/${cadeyUserId}`;

  const bodyObject = {};

  const response = await axios.post(url, bodyObject, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  return await response;
};
