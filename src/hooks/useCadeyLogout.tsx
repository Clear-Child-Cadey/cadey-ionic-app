import { useHistory } from 'react-router';
import { auth } from '../api/Firebase/InitializeFirebase';

const cadeyLogout = () => {
  const history = useHistory();

  auth.signOut();
  history.push('/App/Welcome');
  window.location.reload();
};

export default cadeyLogout;
