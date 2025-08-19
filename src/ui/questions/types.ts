export type AiHook = {
  targetWord: string;
  intent: 'sound' | 'spelling' | 'story';
  baseLine: string;
  questionLine: string;
  validationWord: string;
  // Optional per-question image prompt to steer DALL·E generation
  // If omitted, a contextual prompt will be composed from the adventure story
  // and the target word so the generated image clearly depicts the word.
  imagePrompt?: string;
};

export type Question = {
  id: number;
  word: string;
  imageUrl: string;
  correctAnswer: number | string; // index of correct option or correct spelling
  explanation: string;
  isSpelling?: boolean; // Optional flag for spelling questions
  aiHook?: AiHook; // Optional AI hook config for Step 4 methodology
};

export type BlendingQuestion = {
  id: number;
  word: string;
  imageUrl: string;
  phonemes: string[]; // individual sounds for blending
  explanation: string;
};

export type SpeechQuestion = {
  id: number;
  text: string;
  imageUrl: string;
  expectedWords: string[]; // words the student should say
  explanation: string;
};


