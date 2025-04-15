import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Share,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Heart, 
  Edit, 
  Trash2, 
  Share2, 
  Tag, 
  Clock, 
  ArrowLeft,
  MoreVertical
} from 'lucide-react-native';
import { MediaPlayer } from '@/components/MediaPlayer';
import { Button } from '@/components/Button';
import { useJournalStore } from '@/store/journal-store';
import { colors } from '@/constants/colors';

export default function JournalEntryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getEntryById, toggleFavorite, deleteEntry } = useJournalStore();
  const [showOptions, setShowOptions] = useState(false);
  
  // Get the journal entry
  const entry = getEntryById(id as string);
  
  // If entry doesn't exist, show error
  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Entry Not Found',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Entry Not Found</Text>
          <Text style={styles.errorMessage}>
            The journal entry you're looking for doesn't exist or has been deleted.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle share
  const handleShare = async () => {
    try {
      await Share.share({
        title: entry.title,
        message: `${entry.title}\n\n${entry.description || ''}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEntry(entry.id);
            router.replace('/journal');
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: entry.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => toggleFavorite(entry.id)}
              >
                <Heart 
                  size={24} 
                  color={entry.isFavorite ? colors.error : colors.text} 
                  fill={entry.isFavorite ? colors.error : 'transparent'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowOptions(!showOptions)}
              >
                <MoreVertical size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      {showOptions && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              setShowOptions(false);
              router.push(`/journal/edit/${entry.id}`);
            }}
          >
            <Edit size={20} color={colors.text} />
            <Text style={styles.optionText}>Edit Entry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              setShowOptions(false);
              handleShare();
            }}
          >
            <Share2 size={20} color={colors.text} />
            <Text style={styles.optionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              setShowOptions(false);
              handleDelete();
            }}
          >
            <Trash2 size={20} color={colors.error} />
            <Text style={[styles.optionText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{formatDate(entry.createdAt)}</Text>
          </View>
          
          {entry.tags && entry.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Tag size={16} color={colors.textSecondary} />
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsScroll}
              >
                {entry.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        {/* Media player for audio/video */}
        {(entry.mediaType === 'audio' || entry.mediaType === 'video') && entry.mediaUri && (
          <View style={styles.mediaContainer}>
            <MediaPlayer
              uri={entry.mediaUri}
              type={entry.mediaType}
              title={entry.title}
              autoPlay={false}
              showControls={true}
            />
          </View>
        )}
        
        {/* Description/content */}
        {(entry.description || entry.textContent) && (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>
              {entry.textContent || entry.description}
            </Text>
          </View>
        )}
        
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Edit"
            onPress={() => router.push(`/journal/edit/${entry.id}`)}
            leftIcon={<Edit size={18} color={colors.white} />}
            style={styles.editButton}
          />
          
          <Button
            title="Share"
            onPress={handleShare}
            leftIcon={<Share2 size={18} color={colors.white} />}
            variant="secondary"
            style={styles.shareButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  metaInfo: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.card,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: colors.text,
  },
  mediaContainer: {
    marginBottom: 20,
  },
  contentContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  shareButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    minWidth: 200,
  },
});