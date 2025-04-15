import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Lightbulb, 
  CheckCircle, 
  BookOpen, 
  MessageSquare, 
  Headphones, 
  Pencil, 
  BookText, 
  ChevronRight 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useCoachStore } from '@/store/coach-store';
import { CoachRecommendation } from '@/types/coach';

export default function RecommendationsScreen() {
  const router = useRouter();
  const { recommendations, completeRecommendation, getRecommendations } = useCoachStore();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  const activeRecommendations = recommendations.filter(rec => !rec.completed);
  const completedRecommendations = recommendations.filter(rec => rec.completed);
  
  const displayedRecommendations = activeTab === 'active' ? activeRecommendations : completedRecommendations;
  
  const handleCompleteRecommendation = async (id: string) => {
    try {
      await completeRecommendation(id);
    } catch (error) {
      console.error('Failed to complete recommendation:', error);
    }
  };
  
  const handleRefreshRecommendations = async () => {
    try {
      await getRecommendations();
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
    }
  };
  
  const getRecommendationIcon = (focusArea: string) => {
    switch (focusArea) {
      case 'vocabulary':
        return <BookOpen size={20} color={colors.white} />;
      case 'grammar':
        return <MessageSquare size={20} color={colors.white} />;
      case 'speaking':
        return <MessageSquare size={20} color={colors.white} />;
      case 'listening':
        return <Headphones size={20} color={colors.white} />;
      case 'reading':
        return <BookText size={20} color={colors.white} />;
      case 'writing':
        return <Pencil size={20} color={colors.white} />;
      default:
        return <Lightbulb size={20} color={colors.white} />;
    }
  };
  
  const getRecommendationColor = (focusArea: string) => {
    switch (focusArea) {
      case 'vocabulary':
        return colors.primary;
      case 'grammar':
        return colors.secondary;
      case 'speaking':
        return '#FF9800';
      case 'listening':
        return '#9C27B0';
      case 'reading':
        return '#4CAF50';
      case 'writing':
        return '#00BCD4';
      default:
        return colors.primary;
    }
  };
  
  const renderRecommendationItem = ({ item }: { item: CoachRecommendation }) => (
    <Card style={styles.recommendationCard}>
      <View style={styles.recommendationHeader}>
        <View style={[
          styles.recommendationIconContainer,
          { backgroundColor: getRecommendationColor(item.focusArea) }
        ]}>
          {getRecommendationIcon(item.focusArea)}
        </View>
        <View style={styles.recommendationTitleContainer}>
          <Text style={styles.recommendationTitle}>{item.title}</Text>
          <View style={styles.recommendationMeta}>
            <View style={[
              styles.priorityBadge,
              item.priority === 'high' ? styles.highPriority :
              item.priority === 'medium' ? styles.mediumPriority :
              styles.lowPriority
            ]}>
              <Text style={styles.priorityText}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
              </Text>
            </View>
            <Text style={styles.focusAreaText}>
              {item.focusArea.charAt(0).toUpperCase() + item.focusArea.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.recommendationDescription}>{item.description}</Text>
      
      <View style={styles.reasonContainer}>
        <Lightbulb size={16} color={colors.textSecondary} />
        <Text style={styles.reasonText}>{item.reason}</Text>
      </View>
      
      <View style={styles.recommendationFooter}>
        {!item.completed ? (
          <>
            <Button
              title="Start"
              onPress={() => {
                if (item.type === 'list' && item.listId) {
                  router.push(`/learning/${item.listId}`);
                } else if (item.type === 'practice') {
                  router.push('/learning/practice');
                } else if (item.type === 'test') {
                  router.push('/test/practice');
                } else if (item.type === 'resource' && item.resourceUrl) {
                  // Handle external resource
                } else {
                  // Handle other types
                }
              }}
              style={styles.actionButton}
            />
            <Button
              title="Mark Complete"
              variant="outline"
              onPress={() => handleCompleteRecommendation(item.id)}
              style={styles.actionButton}
            />
          </>
        ) : (
          <View style={styles.completedContainer}>
            <CheckCircle size={18} color={colors.success} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Recommendations" />
      
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
            Active ({activeRecommendations.length})
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
            Completed ({completedRecommendations.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={displayedRecommendations}
        renderItem={renderRecommendationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={<Lightbulb size={48} color={colors.textSecondary} />}
            title={activeTab === 'active' ? "No active recommendations" : "No completed recommendations"}
            message={activeTab === 'active' 
              ? "Complete an assessment to get personalized recommendations" 
              : "Completed recommendations will appear here"
            }
            actionButton={
              activeTab === 'active' ? (
                <Button
                  title="Refresh Recommendations"
                  onPress={handleRefreshRecommendations}
                />
              ) : undefined
            }
          />
        }
      />
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
    paddingBottom: 32,
  },
  recommendationCard: {
    marginBottom: 16,
    padding: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationTitleContainer: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  highPriority: {
    backgroundColor: colors.error + '20',
  },
  mediumPriority: {
    backgroundColor: colors.warning + '20',
  },
  lowPriority: {
    backgroundColor: colors.success + '20',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  focusAreaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recommendationDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  reasonText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success + '20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
    marginLeft: 8,
  },
});