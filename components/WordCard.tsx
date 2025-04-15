import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Edit, Trash2 } from 'lucide-react-native';
import { Word } from '@/types/word';
import { colors, theme } from '@/constants/colors';

interface WordCardProps {
  word: Word;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const getMasteryColor = (level: number) => {
    switch (level) {
      case 0: return colors.mastery0;
      case 1: return colors.mastery1;
      case 2: return colors.mastery2;
      case 3: return colors.mastery3;
      case 4: return colors.mastery4;
      case 5: return colors.mastery5;
      default: return colors.mastery0;
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.masteryStrip} backgroundColor={getMasteryColor(word.masteryLevel)} />
      
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{word.value}</Text>
            <View 
              style={[
                styles.masteryIndicator, 
                { backgroundColor: getMasteryColor(word.masteryLevel) }
              ]} 
            />
          </View>
          
          {showActions && (
            <View style={styles.actions}>
              {onEdit && (
                <TouchableOpacity 
                  onPress={onEdit}
                  style={styles.actionButton}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Edit size={18} color={colors.primary} />
                </TouchableOpacity>
              )}
              
              {onDelete && (
                <TouchableOpacity 
                  onPress={onDelete}
                  style={styles.actionButton}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        
        <Text style={styles.definition}>{word.definition}</Text>
        
        {word.example && (
          <Text style={styles.example}>"{word.example}"</Text>
        )}
        
        {word.lastReviewed && (
          <Text style={styles.lastReviewed}>
            Last reviewed: {new Date(word.lastReviewed).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    ...theme.shadow.sm,
  },
  masteryStrip: {
    width: 6,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  word: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: colors.text,
  },
  masteryIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  definition: {
    fontSize: theme.fontSize.md,
    color: colors.text,
    marginBottom: 8,
  },
  example: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  lastReviewed: {
    fontSize: theme.fontSize.xs,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});