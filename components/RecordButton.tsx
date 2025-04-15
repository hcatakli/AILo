import React, { useState, useEffect } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View, 
  Text,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Mic, Video, Square, Pause } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useJournalStore } from '@/store/journal-store';

interface RecordButtonProps {
  type: 'audio' | 'video';
  size?: 'small' | 'medium' | 'large';
  onStartRecording?: () => Promise<void>;
  onStopRecording?: () => Promise<string | null>;
  onPauseRecording?: () => Promise<void>;
  onResumeRecording?: () => Promise<void>;
  disabled?: boolean;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
  type,
  size = 'medium',
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  disabled = false,
}) => {
  const [isPreparing, setIsPreparing] = useState(false);
  const { isRecording, setIsRecording, recordingDuration } = useJournalStore();
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer when recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, isPaused]);

  // Reset timer when recording stops
  useEffect(() => {
    if (!isRecording) {
      setElapsedTime(0);
    }
  }, [isRecording]);

  const handlePress = async () => {
    if (disabled) return;
    
    if (!isRecording) {
      try {
        setIsPreparing(true);
        await onStartRecording?.();
        setIsRecording(true);
        setIsPaused(false);
      } catch (error) {
        console.error('Failed to start recording:', error);
      } finally {
        setIsPreparing(false);
      }
    } else {
      try {
        setIsPreparing(true);
        await onStopRecording?.();
        setIsRecording(false);
        setIsPaused(false);
      } catch (error) {
        console.error('Failed to stop recording:', error);
      } finally {
        setIsPreparing(false);
      }
    }
  };

  const handlePauseResume = async () => {
    if (disabled || !isRecording) return;
    
    try {
      if (isPaused) {
        await onResumeRecording?.();
        setIsPaused(false);
      } else {
        await onPauseRecording?.();
        setIsPaused(true);
      }
    } catch (error) {
      console.error('Failed to pause/resume recording:', error);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small': return { width: 48, height: 48, iconSize: 20 };
      case 'large': return { width: 80, height: 80, iconSize: 32 };
      default: return { width: 64, height: 64, iconSize: 24 };
    }
  };

  const { width, height, iconSize } = getButtonSize();

  return (
    <View style={styles.container}>
      {isRecording && (
        <View style={styles.timerContainer}>
          <View style={[styles.recordingIndicator, isPaused && styles.pausedIndicator]} />
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        </View>
      )}
      
      <View style={styles.buttonRow}>
        {isRecording && (
          <TouchableOpacity
            style={[styles.controlButton, { width: width * 0.8, height: height * 0.8 }]}
            onPress={handlePauseResume}
            disabled={disabled || isPreparing}
          >
            {isPaused ? (
              <Mic size={iconSize * 0.8} color={colors.primary} />
            ) : (
              <Pause size={iconSize * 0.8} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording ? styles.stopButton : type === 'audio' ? styles.audioButton : styles.videoButton,
            { width, height },
            disabled && styles.disabledButton
          ]}
          onPress={handlePress}
          disabled={disabled || isPreparing}
        >
          {isPreparing ? (
            <ActivityIndicator color={isRecording ? colors.error : colors.white} size="small" />
          ) : isRecording ? (
            <Square size={iconSize} color={colors.white} />
          ) : type === 'audio' ? (
            <Mic size={iconSize} color={colors.white} />
          ) : (
            <Video size={iconSize} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  recordButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  audioButton: {
    backgroundColor: colors.primary,
  },
  videoButton: {
    backgroundColor: colors.secondary,
  },
  stopButton: {
    backgroundColor: colors.error,
  },
  controlButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    marginRight: 8,
  },
  pausedIndicator: {
    backgroundColor: colors.textSecondary,
  },
});