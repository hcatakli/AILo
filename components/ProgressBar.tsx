import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, theme } from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 6,
  backgroundColor = colors.border,
  progressColor = colors.primary,
  style,
  animated = false,
}) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={[styles.container, { height }, style]}>
      <View 
        style={[
          styles.background, 
          { 
            backgroundColor,
          }
        ]} 
      />
      <View 
        style={[
          styles.progress, 
          { 
            width: `${clampedProgress}%`,
            backgroundColor: progressColor,
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 2,
    borderRadius: 999,
  },
});