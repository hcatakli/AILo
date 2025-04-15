import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  LearningGoal, 
  SkillAssessment, 
  CoachRecommendation, 
  CoachConversation,
  CoachMessage,
  LearningInsight,
  LearningStyle,
  CoachSettings
} from '@/types/coach';
import { useWordListsStore } from './word-lists-store';
import { useLearningStore } from './learning-store';

// Mock data for initial state
const INITIAL_GOALS: LearningGoal[] = [
  {
    id: '1',
    title: 'Master 500 essential vocabulary words',
    description: 'Learn and practice 500 most common words in my target language',
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    progress: 35,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updatedAt: new Date().toISOString(),
    completed: false,
    type: 'vocabulary',
    metrics: {
      targetWordCount: 500,
      currentWordCount: 175,
    }
  },
  {
    id: '2',
    title: 'Complete business vocabulary list',
    description: 'Learn all words in the Business English list',
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    progress: 40,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date().toISOString(),
    completed: false,
    type: 'vocabulary',
  }
];

const INITIAL_ASSESSMENTS: SkillAssessment[] = [
  {
    id: '1',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    skills: {
      vocabulary: 45,
      grammar: 60,
      speaking: 40,
      listening: 55,
      reading: 65,
      writing: 50
    },
    weaknesses: ['vocabulary retention', 'speaking fluency'],
    strengths: ['reading comprehension', 'grammar understanding']
  }
];

const INITIAL_RECOMMENDATIONS: CoachRecommendation[] = [
  {
    id: '1',
    title: 'Review difficult words',
    description: 'Practice the 20 words you find most challenging',
    type: 'practice',
    priority: 'high',
    reason: "You've struggled with these words in recent sessions",
    createdAt: new Date().toISOString(),
    completed: false,
    focusArea: 'vocabulary'
  },
  {
    id: '2',
    title: 'Try the Business English list',
    description: 'This list contains professional vocabulary that aligns with your goals',
    type: 'list',
    priority: 'medium',
    reason: 'Matches your career-focused learning goal',
    createdAt: new Date().toISOString(),
    completed: false,
    listId: '2',
    focusArea: 'vocabulary'
  }
];

const INITIAL_CONVERSATIONS: CoachConversation[] = [
  {
    id: '1',
    messages: [
      {
        id: '1',
        content: "Welcome to your AI language coach! I'm here to help you achieve your language learning goals.",
        sender: 'coach',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        content: 'Thanks! I want to improve my vocabulary for business contexts.',
        sender: 'user',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 1000).toISOString()
      },
      {
        id: '3',
        content: "Great goal! I'll help you focus on business vocabulary. Let's start by assessing your current level.",
        sender: 'coach',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 2000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 2000).toISOString()
  }
];

const INITIAL_INSIGHTS: LearningInsight[] = [
  {
    id: '1',
    title: 'Vocabulary Retention Pattern',
    description: 'You tend to learn new words quickly but review them less frequently, which may affect long-term retention.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'pattern'
  },
  {
    id: '2',
    title: 'Consistent Progress',
    description: "You've maintained a 12-day learning streak! Consistent practice is key to language mastery.",
    createdAt: new Date().toISOString(),
    type: 'milestone'
  }
];

const INITIAL_LEARNING_STYLE: LearningStyle = {
  visualLearning: 70,
  auditoryLearning: 50,
  readingWriting: 80,
  kinestheticLearning: 40,
  preferredTimeOfDay: 'evening',
  preferredSessionLength: 'medium',
  preferredReviewFrequency: 'spaced'
};

const INITIAL_SETTINGS: CoachSettings = {
  enabled: true,
  conversationStyle: 'encouraging',
  reminderFrequency: 'daily',
  focusAreas: ['vocabulary', 'reading', 'writing'],
  showOnHomeScreen: true
};

interface CoachState {
  goals: LearningGoal[];
  assessments: SkillAssessment[];
  recommendations: CoachRecommendation[];
  conversations: CoachConversation[];
  currentConversation: CoachConversation | null;
  insights: LearningInsight[];
  learningStyle: LearningStyle;
  settings: CoachSettings;
  isLoading: boolean;
  error: string | null;
}

interface CoachStore extends CoachState {
  // Goals
  addGoal: (goal: Omit<LearningGoal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => Promise<LearningGoal>;
  updateGoal: (id: string, updates: Partial<Omit<LearningGoal, 'id' | 'createdAt'>>) => Promise<LearningGoal>;
  deleteGoal: (id: string) => Promise<void>;
  completeGoal: (id: string) => Promise<void>;
  
  // Assessments
  startAssessment: () => Promise<void>;
  completeAssessment: (results: Omit<SkillAssessment, 'id' | 'date'>) => Promise<SkillAssessment>;
  
  // Recommendations
  getRecommendations: () => Promise<CoachRecommendation[]>;
  completeRecommendation: (id: string) => Promise<void>;
  
  // Conversations
  startConversation: () => Promise<CoachConversation>;
  sendMessage: (content: string) => Promise<CoachMessage>;
  
  // Settings
  updateSettings: (updates: Partial<CoachSettings>) => void;
  
  // Analysis
  analyzePerformance: () => Promise<LearningInsight[]>;
  updateLearningStyle: (updates: Partial<LearningStyle>) => void;
}

export const useCoachStore = create<CoachStore>()(
  persist(
    (set, get) => ({
      goals: INITIAL_GOALS,
      assessments: INITIAL_ASSESSMENTS,
      recommendations: INITIAL_RECOMMENDATIONS,
      conversations: INITIAL_CONVERSATIONS,
      currentConversation: INITIAL_CONVERSATIONS[0],
      insights: INITIAL_INSIGHTS,
      learningStyle: INITIAL_LEARNING_STYLE,
      settings: INITIAL_SETTINGS,
      isLoading: false,
      error: null,

      // Goals
      addGoal: async (goalData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newGoal: LearningGoal = {
            ...goalData,
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            progress: 0,
            completed: false,
          };
          
          set(state => ({
            goals: [...state.goals, newGoal],
            isLoading: false,
          }));
          
          // Add a coach message about the new goal
          if (get().currentConversation) {
            get().sendMessage(`I've set a new goal: ${goalData.title}`);
          }
          
          return newGoal;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      updateGoal: async (id, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const goalIndex = get().goals.findIndex(goal => goal.id === id);
          
          if (goalIndex === -1) {
            throw new Error("Goal not found");
          }
          
          const updatedGoal = {
            ...get().goals[goalIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          
          const newGoals = [...get().goals];
          newGoals[goalIndex] = updatedGoal;
          
          set({
            goals: newGoals,
            isLoading: false,
          });
          
          return updatedGoal;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      deleteGoal: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            goals: state.goals.filter(goal => goal.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      completeGoal: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const goalIndex = get().goals.findIndex(goal => goal.id === id);
          
          if (goalIndex === -1) {
            throw new Error("Goal not found");
          }
          
          const updatedGoal = {
            ...get().goals[goalIndex],
            completed: true,
            progress: 100,
            updatedAt: new Date().toISOString(),
          };
          
          const newGoals = [...get().goals];
          newGoals[goalIndex] = updatedGoal;
          
          set({
            goals: newGoals,
            isLoading: false,
          });
          
          // Add a coach message congratulating the user
          if (get().currentConversation) {
            get().sendMessage(`I've completed my goal: ${updatedGoal.title}`);
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      // Assessments
      startAssessment: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // In a real app, this would initiate an assessment flow
          // For now, we'll just set a loading state
          
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      completeAssessment: async (results) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const newAssessment: SkillAssessment = {
            ...results,
            id: String(Date.now()),
            date: new Date().toISOString(),
          };
          
          set(state => ({
            assessments: [...state.assessments, newAssessment],
            isLoading: false,
          }));
          
          // Generate new recommendations based on assessment
          await get().getRecommendations();
          
          // Add a coach message about the assessment
          if (get().currentConversation) {
            const coachResponse = await get().sendMessage("I've completed my skills assessment");
          }
          
          return newAssessment;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      // Recommendations
      getRecommendations: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 600));
          
          // In a real app, this would analyze user data and generate personalized recommendations
          // For now, we'll use our mock data with a slight modification
          
          const learningStore = useLearningStore.getState();
          const wordListsStore = useWordListsStore.getState();
          
          // Get user's learning history and word lists
          const sessions = learningStore.sessions;
          const lists = wordListsStore.lists;
          
          // Simple recommendation logic based on user data
          const newRecommendations: CoachRecommendation[] = [
            ...INITIAL_RECOMMENDATIONS,
            {
              id: String(Date.now()),
              title: "Review your recent learning sessions",
              description: "Revisit words from your last 3 learning sessions to reinforce your memory",
              type: "practice",
              priority: "high",
              reason: "Spaced repetition improves long-term retention",
              createdAt: new Date().toISOString(),
              completed: false,
              focusArea: "vocabulary"
            }
          ];
          
          set({
            recommendations: newRecommendations,
            isLoading: false,
          });
          
          return newRecommendations;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      completeRecommendation: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const recIndex = get().recommendations.findIndex(rec => rec.id === id);
          
          if (recIndex === -1) {
            throw new Error("Recommendation not found");
          }
          
          const updatedRec = {
            ...get().recommendations[recIndex],
            completed: true,
          };
          
          const newRecs = [...get().recommendations];
          newRecs[recIndex] = updatedRec;
          
          set({
            recommendations: newRecs,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      // Conversations
      startConversation: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 400));
          
          const newConversation: CoachConversation = {
            id: String(Date.now()),
            messages: [
              {
                id: String(Date.now()),
                content: "Hello! I'm your AI language coach. How can I help you today?",
                sender: "coach",
                timestamp: new Date().toISOString(),
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({
            conversations: [...state.conversations, newConversation],
            currentConversation: newConversation,
            isLoading: false,
          }));
          
          return newConversation;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      sendMessage: async (content) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          if (!get().currentConversation) {
            await get().startConversation();
          }
          
          const conversation = get().currentConversation!;
          
          // Add user message
          const userMessage: CoachMessage = {
            id: String(Date.now()),
            content,
            sender: "user",
            timestamp: new Date().toISOString(),
          };
          
          // In a real app, this would call an AI service to generate a response
          // For now, we'll use simple predefined responses
          
          // Simple response logic
          let responseContent = "I understand. Let me help you with that.";
          
          if (content.toLowerCase().includes("goal")) {
            responseContent = "Goals are important for effective language learning. What specific goal would you like to set?";
          } else if (content.toLowerCase().includes("vocabulary") || content.toLowerCase().includes("words")) {
            responseContent = "Building vocabulary is crucial. I recommend daily practice with our flashcard system and contextual learning.";
          } else if (content.toLowerCase().includes("assessment") || content.toLowerCase().includes("test")) {
            responseContent = "Regular assessments help track your progress. Would you like to take a quick assessment now?";
          } else if (content.toLowerCase().includes("recommend") || content.toLowerCase().includes("suggest")) {
            responseContent = "Based on your learning patterns, I recommend focusing on spaced repetition for better retention.";
          }
          
          // Add coach response
          const coachMessage: CoachMessage = {
            id: String(Date.now() + 1),
            content: responseContent,
            sender: "coach",
            timestamp: new Date(Date.now() + 1000).toISOString(),
          };
          
          const updatedMessages = [...conversation.messages, userMessage, coachMessage];
          
          const updatedConversation = {
            ...conversation,
            messages: updatedMessages,
            updatedAt: new Date().toISOString(),
          };
          
          // Update conversations list
          const conversationIndex = get().conversations.findIndex(c => c.id === conversation.id);
          const newConversations = [...get().conversations];
          
          if (conversationIndex !== -1) {
            newConversations[conversationIndex] = updatedConversation;
          }
          
          set({
            conversations: newConversations,
            currentConversation: updatedConversation,
            isLoading: false,
          });
          
          return coachMessage;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      // Settings
      updateSettings: (updates) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...updates,
          }
        }));
      },
      
      // Analysis
      analyzePerformance: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // In a real app, this would analyze user data to generate insights
          // For now, we'll use our mock data with a slight modification
          
          const learningStore = useLearningStore.getState();
          const streak = learningStore.streak;
          
          const newInsights: LearningInsight[] = [
            ...get().insights,
            {
              id: String(Date.now()),
              title: "Learning Consistency",
              description: `You've maintained a ${streak}-day learning streak. Consistent practice is key to language mastery.`,
              createdAt: new Date().toISOString(),
              type: "milestone"
            }
          ];
          
          set({
            insights: newInsights,
            isLoading: false,
          });
          
          return newInsights;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      updateLearningStyle: (updates) => {
        set(state => ({
          learningStyle: {
            ...state.learningStyle,
            ...updates,
          }
        }));
      },
    }),
    {
      name: 'coach-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);