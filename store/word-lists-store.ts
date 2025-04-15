import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word, WordList, WordListSummary } from '@/types/word';
import { useAuthStore } from './auth-store';

// Mock data for demo purposes
const MOCK_WORD_LISTS: WordList[] = [
  {
    id: '1',
    name: 'Essential English Vocabulary',
    description: 'Common words used in everyday conversations',
    language: 'English',
    context: 'Daily conversations',
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-06-20T15:30:00Z',
    wordCount: 50,
    progress: 65,
    userId: '1',
    category: 'General',
    words: [
      {
        id: '101',
        value: 'ubiquitous',
        definition: 'Present, appearing, or found everywhere',
        example: 'Mobile phones are now ubiquitous in modern society',
        masteryLevel: 3,
        createdAt: '2023-01-15T12:00:00Z',
        lastReviewed: '2023-06-18T09:15:00Z',
      },
      {
        id: '102',
        value: 'ephemeral',
        definition: 'Lasting for a very short time',
        example: 'The ephemeral nature of fashion trends',
        masteryLevel: 2,
        createdAt: '2023-01-15T12:05:00Z',
        lastReviewed: '2023-06-19T14:30:00Z',
      },
      {
        id: '103',
        value: 'serendipity',
        definition: 'The occurrence of events by chance in a happy or beneficial way',
        example: 'Finding that book was pure serendipity',
        masteryLevel: 1,
        createdAt: '2023-01-15T12:10:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Business English',
    description: 'Vocabulary for professional settings',
    language: 'English',
    context: 'Workplace communication',
    createdAt: '2023-02-10T09:45:00Z',
    updatedAt: '2023-06-15T11:20:00Z',
    wordCount: 75,
    progress: 40,
    userId: '1',
    category: 'Professional',
    words: [
      {
        id: '201',
        value: 'leverage',
        definition: 'Use something to maximum advantage',
        example: 'We need to leverage our network to find new clients',
        masteryLevel: 4,
        createdAt: '2023-02-10T09:50:00Z',
        lastReviewed: '2023-06-14T10:00:00Z',
      },
      {
        id: '202',
        value: 'paradigm',
        definition: 'A typical example or pattern of something',
        example: 'The company is shifting to a new business paradigm',
        masteryLevel: 2,
        createdAt: '2023-02-10T09:55:00Z',
        lastReviewed: '2023-06-12T16:45:00Z',
      },
    ],
  },
  {
    id: '3',
    name: 'Spanish Basics',
    description: 'Fundamental Spanish vocabulary for beginners',
    language: 'Spanish',
    context: 'Travel and basic conversations',
    createdAt: '2023-03-05T14:20:00Z',
    updatedAt: '2023-06-10T08:15:00Z',
    wordCount: 100,
    progress: 25,
    userId: '1',
    category: 'Language Learning',
    words: [
      {
        id: '301',
        value: 'hola',
        definition: 'Hello',
        example: 'Hola, ¿cómo estás?',
        masteryLevel: 5,
        createdAt: '2023-03-05T14:25:00Z',
        lastReviewed: '2023-06-09T17:30:00Z',
      },
      {
        id: '302',
        value: 'gracias',
        definition: 'Thank you',
        example: 'Muchas gracias por tu ayuda',
        masteryLevel: 5,
        createdAt: '2023-03-05T14:30:00Z',
        lastReviewed: '2023-06-08T11:45:00Z',
      },
    ],
  },
];

interface WordListsState {
  lists: WordList[];
  currentList: WordList | null;
  isLoading: boolean;
  error: string | null;
}

interface WordListsStore extends WordListsState {
  fetchLists: () => Promise<void>;
  fetchListById: (id: string) => Promise<WordList | null>;
  createList: (list: Omit<WordList, 'id' | 'createdAt' | 'updatedAt' | 'wordCount' | 'progress' | 'words'>) => Promise<WordList>;
  updateList: (id: string, updates: Partial<Omit<WordList, 'id' | 'createdAt' | 'updatedAt' | 'wordCount' | 'progress' | 'words'>>) => Promise<WordList>;
  deleteList: (id: string) => Promise<void>;
  addWord: (listId: string, word: Omit<Word, 'id' | 'createdAt' | 'masteryLevel'>) => Promise<Word>;
  updateWord: (listId: string, wordId: string, updates: Partial<Omit<Word, 'id' | 'createdAt'>>) => Promise<Word>;
  deleteWord: (listId: string, wordId: string) => Promise<void>;
  updateWordMastery: (listId: string, wordId: string, masteryLevel: number) => Promise<void>;
  getListSummaries: () => WordListSummary[];
}

export const useWordListsStore = create<WordListsStore>()(
  persist(
    (set, get) => ({
      lists: MOCK_WORD_LISTS,
      currentList: null,
      isLoading: false,
      error: null,

      fetchLists: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, we would fetch from an API
          // For now, we're using the mock data
          
          set({
            lists: MOCK_WORD_LISTS,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },
      
      fetchListById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const list = get().lists.find(list => list.id === id) || null;
          
          set({
            currentList: list,
            isLoading: false,
          });
          
          return list;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          return null;
        }
      },
      
      createList: async (listData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error("You must be logged in to create a list");
          }
          
          const newList: WordList = {
            ...listData,
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            wordCount: 0,
            progress: 0,
            words: [],
            userId: user.id,
          };
          
          set(state => ({
            lists: [...state.lists, newList],
            currentList: newList,
            isLoading: false,
          }));
          
          return newList;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      updateList: async (id, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const listIndex = get().lists.findIndex(list => list.id === id);
          
          if (listIndex === -1) {
            throw new Error("List not found");
          }
          
          const updatedList = {
            ...get().lists[listIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          
          const newLists = [...get().lists];
          newLists[listIndex] = updatedList;
          
          set({
            lists: newLists,
            currentList: updatedList,
            isLoading: false,
          });
          
          return updatedList;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      deleteList: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            lists: state.lists.filter(list => list.id !== id),
            currentList: state.currentList?.id === id ? null : state.currentList,
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
      
      addWord: async (listId, wordData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 400));
          
          const listIndex = get().lists.findIndex(list => list.id === listId);
          
          if (listIndex === -1) {
            throw new Error("List not found");
          }
          
          const newWord: Word = {
            ...wordData,
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            masteryLevel: 0,
          };
          
          const updatedList = { ...get().lists[listIndex] };
          updatedList.words = [...updatedList.words, newWord];
          updatedList.wordCount = updatedList.words.length;
          updatedList.updatedAt = new Date().toISOString();
          
          const newLists = [...get().lists];
          newLists[listIndex] = updatedList;
          
          set({
            lists: newLists,
            currentList: updatedList,
            isLoading: false,
          });
          
          return newWord;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      updateWord: async (listId, wordId, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const listIndex = get().lists.findIndex(list => list.id === listId);
          
          if (listIndex === -1) {
            throw new Error("List not found");
          }
          
          const wordIndex = get().lists[listIndex].words.findIndex(word => word.id === wordId);
          
          if (wordIndex === -1) {
            throw new Error("Word not found");
          }
          
          const updatedWord = {
            ...get().lists[listIndex].words[wordIndex],
            ...updates,
          };
          
          const updatedList = { ...get().lists[listIndex] };
          const updatedWords = [...updatedList.words];
          updatedWords[wordIndex] = updatedWord;
          updatedList.words = updatedWords;
          updatedList.updatedAt = new Date().toISOString();
          
          const newLists = [...get().lists];
          newLists[listIndex] = updatedList;
          
          set({
            lists: newLists,
            currentList: updatedList,
            isLoading: false,
          });
          
          return updatedWord;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },
      
      deleteWord: async (listId, wordId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const listIndex = get().lists.findIndex(list => list.id === listId);
          
          if (listIndex === -1) {
            throw new Error("List not found");
          }
          
          const updatedList = { ...get().lists[listIndex] };
          updatedList.words = updatedList.words.filter(word => word.id !== wordId);
          updatedList.wordCount = updatedList.words.length;
          updatedList.updatedAt = new Date().toISOString();
          
          const newLists = [...get().lists];
          newLists[listIndex] = updatedList;
          
          set({
            lists: newLists,
            currentList: updatedList,
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
      
      updateWordMastery: async (listId, wordId, masteryLevel) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const listIndex = get().lists.findIndex(list => list.id === listId);
          
          if (listIndex === -1) {
            throw new Error("List not found");
          }
          
          const wordIndex = get().lists[listIndex].words.findIndex(word => word.id === wordId);
          
          if (wordIndex === -1) {
            throw new Error("Word not found");
          }
          
          const updatedWord = {
            ...get().lists[listIndex].words[wordIndex],
            masteryLevel,
            lastReviewed: new Date().toISOString(),
          };
          
          const updatedList = { ...get().lists[listIndex] };
          const updatedWords = [...updatedList.words];
          updatedWords[wordIndex] = updatedWord;
          updatedList.words = updatedWords;
          
          // Calculate new progress
          const totalMastery = updatedList.words.reduce((sum, word) => sum + word.masteryLevel, 0);
          const maxPossibleMastery = updatedList.words.length * 5; // Assuming max mastery is 5
          updatedList.progress = Math.round((totalMastery / maxPossibleMastery) * 100);
          updatedList.updatedAt = new Date().toISOString();
          
          const newLists = [...get().lists];
          newLists[listIndex] = updatedList;
          
          set({
            lists: newLists,
            currentList: updatedList,
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
      
      getListSummaries: () => {
        return get().lists.map(list => ({
          id: list.id,
          name: list.name,
          description: list.description,
          language: list.language,
          wordCount: list.wordCount,
          progress: list.progress,
          updatedAt: list.updatedAt,
          category: list.category,
        }));
      },
    }),
    {
      name: 'word-lists-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);