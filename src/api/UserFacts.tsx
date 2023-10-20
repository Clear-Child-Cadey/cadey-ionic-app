const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';
const headers = {
  'accept': 'text/plain',
  'apiKey': API_KEY,
  'Content-Type': 'application/json',
};

interface LogUserFactOptions {
  cadeyUserId: string;
  baseApiUrl: string;
  userFactTypeName: string;
  appPage: string;
  detail1?: string;
  detail2?: string;
  detail3?: string;
  detail4?: string;
  detail5?: string;
  detail6?: string;
  detail7?: string;
  detail8?: string;
  detail9?: string;
}

export const logUserFact = async ({
  cadeyUserId,
  baseApiUrl,
  userFactTypeName,
  appPage,
  detail1 = "",
  detail2 = "",
  detail3 = "",
  detail4 = "",
  detail5 = "",
  detail6 = "",
  detail7 = "",
  detail8 = "",
  detail9 = ""
}: LogUserFactOptions) => {
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      userid: cadeyUserId,
      userFactTypeName: userFactTypeName,
      appPage: appPage,
      detail1,
      detail2,
      detail3,
      detail4,
      detail5,
      detail6,
      detail7,
      detail8,
      detail9,
    }),
  };

  try {
    const response = await fetch(`${baseApiUrl}/userfact`, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling userfact: ', error);
    throw error;
  }
}








export const logShareClick = async (cadeyUserId: string, url: string, mediaId: string, mediaType: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "MediaShared",
          appPage: source,
          detail1: mediaId,
          detail2: mediaType,
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

export const logConcernClick = async (cadeyUserId: string, url: string, concernId: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "ConcernChosen",
          appPage: source,
          detail1: concernId,
          detail2: "",
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

export const logFeaturedVideoNotificationClicked = async (cadeyUserId: string, url: string, mediaId: string, sourceId: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "FeaturedVideoNotificationClicked",
          appPage: source,
          detail1: mediaId,
          detail2: sourceId,
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

export const logAgeScreenReached = async (cadeyUserId: string, url: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "AgePageEntered",
          appPage: source,
          detail1: "",
          detail2: "",
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

export const logMessageOnMessagesPageClicked = async (cadeyUserId: string, url: string, mediaId: string, mediaSourceId: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "MessageClickedOnMessagesPage",
          appPage: source,
          detail1: mediaId,
          detail2: mediaSourceId,
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

export const logTapBarClick = async (cadeyUserId: string, url: string, tabName: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
          userid: cadeyUserId,
          userFactTypeName: "TapBarNavClick",
          appPage: source,
          detail1: tabName,
          detail2: "",
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

export const logOpenedArticle = async (cadeyUserId: string, url: string, wordpressArticleId: number, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "OpenedArticle",
          appPage: source,
          detail1: wordpressArticleId.toString(),
          detail2: "",
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

export const logVideoDetailPageClosed = async (cadeyUserId: string, url: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "VideoDetailPageClosed",
          appPage: source,
          detail1: "",
          detail2: "",
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

export const appPageNavigation = async (cadeyUserId: string, url: string, appPage: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "appPageNavigation",
          appPage: appPage,
          detail1: "",
          detail2: "",
          detail3: "",
          detail4: "",
          detail5: "",
          detail6: "",
          detail7: "",
          detail8: "",
          detail9: "",
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}