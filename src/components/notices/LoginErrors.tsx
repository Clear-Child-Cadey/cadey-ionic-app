import { IonText } from '@ionic/react';
import firebaseErrorMapper from '../../utils/firebaseErrorMapper';

const LoginErrors = ({ errors }: { errors: string[] }) => {
  {
    return (
      errors.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          {errors.map((e) => (
            <IonText style={{ color: '#FF0000' }} key={e}>
              {firebaseErrorMapper(e)}
            </IonText>
          ))}
        </div>
      )
    );
  }
};

export default LoginErrors;
