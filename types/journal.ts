import { Word } from './word';

export type MediaType = 'audio' | 'video' | 'text';

export interface JournalEntry {
  id: string;
  title: string;
  description?: string;
  mediaType: MediaType;
  mediaUri?: string;
  textContent?: string;
  duration?: number; // in seconds
  createdAt: string;
  updatedAt: string;
  wordIds?: string[]; // Associated words
  tags?: string[];
  isFavorite: boolean;
}

export interface JournalFilter {
  mediaType?: MediaType;
  searchQuery?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  favorites?: boolean;
}