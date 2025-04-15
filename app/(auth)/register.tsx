import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    if (!name) {
      errors.name = 'Name is required';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
  };
  
  const handleRegister = async () => {
    if (validateForm()) {
      try {
        await register({ name, email, password });
        // No need to navigate here - the layout will handle it
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start learning</Text>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.form}>
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCorrect={false}
              leftIcon={<User size={20} color={colors.textSecondary} />}
              error={validationErrors.name}
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
              error={validationErrors.email}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              isPassword
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
              error={validationErrors.password}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              isPassword
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
              error={validationErrors.confirmPassword}
            />
            
            <Button
              title="Create Account"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.button}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});