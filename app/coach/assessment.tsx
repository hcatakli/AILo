import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  BarChart, 
  Check, 
  ChevronRight, 
  AlertCircle,
  BookOpen,
  MessageSquare,
  Headphones,
  Pencil,
  BookText,
  Sparkles
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useCoachStore } from '@/store/coach-store';
import { SkillAssessment } from '@/types/coach';

export default function AssessmentScreen() {
  const router = useRouter();
  const { assessments, completeAssessment } = useCoachStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<Partial<SkillAssessment>>({
    skills: {
      vocabulary: 0,
      grammar: 0,
      speaking: 0,
      listening: 0,
      reading: 0,
      writing: 0,
    },
    weaknesses: [],
    strengths: [],
  });
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  
  const steps = [
    {
      title: "Vocabulary Assessment",
      description: "Rate your vocabulary knowledge in your target language",
      icon: <BookOpen size={24} color={colors.white} />,
      iconBg: colors.primary,
      skill: "vocabulary",
      questions: [
        {
          id: "vocab1",
          text: "I can understand and use basic everyday vocabulary",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "vocab2",
          text: "I can recognize and use vocabulary for specific topics (e.g., business, travel)",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "vocab3",
          text: "I can understand idiomatic expressions and colloquialisms",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
      ]
    },
    {
      title: "Grammar Assessment",
      description: "Evaluate your understanding of grammar rules",
      icon: <MessageSquare size={24} color={colors.white} />,
      iconBg: colors.secondary,
      skill: "grammar",
      questions: [
        {
          id: "grammar1",
          text: "I can form basic sentences correctly",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "grammar2",
          text: "I understand and can use different tenses appropriately",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "grammar3",
          text: "I can construct complex sentences with subordinate clauses",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
      ]
    },
    {
      title: "Listening Assessment",
      description: "Rate your ability to understand spoken language",
      icon: <Headphones size={24} color={colors.white} />,
      iconBg: "#9C27B0",
      skill: "listening",
      questions: [
        {
          id: "listening1",
          text: "I can understand slow, clear speech about familiar topics",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "listening2",
          text: "I can follow conversations between native speakers at normal speed",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "listening3",
          text: "I can understand audio content like podcasts and movies without subtitles",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
      ]
    },
    {
      title: "Speaking Assessment",
      description: "Evaluate your speaking abilities",
      icon: <MessageSquare size={24} color={colors.white} />,
      iconBg: "#FF9800",
      skill: "speaking",
      questions: [
        {
          id: "speaking1",
          text: "I can introduce myself and have basic conversations",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "speaking2",
          text: "I can express my opinions and participate in discussions",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "speaking3",
          text: "I can speak fluently with few pauses or hesitations",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
      ]
    },
    {
      title: "Reading Assessment",
      description: "Rate your reading comprehension",
      icon: <BookText size={24} color={colors.white} />,
      iconBg: "#4CAF50",
      skill: "reading",
      questions: [
        {
          id: "reading1",
          text: "I can understand simple texts like menus, signs, and short messages",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "reading2",
          text: "I can read and understand newspaper articles and non-technical texts",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "reading3",
          text: "I can read and understand complex texts including literature and technical material",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
      ]
    },
    {
      title: "Writing Assessment",
      description: "Evaluate your writing skills",
      icon: <Pencil size={24} color={colors.white} />,
      iconBg: "#00BCD4",
      skill: "writing",
      questions: [
        {
          id: "writing1",
          text: "I can write simple messages, notes, and short texts",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "writing2",
          text: "I can write clear, detailed texts on various subjects",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
        {
          id: "writing3",
          text: "I can write well-structured, complex texts with appropriate style",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ]
        },
      ]
    },
  ];
  
  const handleOptionSelect = (questionId: string, value: number) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: value,
    });
  };
  
  const calculateSkillScore = (skill: string) => {
    const skillQuestions = steps.find(step => step.skill === skill)?.questions || [];
    let totalScore = 0;
    let answeredQuestions = 0;
    
    skillQuestions.forEach(question => {
      if (selectedOptions[question.id]) {
        totalScore += selectedOptions[question.id];
        answeredQuestions++;
      }
    });
    
    if (answeredQuestions === 0) return 0;
    
    // Convert to 0-100 scale
    return Math.round((totalScore / (answeredQuestions * 5)) * 100);
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      // Update the results with the current skill score
      const currentSkill = steps[currentStep].skill as keyof typeof results.skills;
      const skillScore = calculateSkillScore(currentSkill);
      
      setResults(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [currentSkill]: skillScore
        }
      }));
      
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = async () => {
    // Calculate final scores for all skills
    const finalSkills = {
      vocabulary: calculateSkillScore('vocabulary'),
      grammar: calculateSkillScore('grammar'),
      speaking: calculateSkillScore('speaking'),
      listening: calculateSkillScore('listening'),
      reading: calculateSkillScore('reading'),
      writing: calculateSkillScore('writing'),
    };
    
    // Determine strengths and weaknesses
    const skillEntries = Object.entries(finalSkills) as [keyof typeof finalSkills, number][];
    const sortedSkills = [...skillEntries].sort((a, b) => b[1] - a[1]);
    
    const strengths = sortedSkills.slice(0, 2)
      .filter(([_, score]) => score >= 60)
      .map(([skill]) => `${skill} proficiency`);
    
    const weaknesses = sortedSkills.slice(-2)
      .filter(([_, score]) => score <= 70)
      .map(([skill]) => `${skill} skills`);
    
    const finalResults: Omit<SkillAssessment, 'id' | 'date'> = {
      skills: finalSkills,
      strengths,
      weaknesses: weaknesses.length > 0 ? weaknesses : ['No significant weaknesses identified'],
    };
    
    try {
      await completeAssessment(finalResults);
      router.push('/coach');
    } catch (error) {
      console.error('Failed to complete assessment:', error);
    }
  };
  
  const isStepComplete = () => {
    if (currentStep >= steps.length) return true;
    
    const currentStepQuestions = steps[currentStep].questions;
    return currentStepQuestions.every(q => selectedOptions[q.id]);
  };
  
  const renderResults = () => {
    const skillScores = Object.entries(results.skills || {}).map(([skill, score]) => ({
      skill,
      score: score || 0,
    }));
    
    return (
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <View style={styles.resultsIconContainer}>
            <Sparkles size={24} color={colors.white} />
          </View>
          <Text style={styles.resultsTitle}>Assessment Complete</Text>
        </View>
        
        <Text style={styles.resultsDescription}>
          Based on your responses, here's an overview of your language skills:
        </Text>
        
        <View style={styles.skillScoresContainer}>
          {skillScores.map(({ skill, score }) => (
            <View key={skill} style={styles.skillScoreItem}>
              <Text style={styles.skillName}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</Text>
              <View style={styles.skillScoreBar}>
                <View 
                  style={[
                    styles.skillScoreFill, 
                    { 
                      width: `${score}%`,
                      backgroundColor: 
                        score < 40 ? colors.error :
                        score < 70 ? colors.warning :
                        colors.success
                    }
                  ]} 
                />
              </View>
              <Text style={styles.skillScoreText}>{score}%</Text>
            </View>
          ))}
        </View>
        
        <Button
          title="View Personalized Recommendations"
          onPress={handleComplete}
          style={styles.completeButton}
        />
      </View>
    );
  };
  
  const renderCurrentStep = () => {
    if (currentStep >= steps.length) {
      return renderResults();
    }
    
    const step = steps[currentStep];
    
    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepIconContainer, { backgroundColor: step.iconBg }]}>
            {step.icon}
          </View>
          <View style={styles.stepTitleContainer}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        </View>
        
        <View style={styles.questionsContainer}>
          {step.questions.map((question, index) => (
            <Card key={question.id} style={styles.questionCard}>
              <Text style={styles.questionText}>{question.text}</Text>
              
              <View style={styles.optionsContainer}>
                {question.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      selectedOptions[question.id] === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleOptionSelect(question.id, option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedOptions[question.id] === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                    {selectedOptions[question.id] === option.value && (
                      <Check size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          ))}
        </View>
        
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <Button
              title="Back"
              variant="outline"
              onPress={handlePreviousStep}
              style={styles.navigationButton}
            />
          )}
          
          <Button
            title={currentStep === steps.length - 1 ? "Finish" : "Next"}
            onPress={handleNextStep}
            disabled={!isStepComplete()}
            style={[styles.navigationButton, currentStep === 0 && styles.fullWidthButton]}
          />
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Skills Assessment" />
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / (steps.length + 1)) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {steps.length + 1}
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>
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
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  questionsContainer: {
    marginBottom: 24,
  },
  questionCard: {
    marginBottom: 16,
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  fullWidthButton: {
    marginHorizontal: 0,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  resultsDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    lineHeight: 22,
  },
  skillScoresContainer: {
    marginBottom: 32,
  },
  skillScoreItem: {
    marginBottom: 16,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  skillScoreBar: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  skillScoreFill: {
    height: '100%',
  },
  skillScoreText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  completeButton: {
    marginTop: 16,
  },
});