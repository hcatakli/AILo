import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, ScanText, Check, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useWordListsStore } from '@/store/word-lists-store';
import { colors } from '@/constants/colors';

// Mock function to simulate text extraction from an image
const extractTextFromImage = async (uri: string) => {
  // In a real app, this would use a text recognition API
  // For demo purposes, we'll return some mock words
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
  
  return [
    { word: 'ubiquitous', definition: 'Present, appearing, or found everywhere' },
    { word: 'ephemeral', definition: 'Lasting for a very short time' },
    { word: 'serendipity', definition: 'The occurrence of events by chance in a happy or beneficial way' },
    { word: 'paradigm', definition: 'A typical example or pattern of something' },
    { word: 'pragmatic', definition: 'Dealing with things sensibly and realistically' },
  ];
};

export default function CameraScanScreen() {
  const router = useRouter();
  const { lists } = useWordListsStore();
  
  const [image, setImage] = useState<string | null>(null);
  const [extractedWords, setExtractedWords] = useState<Array<{ word: string; definition: string; selected: boolean }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setExtractedWords([]);
      setIsProcessing(false);
    }
  };
  
  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera is not available in web mode');
      return;
    }
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setExtractedWords([]);
      setIsProcessing(false);
    }
  };
  
  const processImage = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    
    try {
      const words = await extractTextFromImage(image);
      setExtractedWords(words.map(w => ({ ...w, selected: true })));
    } catch (error) {
      Alert.alert('Error', 'Failed to extract text from image');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleWordSelection = (index: number) => {
    const updatedWords = [...extractedWords];
    updatedWords[index].selected = !updatedWords[index].selected;
    setExtractedWords(updatedWords);
  };
  
  const handleAddToList = () => {
    if (!selectedListId) {
      Alert.alert('Select List', 'Please select a list to add words to');
      return;
    }
    
    const selectedWords = extractedWords.filter(w => w.selected);
    
    if (selectedWords.length === 0) {
      Alert.alert('No Words Selected', 'Please select at least one word to add');
      return;
    }
    
    // In a real app, this would add the words to the selected list
    Alert.alert(
      'Success',
      `Added ${selectedWords.length} words to the selected list`,
      [
        {
          text: 'View List',
          onPress: () => router.push(`/list/${selectedListId}`),
        },
        {
          text: 'OK',
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Camera Word Scanner" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Scan text from images to quickly add words to your lists
        </Text>
        
        {!image ? (
          <Card style={styles.uploadCard}>
            <View style={styles.uploadContent}>
              <Camera size={48} color={colors.primary} />
              <Text style={styles.uploadText}>Take a photo or select an image with text</Text>
              <View style={styles.uploadButtons}>
                <Button
                  title="Take Photo"
                  onPress={takePhoto}
                  variant="primary"
                  style={styles.uploadButton}
                />
                <Button
                  title="Select Image"
                  onPress={pickImage}
                  variant="outline"
                  style={styles.uploadButton}
                />
              </View>
            </View>
          </Card>
        ) : (
          <>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <View style={styles.imageActions}>
                <Button
                  title="Change Image"
                  onPress={pickImage}
                  variant="outline"
                  style={styles.imageButton}
                />
                {!isProcessing && extractedWords.length === 0 && (
                  <Button
                    title="Extract Text"
                    onPress={processImage}
                    leftIcon={<ScanText size={18} color={colors.white} />}
                    style={styles.imageButton}
                  />
                )}
              </View>
            </View>
            
            {isProcessing && (
              <Card style={styles.processingCard}>
                <Text style={styles.processingText}>Processing image...</Text>
              </Card>
            )}
            
            {extractedWords.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Extracted Words</Text>
                <Text style={styles.sectionSubtitle}>
                  Select the words you want to add to your list
                </Text>
                
                {extractedWords.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.wordCard,
                      item.selected && styles.selectedWordCard
                    ]}
                    onPress={() => toggleWordSelection(index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.wordContent}>
                      <Text style={styles.wordText}>{item.word}</Text>
                      <Text style={styles.definitionText}>{item.definition}</Text>
                    </View>
                    <View style={[
                      styles.checkCircle,
                      item.selected && styles.selectedCheckCircle
                    ]}>
                      {item.selected && <Check size={16} color={colors.white} />}
                    </View>
                  </TouchableOpacity>
                ))}
                
                <Text style={styles.sectionTitle}>Select List</Text>
                
                <View style={styles.listsContainer}>
                  {lists.map(list => (
                    <TouchableOpacity
                      key={list.id}
                      style={[
                        styles.listOption,
                        selectedListId === list.id && styles.selectedListOption
                      ]}
                      onPress={() => setSelectedListId(list.id)}
                      activeOpacity={0.7}
                    >
                      <Text 
                        style={[
                          styles.listOptionText,
                          selectedListId === list.id && styles.selectedListOptionText
                        ]}
                      >
                        {list.name}
                      </Text>
                      {selectedListId === list.id && (
                        <Check size={16} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  <TouchableOpacity
                    style={styles.createListOption}
                    onPress={() => router.push('/list/create')}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color={colors.primary} />
                    <Text style={styles.createListText}>Create New List</Text>
                  </TouchableOpacity>
                </View>
                
                <Button
                  title="Add to List"
                  onPress={handleAddToList}
                  style={styles.addButton}
                  disabled={!selectedListId || extractedWords.filter(w => w.selected).length === 0}
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  uploadCard: {
    padding: 24,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginVertical: 16,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  uploadButton: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
  },
  processingCard: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  processingText: {
    fontSize: 16,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  wordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedWordCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  wordContent: {
    flex: 1,
    marginRight: 12,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  definitionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  listsContainer: {
    marginBottom: 24,
  },
  listOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedListOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  listOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedListOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  createListOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    gap: 8,
  },
  createListText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 8,
  },
});