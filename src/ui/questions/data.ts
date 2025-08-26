import { BlendingQuestion, SpeechQuestion, Question } from './types';

export const blendingQuestions: BlendingQuestion[] = [
  {
    id: 1,
    word: 'Irene',
    imageUrl: '🌲🐾',
    phonemes: ['I', 'r', 'e', 'n', 'e'],
    explanation: "Blend the sounds I-r-e-n-e to make 'Irene'!",
  },
];

export const speechQuestions: SpeechQuestion[] = [
  {
    id: 1,
    text:
      "Mia found a hot pot in the mystical forest. The pot had a big log floating on top.",
    imageUrl: '🌲🍄',
    expectedWords: ['hot', 'pot'],
    explanation: 'Great job! You found the short vowel words in Mia\'s mystical forest adventure.',
  },
];

export const longAQuestions: Question[] = [
  // Step 2 - short o CVC fill-in-the-blank
  {
    id: 1,
    word: 'jog',
    imageUrl: '🏃✨',
    isFillBlank: true,
    fillBlankPattern: 'j__',
    correctAnswer: 'jog',
    explanation: 'Mia jogs through the mystical forest—finish the word!',
    aiHook: {
      targetWord: 'jog',
      intent: 'spelling',
      baseLine: 'Mia jogs quietly through the mystical forest, her forest-green cloak flowing as she follows Shadow deeper into the woodland.',
      questionLine: 'Listen and fill in the missing letters for when you run slowly (short o sound).',
      validationWord: 'jog',
      imagePrompt: 'Mia in her forest-green cloak jogging through the mystical forest, running with purpose among glowing mushrooms and whispering trees, clearly showing the action of jogging.'
    }
  },
  // Step 3 - short o CVC fill-in-the-blank
  {
    id: 2,
    word: 'dog',
    imageUrl: '🐕✨',
    isFillBlank: true,
    fillBlankPattern: 'd__',
    correctAnswer: 'dog',
    explanation: 'Shadow the mysterious dog appears in the forest—complete the word you hear!',
    aiHook: {
      targetWord: 'dog',
      intent: 'spelling',
      baseLine: 'Shadow, the mysterious black dog with glowing eyes, appears beside Mia in the mystical forest, wagging its tail and guiding her toward hidden secrets.',
      questionLine: 'Listen and fill in the missing letters for a furry friend that barks (short o sound).',
      validationWord: 'dog',
      imagePrompt: 'Mia in her forest-green cloak with Shadow the mysterious black DOG with glowing eyes in the mystical forest, the dog is wagging its tail, magical atmosphere with glowing mushrooms and whispering trees; clearly shows a dog.'
    }
  },
  // Step 4 - short o CVC fill-in-the-blank
  {
    id: 3,
    word: 'mop',
    imageUrl: '🧽✨',
    isFillBlank: true,
    fillBlankPattern: 'm__',
    correctAnswer: 'mop',
    explanation: 'Mia uses a bundle of moss to clean up—fill in the missing letters!',
    aiHook: {
      targetWord: 'mop',
      intent: 'spelling',
      baseLine: 'Mia picks up a soft bundle of forest moss to clean up the magical pollen that scattered across the woodland clearing.',
      questionLine: 'Listen and fill in the missing letters for what you use to clean the floor (short o sound).',
      validationWord: 'mop',
      imagePrompt: 'Mia in her forest-green cloak holding a natural MOP made of forest moss in the mystical woodland clearing, cleaning magical pollen from the ground, glowing mushrooms around; clearly shows a mop being used.'
    }
  },
];

export const questions: Question[] = [
  // Steps 7–9 updated to short o CVC spelling words (step 10 removed)
  {
    id: 1,
    word: 'log',
    imageUrl: '🪵✨',
    isSpelling: true,
    correctAnswer: 'log',
    explanation: 'Mia finds a magical log for the forest clearing. Spell the word.',
    aiHook: {
      targetWord: 'log',
      intent: 'spelling',
      baseLine: 'Mia discovers a magical glowing log that will create warmth in the forest clearing, making their woodland home cozy for her sister and the boy protector.',
      questionLine: 'Listen and spell the word for a piece of wood (short o sound).',
      validationWord: 'log',
      imagePrompt: 'Mia in her forest-green cloak holding a magical glowing LOG near a forest clearing with glowing mushrooms, warm golden light emanating from the log, mystical woodland atmosphere; clearly shows a log.'
    }
  },
  {
    id: 2,
    word: 'pot',
    imageUrl: '🦄✨',
    isSpelling: true,
    correctAnswer: 'pot',
    explanation: 'A magical forest pot bubbles with herbal brew. Spell the word.',
    aiHook: {
      targetWord: 'pot',
      intent: 'spelling',
      baseLine: 'Mia stirs a magical forest pot that bubbles with glowing herbal brew, filling the woodland clearing with mystical aromas.',
      questionLine: 'Listen and spell the word for what you cook soup in (short o sound).',
      validationWord: 'pot',
      imagePrompt: 'Mia in her forest-green cloak stirring a magical cooking POT with bubbling herbal brew in the mystical forest clearing, glowing steam and magical sparkles rising from the pot; clearly shows a cooking pot.'
    }
  },
  {
    id: 3,
    word: 'hop',
    imageUrl: '🐰✨',
    isSpelling: true,
    correctAnswer: 'hop',
    explanation: 'The forest rabbits love to hop around the clearing. Spell the word.',
    aiHook: {
      targetWord: 'hop',
      intent: 'spelling',
      baseLine: 'Mia smiles as the magical forest rabbits hop playfully around the woodland clearing, making the soft moss bounce with each gentle jump.',
      questionLine: 'Listen and spell the word for jumping on one foot (short o sound).',
      validationWord: 'hop',
      imagePrompt: 'Mia in her forest-green cloak watching magical forest rabbits HOPPING around the mystical woodland clearing, bouncing with joy among glowing mushrooms, magical sparkles flying with each hop; clearly shows hopping movement.'
    }
  },
];

export const options: string[] = ['th', 'ch', 'fr'];


