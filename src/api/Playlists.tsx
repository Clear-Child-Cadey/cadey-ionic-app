const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';
import { Symptom } from "../components/ConcernsList/ConcernsList";
import { PopularSymptomSeries, PopularSymptomVideo } from "../components/SymptomsList/PopularSymptomsList";

export const getPopularSeriesSymptoms = async (apiUrl: string) => {
    const url = `${apiUrl}/popularseriessymptoms/`;

    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
        },
    });

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

export const getPopularSeries = async (apiUrl: string, symptom: number) => {
    const url = `${apiUrl}/popularseries/${symptom}`;

    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
        },
    });

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


