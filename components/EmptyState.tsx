import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from './Button';
import { colors, theme } from '@/constants/colors';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text style={styles.title}>{title}</Text>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.full,
    ...theme.shadow.sm,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
    maxWidth: '80%',
  },
  button: {
    minWidth: 180,
  },
});