import { useHistory } from 'react-router';
import { useModalContext } from '../context/ModalContext';
import { useTabContext } from '../context/TabContext';
import { getQuiz } from '../api/Quiz';
import AppMeta from '../variables/AppMeta';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import React from 'react';
import ApiUrlContext from '../context/ApiUrlContext';
import { setQuizModalOpen as setQuizModalOpenRx } from '../features/video/slice';

interface Props {
  clientContext: number; //Where the user is in the app: 1 = VideoDetail, 2 = appopened, 3 = Onboarding sequence
  entityType: number; // 1 = video, 2 = article
  entityId: number; // The ID of the video or article
  shouldHaveEmailVerified?: boolean;
}

const useRequestQuiz = ({
  clientContext,
  entityType,
  entityId,
  shouldHaveEmailVerified = false,
}: Props) => {
  const dispatch = useDispatch();
  const { setQuizModalData, setQuizModalOpen } = useModalContext();
  const { setIsTabBarVisible } = useTabContext();
  const history = useHistory();
  const { apiUrl } = React.useContext(ApiUrlContext);
  const cadeyUserId = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  ); // either grab the ID from cadey user, if set, otherwise, get the appOpen cadeyUserId

  const deepLinkStatus = useSelector((state: RootState) => {
    return state.deepLink;
  });

  const { videoId, articleId } = deepLinkStatus;

  const isVideoModal = entityType === 1;

  // Set email verification requirement based on where quiz is being rendered
  const emailVerified =
    shouldHaveEmailVerified && AppMeta.forceEmailVerification
      ? useSelector((state: RootState) => {
          return (
            state.authStatus?.emailVerified ||
            state.authStatus?.userData?.firebaseUser?.emailVerified
          );
        })
      : true;

  const requestQuiz = async () => {
    if (emailVerified) {
      const quizResponse = await getQuiz(
        apiUrl,
        Number(cadeyUserId),
        clientContext,
        entityType, // Entity Type (1 = video)
        entityId, // Entity IDs (The ID of the video)
      );

      // setCheckForWelcome(true); // Prevents re-fetching the quiz hmmmmmmm...

      // If the user has not completed the welcome sequence, show the welcome page
      if (quizResponse.question !== null && quizResponse.question.id > 0) {
        // Set the quiz data
        setQuizModalData(quizResponse);

        if (isVideoModal) {
          //set quiz modal open
          setQuizModalOpen(true);
          dispatch(setQuizModalOpenRx(true));
        } else {
          // Hide the tab bar
          setIsTabBarVisible(false);

          // Redirect user to Welcome sequence - Age group
          history.push('/App/Welcome/Path');
        }
      } else if (!isVideoModal) {
        // Show the tab bar and redirect to the home page
        setIsTabBarVisible(true);

        console.log('deepLinkStatus', deepLinkStatus);
        // Check if there is a video or article ID from a deep link. If so, append to the Home route
        if (videoId != '') {
          history.push(`/App/Home?video=${videoId}`);
        } else if (articleId > 0) {
          history.push(`/App/Home?article=${articleId}`);
        } else {
          history.push('/App/Home');
        }
      }
    }
  };

  return { requestQuiz };
};

export default useRequestQuiz;
