import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import VerifyEmailPage from './VerifyEmailPage';
import PasswordResetPage from './PasswordResetPage';

const HandlerPage: React.FC = () => {
  const auth = getAuth();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode');
  const actionCode = new URLSearchParams(location.search).get('oobCode');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [auth]);

  switch (mode) {
    case 'resetPassword':
      return <PasswordResetPage auth={auth} actionCode={actionCode} />;
      break;
    case 'verifyEmail':
      return (
        <VerifyEmailPage
          auth={auth}
          actionCode={actionCode}
          loading={loading}
        />
      );
      break;
    default:
      return null;
  }
};

export default HandlerPage;
