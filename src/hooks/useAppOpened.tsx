import React from 'react';
import ApiUrlContext from '../context/ApiUrlContext';
import getDeviceId from '../utils/getDeviceId';
import AppMeta from '../variables/AppMeta';
import { useDispatch } from 'react-redux';
import { setGrandfatherStatus } from '../features/authLoading/slice';
import axios from '../config/AxiosConfig';

const useAppOpened = () => {
  const { apiUrl } = React.useContext(ApiUrlContext);
  const dispatch = useDispatch();

  const appOpenAction = async () => {
    const url = `${apiUrl}/cadeyappopened`;
    const cadeyUserDeviceId = await getDeviceId();

    const bodyObject = {
      cadeyUserDeviceId,
    };

    try {
      // Use Axios to make the POST request
      const response = await axios.post(url, bodyObject, {
        headers: {
          accept: 'text/plain',
          apiKey: AppMeta.cadeyApiKey,
          'Content-Type': 'application/json',
        },
      });

      // Axios automatically throws an error on bad status, so no need to check response.ok
      const data = response.data; // response from Axios already parsed as JSON

      const grandfatherSignup =
        data.companyName === 'Grandfather' && data.authId === null;
      if (grandfatherSignup) {
        dispatch(setGrandfatherStatus(true));
      }

      return { grandfatherSignup };
    } catch (error) {
      console.error('HTTP error!', error.response || error);
      throw error; // Rethrow after logging
    }
  };

  return {
    appOpenAction,
  };
};

export default useAppOpened;
