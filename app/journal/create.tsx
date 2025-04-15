import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Mic, 
  Video, 
  FileText, 
  X, 
  Check, 
  Tag, 
  Trash2,
  Info
} from 'lucide-react-native';
import { RecordButton } from '@/components/RecordButton';
import { MediaPlayer } from '@/components/MediaPlayer';
import { Button } from '@/components/Button';
import { useJournalStore } from '@/store/journal-store';
import { colors } from '@/constants/colors';
import { MediaType } from '@/types/journal';

export default function CreateJournalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { type = 'audio' } = params as { type: MediaType };
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  
  const { addEntry, isRecording, setIsRecording } = useJournalStore();
  
  // Set up header
  useEffect(() => {
    let headerTitle = 'New Journal Entry';
    let headerIcon = <FileText size={20} color={colors.text} />;
    
    if (type === 'audio') {
      headerTitle = 'New Voice Entry';
      headerIcon = <Mic size={20} color={colors.primary} />;
    } else if (type === 'video') {
      headerTitle = 'New Video Entry';
      headerIcon = <Video size={20} color={colors.secondary} />;
    }
    
    // This would be implemented in a real app
  }, [type]);
  
  // Handle recording start
  const handleStartRecording = async () => {
    try {
      // In a real implementation, we would use expo-av to start recording
      console.log('Starting recording...');
      
      // For demo purposes, simulate a recording URI
      const demoUri = type === 'audio' 
        ? 'https://example.com/audio-recording.m4a'
        : 'https://example.com/video-recording.mp4';
      
      setRecordingUri(demoUri);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
      return Promise.reject(error);
    }
  };
  
  // Handle recording stop
  const handleStopRecording = async () => {
    try {
      // In a real implementation, we would use expo-av to stop recording
      console.log('Stopping recording...');
      
      // For demo purposes, simulate a successful recording
      setRecordingComplete(true);
      return Promise.resolve(recordingUri);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
      return Promise.reject(error);
    }
  };
  
  // Handle recording pause
  const handlePauseRecording = async () => {
    // In a real implementation, we would use expo-av to pause recording
    console.log('Pausing recording...');
    return Promise.resolve();
  };
  
  // Handle recording resume
  const handleResumeRecording = async () => {
    // In a real implementation, we would use expo-av to resume recording
    console.log('Resuming recording...');
    return Promise.resolve();
  };
  
  // Add a tag
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Save journal entry
  const saveEntry = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your journal entry');
      return;
    }
    
    if ((type === 'audio' || type === 'video') && !recordingComplete) {
      Alert.alert('Error', 'Please complete a recording before saving');
      return;
    }
    
    const entryId = addEntry({
      title: title.trim(),
      description: description.trim(),
      mediaType: type,
      mediaUri: recordingUri || undefined,
      textContent: type === 'text' ? description : undefined,
      tags: tags.length > 0 ? tags : undefined,
      isFavorite: false,
    });
    
    // Navigate to the new entry
    router.replace(`/journal/${entryId}`);
  };
  
  // Discard entry and go back
  const discardEntry = () => {
    if (title || description || recordingComplete || tags.length > 0) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard this entry?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: type === 'audio' 
            ? 'New Voice Entry' 
            : type === 'video' 
              ? 'New Video Entry' 
              : 'New Text Entry',
          headerLeft: () => (
            <TouchableOpacity onPress={discardEntry}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={saveEntry}>
              <Check size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Entry Title"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          
          {/* Recording section for audio/video */}
          {(type === 'audio' || type === 'video') && (
            <View style={styles.recordingSection}>
              {recordingComplete ? (
                <View style={styles.recordingPreview}>
                  <MediaPlayer
                    uri={recordingUri || ''}
                    type={type}
                    autoPlay={false}
                  />
                  
                  <Button
                    title="Record Again"
                    onPress={() => {
                      setRecordingComplete(false);
                      setRecordingUri(null);
                    }}
                    variant="outline"
                    leftIcon={type === 'audio' ? <Mic size={18} color={colors.primary} /> : <Video size={18} color={colors.primary} />}
                    style={styles.reRecordButton}
                  />
                </View>
              ) : (
                <View style={styles.recordingControls}>
                  <Text style={styles.recordingInstructions}>
                    {type === 'audio' 
                      ? 'Record your voice note' 
                      : 'Record your video'}
                  </Text>
                  
                  <RecordButton
                    type={type}
                    size="large"
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
                    onPauseRecording={handlePauseRecording}
                    onResumeRecording={handleResumeRecording}
                  />
                  
                  <Text style={styles.recordingTip}>
                    <Info size={14} color={colors.textSecondary} />
                    {' '}
                    {type === 'audio' 
                      ? 'Speak clearly and at a moderate pace' 
                      : 'Hold your device steady while recording'}
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {/* Description input */}
          <TextInput
            style={styles.descriptionInput}
            placeholder={type === 'text' ? 'Write your journal entry...' : 'Add a description (optional)'}
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            numberOfLines={type === 'text' ? 10 : 4}
          />
          
          {/* Tags section */}
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag"
                placeholderTextColor={colors.textSecondary}
                value={currentTag}
                onChangeText={setCurrentTag}
                onSubmitEditing={addTag}
              />
              
              <TouchableOpacity 
                style={[
                  styles.addTagButton,
                  !currentTag.trim() && styles.disabledButton
                ]}
                onPress={addTag}
                disabled={!currentTag.trim()}
              >
                <Tag size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
            
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => removeTag(tag)}
                      style={styles.removeTagButton}
                    >
                      <X size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Discard"
            onPress={discardEntry}
            variant="outline"
            leftIcon={<Trash2 size={18} color={colors.error} />}
            style={styles.discardButton}
            textStyle={{ color: colors.error }}
          />
          
          <Button
            title="Save Entry"
            onPress={saveEntry}
            leftIcon={<Check size={18} color={colors.white} />}
            style={styles.saveButton}
            disabled={!title.trim() || ((type === 'audio' || type === 'video') && !recordingComplete)}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
  },
  recordingSection: {
    marginBottom: 16,
  },
  recordingControls: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
  },
  recordingInstructions: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  recordingTip: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 24,
    textAlign: 'center',
  },
  recordingPreview: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  reRecordButton: {
    marginTop: 16,
  },
  descriptionInput: {
    fontSize: 16,
    color: colors.text,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 100,
  },
  tagsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 12,
    backgroundColor: colors.card,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  addTagButton: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 4,
  },
  removeTagButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  discardButton: {
    flex: 1,
    marginRight: 8,
    borderColor: colors.error,
  },
  saveButton: {
    flex: 2,
  },
});