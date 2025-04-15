import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { colors, theme } from '@/constants/colors';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  rightContent?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  rightContent,
  variant = 'default',
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    if (variant === 'elevated') {
      baseStyle.push(styles.elevatedCard);
    } else if (variant === 'flat') {
      baseStyle.push(styles.flatCard);
    }
    
    return baseStyle;
  };
  
  return (
    <CardComponent
      style={[...getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
          </View>
          {rightContent && <View>{rightContent}</View>}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadow.sm,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevatedCard: {
    ...theme.shadow.md,
    borderWidth: 0,
  },
  flatCard: {
    ...theme.shadow.sm,
    backgroundColor: colors.background,
    borderWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});