import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Calendar, 
  ChevronRight, 
  MoreVertical 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { useCoachStore } from '@/store/coach-store';
import { LearningGoal } from '@/types/coach';

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, completeGoal } = useCoachStore();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);
  
  const displayedGoals = activeTab === 'active' ? activeGoals : completedGoals;
  
  const handleCompleteGoal = async (goalId: string) => {
    try {
      await completeGoal(goalId);
    } catch (error) {
      console.error('Failed to complete goal:', error);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const renderGoalItem = ({ item }: { item: LearningGoal }) => (
    <Card style={styles.goalCard} onPress={() => router.push(`/coach/goals/${item.id}`)}>
      <View style={styles.goalHeader}>
        <View style={[
          styles.goalTypeIndicator,
          item.type === 'vocabulary' ? styles.vocabularyType :
          item.type === 'grammar' ? styles.grammarType :
          item.type === 'speaking' ? styles.speakingType :
          item.type === 'listening' ? styles.listeningType :
          item.type === 'reading' ? styles.readingType :
          item.type === 'writing' ? styles.writingType :
          styles.customType
        ]} />
        <Text style={styles.goalTitle}>{item.title}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {item.description && (
        <Text style={styles.goalDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.goalProgressContainer}>
        <View style={styles.goalProgressBar}>
          <View 
            style={[
              styles.goalProgressFill, 
              { width: `${item.progress}%` }
            ]} 
          />
        </View>
        <Text style={styles.goalProgressText}>{item.progress}%</Text>
      </View>
      
      <View style={styles.goalFooter}>
        {item.targetDate && (
          <View style={styles.goalDateContainer}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={styles.goalDateText}>{formatDate(item.targetDate)}</Text>
          </View>
        )}
        
        {!item.completed ? (
          <Button
            title="Complete"
            size="small"
            variant="outline"
            leftIcon={<CheckCircle size={16} color={colors.primary} />}
            onPress={() => handleCompleteGoal(item.id)}
          />
        ) : (
          <View style={styles.completedBadge}>
            <CheckCircle size={16} color={colors.success} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Learning Goals" />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'active' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'active' && styles.activeTabText
          ]}>
            Active ({activeGoals.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'completed' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'completed' && styles.activeTabText
          ]}>
            Completed ({completedGoals.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={displayedGoals}
        renderItem={renderGoalItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={<Target size={48} color={colors.textSecondary} />}
            title={activeTab === 'active' ? "No active goals" : "No completed goals"}
            message={activeTab === 'active' 
              ? "Set learning goals to track your progress and stay motivated" 
              : "Complete goals will appear here"
            }
            actionButton={
              activeTab === 'active' ? (
                <Button
                  title="Create Goal"
                  onPress={() => router.push('/coach/goals/create')}
                />
              ) : undefined
            }
          />
        }
      />
      
      {activeTab === 'active' && (
        <View style={styles.fabContainer}>
          <TouchableOpacity 
            style={styles.fab}
            onPress={() => router.push('/coach/goals/create')}
          >
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  activeTabButton: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  goalCard: {
    marginBottom: 16,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  vocabularyType: {
    backgroundColor: colors.primary,
  },
  grammarType: {
    backgroundColor: colors.secondary,
  },
  speakingType: {
    backgroundColor: '#FF9800',
  },
  listeningType: {
    backgroundColor: '#9C27B0',
  },
  readingType: {
    backgroundColor: '#4CAF50',
  },
  writingType: {
    backgroundColor: '#00BCD4',
  },
  customType: {
    backgroundColor: '#607D8B',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  moreButton: {
    padding: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  goalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    width: 40,
    textAlign: 'right',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalDateText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completedText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '500',
    marginLeft: 4,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});