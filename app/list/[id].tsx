import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, BookOpen, Brain, MoreVertical, Edit, Trash2 } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { WordCard } from '@/components/WordCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ProgressBar } from '@/components/ProgressBar';
import { useWordListsStore } from '@/store/word-lists-store';
import { colors } from '@/constants/colors';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { fetchListById, currentList, isLoading, deleteList, deleteWord } = useWordListsStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchListById(id);
    }
  }, [id]);
  
  const handleRefresh = async () => {
    if (id) {
      setRefreshing(true);
      await fetchListById(id);
      setRefreshing(false);
    }
  };
  
  const handleAddWord = () => {
    router.push(`/list/add-word?listId=${id}`);
  };
  
  const handleLearnPress = () => {
    router.push(`/learning/${id}`);
  };
  
  const handleTestPress = () => {
    router.push(`/test/${id}`);
  };
  
  const handleEditWord = (wordId: string) => {
    router.push(`/list/add-word?listId=${id}&wordId=${wordId}`);
  };
  
  const handleDeleteWord = (wordId: string) => {
    Alert.alert(
      'Delete Word',
      'Are you sure you want to delete this word? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWord(id, wordId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete word');
            }
          },
        },
      ]
    );
  };
  
  const handleMorePress = () => {
    if (!currentList) return;
    
    Alert.alert(
      'List Options',
      'Choose an action',
      [
        {
          text: 'Edit List',
          onPress: () => router.push(`/list/edit?id=${id}`),
        },
        {
          text: 'Delete List',
          onPress: handleDeleteList,
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  
  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list? All words in this list will be deleted. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete list');
            }
          },
        },
      ]
    );
  };
  
  if (isLoading && !refreshing) {
    return <LoadingIndicator fullScreen message="Loading word list..." />;
  }
  
  if (!currentList) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="List Details" />
        <EmptyState
          title="List Not Found"
          description="The word list you're looking for doesn't exist or has been deleted."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={currentList.name}
        rightContent={
          <TouchableOpacity 
            onPress={handleMorePress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MoreVertical size={24} color={colors.text} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.listInfo}>
        <View style={styles.listDetails}>
          <Text style={styles.language}>{currentList.language}</Text>
          {currentList.description && (
            <Text style={styles.description}>{currentList.description}</Text>
          )}
          <View style={styles.stats}>
            <Text style={styles.statText}>{currentList.wordCount} words</Text>
            <Text style={styles.statText}>{currentList.progress}% mastered</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <ProgressBar progress={currentList.progress} />
        </View>
        
        <View style={styles.actions}>
          <Button
            title="Learn"
            onPress={handleLearnPress}
            variant="primary"
            leftIcon={<BookOpen size={18} color={colors.white} />}
            style={styles.actionButton}
          />
          <Button
            title="Test"
            onPress={handleTestPress}
            variant="secondary"
            leftIcon={<Brain size={18} color={colors.white} />}
            style={styles.actionButton}
          />
        </View>
      </View>
      
      <View style={styles.wordsHeader}>
        <Text style={styles.wordsTitle}>Words</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddWord}
        >
          <Plus size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add Word</Text>
        </TouchableOpacity>
      </View>
      
      {currentList.words.length === 0 ? (
        <EmptyState
          title="No Words Yet"
          description="Add words to this list to start learning"
          actionLabel="Add Word"
          onAction={handleAddWord}
          style={styles.emptyState}
        />
      ) : (
        <FlatList
          data={currentList.words}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WordCard
              word={item}
              onEdit={() => handleEditWord(item.id)}
              onDelete={() => handleDeleteWord(item.id)}
            />
          )}
          contentContainerStyle={styles.wordsList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
  listInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listDetails: {
    marginBottom: 16,
  },
  language: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  wordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  wordsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 14,
  },
  wordsList: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
  },
});