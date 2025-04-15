import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoreVertical, BookOpen, Brain } from 'lucide-react-native';
import { WordListSummary } from '@/types/word';
import { ProgressBar } from './ProgressBar';
import { colors, theme } from '@/constants/colors';

interface WordListCardProps {
  list: WordListSummary;
  onPress: () => void;
  onLearnPress: () => void;
  onTestPress: () => void;
  onMorePress: () => void;
}

export const WordListCard: React.FC<WordListCardProps> = ({
  list,
  onPress,
  onLearnPress,
  onTestPress,
  onMorePress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{list.name}</Text>
          <View style={styles.languageContainer}>
            <Text style={styles.language}>{list.language}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={onMorePress}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          style={styles.moreButton}
        >
          <MoreVertical size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {list.description && (
        <Text style={styles.description} numberOfLines={2}>
          {list.description}
        </Text>
      )}
      
      <View style={styles.statsContainer}>
        <Text style={styles.wordCount}>{list.wordCount} words</Text>
        <Text style={styles.updatedAt}>Updated {formatDate(list.updatedAt)}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {list.progress}% mastered
        </Text>
        <ProgressBar progress={list.progress} />
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onLearnPress}
        >
          <BookOpen size={18} color={colors.primary} />
          <Text style={styles.actionText}>Learn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onTestPress}
        >
          <Brain size={18} color={colors.secondary} />
          <Text style={styles.actionText}>Test</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    ...theme.shadow.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: colors.text,
    marginBottom: 6,
  },
  languageContainer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  language: {
    fontSize: theme.fontSize.xs,
    color: colors.primaryDark,
    fontWeight: theme.fontWeight.medium,
  },
  moreButton: {
    padding: 4,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  wordCount: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  updatedAt: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.full,
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: colors.text,
  },
});