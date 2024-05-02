import { QuizResponse } from '../components/Modals/QuizModal/QuizModal';
import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const getQuiz = async (
  cadeyUserId: number,
  clientContext: number, // Where the user is in the app
  // 1 = VideoDetail
  // 2 = appopened
  entityType: number, // 1 = video, 2 = article
  entityId: number, // The ID of the video or article
) => {
  const url = `${AppMeta.baseApiUrl}/quiz`;
  const bodyObject = {
    cadeyUserId: cadeyUserId,
    clientContext: clientContext,
    entityType: entityType,
    entityId: entityId,
  };

  const response = await axios.post(url, bodyObject, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
      'Content-Type': 'application/json',
    },
  });

  return await response.data;
};

export const postQuizResponse = async (
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
  const url = `${AppMeta.baseApiUrl}/quizquestionresponse`;
  const bodyObject = {
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
  };

  const response = await axios.post(url, bodyObject, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
      'Content-Type': 'application/json',
    },
  });

  return await response.data;
};
