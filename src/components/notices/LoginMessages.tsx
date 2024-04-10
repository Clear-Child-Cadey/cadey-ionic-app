import { IonText } from '@ionic/react';

const LoginMessages = ({ messages }: { messages: string[] }) => {
  {
    return (
      <div style={{ marginBottom: '2rem' }}>
        {messages.length > 0 && (
          <p style={{ color: 'red', textAlign: 'center' }}>
            {messages.map((e) => (
              <IonText key={e}>{e}</IonText>
            ))}
          </p>
        )}
      </div>
    );
  }
};

export default LoginMessages;
