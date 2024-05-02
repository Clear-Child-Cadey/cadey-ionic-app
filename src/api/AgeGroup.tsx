import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';
import getDeviceId from '../utils/getDeviceId';

export const postCadeyUserAgeGroup = async (
  cadeyUserId: string,
  ageGroup: string,
) => {
  const url = `${AppMeta.baseApiUrl}/ageGroup/${cadeyUserId}/${ageGroup}`;

  const cadeyUserDeviceId = getDeviceId();
  const bodyObject = {
    cadeyUserDeviceId,
    cadeyUserId,
  };

  const response = await axios.post(url, bodyObject, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  return await response;
};
