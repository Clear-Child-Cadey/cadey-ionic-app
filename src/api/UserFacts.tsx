const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';
const headers = {
  'accept': 'text/plain',
  'apiKey': API_KEY,
  'Content-Type': 'application/json',
};

export const logVideoPlay = async (cadeyUserId: string, url: string, mediaId: string, mediaType: string, source: string) => {
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ 
      userid: cadeyUserId,
      userFactTypeName: "StartedMedia",
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

export const logVideoPause = async (cadeyUserId: string, url: string, mediaId: string, mediaProgress: string, mediaType: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "PausedMedia",
          appPage: source,
          detail1: mediaId,
          detail2: mediaProgress,
          detail3: mediaType,
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

export const logVideoProgress = async (cadeyUserId: string, url: string, mediaId: string, progress: string, videoType: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "InProgressMedia",
          appPage: source,
          detail1: mediaId,
          detail2: progress,
          detail3: videoType,
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

export const logVideoFinish = async (cadeyUserId: string, url: string, mediaId: string, mediaType: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "FinishedMedia",
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

// Log user response to false door question
export const logFalseDoorResponse = async (cadeyUserId: string, url: string, falseDoorQuestionId: string, userResponse: string, source: string) => {
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "FalseDoorQuestionResponse",
          appPage: source,
          detail1: falseDoorQuestionId, 
          detail2: userResponse,
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