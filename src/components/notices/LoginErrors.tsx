import { IonText } from '@ionic/react';
import firebaseErrorMapper from '../../utils/firebaseErrorMapper';

const LoginErrors = ({
  errors,
  goBack,
}: {
  errors: string[];
  goBack?: () => void;
}) => {
  {
    return (
      <div style={{ marginBottom: '2rem' }}>
        {errors.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            {errors.map((e) => (
              <IonText style={{ color: '#FF0000' }} key={e}>
                {firebaseErrorMapper(e)}
              </IonText>
            ))}
          </div>
        )}
        {goBack && errors.length > 0 && (
          <p className='go-back'>
            <span role='button' onClick={goBack}>
              ← Go Back
            </span>
          </p>
        )}
      </div>
    );
  }
};

export default LoginErrors;
