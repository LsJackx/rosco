export enum GamePhase {
  SETUP = 'setup',
  LOADING_QUESTIONS = 'loading_questions',
  REVIEW_QUESTIONS = 'review_questions',
  PLAYING = 'playing',
  GAMEOVER = 'gameover',
}

export type QuestionStatus = 'pending' | 'correct' | 'incorrect' | 'pasada';

export interface Question {
  letter: string;
  question: string;
  answer: string;
  status: QuestionStatus;
  userAnswer: string;
}

// For saving/loading from Firestore
export interface RoscoData {
  topic: string;
  educationalLevel: string;
  difficulty: string;
  questions: Omit<Question, 'status' | 'userAnswer'>[];
  createdAt: string;
}

export interface SavedRosco extends RoscoData {
    id: string;
}

export type Language = 'es';

export interface Translations {
  [key: string]: { [key:string]: string };
}