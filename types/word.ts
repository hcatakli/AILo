export interface Word {
  id: string;
  value: string;
  definition: string;
  example?: string;
  pronunciation?: string;
  imageUrl?: string;
  createdAt: string;
  lastReviewed?: string;
  masteryLevel: number; // 0-5 scale
}

export interface WordList {
  id: string;
  name: string;
  description?: string;
  language: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  words: Word[];
  progress: number; // 0-100 percentage
  userId: string;
  category?: string;
}

export interface WordListSummary {
  id: string;
  name: string;
  description?: string;
  language: string;
  wordCount: number;
  progress: number;
  updatedAt: string;
  category?: string;
}

export interface LearningSession {
  id: string;
  listId: string;
  startedAt: string;
  completedAt?: string;
  correctAnswers: number;
  totalQuestions: number;
  words: {
    wordId: string;
    correct: boolean;
  }[];
}

export interface TestSession extends LearningSession {
  score: number;
  timeTaken?: number;
}