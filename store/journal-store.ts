import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, JournalFilter, MediaType } from '@/types/journal';
import { Platform } from 'react-native';

interface JournalState {
  entries: JournalEntry[];
  isRecording: boolean;
  currentRecordingUri: string | null;
  recordingDuration: number;
  filter: JournalFilter;
  
  // Actions
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setFilter: (filter: JournalFilter) => void;
  clearFilter: () => void;
  
  // Recording state
  setIsRecording: (isRecording: boolean) => void;
  setCurrentRecordingUri: (uri: string | null) => void;
  setRecordingDuration: (duration: number) => void;
  
  // Queries
  getEntryById: (id: string) => JournalEntry | undefined;
  getEntriesByMediaType: (mediaType: MediaType) => JournalEntry[];
  getEntriesByWord: (wordId: string) => JournalEntry[];
  getFavorites: () => JournalEntry[];
  getRecentEntries: (limit?: number) => JournalEntry[];
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      isRecording: false,
      currentRecordingUri: null,
      recordingDuration: 0,
      filter: {},
      
      addEntry: (entryData) => {
        const id = Date.now().toString();
        const now = new Date().toISOString();
        
        const newEntry: JournalEntry = {
          id,
          createdAt: now,
          updatedAt: now,
          isFavorite: false,
          ...entryData,
        };
        
        set(state => ({
          entries: [newEntry, ...state.entries]
        }));
        
        return id;
      },
      
      updateEntry: (id, updates) => {
        set(state => ({
          entries: state.entries.map(entry => 
            entry.id === id 
              ? { 
                  ...entry, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                } 
              : entry
          )
        }));
      },
      
      deleteEntry: (id) => {
        set(state => ({
          entries: state.entries.filter(entry => entry.id !== id)
        }));
      },
      
      toggleFavorite: (id) => {
        set(state => ({
          entries: state.entries.map(entry => 
            entry.id === id 
              ? { ...entry, isFavorite: !entry.isFavorite } 
              : entry
          )
        }));
      },
      
      setFilter: (filter) => {
        set({ filter });
      },
      
      clearFilter: () => {
        set({ filter: {} });
      },
      
      setIsRecording: (isRecording) => {
        set({ isRecording });
      },
      
      setCurrentRecordingUri: (uri) => {
        set({ currentRecordingUri: uri });
      },
      
      setRecordingDuration: (duration) => {
        set({ recordingDuration: duration });
      },
      
      getEntryById: (id) => {
        return get().entries.find(entry => entry.id === id);
      },
      
      getEntriesByMediaType: (mediaType) => {
        return get().entries.filter(entry => entry.mediaType === mediaType);
      },
      
      getEntriesByWord: (wordId) => {
        return get().entries.filter(entry => 
          entry.wordIds?.includes(wordId)
        );
      },
      
      getFavorites: () => {
        return get().entries.filter(entry => entry.isFavorite);
      },
      
      getRecentEntries: (limit = 5) => {
        return [...get().entries]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        entries: state.entries,
        // Don't persist recording state
      }),
    }
  )
);