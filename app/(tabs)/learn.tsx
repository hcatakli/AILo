import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Clock, Award, Flame } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useWordListsStore } from '@/store/word-lists-store';
import { useLearningStore } from '@/store/learning-store';
import { colors } from '@/constants/colors';

export default function LearnScreen() {
  const router = useRouter();
  const { lists, fetchLists, isLoading } = useWordListsStore();
  const { streak, currentSession, resetCurrentSession } = useLearningStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchLists();
    
    // Check if there's an active session to resume
    if (currentSession) {
      router.push(`/learning/${currentSession.listId}`);
    }
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  };
  
  const handleListPress = (listId: string) => {
    router.push(`/learning/${listId}`);
  };
  
  if (isLoading && !refreshing) {
    return <LoadingIndicator fullScreen message="Loading learning content..." />;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn</Text>
        <View style={styles.streakContainer}>
          <Flame size={20} color={colors.secondary} />
          <Text style={styles.streakText}>{streak} day streak</Text>
        </View>
      </View>
      
      {currentSession && (
        <Card style={styles.resumeCard}>
          <View style={styles.resumeContent}>
            <View style={styles.resumeInfo}>
              <Text style={styles.resumeTitle}>Resume Learning</Text>
              <Text style={styles.resumeSubtitle}>
                You have an active session
              </Text>
            </View>
            <View style={styles.resumeActions}>
              <TouchableOpacity
                style={styles.resumeButton}
                onPress={() => router.push(`/learning/${currentSession.listId}`)}
              >
                <Text style={styles.resumeButtonText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => resetCurrentSession()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      )}
      
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Clock size={20} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>
            {useLearningStore.getState().sessions.length}
          </Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Award size={20} color={colors.secondary} />
          </View>
          <Text style={styles.statValue}>
            {useLearningStore.getState().sessions.reduce((sum, session) => sum + session.correctAnswers, 0)}
          </Text>
          <Text style={styles.statLabel}>Correct</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Flame size={20} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </Card>
      </View>
      
      <Text style={styles.sectionTitle}>Choose a List to Learn</Text>
      
      {lists.length === 0 ? (
        <EmptyState
          title="No Word Lists Yet"
          description="Create your first word list to start learning"
          actionLabel="Create List"
          onAction={() => router.push('/list/create')}
          style={styles.emptyState}
        />
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listCard}
              onPress={() => handleListPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listStats}>
                  {item.wordCount} words • {item.progress}% mastered
                </Text>
              </View>
              <View style={styles.listAction}>
                <BookOpen size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
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
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  resumeCard: {
    margin: 16,
    backgroundColor: colors.primary,
  },
  resumeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumeInfo: {
    flex: 1,
  },
  resumeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  resumeSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  resumeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  resumeButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resumeButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  listStats: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
  },
});