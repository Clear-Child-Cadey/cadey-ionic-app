import React from 'react';
import ApiUrlContext from '../context/ApiUrlContext';
import getDeviceId from '../utils/getDeviceId';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import AppMeta from '../variables/AppMeta';
import { useDispatch } from 'react-redux';
import { setAppOpenCadeyId } from '../features/authLoading/slice';

const useAppOpened = () => {
  const { apiUrl } = React.useContext(ApiUrlContext);
  const dispatch = useDispatch();

  const appOpenAction = async () => {
    // Define the url for the request
    const url = `${apiUrl}/cadeyappopened`;

    // Determine the platform on which the app is running
    // Prepare the body of the request
    const bodyObject = {
      cadeyUserId: 0,
      authId: null,
      cadeyUserEmail: null,
      cadeyUserDeviceId: getDeviceId(),
    };

    let request;

    try {
      request = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            accept: 'text/plain',
            apiKey: AppMeta.cadeyApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyObject),
        },
        { requestName: 'cadeyAppOpen' },
      );
    } catch (error) {
      throw new Error(`HTTP error! status: ${error}`);
    }

    if (!request.ok) {
      throw new Error(`HTTP error! status: ${request.status}`);
    }

    const response = await request.json(); // Parse the response data as json

    dispatch(setAppOpenCadeyId(response.cadeyUserId));
  };

  return {
    appOpenAction,
  };
};

export default useAppOpened;
