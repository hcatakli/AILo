import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Mic, Video, FileText, Heart, Clock, Tag, MoreVertical } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { JournalEntry } from '@/types/journal';

interface JournalCardProps {
  entry: JournalEntry;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onOptionsPress?: () => void;
  compact?: boolean;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  entry,
  onPress,
  onFavoritePress,
  onOptionsPress,
  compact = false,
}) => {
  const { title, description, mediaType, createdAt, isFavorite, tags } = entry;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get icon based on media type
  const getMediaIcon = () => {
    switch (mediaType) {
      case 'audio':
        return <Mic size={compact ? 16 : 20} color={colors.primary} />;
      case 'video':
        return <Video size={compact ? 16 : 20} color={colors.secondary} />;
      case 'text':
      default:
        return <FileText size={compact ? 16 : 20} color={colors.textSecondary} />;
    }
  };
  
  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.compactIconContainer}>
          {getMediaIcon()}
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{title}</Text>
          <View style={styles.compactMeta}>
            <Clock size={12} color={colors.textSecondary} />
            <Text style={styles.compactMetaText}>{formatDate(createdAt)}</Text>
          </View>
        </View>
        {isFavorite && (
          <Heart size={16} color={colors.error} fill={colors.error} />
        )}
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.mediaTypeContainer}>
          {getMediaIcon()}
          <Text style={styles.mediaTypeText}>
            {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onFavoritePress}
          >
            <Heart 
              size={20} 
              color={isFavorite ? colors.error : colors.textSecondary} 
              fill={isFavorite ? colors.error : 'transparent'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onOptionsPress}
          >
            <MoreVertical size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
      
      {mediaType === 'video' && entry.mediaUri && (
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: entry.mediaUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Video size={20} color={colors.white} />
            </View>
          </View>
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>{formatDate(createdAt)}</Text>
        </View>
        
        {tags && tags.length > 0 && (
          <View style={styles.metaInfo}>
            <Tag size={16} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {tags.slice(0, 2).join(', ')}
              {tags.length > 2 ? ` +${tags.length - 2}` : ''}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mediaTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  thumbnailContainer: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  compactIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});