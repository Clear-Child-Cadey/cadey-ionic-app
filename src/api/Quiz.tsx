const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';
import { QuizResponse } from '../components/Modals/QuizModal/QuizModal';
import fetchWithTimeout from '../utils/fetchWithTimeout';

let response;

export const getQuiz = async (
  apiUrl: string,
  cadeyUserId: number,
  clientContext: number, // Where the user is in the app
  // 1 = VideoDetail
  // 2 = appopened
  entityType: number, // 1 = video, 2 = article
  entityId: number, // The ID of the video or article
) => {
  const url = `${apiUrl}/quiz`;

  try {
    response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          accept: 'text/plain',
          apiKey: 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cadeyUserId: cadeyUserId,
          clientContext: clientContext,
          entityType: entityType,
          entityId: entityId,
        }),
      },
      { cadeyUserId, requestName: 'getQuiz' },
    );
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const postQuizResponse = async (
  apiUrl: string,
  cadeyUserId: number,
  clientContext: number,
  entityId: number,
  entityType: number,
  quizId: number,
  questionId: number,
  questionWasSkipped: boolean,
  quizWasCancelled: boolean,
  responses: QuizResponse[],
) => {
  const url = `${apiUrl}/quizquestionresponse`;

  try {
    response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          accept: 'text/plain',
          apiKey: 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizRequest: {
            cadeyUserId: cadeyUserId,
            clientContext: clientContext,
            entityType: entityType,
            entityId: entityId,
          },
          cadeyUserId: cadeyUserId,
          quizId: quizId,
          questionId: questionId,
          questionWasSkipped: questionWasSkipped,
          quizWasCancelled: quizWasCancelled,
          responses: responses,
        }),
      },
      { cadeyUserId, requestName: 'postQuizResponse' },
    );
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
