import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, theme } from '@/constants/colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
  style?: ViewStyle;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightContent,
  style,
  transparent = false,
}) => {
  const router = useRouter();
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };
  
  return (
    <View style={[
      styles.container, 
      transparent ? styles.transparentContainer : null,
      style
    ]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {rightContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
    borderRadius: theme.borderRadius.full,
    backgroundColor: colors.card,
    ...theme.shadow.sm,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
});