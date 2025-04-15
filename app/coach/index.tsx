import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Send, 
  Brain, 
  Target, 
  BarChart, 
  Lightbulb, 
  Settings,
  ChevronRight
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useCoachStore } from '@/store/coach-store';
import { CoachMessage } from '@/types/coach';

export default function CoachScreen() {
  const router = useRouter();
  const { 
    currentConversation, 
    startConversation, 
    sendMessage, 
    recommendations, 
    goals,
    insights,
    isLoading 
  } = useCoachStore();
  
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    if (!currentConversation) {
      startConversation();
    }
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentConversation?.messages]);
  
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    const trimmedMessage = messageText.trim();
    setMessageText('');
    
    try {
      await sendMessage(trimmedMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const renderMessage = ({ item }: { item: CoachMessage }) => {
    const isCoach = item.sender === 'coach';
    
    return (
      <View style={[
        styles.messageContainer,
        isCoach ? styles.coachMessageContainer : styles.userMessageContainer
      ]}>
        {isCoach && (
          <View style={styles.coachAvatar}>
            <Brain size={16} color={colors.white} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isCoach ? styles.coachBubble : styles.userBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCoach ? styles.coachMessageText : styles.userMessageText
          ]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };
  
  if (isLoading && !currentConversation) {
    return <LoadingIndicator fullScreen message="Initializing your AI coach..." />;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="AI Coach" 
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/coach/settings')}>
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        }
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.contentContainer}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeSection}>
            <View style={styles.coachHeader}>
              <View style={styles.coachIconContainer}>
                <Brain size={24} color={colors.white} />
              </View>
              <View>
                <Text style={styles.coachTitle}>Your AI Language Coach</Text>
                <Text style={styles.coachSubtitle}>Personalized guidance for your language journey</Text>
              </View>
            </View>
          </View>
          
          {goals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Learning Goals</Text>
                <TouchableOpacity onPress={() => router.push('/coach/goals')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.goalsScrollView}
              >
                {goals.filter(goal => !goal.completed).map(goal => (
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
          
          {recommendations.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended For You</Text>
                <TouchableOpacity onPress={() => router.push('/coach/recommendations')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {recommendations.filter(rec => !rec.completed).slice(0, 2).map(recommendation => (
                <Card key={recommendation.id} style={styles.recommendationCard}>
                  <View style={styles.recommendationHeader}>
                    <View style={[
                      styles.priorityIndicator, 
                      recommendation.priority === 'high' 
                        ? styles.highPriority 
                        : recommendation.priority === 'medium'
                          ? styles.mediumPriority
                          : styles.lowPriority
                    ]} />
                    <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                  </View>
                  <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
                  <View style={styles.recommendationFooter}>
                    <Text style={styles.recommendationReason}>{recommendation.reason}</Text>
                    <Button 
                      title="Start" 
                      size="small" 
                      onPress={() => {
                        if (recommendation.type === 'list' && recommendation.listId) {
                          router.push(`/learning/${recommendation.listId}`);
                        } else {
                          router.push('/coach/recommendations');
                        }
                      }}
                    />
                  </View>
                </Card>
              ))}
            </View>
          )}
          
          {insights.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Learning Insights</Text>
                <TouchableOpacity onPress={() => router.push('/coach/insights')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <Card style={styles.insightsCard}>
                <View style={styles.insightHeader}>
                  <View style={styles.insightIconContainer}>
                    <Lightbulb size={20} color={colors.white} />
                  </View>
                  <Text style={styles.insightTitle}>{insights[0].title}</Text>
                </View>
                <Text style={styles.insightDescription}>{insights[0].description}</Text>
              </Card>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.assessmentCard}
            onPress={() => router.push('/coach/assessment')}
          >
            <View style={styles.assessmentContent}>
              <View style={styles.assessmentIconContainer}>
                <BarChart size={24} color={colors.white} />
              </View>
              <View style={styles.assessmentTextContainer}>
                <Text style={styles.assessmentTitle}>Take a Skills Assessment</Text>
                <Text style={styles.assessmentDescription}>
                  Measure your progress and get personalized recommendations
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Coach Chat</Text>
            </View>
            
            <View style={styles.chatContainer}>
              {currentConversation?.messages.map(message => renderMessage({ item: message }))}
              <View style={styles.messageSpacing} />
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask your coach anything..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !messageText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color={!messageText.trim() ? colors.textSecondary : colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  welcomeSection: {
    padding: 16,
    paddingBottom: 8,
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
    marginRight: 12,
  },
  coachTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  coachSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  goalsScrollView: {
    marginLeft: -16,
    paddingLeft: 16,
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
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
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
  insightsCard: {
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
    lineHeight: 20,
  },
  assessmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  assessmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assessmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.info,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assessmentTextContainer: {
    flex: 1,
  },
  assessmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  assessmentDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  chatContainer: {
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  coachMessageContainer: {
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  coachAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  coachBubble: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  coachMessageText: {
    color: colors.text,
  },
  userMessageText: {
    color: colors.white,
  },
  messageSpacing: {
    height: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});