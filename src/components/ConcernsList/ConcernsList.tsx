// Import our dependencies & styles
import React, { useState } from 'react';
import {
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import './ConcernsList.css';

// Define a TypeScript interface for the ConcernsList component's props
interface ConcernsListProps {
        onNext: (choice: { concern: string; symptoms: string[] }) => void;
}

// Define the ConcernsList functional component
const ConcernsList: React.FC<ConcernsListProps> = ({ onNext }) => {

        // Hardcoded payload until we can get this from an API
        // This should be replaced with an API call in the future
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

        // Create a list of choices by mapping over the payload entries
        const choices = Object.entries(choicesPayload).map(([_, value]) => {
                return {
                        concern: value.name,
                        symptoms: Object.values(value.items),
                };
        });

        // Render the component 
        return (
                <IonGrid>
                        <IonRow>
                                {/* Iterate over the choices and create a button for each concern */}
                                {choices.map((choice, index) => (
                                <IonCol size="6" key={index}>
                                        {/* When a button is clicked, call the onNext function with the chosen concern */}
                                        <IonButton
                                        className="concern"
                                        expand="block"
                                        onClick={() => onNext(choice)}
                                        >
                                        {choice.concern}
                                        </IonButton>
                                </IonCol>
                                ))}
                        </IonRow>
                </IonGrid>
        );
};

export default ConcernsList;