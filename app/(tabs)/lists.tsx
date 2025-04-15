import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Filter, MoreVertical } from 'lucide-react-native';
import { WordListCard } from '@/components/WordListCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useWordListsStore } from '@/store/word-lists-store';
import { WordListSummary } from '@/types/word';
import { colors } from '@/constants/colors';

export default function ListsScreen() {
  const router = useRouter();
  const { lists, fetchLists, isLoading, deleteList } = useWordListsStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchLists();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  };
  
  const handleListPress = (listId: string) => {
    router.push(`/list/${listId}`);
  };
  
  const handleLearnPress = (listId: string) => {
    router.push(`/learning/${listId}`);
  };
  
  const handleTestPress = (listId: string) => {
    router.push(`/test/${listId}`);
  };
  
  const handleMorePress = (list: WordListSummary) => {
    Alert.alert(
      list.name,
      'Choose an action',
      [
        {
          text: 'Edit List',
          onPress: () => router.push(`/list/${list.id}?edit=true`),
        },
        {
          text: 'Delete List',
          onPress: () => confirmDelete(list),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  
  const confirmDelete = (list: WordListSummary) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}"? This action cannot be undone.`,
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
              await deleteList(list.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete list');
            }
          },
        },
      ]
    );
  };
  
  if (isLoading && !refreshing) {
    return <LoadingIndicator fullScreen message="Loading your word lists..." />;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Word Lists</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/list/create')}
          >
            <Plus size={20} color={colors.white} />
            <Text style={styles.createButtonText}>Create List</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {lists.length === 0 ? (
        <EmptyState
          title="No Word Lists Yet"
          description="Create your first word list to start learning new vocabulary"
          actionLabel="Create List"
          onAction={() => router.push('/list/create')}
          icon={<Plus size={40} color={colors.primary} />}
        />
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WordListCard
              list={item}
              onPress={() => handleListPress(item.id)}
              onLearnPress={() => handleLearnPress(item.id)}
              onTestPress={() => handleTestPress(item.id)}
              onMorePress={() => handleMorePress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
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
    alignItems: 'center',
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
});