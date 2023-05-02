import './QuestionForm.css';

// Import our dependencies
import React, { useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
} from '@ionic/react';

// Allow the QuestionForm to continue to the next step
interface QuestionFormProps {
  onNext: () => void;
}

// Create the QuestionForm component, and use the useState hook to handle the input fields, loading state, and the response:
const QuestionForm: React.FC = () => {
  const [selectedChoice, setSelectedChoice] = useState(-1);
  const [subChoices, setSubChoices] = useState<Array<string>>([]);
  const [selectedSubChoices, setSelectedSubChoices] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [age, setAge] = useState('');
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);

//   Hardcoded payload until we can get this from an API
  const choicesPayload = {
    "0": {"name": "Negative emotionality (worry, sadness, ...)",
           "items": {
             "0": "Worries a lot",
             "1": "Phobias",
             "2": "Sadness",
             "3": "Constant negativity",
             "4": "Cries a lot",
             "5": "Easily upset",
             "6": "Mood swings",
             "7": "Negative attitude",
             "8": "Poor self-esteem",
		     "9": "Perfectionist, too hard on themselves",
             "10": "Detached, withdrawn, living in their own world"
           }
   },
   "1": {"name": "Attention & memory",
           "items": {
             "0": "Can't focus on tasks",
             "1": "Does not remember information",
             "2": "Short attention span",
             "3": "Forgets to do things",
             "4": "Shifts attention too often, easily distracted",
             "5": "In their own world"
           }
   },
   "2": {"name": "Social interactions",
           "items": {
             "0": "Does not have friends",
             "1": "Does not keep friends over time",
             "2": "Avoids peers, not socially motivated",
             "3": "Has trouble with conversations",
             "4": "Talks at inappropriate times",
             "5": "Does not understand others’ thoughts and feelings"
           }
   },
   "3": {"name": "Speech & language",
           "items": {
             "0": "Not understanding others",
             "1": "Talking too much",
             "2": "Being too loud",
             "3": "Making repetitive sounds",
             "4": "Not speaking clearly",
             "5": "Doesn't talk"
           }
   },
   "4": {"name": "Movement & coordination",
           "items": {
             "0": "Curling fingers",
             "1": "Tics",
             "2": "Poor spatial orientation",
             "3": "Repetitive movements",
             "4": "Stimming",
             "5": "Uncoordinated"
           }
   },
   "5": {"name": "Anger & aggression",
           "items": {
             "0": "Angry",
             "1": "Bullying peers",
             "2": "Bites, kicks, or hits",
             "3": "Yells",
             "4": "Easily irritable",
             "5": "Curses"
           }
   },
   "6": {"name": "School & academics",
           "items": {
             "0": "Poor handwriting",
             "1": "Problems with math, calculations",
             "2": "Doesn't write well",
             "3": "Takes too long to do homework",
		     "4": "Reading challenges",
             "5": "Does not understand what they read",
             "6": "Slow processing speed",
             "7": "Can’t focus on schoolwork",
             "8": "Disorganized"
           }
   },
   "7": {"name": "Sensory processing",
           "items": {
             "0": "Does not process what is going on around them",
             "1": "Sensitive to noise, taste, touch, or what they see",
             "2": "Easily overwhelmed by stimuli",
             "3": "Sensory-seeking"
           }
   },
   "8": {"name": "Hyperactivity & impulsivity",
           "items": {
             "0": "Doesn't think before acting",
             "1": "Difficulty with transitions",
             "2": "Excessive energy",
             "3": "Feels emotions very quickly",
		     "4": "Speaks without thinking, interrupts"
           }
   },
   "9": {"name": "Risky choices",
           "items": {
             "0": "Doesn't understand danger",
             "1": "Climbs, runs around, rides at high speeds, etc."
           }
   },
   "10": {"name": "Tantrums & meltdowns",
           "items": {
             "0": "Inflicts self-harm",
             "1": "Outbursts",
             "2": "Mood swings",
             "3": "Throws temper tantrums, yelling, throwing self to floor"
           }
   },
   "11": {"name": "Listening & following directions",
           "items": {
             "0": "Defiant",
             "1": "Not being honest",
             "2": "Not following directions",
             "3": "Doesn't like to hear a \"no\"",
             "4": "Talks in a hurtful way"
           }
   },   
   "12": {"name": "Behavior Problems",
           "items": {
             "0": "Gets in trouble at school",
             "1": "Gets in trouble at home",
             "2": "Uses rude language",
             "3": "Hits other children in school",
             "4": "Disturbs or Distracts others",
             "5": "Expelled from school"
           }
   },   
   "13": {"name": "Adapting to Change",
           "items": {
             "0": "Has a hard time with change"
           }
   },   
   "14": {"name": "Sleep, eating & daily living",
           "items": {
            "0": "Trouble falling asleep",
            "1": "Trouble sleeping all night",
            "2": "Wetting the bed",
            "3": "Poor hygiene",
            "4": "Messy room", 
            "5": "Refuses to eat certain foods",
		    "6": "Eats too much, hoards food",
		    "7": "Eats too little"
           }
   },   
   "15": {"name": "Maturity & development",
           "items": {
             "0": "Not acting age-appropriately",
             "1": "Delayed language",
             "2": "Behind academically",
 		        "3": "Seems socially immature"
           }
   }
  };
  
  const choices = Object.entries(choicesPayload).map(([_, value]) => {
    return {
      label: value.name,
      subChoices: Object.values(value.items),
    };
  });

  // Send a POST request to the provided endpoint with the question and age as the request payload:
  const handleSubmit = async () => {
    setIsLoading(true);

    setUserQuery(subChoices.join(', '));

    const url = 'https://wruaigpff6432iw6mamzxargz40rfkty.lambda-url.us-west-2.on.aws/';
    const bodyObject = {
      client_id: '127001',
      user_query: userQuery,
      age: age,
      tools: '',
    };
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(bodyObject),
    };

    // Log the request object
    console.log('Request:', bodyObject); 

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      setResponse(data);

      // Log the response data
      console.log('Response:', data); 

      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleChoiceClick = (index: number) => {
    setSelectedChoice(index);
    setSubChoices([]);
  };

//   Sorts the user choices alphabetically
  const sortSubChoices = (a: string, b: string) => {
    const aNumber = parseInt(a.split(' ')[1]);
    const bNumber = parseInt(b.split(' ')[1]);
  
    return aNumber - bNumber;
  };  

//   Update the state when the user selects checkbox items
const handleSubChoiceChange = (subChoice: string, isChecked: boolean) => {
    let newSelectedSubChoices: string[];

    if (isChecked) {
        newSelectedSubChoices = [...selectedSubChoices, subChoice].sort(sortSubChoices);
    } else {
        newSelectedSubChoices = selectedSubChoices
        .filter((item) => item !== subChoice)
        .sort(sortSubChoices);
    }

    setSelectedSubChoices(newSelectedSubChoices);
    setUserQuery(newSelectedSubChoices.join(', '));
};

  // Create the form with the input fields for the question and age, and a button to submit the form:
  return (
    <>
      <IonGrid>
        <IonRow>
          {choices.map((choice, index) => (
            <IonCol size="3" key={index}>
                <IonButton
                    expand="block"
                    onClick={() => handleChoiceClick(index)}
                    color={selectedChoice === index ? 'primary' : 'light'}
                >
                    {choice.label}
                </IonButton>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      
      {/* Display the sub-choices when a user selects an item from the grid */}
      {selectedChoice > -1 && (
        <>
            {choices[selectedChoice].subChoices.map((subChoice, index) => (
                <IonItem key={index}>
                    <IonLabel>{subChoice}</IonLabel>
                    <IonCheckbox
                        slot="start"
                        checked={selectedSubChoices.includes(subChoice)}
                        onIonChange={(e) => handleSubChoiceChange(subChoice, e.detail.checked)}
                    />
                </IonItem>
            ))}
        </>
      )}

      {/* Display the sub choices on the screen */}
      {selectedSubChoices.length > 0 && (
        <IonItem>
          <IonLabel>
            Selected Items: {selectedSubChoices.join(', ')}
          </IonLabel>
        </IonItem>
      )}
      <IonItem>
        <IonLabel position="floating">Age</IonLabel>
        <IonInput type="number" value={age} onIonChange={(e) => setAge(e.detail.value!)}></IonInput>
      </IonItem>
      <IonButton expand="block" onClick={handleSubmit}>
        Submit
      </IonButton>
      <IonLoading isOpen={isLoading} message={'Please wait...'} />
      <IonItem>
        {response.action_content && (
        <>
            <IonLabel>
            <h2>{response.action_content.title}</h2>
            </IonLabel>
            <ol>
            {Object.entries(response.action_content.body).map(([key, value]) => (
                <li key={key}>
                <strong>{key}</strong>
                <ul>
                    {value.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                    ))}
                </ul>
                </li>
            ))}
            </ol>
        </>
        )}
        </IonItem>
    </>
  );
};

export default QuestionForm;
