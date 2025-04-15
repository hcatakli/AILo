import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Lightbulb, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  Calendar
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { useCoachStore } from '@/store/coach-store';
import { LearningInsight } from '@/types/coach';

export default function InsightsScreen() {
  const { insights, analyzePerformance } = useCoachStore();
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <Lightbulb size={20} color={colors.white} />;
      case 'improvement':
        return <TrendingUp size={20} color={colors.white} />;
      case 'challenge':
        return <AlertTriangle size={20} color={colors.white} />;
      case 'milestone':
        return <Award size={20} color={colors.white} />;
      default:
        return <Lightbulb size={20} color={colors.white} />;
    }
  };
  
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern':
        return colors.primary;
      case 'improvement':
        return colors.success;
      case 'challenge':
        return colors.warning;
      case 'milestone':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const renderInsightItem = ({ item }: { item: LearningInsight }) => (
    <Card style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <View style={[
          styles.insightIconContainer,
          { backgroundColor: getInsightColor(item.type) }
        ]}>
          {getInsightIcon(item.type)}
        </View>
        <View style={styles.insightTitleContainer}>
          <Text style={styles.insightTitle}>{item.title}</Text>
          <View style={styles.insightMeta}>
            <Calendar size={12} color={colors.textSecondary} />
            <Text style={styles.insightDate}>{formatDate(item.createdAt)}</Text>
            <View style={[
              styles.insightTypeBadge,
              { backgroundColor: getInsightColor(item.type) + '20' }
            ]}>
              <Text style={[
                styles.insightTypeText,
                { color: getInsightColor(item.type) }
              ]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <Text style={styles.insightDescription}>{item.description}</Text>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Learning Insights" />
      
      <FlatList
        data={insights}
        renderItem={renderInsightItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={<Lightbulb size={48} color={colors.textSecondary} />}
            title="No insights yet"
            message="Continue learning and practicing to generate insights about your learning patterns"
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  insightCard: {
    marginBottom: 16,
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  insightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    marginRight: 8,
  },
  insightTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  insightTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});