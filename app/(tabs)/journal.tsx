import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Mic, 
  Video, 
  FileText, 
  Search, 
  Filter, 
  Heart,
  ChevronRight
} from 'lucide-react-native';
import { JournalCard } from '@/components/JournalCard';
import { Card } from '@/components/Card';
import { useJournalStore } from '@/store/journal-store';
import { colors } from '@/constants/colors';
import { MediaType } from '@/types/journal';

export default function JournalScreen() {
  const router = useRouter();
  const { entries, toggleFavorite, getEntriesByMediaType, getFavorites } = useJournalStore();
  const [activeFilter, setActiveFilter] = useState<MediaType | 'all' | 'favorites'>('all');
  
  // Get filtered entries
  const getFilteredEntries = () => {
    if (activeFilter === 'all') return entries;
    if (activeFilter === 'favorites') return getFavorites();
    return getEntriesByMediaType(activeFilter as MediaType);
  };
  
  const filteredEntries = getFilteredEntries();
  
  // Count entries by type
  const audioCount = getEntriesByMediaType('audio').length;
  const videoCount = getEntriesByMediaType('video').length;
  const textCount = getEntriesByMediaType('text').length;
  const favoritesCount = getFavorites().length;
  
  // Navigate to create journal entry
  const navigateToCreate = (type: MediaType) => {
    router.push({
      pathname: '/journal/create',
      params: { type }
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/journal/search')}
          >
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/journal/filter')}
          >
            <Filter size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Create new entry section */}
        <Card style={styles.createCard}>
          <Text style={styles.createTitle}>Create New Entry</Text>
          
          <View style={styles.createOptions}>
            <TouchableOpacity 
              style={[styles.createOption, styles.audioOption]}
              onPress={() => navigateToCreate('audio')}
            >
              <Mic size={24} color={colors.white} />
              <Text style={styles.createOptionText}>Voice</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.createOption, styles.videoOption]}
              onPress={() => navigateToCreate('video')}
            >
              <Video size={24} color={colors.white} />
              <Text style={styles.createOptionText}>Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.createOption, styles.textOption]}
              onPress={() => navigateToCreate('text')}
            >
              <FileText size={24} color={colors.white} />
              <Text style={styles.createOptionText}>Text</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* Filter tabs */}
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}
        >
          <TouchableOpacity 
            style={[
              styles.filterTab,
              activeFilter === 'all' && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text 
              style={[
                styles.filterTabText,
                activeFilter === 'all' && styles.activeFilterTabText
              ]}
            >
              All ({entries.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterTab,
              activeFilter === 'audio' && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter('audio')}
          >
            <Mic size={16} color={activeFilter === 'audio' ? colors.white : colors.primary} />
            <Text 
              style={[
                styles.filterTabText,
                activeFilter === 'audio' && styles.activeFilterTabText
              ]}
            >
              Audio ({audioCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterTab,
              activeFilter === 'video' && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter('video')}
          >
            <Video size={16} color={activeFilter === 'video' ? colors.white : colors.secondary} />
            <Text 
              style={[
                styles.filterTabText,
                activeFilter === 'video' && styles.activeFilterTabText
              ]}
            >
              Video ({videoCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterTab,
              activeFilter === 'text' && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter('text')}
          >
            <FileText size={16} color={activeFilter === 'text' ? colors.white : colors.textSecondary} />
            <Text 
              style={[
                styles.filterTabText,
                activeFilter === 'text' && styles.activeFilterTabText
              ]}
            >
              Text ({textCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterTab,
              activeFilter === 'favorites' && styles.activeFilterTab,
              styles.favoritesTab
            ]}
            onPress={() => setActiveFilter('favorites')}
          >
            <Heart 
              size={16} 
              color={activeFilter === 'favorites' ? colors.white : colors.error} 
              fill={activeFilter === 'favorites' ? colors.white : colors.error}
            />
            <Text 
              style={[
                styles.filterTabText,
                activeFilter === 'favorites' && styles.activeFilterTabText
              ]}
            >
              Favorites ({favoritesCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Journal entries */}
        {filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onPress={() => router.push(`/journal/${entry.id}`)}
              onFavoritePress={() => toggleFavorite(entry.id)}
              onOptionsPress={() => {
                // Show options menu
              }}
            />
          ))
        ) : (
          <Card style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No entries found</Text>
            <Text style={styles.emptyStateDescription}>
              {activeFilter === 'all' 
                ? "You haven't created any journal entries yet." 
                : `You don't have any ${activeFilter} entries.`}
            </Text>
            
            {activeFilter !== 'favorites' && (
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => navigateToCreate(activeFilter === 'all' ? 'audio' : activeFilter as MediaType)}
              >
                <Plus size={20} color={colors.white} />
                <Text style={styles.createButtonText}>
                  Create {activeFilter === 'all' ? 'New' : activeFilter} Entry
                </Text>
              </TouchableOpacity>
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  createCard: {
    marginBottom: 20,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  createOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createOption: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  audioOption: {
    backgroundColor: colors.primary,
  },
  videoOption: {
    backgroundColor: colors.secondary,
  },
  textOption: {
    backgroundColor: colors.textSecondary,
  },
  createOptionText: {
    color: colors.white,
    fontWeight: '600',
    marginTop: 8,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    gap: 6,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  favoritesTab: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeFilterTabText: {
    color: colors.white,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});