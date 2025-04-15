import { Word, WordList } from './word';

export interface LearningGoal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  type: 'vocabulary' | 'grammar' | 'speaking' | 'listening' | 'reading' | 'writing' | 'custom';
  metrics?: {
    targetWordCount?: number;
    currentWordCount?: number;
    targetProficiencyLevel?: number;
    currentProficiencyLevel?: number;
  };
}

export interface SkillAssessment {
  id: string;
  date: string;
  skills: {
    vocabulary: number; // 0-100
    grammar: number;
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
  };
  weaknesses: string[];
  strengths: string[];
}

export interface CoachRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'list' | 'practice' | 'test' | 'resource' | 'challenge';
  priority: 'high' | 'medium' | 'low';
  reason: string;
  createdAt: string;
  completed: boolean;
  listId?: string;
  resourceUrl?: string;
  focusArea: 'vocabulary' | 'grammar' | 'speaking' | 'listening' | 'reading' | 'writing';
}

export interface CoachConversation {
  id: string;
  messages: CoachMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CoachMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: string;
  attachedRecommendation?: CoachRecommendation;
  attachedGoal?: LearningGoal;
  attachedAssessment?: SkillAssessment;
}

export interface LearningInsight {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type: 'pattern' | 'improvement' | 'challenge' | 'milestone';
  relatedWords?: string[]; // Word IDs
  relatedLists?: string[]; // List IDs
}

export interface LearningStyle {
  visualLearning: number; // 0-100
  auditoryLearning: number;
  readingWriting: number;
  kinestheticLearning: number;
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  preferredSessionLength?: 'short' | 'medium' | 'long';
  preferredReviewFrequency?: 'daily' | 'spaced' | 'intensive';
}

export interface CoachSettings {
  enabled: boolean;
  conversationStyle: 'formal' | 'casual' | 'encouraging' | 'direct';
  reminderFrequency: 'daily' | 'weekly' | 'monthly' | 'none';
  focusAreas: ('vocabulary' | 'grammar' | 'speaking' | 'listening' | 'reading' | 'writing')[];
  showOnHomeScreen: boolean;
}