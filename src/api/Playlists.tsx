const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';
import { Symptom } from "../components/ConcernsList/ConcernsList";
import { PopularSymptomSeries, PopularSymptomVideo } from "../components/SymptomsList/PopularSymptomsList";
import fetchWithTimeout from "../utils/fetchWithTimeout";

let response;

export const getPopularSeriesSymptoms = async (apiUrl: string, cadeyUserId: string) => {
    const url = `${apiUrl}/popularseriessymptoms/`;

    try {
        response = await fetchWithTimeout(
          url,
          {
            method: "GET",
            headers: {
              accept: "text/plain",
              apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
            },
          },
          { cadeyUserId, requestName: "getPopularSeriesSymptoms" },
        );
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    const data = await response.json();

    // Return data mapped to the Symptom interface
    return data.map((series: Symptom) => ({
        id: series.id,
        name: series.name,
    }));
};

export const getPopularSeries = async (apiUrl: string, cadeyUserId: string, symptom: number) => {
    const url = `${apiUrl}/popularseries/${symptom}`;

    try {
        response = await fetchWithTimeout(
          url,
          {
            method: "GET",
            headers: {
              accept: "text/plain",
              apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
            },
          },
          { cadeyUserId, requestName: "getPopularSeries" },
        );
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    const data = await response.json();

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


