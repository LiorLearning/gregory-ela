import { BlendingQuestion, SpeechQuestion, Question } from './types';

export const blendingQuestions: BlendingQuestion[] = [
  {
    id: 1,
    word: 'Kaida',
    imageUrl: '✨📚',
    phonemes: ['K', 'ai', 'da'],
    explanation: "Blend the sounds K-ai-da to make 'Kaida'!",
  },
];

export const speechQuestions: SpeechQuestion[] = [
  {
    id: 1,
    text:
      "Kaida found a magical gate blocking his path in the library's secret chamber. The wise librarian appeared beside him with a gentle smile. 'You must make the correct choice to open this gate,' she explained carefully. 'Speak the magic words and watch it shine with brilliant light.' Kaida nodded bravely, touched the gate gently, and whispered the ancient spell. Suddenly, the gate began to shine brightly, opening to reveal floating books beyond.",
    imageUrl: '✨🚪📚💎🌟',
    expectedWords: ['gate', 'wise', 'make', 'shine'],
    explanation: 'Excellent reading! You found all the silent e words in Kaida\'s magical library adventure.',
  },
];

export const longAQuestions: Question[] = [
  {
    id: 1,
    word: 'name',
    imageUrl: '📜✨',
    isSpelling: true,
    correctAnswer: 'name',
    explanation: 'Kaida\'s magical "name" glows on the ancient scroll - the long a sound with silent e at the end!',
    aiHook: {
      targetWord: 'name',
      intent: 'spelling',
      baseLine: 'Kaida discovers his identity written in golden letters on an enchanted library registry.',
      questionLine: 'Listen and type the long a word with silent e for what you are called.',
      validationWord: 'name',
      imagePrompt: 'Ancient glowing scroll showing Kaida\'s NAME written in golden magical letters in the mystical library, floating books and magical atmosphere visible; clearly shows the name on parchment.'
    }
  },
  {
    id: 2,
    word: 'lake',
    imageUrl: '🏞️✨',
    isSpelling: true,
    correctAnswer: 'lake',
    explanation: 'A mystical "lake" of shimmering knowledge surrounds the library - the long a sound with silent e at the end!',
    aiHook: {
      targetWord: 'lake',
      intent: 'spelling',
      baseLine: 'Kaida gazes upon the magical waters that reflect ancient wisdom around the library tower.',
      questionLine: 'Listen and type the long a word with silent e for the body of water.',
      validationWord: 'lake',
      imagePrompt: 'Mystical glowing LAKE surrounding the library tower with reflections of magical knowledge in the water, floating books visible above the lake; composition highlights the magical lake clearly.'
    }
  },
];

export const questions: Question[] = [
  {
    id: 1,
    word: 'cake',
    imageUrl: '🎂✨',
    isSpelling: true,
    correctAnswer: 'cake',
    explanation: 'A magical "cake" with sparkles - the long a sound with silent e at the end!',
    aiHook: {
      targetWord: 'cake',
      intent: 'spelling',
      baseLine: 'Kaida discovers a mystical birthday celebration in the library with a glowing dessert.',
      questionLine: 'Listen and type the long a word with silent e for the sweet treat.',
      validationWord: 'cake',
      imagePrompt: 'Magical glowing CAKE with sparkles and candles in the mystical library, floating books in background; clearly shows a decorated cake with magical properties.'
    }
  },
  {
    id: 2,
    word: 'make',
    imageUrl: '🔨✨',
    isSpelling: true,
    correctAnswer: 'make',
    explanation: 'Kaida can "make" magical spells - the long a sound with silent e at the end!',
    aiHook: {
      targetWord: 'make',
      intent: 'spelling',
      baseLine: 'Kaida crafts powerful enchantments using ancient tools and mystical ingredients.',
      questionLine: 'Listen and type the long a word with silent e for creating something.',
      validationWord: 'make',
      imagePrompt: 'Kaida using magical tools to MAKE enchantments in the library workshop, glowing crafting materials visible; composition shows the act of creating magic.'
    }
  },
  {
    id: 3,
    word: 'take',
    imageUrl: '👋✨',
    isSpelling: true,
    correctAnswer: 'take',
    explanation: 'Kaida will "take" the ancient book - the long a sound with silent e at the end!',
    aiHook: {
      targetWord: 'take',
      intent: 'spelling',
      baseLine: 'Kaida reaches for a glowing tome from the highest shelf in the enchanted library.',
      questionLine: 'Listen and type the long a word with silent e for grabbing something.',
      validationWord: 'take',
      imagePrompt: 'Kaida reaching to TAKE a glowing ancient book from a high mystical library shelf, magical light emanating from the book; focus on the action of taking.'
    }
  },
  {
    id: 4,
    word: 'game',
    imageUrl: '🎮✨',
    isSpelling: true,
    correctAnswer: 'game',
    explanation: 'The library has a magical "game" of riddles - the long a sound with silent e at the end!',
    aiHook: {
      targetWord: 'game',
      intent: 'spelling',
      baseLine: 'Enchanted playing pieces float around Kaida as he solves mystical puzzles.',
      questionLine: 'Listen and type the long a word with silent e for a fun activity.',
      validationWord: 'game',
      imagePrompt: 'Magical floating GAME pieces and puzzle elements around Kaida in the mystical library, glowing riddles visible; composition highlights the magical game elements.'
    }
  },
];

export const options: string[] = ['th', 'ch', 'fr'];


