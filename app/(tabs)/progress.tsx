import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, BarChart2, Flame, Award, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { useWordListsStore } from '@/store/word-lists-store';
import { useLearningStore } from '@/store/learning-store';
import { colors } from '@/constants/colors';

export default function ProgressScreen() {
  const { lists, fetchLists } = useWordListsStore();
  const { sessions, testSessions, streak } = useLearningStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchLists();
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Calculate overall statistics
  const totalWords = lists.reduce((sum, list) => sum + list.wordCount, 0);
  const totalProgress = lists.length > 0
    ? Math.round(lists.reduce((sum, list) => sum + list.progress, 0) / lists.length)
    : 0;
  
  const totalSessions = sessions.length;
  const totalCorrectAnswers = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
  const totalQuestions = sessions.reduce((sum, session) => sum + session.totalQuestions, 0);
  const correctRate = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;
  
  // Get recent sessions
  const recentSessions = [...sessions].sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  ).slice(0, 5);
  
  // Get top lists by progress
  const topLists = [...lists].sort((a, b) => b.progress - a.progress).slice(0, 3);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsCards}>
          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <BarChart2 size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{totalProgress}%</Text>
            <Text style={styles.statLabel}>Overall Progress</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Flame size={20} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Calendar size={20} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </Card>
        </View>
        
        <Card style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Learning Overview</Text>
          
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Total Words</Text>
            <Text style={styles.overviewValue}>{totalWords}</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Lists Created</Text>
            <Text style={styles.overviewValue}>{lists.length}</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Correct Rate</Text>
            <Text style={styles.overviewValue}>{correctRate}%</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Questions Answered</Text>
            <Text style={styles.overviewValue}>{totalQuestions}</Text>
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>Top Lists</Text>
        
        {topLists.map(list => (
          <Card key={list.id} style={styles.listCard}>
            <Text style={styles.listName}>{list.name}</Text>
            <View style={styles.listStats}>
              <Text style={styles.listStatsText}>{list.wordCount} words</Text>
              <Text style={styles.listStatsText}>{list.progress}% mastered</Text>
            </View>
            <ProgressBar progress={list.progress} style={styles.listProgress} />
          </Card>
        ))}
        
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        
        {recentSessions.length > 0 ? (
          recentSessions.map(session => {
            const date = new Date(session.startedAt);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const correctRate = Math.round((session.correctAnswers / session.totalQuestions) * 100);
            
            return (
              <Card key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionDate}>{formattedDate} at {formattedTime}</Text>
                    <Text style={styles.sessionListName}>
                      {lists.find(l => l.id === session.listId)?.name || 'Unknown List'}
                    </Text>
                  </View>
                  <View style={styles.sessionStats}>
                    <View style={styles.sessionStat}>
                      <CheckCircle size={16} color={colors.success} />
                      <Text style={styles.sessionStatText}>{session.correctAnswers}</Text>
                    </View>
                    <View style={styles.sessionStat}>
                      <XCircle size={16} color={colors.error} />
                      <Text style={styles.sessionStatText}>{session.totalQuestions - session.correctAnswers}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.sessionProgress}>
                  <ProgressBar 
                    progress={correctRate} 
                    progressColor={colors.success}
                  />
                  <Text style={styles.sessionProgressText}>{correctRate}%</Text>
                </View>
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No learning sessions yet</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  overviewCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewLabel: {
    fontSize: 16,
    color: colors.text,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  listCard: {
    marginBottom: 12,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  listStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  listStatsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listProgress: {
    marginTop: 4,
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  sessionListName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sessionStats: {
    flexDirection: 'row',
    gap: 12,
  },
  sessionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionStatText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  sessionProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionProgressText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
    minWidth: 40,
    textAlign: 'right',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});