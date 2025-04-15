import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, ListPlus, Users, MessageCircle, Award, Mic, ChevronRight, Brain, Target, Lightbulb } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { useCommunityStore } from '@/store/community-store';
import { useCoachStore } from '@/store/coach-store';

export default function HomeScreen() {
  const router = useRouter();
  const { onlineUsers, recommendedPartners } = useCommunityStore();
  const { 
    recommendations, 
    goals, 
    insights, 
    settings: coachSettings 
  } = useCoachStore();
  
  // Fetch community data if not already loaded
  useEffect(() => {
    useCommunityStore.getState().fetchPartners();
    useCommunityStore.getState().fetchGroups();
    useCommunityStore.getState().fetchTopics();
  }, []);

  // Get active recommendations and goals
  const activeRecommendations = recommendations.filter(rec => !rec.completed);
  const activeGoals = goals.filter(goal => !goal.completed);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.title}>Ready to learn today?</Text>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.streakContainer}>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakValue}>12 days</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Today's Progress</Text>
            <View style={styles.progressBar}>
              <ProgressBar progress={0.6} />
              <Text style={styles.progressValue}>60%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/list/create')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
              <ListPlus size={24} color={colors.white} />
            </View>
            <Text style={styles.actionText}>Create List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/learning/practice')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
              <BookOpen size={24} color={colors.white} />
            </View>
            <Text style={styles.actionText}>Practice</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/journal/create')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
              <Mic size={24} color={colors.white} />
            </View>
            <Text style={styles.actionText}>Journal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/coach')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
              <Brain size={24} color={colors.white} />
            </View>
            <Text style={styles.actionText}>AI Coach</Text>
          </TouchableOpacity>
        </View>
        
        {coachSettings.showOnHomeScreen && activeRecommendations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Coach Recommendations</Text>
              <TouchableOpacity onPress={() => router.push('/coach/recommendations')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <Card style={styles.coachCard}>
              <View style={styles.coachCardHeader}>
                <View style={styles.coachIconContainer}>
                  <Brain size={20} color={colors.white} />
                </View>
                <Text style={styles.coachCardTitle}>Your AI Coach suggests:</Text>
              </View>
              
              {activeRecommendations.slice(0, 1).map(recommendation => (
                <View key={recommendation.id} style={styles.recommendationItem}>
                  <View style={[
                    styles.recommendationPriority,
                    recommendation.priority === 'high' ? styles.highPriority :
                    recommendation.priority === 'medium' ? styles.mediumPriority :
                    styles.lowPriority
                  ]} />
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                    <Text style={styles.recommendationDescription} numberOfLines={2}>
                      {recommendation.description}
                    </Text>
                  </View>
                </View>
              ))}
              
              <Button 
                title="View Recommendation" 
                onPress={() => router.push('/coach/recommendations')}
                style={styles.coachCardButton}
              />
            </Card>
          </View>
        )}
        
        {coachSettings.showOnHomeScreen && activeGoals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Learning Goals</Text>
              <TouchableOpacity onPress={() => router.push('/coach/goals')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
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
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Language Partners</Text>
            <TouchableOpacity onPress={() => router.push('/community/partners')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnersScroll}>
            {onlineUsers.slice(0, 5).map((user) => (
              <TouchableOpacity 
                key={user.id} 
                style={styles.partnerCard}
                onPress={() => router.push(`/community/profile/${user.id}`)}
              >
                <View style={styles.partnerAvatarContainer}>
                  <Image source={{ uri: user.avatar }} style={styles.partnerAvatar} />
                  <View style={styles.onlineIndicator} />
                </View>
                <Text style={styles.partnerName} numberOfLines={1}>{user.name}</Text>
                <Text style={styles.partnerLanguages}>
                  {user.nativeLanguage} → {user.learningLanguage}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.findMoreCard}
              onPress={() => router.push('/community/partners')}
            >
              <View style={styles.findMoreIcon}>
                <Users size={24} color={colors.primary} />
              </View>
              <Text style={styles.findMoreText}>Find More Partners</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {coachSettings.showOnHomeScreen && insights.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Learning Insights</Text>
              <TouchableOpacity onPress={() => router.push('/coach/insights')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
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
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Highlights</Text>
            <TouchableOpacity onPress={() => router.push('/community')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <Card style={styles.communityCard} onPress={() => router.push('/community/forum')}>
            <View style={styles.communityCardHeader}>
              <View style={[styles.communityIcon, { backgroundColor: colors.primary }]}>
                <MessageCircle size={20} color={colors.white} />
              </View>
              <Text style={styles.communityCardTitle}>Active Discussions</Text>
            </View>
            <Text style={styles.communityCardDescription}>
              Join conversations about language learning techniques, cultural insights, and more.
            </Text>
            <Button 
              title="Browse Forum" 
              onPress={() => router.push('/community/forum')}
              variant="outline"
              size="small"
              style={styles.communityCardButton}
            />
          </Card>
          
          <Card style={styles.communityCard} onPress={() => router.push('/community/challenges')}>
            <View style={styles.communityCardHeader}>
              <View style={[styles.communityIcon, { backgroundColor: '#FF9800' }]}>
                <Award size={20} color={colors.white} />
              </View>
              <Text style={styles.communityCardTitle}>Language Challenges</Text>
            </View>
            <Text style={styles.communityCardDescription}>
              Participate in community challenges to boost your language skills and stay motivated.
            </Text>
            <Button 
              title="View Challenges" 
              onPress={() => router.push('/community/challenges')}
              variant="outline"
              size="small"
              style={styles.communityCardButton}
            />
          </Card>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
          </View>
          
          <Card style={styles.recommendedCard} onPress={() => router.push('/community/groups')}>
            <Text style={styles.recommendedTitle}>Join a Study Group</Text>
            <Text style={styles.recommendedDescription}>
              Connect with learners at your level and practice together in a structured environment.
            </Text>
            <View style={styles.recommendedAction}>
              <Text style={styles.recommendedActionText}>Find a group</Text>
              <ChevronRight size={16} color={colors.primary} />
            </View>
          </Card>
          
          <Card style={styles.recommendedCard} onPress={() => router.push('/community/partners')}>
            <Text style={styles.recommendedTitle}>Find a Language Exchange Partner</Text>
            <Text style={styles.recommendedDescription}>
              Practice with native speakers who are learning your language for mutual benefit.
            </Text>
            <View style={styles.recommendedAction}>
              <Text style={styles.recommendedActionText}>Browse partners</Text>
              <ChevronRight size={16} color={colors.primary} />
            </View>
          </Card>
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
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakContainer: {
    flex: 1,
    paddingRight: 16,
  },
  streakLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  progressContainer: {
    flex: 1.5,
    paddingLeft: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
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
  coachCard: {
    padding: 16,
    marginBottom: 8,
  },
  coachCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  coachIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coachCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationPriority: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
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
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  coachCardButton: {
    alignSelf: 'flex-start',
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
  insightCard: {
    padding: 16,
    marginBottom: 8,
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
  partnersScroll: {
    marginLeft: -20,
    paddingLeft: 20,
    paddingRight: 10,
  },
  partnerCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  partnerAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  partnerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.background,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  partnerLanguages: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  findMoreCard: {
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginRight: 12,
  },
  findMoreIcon: {
    marginBottom: 8,
  },
  findMoreText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  communityCard: {
    marginBottom: 12,
    padding: 16,
  },
  communityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  communityCardDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  communityCardButton: {
    alignSelf: 'flex-start',
  },
  recommendedCard: {
    marginBottom: 12,
    padding: 16,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  recommendedDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendedAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
});