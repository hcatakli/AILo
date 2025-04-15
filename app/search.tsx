import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, X, BookOpen, ListPlus } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { WordCard } from '@/components/WordCard';
import { EmptyState } from '@/components/EmptyState';
import { useWordListsStore } from '@/store/word-lists-store';
import { Word, WordList } from '@/types/word';
import { colors } from '@/constants/colors';

type SearchResult = {
  type: 'word' | 'list';
  item: Word | WordList;
  listId?: string;
};

export default function SearchScreen() {
  const router = useRouter();
  const { lists, fetchLists } = useWordListsStore();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  useEffect(() => {
    fetchLists();
  }, []);
  
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    
    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Search in lists
    lists.forEach(list => {
      if (list.name.toLowerCase().includes(lowerQuery) || 
          (list.description && list.description.toLowerCase().includes(lowerQuery))) {
        searchResults.push({
          type: 'list',
          item: list,
        });
      }
      
      // Search in words
      list.words.forEach(word => {
        if (word.value.toLowerCase().includes(lowerQuery) || 
            word.definition.toLowerCase().includes(lowerQuery) ||
            (word.example && word.example.toLowerCase().includes(lowerQuery))) {
          searchResults.push({
            type: 'word',
            item: word,
            listId: list.id,
          });
        }
      });
    });
    
    setResults(searchResults);
  }, [query, lists]);
  
  const handleSearch = (text: string) => {
    setQuery(text);
    
    if (text.trim() && !recentSearches.includes(text.trim())) {
      // Add to recent searches when user submits
      const updatedSearches = [text.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
  };
  
  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'list') {
      router.push(`/list/${(result.item as WordList).id}`);
    } else if (result.type === 'word' && result.listId) {
      router.push(`/list/${result.listId}`);
    }
  };
  
  const renderItem = ({ item }: { item: SearchResult }) => {
    if (item.type === 'list') {
      const list = item.item as WordList;
      return (
        <TouchableOpacity
          style={styles.listResult}
          onPress={() => handleResultPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.listIconContainer}>
            <ListPlus size={20} color={colors.white} />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>{list.name}</Text>
            <Text style={styles.listMeta}>
              {list.wordCount} words • {list.language}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      const word = item.item as Word;
      return (
        <WordCard
          word={word}
          onPress={() => handleResultPress(item)}
          showActions={false}
        />
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Search" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search words and lists"
            value={query}
            onChangeText={handleSearch}
            autoFocus
            clearButtonMode="never"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {query.length === 0 ? (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          
          {recentSearches.length > 0 ? (
            recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => setQuery(search)}
              >
                <SearchIcon size={16} color={colors.textSecondary} />
                <Text style={styles.recentText}>{search}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent searches</Text>
          )}
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) => 
            `${item.type}-${item.type === 'list' 
              ? (item.item as WordList).id 
              : (item.item as Word).id}-${index}`
          }
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <EmptyState
          title="No Results Found"
          description={`No matches found for "${query}"`}
          icon={<BookOpen size={40} color={colors.primary} />}
          style={styles.emptyState}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  resultsList: {
    padding: 16,
  },
  listResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  listMeta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recentContainer: {
    padding: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  recentText: {
    fontSize: 16,
    color: colors.text,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
  },
});