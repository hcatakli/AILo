import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }}
            style={styles.logo}
          />
        </View>
        
        <Text style={styles.title}>VocabMaster</Text>
        <Text style={styles.subtitle}>
          Expand your vocabulary and master new languages with our intuitive learning app
        </Text>
        
        <View style={styles.features}>
          <Feature title="Create custom word lists" description="Organize vocabulary by topic, language, or difficulty" />
          <Feature title="Learn effectively" description="Spaced repetition and interactive exercises" />
          <Feature title="Track your progress" description="See your improvement with detailed statistics" />
        </View>
      </View>
      
      <View style={styles.buttons}>
        <Button
          title="Log In"
          onPress={() => router.push('/login')}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Create Account"
          onPress={() => router.push('/register')}
          variant="outline"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

interface FeatureProps {
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ title, description }) => (
  <View style={styles.feature}>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttons: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    gap: 12,
  },
  button: {
    width: '100%',
  },
});