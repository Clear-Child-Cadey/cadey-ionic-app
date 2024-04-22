import { useSelector } from 'react-redux';
import LogDeviceFactOptions from '../interfaces/LogDeviceFactOptions';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import getDeviceId from '../utils/getDeviceId';
import AppMeta from '../variables/AppMeta';
import { RootState } from '../store';

const useDeviceFacts = () => {
  const headers = {
    accept: 'text/plain',
    apiKey: AppMeta.cadeyApiKey,
    'Content-Type': 'application/json',
  };

  // Check if the

  const cadeyUserId: number = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  );

  const logDeviceFact = async (facts: LogDeviceFactOptions) => {
    if (cadeyUserId === 0) {
      throw new Error('Cadey User ID is 0');
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
      const url = `${AppMeta.baseApiUrl}/devicefact`;

      try {
        response = await fetchWithTimeout(url, requestOptions, {
          cadeyUserId,
          requestName: 'postDeviceFact',
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
    logDeviceFact,
  };
};

export default useDeviceFacts;
