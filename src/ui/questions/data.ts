import { BlendingQuestion, SpeechQuestion, Question } from './types';

export const blendingQuestions: BlendingQuestion[] = [
  {
    id: 1,
    word: 'Gregory',
    imageUrl: '👾⚡',
    phonemes: ['G', 'r', 'e', 'g', 'o', 'r', 'y'],
    explanation: "Blend the sounds G-r-e-g-o-r-y to make 'Gregory'!",
  },
];

export const speechQuestions: SpeechQuestion[] = [
  {
    id: 1,
    text:
      "Gregory found a hot spot in the digital realm. The corrupted code had a big log file floating on top.",
    imageUrl: '👾💻',
    expectedWords: ['hot', 'spot'],
    explanation: 'Great job! You found the short vowel words in Gregory\'s digital corruption adventure.',
  },
];

export const longAQuestions: Question[] = [
  // Step 2 - long a with ai fill-in-the-blank
  {
    id: 1,
    word: 'rain',
    imageUrl: '🌧️✨',
    isFillBlank: true,
    fillBlankPattern: 'r__n',
    correctAnswer: 'rain',
    explanation: 'Gregory watches digital rain fall through the corrupted realm—finish the word!',
    aiHook: {
      targetWord: 'rain',
      intent: 'spelling',
      baseLine: 'Gregory stands in the corrupted digital realm as glitched rain falls from the pixelated sky, each droplet sparkling with code fragments.',
      questionLine: 'Listen and fill in the missing letters for water that falls from the sky (long a sound with ai).',
      validationWord: 'rain',
      imagePrompt: 'Gregory in his blue hoodie with glowing runes standing in digital RAIN falling from pixelated sky in the corrupted realm, with glitched raindrops sparkling with code fragments around him; clearly shows rain falling.'
    }
  },
  // Step 3 - long a with ai fill-in-the-blank  
  {
    id: 2,
    word: 'train',
    imageUrl: '🚂✨',
    isFillBlank: true,
    fillBlankPattern: 'tr__n',
    correctAnswer: 'train',
    explanation: 'A digital train speeds through the glitched landscape—complete the word you hear!',
    aiHook: {
      targetWord: 'train',
      intent: 'spelling',
      baseLine: 'A glowing digital train with pixelated steam rushes through the corrupted landscape, its wheels sparking with electrical code as it carries Gregory to his next adventure.',
      questionLine: 'Listen and fill in the missing letters for what travels on tracks (long a sound with ai).',
      validationWord: 'train',
      imagePrompt: 'Gregory in his blue hoodie with glowing runes riding a digital glowing TRAIN with pixelated steam rushing through the corrupted landscape, wheels sparking with electrical code; clearly shows a train on tracks.'
    }
  },
  // Step 4 - long a with ai fill-in-the-blank
  {
    id: 3,
    word: 'tail',
    imageUrl: '🦊✨',
    isFillBlank: true,
    fillBlankPattern: 't__l',
    correctAnswer: 'tail',
    explanation: 'A digital fox swishes its glowing tail in the virtual forest—fill in the missing letters!',
    aiHook: {
      targetWord: 'tail',
      intent: 'spelling',
      baseLine: 'Gregory encounters a friendly digital fox in the virtual forest, its glowing tail swishing back and forth as pixelated leaves dance around them.',
      questionLine: 'Listen and fill in the missing letters for what animals wag (long a sound with ai).',
      validationWord: 'tail',
      imagePrompt: 'Gregory in his blue hoodie with glowing runes petting a digital fox with a glowing TAIL swishing in the virtual forest, with pixelated leaves dancing around them; clearly shows an animal tail.'
    }
  },
];

export const questions: Question[] = [
  // Steps 6-8 updated to long a with ay spelling words
  {
    id: 1,
    word: 'play',
    imageUrl: '🎮✨',
    isSpelling: true,
    correctAnswer: 'play',
    explanation: 'Gregory enjoys playing digital games in the virtual realm. Spell the word.',
    aiHook: {
      targetWord: 'play',
      intent: 'spelling',
      baseLine: 'Gregory sits at a glowing gaming console in the internet café, playing an exciting digital adventure game that helps him practice his coding skills.',
      questionLine: 'Listen and spell the word for having fun with games (long a sound with ay).',
      validationWord: 'play',
      imagePrompt: 'Gregory in his blue hoodie with glowing runes sitting at a glowing gaming console PLAYING digital games in the internet café, with colorful game graphics and digital effects around him; clearly shows playing/gaming.'
    }
  },
  {
    id: 2,
    word: 'day',
    imageUrl: '☀️✨',
    isSpelling: true,
    correctAnswer: 'day',
    explanation: 'A new digital day dawns in the corrupted realm with glowing sunshine. Spell the word.',
    aiHook: {
      targetWord: 'day',
      intent: 'spelling',
      baseLine: 'Gregory watches as a beautiful digital sunrise brings a new day to the corrupted realm, with pixelated sunbeams breaking through the glitched clouds and warming the virtual landscape.',
      questionLine: 'Listen and spell the word for when the sun is shining (long a sound with ay).',
      validationWord: 'day',
      imagePrompt: 'Gregory in his blue hoodie with glowing runes watching a digital sunrise bringing a new DAY to the corrupted realm, with pixelated sunbeams and glitched clouds in the virtual landscape; clearly shows daytime/sunshine.'
    }
  },
  {
    id: 3,
    word: 'way',
    imageUrl: '🛤️✨',
    isSpelling: true,
    correctAnswer: 'way',
    explanation: 'Gregory finds the right path through the digital maze. Spell the word.',
    aiHook: {
      targetWord: 'way',
      intent: 'spelling',
      baseLine: 'Gregory discovers a glowing digital pathway that leads through the corrupted maze, with sparkling code fragments lighting the way forward to his next adventure.',
      questionLine: 'Listen and spell the word for a path or direction (long a sound with ay).',
      validationWord: 'way',
      imagePrompt: 'Gregory in his blue hoodie with glowing runes walking on a glowing digital pathway/WAY through a corrupted maze, with sparkling code fragments lighting the path forward; clearly shows a path or way.'
    }
  },
];

export const options: string[] = ['th', 'ch', 'fr'];


