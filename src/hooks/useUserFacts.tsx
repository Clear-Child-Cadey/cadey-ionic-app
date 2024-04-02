import { useSelector } from 'react-redux';
import LogUserFactOptions from '../interfaces/LogUserFactOptions';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import getDeviceId from '../utils/getDeviceId';
import AppMeta from '../variables/AppMeta';
import { RootState } from '../store';

const useUserFacts = () => {
  const headers = {
    accept: 'text/plain',
    apiKey: AppMeta.cadeyApiKey,
    'Content-Type': 'application/json',
  };

  // Check if the

  const cadeyUserId: number | 'pending' = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  );

  const logUserFact = async (facts: LogUserFactOptions) => {
    if (cadeyUserId === 'pending') {
      throw new Error('Cadey User ID is pending');
    }

    facts.deviceId = getDeviceId();
    facts.userId = cadeyUserId;

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(facts),
    };

    try {
      let response;
      const url = `${AppMeta.baseApiUrl}/userfact`;

      try {
        response = await fetchWithTimeout(url, requestOptions, {
          cadeyUserId,
          requestName: 'postUserFact',
        });
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling userfact: ', error);
      throw error;
    }
  };

  return {
    logUserFact,
  };
};

export default useUserFacts;
