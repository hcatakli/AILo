import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useWordListsStore } from '@/store/word-lists-store';
import { colors } from '@/constants/colors';

export default function CreateListScreen() {
  const router = useRouter();
  const { createList, isLoading } = useWordListsStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [context, setContext] = useState('');
  const [category, setCategory] = useState('');
  
  const [errors, setErrors] = useState({
    name: '',
    language: '',
  });
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      language: '',
    };
    
    if (!name.trim()) {
      newErrors.name = 'List name is required';
    }
    
    if (!language.trim()) {
      newErrors.language = 'Language is required';
    }
    
    setErrors(newErrors);
    
    return !newErrors.name && !newErrors.language;
  };
  
  const handleCreateList = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const newList = await createList({
        name: name.trim(),
        description: description.trim(),
        language: language.trim(),
        context: context.trim(),
        category: category.trim(),
      });
      
      Alert.alert(
        'List Created',
        'Your new word list has been created successfully.',
        [
          {
            text: 'Add Words Now',
            onPress: () => router.push(`/list/add-word?listId=${newList.id}`),
          },
          {
            text: 'View List',
            onPress: () => router.push(`/list/${newList.id}`),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create list');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Create New List" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitle}>
            Create a new word list to organize your vocabulary
          </Text>
          
          <View style={styles.form}>
            <Input
              label="List Name"
              placeholder="e.g., Business English, Spanish Verbs"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            
            <Input
              label="Description (Optional)"
              placeholder="Brief description of this list"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.textArea}
            />
            
            <Input
              label="Language"
              placeholder="e.g., English, Spanish, French"
              value={language}
              onChangeText={setLanguage}
              error={errors.language}
            />
            
            <Input
              label="Context (Optional)"
              placeholder="e.g., Travel, Business, Academic"
              value={context}
              onChangeText={setContext}
            />
            
            <Input
              label="Category (Optional)"
              placeholder="e.g., Verbs, Nouns, Idioms"
              value={category}
              onChangeText={setCategory}
            />
            
            <Button
              title="Create List"
              onPress={handleCreateList}
              isLoading={isLoading}
              style={styles.button}
            />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  button: {
    marginTop: 16,
  },
});