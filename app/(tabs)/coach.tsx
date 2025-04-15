import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, Target, MessageCircle, BarChart, Settings, Lightbulb, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { useCoachStore } from '@/store/coach-store';

export default function CoachScreen() {
  const router = useRouter();
  const { 
    goals, 
    recommendations, 
    insights, 
    currentConversation, 
    startConversation,
    settings
  } = useCoachStore();

  // Get active goals and recommendations
  const activeGoals = goals.filter(goal => !goal.completed);
  const activeRecommendations = recommendations.filter(rec => !rec.completed);
  
  // Get the last message from the current conversation
  const lastMessage = currentConversation?.messages[currentConversation.messages.length - 1];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Language Coach</Text>
          <Text style={styles.subtitle}>Personalized guidance for your language journey</Text>
        </View>
        
        <Card style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <View style={styles.coachIconContainer}>
              <Brain size={24} color={colors.white} />
            </View>
            <View style={styles.coachInfo}>
              <Text style={styles.coachName}>Your AI Coach</Text>
              <Text style={styles.coachStatus}>Always available</Text>
            </View>
          </View>
          
          <View style={styles.messagePreview}>
            {lastMessage ? (
              <Text style={styles.messageText} numberOfLines={2}>
                {lastMessage.content}
              </Text>
            ) : (
              <Text style={styles.messageText} numberOfLines={2}>
                Hello! I'm your AI language coach. How can I help you today?
              </Text>
            )}
          </View>
          
          <Button
            title="Continue Conversation"
            onPress={() => router.push('/coach/chat')}
            style={styles.chatButton}
          />
        </Card>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Learning Goals</Text>
            <TouchableOpacity onPress={() => router.push('/coach/goals')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {activeGoals.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.goalsScrollView}
            >
              {activeGoals.slice(0, 3).map(goal => (
                <Card key={goal.id} style={styles.goalCard} onPress={() => router.push(`/coach/goals/${goal.id}`)}>
                  <View style={styles.goalIconContainer}>
                    <Target size={20} color={colors.white} />
                  </View>
                  <Text style={styles.goalTitle} numberOfLines={2}>{goal.title}</Text>
                  <View style={styles.goalProgressContainer}>
                    <View style={styles.goalProgressBar}>
                      <View 
                        style={[
                          styles.goalProgressFill, 
                          { width: `${goal.progress}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.goalProgressText}>{goal.progress}%</Text>
                  </View>
                </Card>
              ))}
              
              <TouchableOpacity 
                style={styles.addGoalCard}
                onPress={() => router.push('/coach/goals/create')}
              >
                <View style={styles.addGoalIcon}>
                  <Target size={24} color={colors.primary} />
                </View>
                <Text style={styles.addGoalText}>Add New Goal</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No goals set yet</Text>
              <Text style={styles.emptyDescription}>
                Setting clear goals will help you track your progress and stay motivated.
              </Text>
              <Button
                title="Create Your First Goal"
                onPress={() => router.push('/coach/goals/create')}
                style={styles.emptyButton}
              />
            </Card>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <TouchableOpacity onPress={() => router.push('/coach/recommendations')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {activeRecommendations.length > 0 ? (
            activeRecommendations.slice(0, 2).map(recommendation => (
              <Card 
                key={recommendation.id} 
                style={styles.recommendationCard}
                onPress={() => router.push(`/coach/recommendations/${recommendation.id}`)}
              >
                <View style={styles.recommendationHeader}>
                  <View style={[
                    styles.recommendationPriority,
                    recommendation.priority === 'high' ? styles.highPriority :
                    recommendation.priority === 'medium' ? styles.mediumPriority :
                    styles.lowPriority
                  ]} />
                  <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                </View>
                <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
                <View style={styles.recommendationFooter}>
                  <Text style={styles.recommendationReason}>{recommendation.reason}</Text>
                  <Button
                    title="Start"
                    size="small"
                    onPress={() => router.push(`/coach/recommendations/${recommendation.id}`)}
                  />
                </View>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No recommendations yet</Text>
              <Text style={styles.emptyDescription}>
                Complete an assessment to get personalized recommendations for your learning journey.
              </Text>
              <Button
                title="Take Assessment"
                onPress={() => router.push('/coach/assessment')}
                style={styles.emptyButton}
              />
            </Card>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Learning Insights</Text>
            <TouchableOpacity onPress={() => router.push('/coach/insights')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {insights.length > 0 ? (
            <Card style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightIconContainer}>
                  <Lightbulb size={20} color={colors.white} />
                </View>
                <Text style={styles.insightTitle}>{insights[0].title}</Text>
              </View>
              <Text style={styles.insightDescription}>{insights[0].description}</Text>
              <TouchableOpacity 
                style={styles.insightAction}
                onPress={() => router.push('/coach/insights')}
              >
                <Text style={styles.insightActionText}>View Insights</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </Card>
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No insights yet</Text>
              <Text style={styles.emptyDescription}>
                Continue learning and practicing to generate insights about your learning patterns.
              </Text>
            </Card>
          )}
        </View>
        
        <View style={styles.actionCards}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/coach/assessment')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
              <BarChart size={24} color={colors.white} />
            </View>
            <Text style={styles.actionTitle}>Assessment</Text>
            <Text style={styles.actionDescription}>Evaluate your skills</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/coach/chat')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
              <MessageCircle size={24} color={colors.white} />
            </View>
            <Text style={styles.actionTitle}>Chat</Text>
            <Text style={styles.actionDescription}>Ask for help</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/coach/settings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
              <Settings size={24} color={colors.white} />
            </View>
            <Text style={styles.actionTitle}>Settings</Text>
            <Text style={styles.actionDescription}>Customize coach</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  coachCard: {
    marginHorizontal: 20,
    padding: 16,
    marginBottom: 24,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  coachIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  coachStatus: {
    fontSize: 14,
    color: colors.success,
  },
  messagePreview: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  chatButton: {
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  goalsScrollView: {
    marginLeft: -20,
    paddingLeft: 20,
    paddingRight: 8,
  },
  goalCard: {
    width: 160,
    marginRight: 12,
    padding: 16,
  },
  goalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    height: 40,
  },
  goalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  goalProgressText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    width: 36,
    textAlign: 'right',
  },
  addGoalCard: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginRight: 12,
  },
  addGoalIcon: {
    marginBottom: 8,
  },
  addGoalText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  recommendationCard: {
    marginBottom: 12,
    padding: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationPriority: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  highPriority: {
    backgroundColor: colors.error,
  },
  mediumPriority: {
    backgroundColor: colors.warning,
  },
  lowPriority: {
    backgroundColor: colors.success,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  recommendationDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendationReason: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  insightCard: {
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  insightDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  insightAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
  emptyCard: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  actionCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionCard: {
    width: '30%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});