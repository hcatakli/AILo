import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, XCircle, ArrowRight, Flame } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useWordListsStore } from '@/store/word-lists-store';
import { useLearningStore } from '@/store/learning-store';
import { Word } from '@/types/word';
import { colors } from '@/constants/colors';

export default function LearningScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { lists, fetchListById, isLoading: isLoadingList } = useWordListsStore();
  const { 
    currentSession, 
    startLearningSession, 
    completeQuestion, 
    endLearningSession,
    isLoading: isLoadingSession,
    streak
  } = useLearningStore();
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
  });
  
  const isLoading = isLoadingList || isLoadingSession;
  
  useEffect(() => {
    if (id) {
      fetchListById(id);
    }
  }, [id]);
  
  useEffect(() => {
    const initSession = async () => {
      if (id && lists.length > 0) {
        // Check if there's an existing session for this list
        if (currentSession && currentSession.listId === id) {
          // Resume session
          const list = lists.find(l => l.id === id);
          if (list) {
            // Find the next unanswered question
            const nextIndex = currentSession.words.findIndex(w => !w.correct);
            if (nextIndex >= 0) {
              setCurrentWordIndex(nextIndex);
              const wordId = currentSession.words[nextIndex].wordId;
              const word = list.words.find(w => w.id === wordId) || null;
              setCurrentWord(word);
              if (word) {
                generateOptions(word, list.words);
              }
            } else {
              // All questions answered, show results
              setIsSessionComplete(true);
              setSessionStats({
                correct: currentSession.correctAnswers,
                total: currentSession.totalQuestions,
              });
            }
          }
        } else {
          // Start new session
          try {
            const session = await startLearningSession(id);
            const list = lists.find(l => l.id === id);
            if (list && session.words.length > 0) {
              const wordId = session.words[0].wordId;
              const word = list.words.find(w => w.id === wordId) || null;
              setCurrentWord(word);
              if (word) {
                generateOptions(word, list.words);
              }
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to start learning session');
            router.back();
          }
        }
      }
    };
    
    initSession();
  }, [id, lists]);
  
  const generateOptions = (currentWord: Word, allWords: Word[]) => {
    // Create options including the correct answer and 3 random incorrect answers
    const correctAnswer = currentWord.definition;
    
    // Filter out the current word and get random words for incorrect options
    const otherWords = allWords.filter(w => w.id !== currentWord.id);
    const shuffledWords = [...otherWords].sort(() => Math.random() - 0.5);
    const incorrectOptions = shuffledWords.slice(0, 3).map(w => w.definition);
    
    // Combine and shuffle all options
    const allOptions = [correctAnswer, ...incorrectOptions];
    const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);
    
    setOptions(shuffledOptions);
  };
  
  const handleOptionSelect = (option: string) => {
    if (isCorrect !== null || !currentWord) return; // Already answered or no word
    
    setSelectedOption(option);
    const correct = option === currentWord.definition;
    setIsCorrect(correct);
    
    // Update the session
    if (currentSession && currentWord) {
      completeQuestion(currentWord.id, correct);
    }
  };
  
  const handleNextQuestion = () => {
    if (!currentSession) return;
    
    // Reset state for next question
    setSelectedOption(null);
    setIsCorrect(null);
    
    // Check if there are more questions
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < currentSession.words.length) {
      setCurrentWordIndex(nextIndex);
      
      // Get the next word
      const list = lists.find(l => l.id === id);
      if (list) {
        const wordId = currentSession.words[nextIndex].wordId;
        const word = list.words.find(w => w.id === wordId) || null;
        setCurrentWord(word);
        if (word) {
          generateOptions(word, list.words);
        }
      }
    } else {
      // Session complete
      setIsSessionComplete(true);
      setSessionStats({
        correct: currentSession.correctAnswers,
        total: currentSession.totalQuestions,
      });
      endLearningSession();
    }
  };
  
  const handleFinishSession = () => {
    router.back();
  };
  
  if (isLoading && !currentWord) {
    return <LoadingIndicator fullScreen message="Preparing your learning session..." />;
  }
  
  if (isSessionComplete) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Session Complete" />
        
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Great job!</Text>
            <View style={styles.streakContainer}>
              <Flame size={20} color={colors.secondary} />
              <Text style={styles.streakText}>{streak} day streak</Text>
            </View>
          </View>
          
          <Card style={styles.resultsCard}>
            <Text style={styles.resultsScore}>
              {sessionStats.correct} / {sessionStats.total}
            </Text>
            <Text style={styles.resultsScoreLabel}>Correct Answers</Text>
            
            <View style={styles.resultsStat}>
              <Text style={styles.resultsStatLabel}>Accuracy</Text>
              <Text style={styles.resultsStatValue}>
                {Math.round((sessionStats.correct / sessionStats.total) * 100)}%
              </Text>
            </View>
          </Card>
          
          <Button
            title="Finish"
            onPress={handleFinishSession}
            style={styles.finishButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  if (!currentWord || !currentSession) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Learning" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load learning session</Text>
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
      <Header title="Learning" />
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentWordIndex + 1} of {currentSession.totalQuestions}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentWordIndex + 1) / currentSession.totalQuestions) * 100}%` }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.wordCard}>
          <Text style={styles.wordLabel}>What is the definition of:</Text>
          <Text style={styles.wordValue}>{currentWord.value}</Text>
          
          {currentWord.example && (
            <Text style={styles.example}>"{currentWord.example}"</Text>
          )}
        </Card>
        
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOption,
                isCorrect !== null && option === currentWord.definition && styles.correctOption,
                selectedOption === option && isCorrect === false && styles.incorrectOption,
              ]}
              onPress={() => handleOptionSelect(option)}
              disabled={isCorrect !== null}
            >
              <Text 
                style={[
                  styles.optionText,
                  selectedOption === option && styles.selectedOptionText,
                  isCorrect !== null && option === currentWord.definition && styles.correctOptionText,
                  selectedOption === option && isCorrect === false && styles.incorrectOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {isCorrect !== null && (
        <View style={styles.feedbackContainer}>
          <View style={[
            styles.feedbackCard,
            isCorrect ? styles.correctFeedback : styles.incorrectFeedback
          ]}>
            <View style={styles.feedbackHeader}>
              {isCorrect ? (
                <CheckCircle size={24} color={colors.white} />
              ) : (
                <XCircle size={24} color={colors.white} />
              )}
              <Text style={styles.feedbackTitle}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
            </View>
            
            <Text style={styles.feedbackText}>
              {isCorrect 
                ? 'Great job! You got it right.' 
                : `The correct definition of "${currentWord.value}" is: ${currentWord.definition}`
              }
            </Text>
            
            <Button
              title="Next"
              onPress={handleNextQuestion}
              rightIcon={<ArrowRight size={18} color={colors.white} />}
              style={styles.nextButton}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  wordCard: {
    marginBottom: 24,
  },
  wordLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  wordValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  example: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 8,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  correctOption: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10', // 10% opacity
  },
  incorrectOption: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10', // 10% opacity
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  correctOptionText: {
    color: colors.success,
    fontWeight: '500',
  },
  incorrectOptionText: {
    color: colors.error,
    fontWeight: '500',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  feedbackCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  correctFeedback: {
    backgroundColor: colors.success,
  },
  incorrectFeedback: {
    backgroundColor: colors.error,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  feedbackText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 16,
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-end',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  resultsCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  resultsScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  resultsScoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  resultsStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  resultsStatLabel: {
    fontSize: 16,
    color: colors.text,
  },
  resultsStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  finishButton: {
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
    textAlign: 'center',
  },
  errorButton: {
    minWidth: 120,
  },
});