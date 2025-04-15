import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useWordListsStore } from '@/store/word-lists-store';
import { colors } from '@/constants/colors';

export default function AddWordScreen() {
  const { listId, wordId } = useLocalSearchParams<{ listId: string; wordId?: string }>();
  const router = useRouter();
  const { 
    fetchListById, 
    currentList, 
    isLoading, 
    addWord, 
    updateWord 
  } = useWordListsStore();
  
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [errors, setErrors] = useState({
    word: '',
    definition: '',
  });
  
  const isEditMode = !!wordId;
  
  useEffect(() => {
    if (listId) {
      fetchListById(listId);
    }
  }, [listId]);
  
  useEffect(() => {
    if (isEditMode && currentList) {
      const wordToEdit = currentList.words.find(w => w.id === wordId);
      if (wordToEdit) {
        setWord(wordToEdit.value);
        setDefinition(wordToEdit.definition);
        setExample(wordToEdit.example || '');
      }
    }
  }, [isEditMode, currentList, wordId]);
  
  const validateForm = () => {
    const newErrors = {
      word: '',
      definition: '',
    };
    
    if (!word.trim()) {
      newErrors.word = 'Word is required';
    }
    
    if (!definition.trim()) {
      newErrors.definition = 'Definition is required';
    }
    
    setErrors(newErrors);
    
    return !newErrors.word && !newErrors.definition;
  };
  
  const handleSaveWord = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode) {
        await updateWord(listId, wordId, {
          value: word.trim(),
          definition: definition.trim(),
          example: example.trim() || undefined,
        });
        
        Alert.alert('Success', 'Word updated successfully');
      } else {
        await addWord(listId, {
          value: word.trim(),
          definition: definition.trim(),
          example: example.trim() || undefined,
        });
        
        // Clear form for adding another word
        setWord('');
        setDefinition('');
        setExample('');
        
        Alert.alert(
          'Success',
          'Word added successfully',
          [
            {
              text: 'Add Another',
              style: 'cancel',
            },
            {
              text: 'View List',
              onPress: () => router.push(`/list/${listId}`),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', isEditMode ? 'Failed to update word' : 'Failed to add word');
    }
  };
  
  if (isLoading && !currentList) {
    return <LoadingIndicator fullScreen message="Loading..." />;
  }
  
  if (!currentList) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={isEditMode ? 'Edit Word' : 'Add Word'} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>List not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={isEditMode ? 'Edit Word' : 'Add Word'} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.listName}>List: {currentList.name}</Text>
          
          <View style={styles.form}>
            <Input
              label="Word"
              placeholder="Enter the word or phrase"
              value={word}
              onChangeText={setWord}
              error={errors.word}
            />
            
            <Input
              label="Definition"
              placeholder="Enter the definition"
              value={definition}
              onChangeText={setDefinition}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.textArea}
              error={errors.definition}
            />
            
            <Input
              label="Example (Optional)"
              placeholder="Enter an example sentence"
              value={example}
              onChangeText={setExample}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.textArea}
            />
            
            <Button
              title={isEditMode ? 'Update Word' : 'Add Word'}
              onPress={handleSaveWord}
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
  listName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    marginBottom: 16,
  },
  errorButton: {
    minWidth: 120,
  },
});