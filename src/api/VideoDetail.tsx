import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const getVideoDetailData = async (vimeoId: string) => {
  const url = `${AppMeta.baseApiUrl}/videodetails/${vimeoId}`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  return await response.data;
};
