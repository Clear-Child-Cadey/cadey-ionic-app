import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const getRecommendations = async (
  // apiUrl: string,
  cadeyUserId: string,
  ageGroup: number,
  symptoms: any[],
) => {
  // const cadeyUserId = useSelector((state: RootState) => {
  //   return state.authStatus.userData.cadeyUser?.cadeyUserId || 0;
  // });
  const url = `${AppMeta.baseApiUrl}/getrecommendations?cadeyUserId=${cadeyUserId}&ageGroup=${ageGroup}&symptomIds=${symptoms.map((symptom) => symptom.id).join('&symptomIds=')}`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  return await response.data;
};
