import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Target, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Headphones, 
  Pencil, 
  BookText, 
  Check 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useCoachStore } from '@/store/coach-store';
import { LearningGoal } from '@/types/coach';

export default function CreateGoalScreen() {
  const router = useRouter();
  const { addGoal } = useCoachStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState<string | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<LearningGoal['type']>('vocabulary');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const goalTypes = [
    { 
      type: 'vocabulary' as const, 
      label: 'Vocabulary', 
      icon: <BookOpen size={20} color={colors.white} />,
      color: colors.primary
    },
    { 
      type: 'grammar' as const, 
      label: 'Grammar', 
      icon: <MessageSquare size={20} color={colors.white} />,
      color: colors.secondary
    },
    { 
      type: 'speaking' as const, 
      label: 'Speaking', 
      icon: <MessageSquare size={20} color={colors.white} />,
      color: '#FF9800'
    },
    { 
      type: 'listening' as const, 
      label: 'Listening', 
      icon: <Headphones size={20} color={colors.white} />,
      color: '#9C27B0'
    },
    { 
      type: 'reading' as const, 
      label: 'Reading', 
      icon: <BookText size={20} color={colors.white} />,
      color: '#4CAF50'
    },
    { 
      type: 'writing' as const, 
      label: 'Writing', 
      icon: <Pencil size={20} color={colors.white} />,
      color: '#00BCD4'
    },
    { 
      type: 'custom' as const, 
      label: 'Custom', 
      icon: <Target size={20} color={colors.white} />,
      color: '#607D8B'
    },
  ];
  
  const handleCreateGoal = async () => {
    if (!title.trim()) return;
    
    try {
      const newGoal = await addGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        targetDate,
        type: selectedType,
        completed: false,
        progress: 0,
      });
      
      router.push('/coach/goals');
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };
  
  const handleSelectDate = (date: Date) => {
    setTargetDate(date.toISOString());
    setShowDatePicker(false);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Function to set a date X days from now
  const setDateFromNow = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setTargetDate(date.toISOString());
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Create Goal" />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Details</Text>
          
          <Card style={styles.inputCard}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter goal title"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            
            <Text style={styles.inputLabel}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter goal description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Type</Text>
          
          <Card style={styles.typeCard}>
            <View style={styles.typeGrid}>
              {goalTypes.map((goalType) => (
                <TouchableOpacity
                  key={goalType.type}
                  style={[
                    styles.typeButton,
                    selectedType === goalType.type && styles.selectedTypeButton
                  ]}
                  onPress={() => setSelectedType(goalType.type)}
                >
                  <View style={[
                    styles.typeIconContainer,
                    { backgroundColor: goalType.color }
                  ]}>
                    {goalType.icon}
                  </View>
                  <Text style={[
                    styles.typeText,
                    selectedType === goalType.type && styles.selectedTypeText
                  ]}>
                    {goalType.label}
                  </Text>
                  {selectedType === goalType.type && (
                    <View style={styles.selectedIndicator}>
                      <Check size={16} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Date</Text>
          
          <Card style={styles.dateCard}>
            <View style={styles.dateDisplay}>
              <Calendar size={20} color={colors.text} />
              <Text style={styles.dateText}>
                {targetDate ? formatDate(targetDate) : 'No date set'}
              </Text>
            </View>
            
            <View style={styles.dateOptions}>
              <TouchableOpacity 
                style={styles.dateOption}
                onPress={() => setDateFromNow(7)}
              >
                <Text style={styles.dateOptionText}>1 Week</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dateOption}
                onPress={() => setDateFromNow(30)}
              >
                <Text style={styles.dateOptionText}>1 Month</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dateOption}
                onPress={() => setDateFromNow(90)}
              >
                <Text style={styles.dateOptionText}>3 Months</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dateOption}
                onPress={() => setTargetDate(undefined)}
              >
                <Text style={styles.dateOptionText}>No Date</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
        
        <Button
          title="Create Goal"
          onPress={handleCreateGoal}
          disabled={!title.trim()}
          style={styles.createButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  inputCard: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeCard: {
    padding: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  typeButton: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    position: 'relative',
  },
  selectedTypeButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedTypeText: {
    color: colors.primary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  dateCard: {
    padding: 16,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  dateOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
  },
  dateOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  createButton: {
    marginTop: 8,
  },
});