import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import VerifyEmailPage from './VerifyEmailPage';
import PasswordResetPage from './PasswordResetPage';

const HandlerPage: React.FC = () => {
  const auth = getAuth();
  // console.log(auth);
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode');
  const actionCode = new URLSearchParams(location.search).get('oobCode');
  const [loading, setLoading] = useState<boolean>(true);
  // console.log('test', mode);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [auth]);

  if (mode === 'resetPassword') {
    return <PasswordResetPage auth={auth} actionCode={actionCode} />;
  }

  if (mode === 'verifyEmail') {
    return (
      <VerifyEmailPage auth={auth} actionCode={actionCode} loading={loading} />
    );
  }
};

export default HandlerPage;
