import { IonText } from '@ionic/react';
import firebaseErrorMapper from '../../utils/firebaseErrorMapper';

const LoginErrors = ({ errors }: { errors: string[] }) => {
  {
    return (
      errors.length > 0 && (
        <p>
          {errors.map((e) => (
            <IonText key={e}>{firebaseErrorMapper(e)}</IonText>
          ))}
        </p>
      )
    );
  }
};

export default LoginErrors;
