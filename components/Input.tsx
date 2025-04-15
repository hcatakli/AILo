import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, theme } from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  secureTextEntry,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus();
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur();
    }
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error ? styles.inputError : null,
        inputStyle
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || isPassword) ? styles.inputWithRightIcon : null,
          ]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        
        {isPassword ? (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            {isPasswordVisible ? (
              <Eye size={20} color={colors.textSecondary} />
            ) : (
              <EyeOff size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
      
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: theme.fontSize.sm,
    marginBottom: 8,
    fontWeight: theme.fontWeight.medium,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.white,
    transition: 'all 0.2s ease',
  },
  inputFocused: {
    borderColor: colors.primary,
    ...theme.shadow.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: theme.fontSize.md,
    color: colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: theme.fontSize.sm,
    marginTop: 4,
  },
});