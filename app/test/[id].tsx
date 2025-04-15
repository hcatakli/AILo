import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, XCircle, ArrowRight, Clock, Award, Share2 } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useWordListsStore } from '@/store/word-lists-store';
import { useLearningStore } from '@/store/learning-store';
import { Word } from '@/types/word';
import { colors } from '@/constants/colors';

export default function TestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { lists, fetchListById, isLoading: isLoadingList } = useWordListsStore();
  const { 
    currentTestSession, 
    startTestSession, 
    completeTestQuestion, 
    endTestSession,
    isLoading: isLoadingSession,
  } = useLearningStore();
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    score: 0,
    timeTaken: 0,
  });
  const [startTime, setStartTime] = useState(Date.now());
  
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
        if (currentTestSession && currentTestSession.listId === id) {
          // Resume session
          const list = lists.find(l => l.id === id);
          if (list) {
            // Find the next unanswered question
            const nextIndex = currentTestSession.words.findIndex(w => !w.correct);
            if (nextIndex >= 0) {
              setCurrentWordIndex(nextIndex);
              const wordId = currentTestSession.words[nextIndex].wordId;
              const word = list.words.find(w => w.id === wordId) || null;
              setCurrentWord(word);
            } else {
              // All questions answered, show results
              setIsSessionComplete(true);
              setSessionStats({
                correct: currentTestSession.correctAnswers,
                total: currentTestSession.totalQuestions,
                score: currentTestSession.score,
                timeTaken: 0, // Will be calculated when session ends
              });
            }
          }
        } else {
          // Start new session
          try {
            setStartTime(Date.now());
            const session = await startTestSession(id);
            const list = lists.find(l => l.id === id);
            if (list && session.words.length > 0) {
              const wordId = session.words[0].wordId;
              const word = list.words.find(w => w.id === wordId) || null;
              setCurrentWord(word);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to start test session');
            router.back();
          }
        }
      }
    };
    
    initSession();
  }, [id, lists]);
  
  const handleSubmitAnswer = () => {
    if (isCorrect !== null || !currentWord) return; // Already answered or no word
    
    // Check if answer is correct (case insensitive)
    const correct = answer.trim().toLowerCase() === currentWord.definition.toLowerCase();
    setIsCorrect(correct);
    
    // Update the session
    if (currentTestSession && currentWord) {
      completeTestQuestion(currentWord.id, correct);
    }
  };
  
  const handleNextQuestion = () => {
    if (!currentTestSession) return;
    
    // Reset state for next question
    setAnswer('');
    setIsCorrect(null);
    
    // Check if there are more questions
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < currentTestSession.words.length) {
      setCurrentWordIndex(nextIndex);
      
      // Get the next word
      const list = lists.find(l => l.id === id);
      if (list) {
        const wordId = currentTestSession.words[nextIndex].wordId;
        const word = list.words.find(w => w.id === wordId) || null;
        setCurrentWord(word);
      }
    } else {
      // Session complete
      const timeTaken = Math.round((Date.now() - startTime) / 1000); // in seconds
      setIsSessionComplete(true);
      setSessionStats({
        correct: currentTestSession.correctAnswers,
        total: currentTestSession.totalQuestions,
        score: currentTestSession.score,
        timeTaken,
      });
      endTestSession(timeTaken);
    }
  };
  
  const handleFinishSession = () => {
    router.back();
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  if (isLoading && !currentWord) {
    return <LoadingIndicator fullScreen message="Preparing your test..." />;
  }
  
  if (isSessionComplete) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Test Results" />
        
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Complete!</Text>
          
          <Card style={styles.resultsCard}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>{sessionStats.score}%</Text>
            </View>
            <Text style={styles.scoreLabel}>Your Score</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <CheckCircle size={20} color={colors.success} />
                <Text style={styles.statValue}>{sessionStats.correct}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              
              <View style={styles.statItem}>
                <XCircle size={20} color={colors.error} />
                <Text style={styles.statValue}>{sessionStats.total - sessionStats.correct}</Text>
                <Text style={styles.statLabel}>Incorrect</Text>
              </View>
              
              <View style={styles.statItem}>
                <Clock size={20} color={colors.primary} />
                <Text style={styles.statValue}>{formatTime(sessionStats.timeTaken)}</Text>
                <Text style={styles.statLabel}>Time</Text>
              </View>
            </View>
          </Card>
          
          <View style={styles.resultsActions}>
            <Button
              title="Share Results"
              onPress={() => {
                // In a real app, this would share the results
                Alert.alert('Share', 'Sharing functionality would be implemented here');
              }}
              variant="outline"
              leftIcon={<Share2 size={18} color={colors.primary} />}
              style={styles.shareButton}
            />
            
            <Button
              title="Finish"
              onPress={handleFinishSession}
              style={styles.finishButton}
            />
          </View>
          
          {sessionStats.score >= 80 && (
            <Card style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Award size={24} color={colors.white} />
              </View>
              <Text style={styles.achievementTitle}>Achievement Unlocked!</Text>
              <Text style={styles.achievementText}>
                {sessionStats.score === 100 
                  ? 'Perfect Score! You got all answers correct.' 
                  : 'Great Score! You passed with flying colors.'}
              </Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    );
  }
  
  if (!currentWord || !currentTestSession) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Test" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load test session</Text>
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
      <Header title="Test" />
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentWordIndex + 1} of {currentTestSession.totalQuestions}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentWordIndex + 1) / currentTestSession.totalQuestions) * 100}%` }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.wordCard}>
          <Text style={styles.wordLabel}>What is the definition of:</Text>
          <Text style={styles.wordValue}>{currentWord.value}</Text>
          
          {currentWord.example && (
            <Text style={styles.example}>Example: "{currentWord.example}"</Text>
          )}
        </Card>
        
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>Enter the definition:</Text>
          <TextInput
            style={[
              styles.answerInput,
              isCorrect === true && styles.correctInput,
              isCorrect === false && styles.incorrectInput,
            ]}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type your answer here"
            multiline
            editable={isCorrect === null}
            onSubmitEditing={handleSubmitAnswer}
          />
          
          {isCorrect === null && (
            <Button
              title="Submit Answer"
              onPress={handleSubmitAnswer}
              style={styles.submitButton}
              disabled={!answer.trim()}
            />
          )}
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
                ? 'Great job! Your answer is correct.' 
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
    backgroundColor: colors.secondary,
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
  answerContainer: {
    marginBottom: 24,
  },
  answerLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  correctInput: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10', // 10% opacity
  },
  incorrectInput: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10', // 10% opacity
  },
  submitButton: {
    alignSelf: 'flex-end',
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
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  resultsCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
  },
  scoreLabel: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultsActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  shareButton: {
    flex: 1,
  },
  finishButton: {
    flex: 1,
  },
  achievementCard: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    padding: 16,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
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