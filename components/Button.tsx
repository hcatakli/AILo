import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { colors, theme } from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryButton);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineButton);
    } else if (variant === 'text') {
      baseStyle.push(styles.textButton);
    }
    
    if (disabled || isLoading) {
      baseStyle.push(styles.disabledButton);
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${size}Text`]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryButtonText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButtonText);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineButtonText);
    } else if (variant === 'text') {
      baseStyle.push(styles.textButtonText);
    }
    
    if (disabled || isLoading) {
      baseStyle.push(styles.disabledButtonText);
    }
    
    return baseStyle;
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[...getButtonStyle(), style]}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? colors.white : variant === 'outline' ? colors.primary : colors.primary} 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontWeight: theme.fontWeight.semibold,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    ...theme.shadow.sm,
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    ...theme.shadow.sm,
  },
  secondaryButtonText: {
    color: colors.white,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  textButtonText: {
    color: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledButtonText: {
    opacity: 0.8,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});