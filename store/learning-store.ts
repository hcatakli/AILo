import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LearningSession, TestSession, Word } from '@/types/word';
import { useWordListsStore } from './word-lists-store';

interface LearningState {
  currentSession: LearningSession | null;
  currentTestSession: TestSession | null;
  sessions: LearningSession[];
  testSessions: TestSession[];
  streak: number;
  lastLearningDate: string | null;
  isLoading: boolean;
  error: string | null;
}

interface LearningStore extends LearningState {
  startLearningSession: (listId: string, wordCount?: number) => Promise<LearningSession>;
  completeQuestion: (wordId: string, correct: boolean) => Promise<void>;
  endLearningSession: () => Promise<void>;
  startTestSession: (listId: string, wordCount?: number) => Promise<TestSession>;
  completeTestQuestion: (wordId: string, correct: boolean) => Promise<void>;
  endTestSession: (timeTaken?: number) => Promise<void>;
  getSessionHistory: (listId?: string) => LearningSession[];
  getTestHistory: (listId?: string) => TestSession[];
  resetCurrentSession: () => void;
}

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      currentTestSession: null,
      sessions: [],
      testSessions: [],
      streak: 0,
      lastLearningDate: null,
      isLoading: false,
      error: null,

      startLearningSession: async (listId, wordCount = 10) => {
        set({ isLoading: true, error: null });
        
        try {
          const list = await useWordListsStore.getState().fetchListById(listId);
          
          if (!list) {
            throw new Error("List not found");
          }
          
          // Select words for the session, prioritizing those with lower mastery
          const sortedWords = [...list.words].sort((a, b) => a.masteryLevel - b.masteryLevel);
          const sessionWords = sortedWords.slice(0, wordCount);
          
          if (sessionWords.length === 0) {
            throw new Error("No words available in this list");
          }
          
          const newSession: LearningSession = {
            id: String(Date.now()),
            listId,
            startedAt: new Date().toISOString(),
            correctAnswers: 0,
            totalQuestions: sessionWords.length,
            words: sessionWords.map(word => ({
              wordId: word.id,
              correct: false,
            })),
          };
          
          set({
            currentSession: newSession,
            isLoading: false,
          });
          
          return newSession;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      completeQuestion: async (wordId, correct) => {
        const session = get().currentSession;
        
        if (!session) {
          throw new Error("No active learning session");
        }
        
        const wordIndex = session.words.findIndex(w => w.wordId === wordId);
        
        if (wordIndex === -1) {
          throw new Error("Word not found in current session");
        }
        
        const updatedWords = [...session.words];
        updatedWords[wordIndex] = { ...updatedWords[wordIndex], correct };
        
        const correctAnswers = updatedWords.filter(w => w.correct).length;
        
        set({
          currentSession: {
            ...session,
            words: updatedWords,
            correctAnswers,
          },
        });
        
        // Update word mastery level
        if (correct) {
          await useWordListsStore.getState().updateWordMastery(
            session.listId,
            wordId,
            // Increase mastery level by 1, max 5
            Math.min(5, (useWordListsStore.getState().lists.find(l => l.id === session.listId)?.words.find(w => w.id === wordId)?.masteryLevel || 0) + 1)
          );
        }
      },
      
      endLearningSession: async () => {
        const session = get().currentSession;
        
        if (!session) {
          throw new Error("No active learning session");
        }
        
        const completedSession: LearningSession = {
          ...session,
          completedAt: new Date().toISOString(),
        };
        
        // Update streak
        const today = new Date().toDateString();
        const lastDate = get().lastLearningDate ? new Date(get().lastLearningDate).toDateString() : null;
        
        let newStreak = get().streak;
        
        if (lastDate === null) {
          // First session ever
          newStreak = 1;
        } else if (lastDate === today) {
          // Already learned today, streak unchanged
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = yesterday.toDateString();
          
          if (lastDate === yesterdayString) {
            // Learned yesterday, increase streak
            newStreak += 1;
          } else {
            // Streak broken, reset to 1
            newStreak = 1;
          }
        }
        
        set(state => ({
          currentSession: null,
          sessions: [...state.sessions, completedSession],
          streak: newStreak,
          lastLearningDate: today,
        }));
      },
      
      startTestSession: async (listId, wordCount = 20) => {
        set({ isLoading: true, error: null });
        
        try {
          const list = await useWordListsStore.getState().fetchListById(listId);
          
          if (!list) {
            throw new Error("List not found");
          }
          
          // For tests, randomly select words from the list
          const shuffledWords = [...list.words].sort(() => Math.random() - 0.5);
          const sessionWords = shuffledWords.slice(0, wordCount);
          
          if (sessionWords.length === 0) {
            throw new Error("No words available in this list");
          }
          
          const newSession: TestSession = {
            id: String(Date.now()),
            listId,
            startedAt: new Date().toISOString(),
            correctAnswers: 0,
            totalQuestions: sessionWords.length,
            score: 0,
            words: sessionWords.map(word => ({
              wordId: word.id,
              correct: false,
            })),
          };
          
          set({
            currentTestSession: newSession,
            isLoading: false,
          });
          
          return newSession;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      completeTestQuestion: async (wordId, correct) => {
        const session = get().currentTestSession;
        
        if (!session) {
          throw new Error("No active test session");
        }
        
        const wordIndex = session.words.findIndex(w => w.wordId === wordId);
        
        if (wordIndex === -1) {
          throw new Error("Word not found in current session");
        }
        
        const updatedWords = [...session.words];
        updatedWords[wordIndex] = { ...updatedWords[wordIndex], correct };
        
        const correctAnswers = updatedWords.filter(w => w.correct).length;
        const score = Math.round((correctAnswers / session.totalQuestions) * 100);
        
        set({
          currentTestSession: {
            ...session,
            words: updatedWords,
            correctAnswers,
            score,
          },
        });
      },
      
      endTestSession: async (timeTaken) => {
        const session = get().currentTestSession;
        
        if (!session) {
          throw new Error("No active test session");
        }
        
        const completedSession: TestSession = {
          ...session,
          completedAt: new Date().toISOString(),
          timeTaken,
        };
        
        set(state => ({
          currentTestSession: null,
          testSessions: [...state.testSessions, completedSession],
        }));
      },
      
      getSessionHistory: (listId) => {
        const sessions = get().sessions;
        
        if (!listId) {
          return sessions;
        }
        
        return sessions.filter(session => session.listId === listId);
      },
      
      getTestHistory: (listId) => {
        const sessions = get().testSessions;
        
        if (!listId) {
          return sessions;
        }
        
        return sessions.filter(session => session.listId === listId);
      },
      
      resetCurrentSession: () => {
        set({
          currentSession: null,
          currentTestSession: null,
        });
      },
    }),
    {
      name: 'learning-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);