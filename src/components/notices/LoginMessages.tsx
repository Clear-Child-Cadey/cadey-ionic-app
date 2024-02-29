import { IonText } from '@ionic/react';

const LoginMessages = ({ messages }: { messages: string[] }) => {
  {
    return (
      messages.length > 0 && (
        <p>
          {messages.map((e) => (
            <IonText key={e}>{e}</IonText>
          ))}
        </p>
      )
    );
  }
};

export default LoginMessages;