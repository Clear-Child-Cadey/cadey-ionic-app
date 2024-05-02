import { Symptom } from '../components/ConcernsList/ConcernsList';
import { PopularSymptomVideo } from '../components/SymptomsList/PopularSymptomsList';
import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const getPopularSeriesSymptoms = async (apiUrl: string) => {
  const url = `${apiUrl}/popularseriessymptoms/`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  const data = await response.data;

  // Return data mapped to the Symptom interface
  return data.map((series: Symptom) => ({
    id: series.id,
    name: series.name,
  }));
};

export const getPopularSeries = async (apiUrl: string, symptom: number) => {
  const url = `${apiUrl}/popularseries/${symptom}`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  const data = await response.data;

  // Return data mapped to the PopularSymptomSeries interface
  const popularSeries = {
    symptomId: data.symptomId,
    symptomName: data.symptomName,
    items: data.items.map((item: PopularSymptomVideo) => ({
      entityId: item.entityId,
      entityType: item.entityType,
      entityTitle: item.entityTitle,
      vimeoSourceId: item.vimeoSourceId,
      vimeoThumbnail: item.vimeoThumbnail,
    })),
  };
  return popularSeries;
};
