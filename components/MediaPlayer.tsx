import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MediaType } from '@/types/journal';

interface MediaPlayerProps {
  uri: string;
  type: MediaType;
  title?: string;
  onError?: (error: any) => void;
  autoPlay?: boolean;
  showControls?: boolean;
  style?: any;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  uri,
  type,
  title,
  onError,
  autoPlay = false,
  showControls = true,
  style
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For web compatibility
  const isWeb = Platform.OS === 'web';
  
  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Toggle play/pause
  const togglePlayback = () => {
    if (isWeb) {
      // Web implementation would go here
      console.log('Toggle playback on web');
      setIsPlaying(!isPlaying);
      return;
    }
    
    setIsPlaying(!isPlaying);
    // In a real implementation, we would control the actual media playback here
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, we would control the actual media volume here
  };
  
  // Seek forward 10 seconds
  const seekForward = () => {
    const newPosition = Math.min(position + 10, duration);
    setPosition(newPosition);
    // In a real implementation, we would seek the actual media here
  };
  
  // Seek backward 10 seconds
  const seekBackward = () => {
    const newPosition = Math.max(position - 10, 0);
    setPosition(newPosition);
    // In a real implementation, we would seek the actual media here
  };
  
  // Simulate loading and playback for demo purposes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Simulate loading
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      setDuration(type === 'audio' ? 120 : 180); // Simulate 2 or 3 minute duration
      
      if (autoPlay) {
        setIsPlaying(true);
      }
    }, 1500);
    
    // Simulate playback progress
    if (isPlaying && !isLoading) {
      interval = setInterval(() => {
        setPosition(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      clearTimeout(loadingTimeout);
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isLoading, duration, autoPlay]);
  
  // If there's an error, show error state
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Text style={styles.errorText}>Failed to load media</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }
  
  // If it's loading, show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading media...</Text>
      </View>
    );
  }
  
  // For web, we'll show a simplified player
  if (isWeb && type === 'video') {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.webNotice}>
          Video playback is available in the mobile app
        </Text>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      {/* Media display area - in a real implementation, this would be the actual media player */}
      <View 
        style={[
          styles.mediaContainer,
          type === 'audio' ? styles.audioContainer : styles.videoContainer
        ]}
      >
        {type === 'audio' ? (
          <View style={styles.audioVisualizer}>
            {/* Audio waveform visualization (simplified) */}
            {Array.from({ length: 20 }).map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.visualizerBar,
                  { 
                    height: Math.random() * 40 + 10,
                    opacity: isPlaying ? 1 : 0.5
                  }
                ]} 
              />
            ))}
          </View>
        ) : (
          <View style={styles.videoPlaceholder}>
            {/* This would be replaced with actual video in a real implementation */}
            <Text style={styles.videoPlaceholderText}>
              {isPlaying ? 'Playing video...' : 'Video paused'}
            </Text>
          </View>
        )}
      </View>
      
      {title && <Text style={styles.title}>{title}</Text>}
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground} />
          <View 
            style={[
              styles.progressFill,
              { width: `${(position / duration) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      
      {/* Controls */}
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
            {isMuted ? (
              <VolumeX size={20} color={colors.text} />
            ) : (
              <Volume2 size={20} color={colors.text} />
            )}
          </TouchableOpacity>
          
          <View style={styles.mainControls}>
            <TouchableOpacity style={styles.controlButton} onPress={seekBackward}>
              <SkipBack size={24} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
              {isPlaying ? (
                <Pause size={24} color={colors.white} />
              ) : (
                <Play size={24} color={colors.white} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={seekForward}>
              <SkipForward size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Placeholder for additional controls */}
          <View style={styles.controlButton} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
    padding: 16,
  },
  mediaContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  audioContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    width: 40,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    marginHorizontal: 8,
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  audioVisualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    gap: 3,
  },
  visualizerBar: {
    width: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: colors.white,
    fontSize: 16,
  },
  webNotice: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
});