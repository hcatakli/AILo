import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Coffee, Utensils, ShoppingBag, Train, Building, Plus, Check } from 'lucide-react-native';
import * as Location from 'expo-location';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useWordListsStore } from '@/store/word-lists-store';
import { colors } from '@/constants/colors';

// Mock location-based vocabulary suggestions
const getLocationBasedWords = (locationType: string) => {
  const wordSets: {
    [key: string]: Array<{ word: string; definition: string }>
  } = {
    cafe: [
      { word: "espresso", definition: "Strong black coffee made by forcing steam through ground coffee beans" },
      { word: "barista", definition: "A person who makes and serves coffee in a coffee shop" },
      { word: "latte", definition: "Coffee made with espresso and steamed milk" },
      { word: "ambiance", definition: "The character and atmosphere of a place" },
    ],
    restaurant: [
      { word: "cuisine", definition: "A style or method of cooking, especially as characteristic of a particular country or region" },
      { word: "appetizer", definition: "A small dish of food served before the main course of a meal" },
      { word: "reservation", definition: "An arrangement to have something kept for someone" },
      { word: "sommelier", definition: "A wine steward in a restaurant" },
    ],
    shopping: [
      { word: "merchandise", definition: "Goods to be bought and sold" },
      { word: "discount", definition: "A deduction from the usual cost of something" },
      { word: "boutique", definition: "A small store selling fashionable clothes or accessories" },
      { word: "retail", definition: "The sale of goods to the public in relatively small quantities for use or consumption" },
    ],
    transit: [
      { word: "commute", definition: "Travel some distance between one's home and place of work on a regular basis" },
      { word: "fare", definition: "The money paid for a journey on public transport" },
      { word: "itinerary", definition: "A planned route or journey" },
      { word: "departure", definition: "The action of leaving, especially to start a journey" },
    ],
    office: [
      { word: "colleague", definition: "A person with whom one works in a profession or business" },
      { word: "deadline", definition: "The latest time or date by which something should be completed" },
      { word: "agenda", definition: "A list of items to be discussed at a formal meeting" },
      { word: "collaborate", definition: "Work jointly on an activity or project" },
    ],
    default: [
      { word: "vicinity", definition: "The area near or surrounding a particular place" },
      { word: "landmark", definition: "An object or feature that is easily recognized and helps mark a location" },
      { word: "navigate", definition: "Plan and direct the route or course of a ship, aircraft, or other form of transport" },
      { word: "destination", definition: "A place to which someone or something is going or being sent" },
    ],
  };
  
  return (wordSets[locationType] || wordSets.default).map(item => ({
    ...item,
    selected: false,
  }));
};

export default function ContextualLearningScreen() {
  const router = useRouter();
  const { lists } = useWordListsStore();
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationType, setLocationType] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedWords, setSuggestedWords] = useState<Array<{ word: string; definition: string; selected: boolean }>>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        // Skip location request on web
        setIsLoading(false);
        setSuggestedWords(getLocationBasedWords('default'));
        return;
      }
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is needed for contextual learning');
        setIsLoading(false);
        setSuggestedWords(getLocationBasedWords('default'));
        return;
      }
      
      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        // In a real app, we would use the coordinates to determine the location type
        // For demo purposes, we'll just use a random location type
        const locationTypes = ['cafe', 'restaurant', 'shopping', 'transit', 'office'];
        const randomType = locationTypes[Math.floor(Math.random() * locationTypes.length)];
        setLocationType(randomType);
        
        setSuggestedWords(getLocationBasedWords(randomType));
      } catch (error) {
        console.error('Error getting location:', error);
        setSuggestedWords(getLocationBasedWords('default'));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  
  const getLocationIcon = () => {
    switch (locationType) {
      case 'cafe':
        return <Coffee size={24} color={colors.white} />;
      case 'restaurant':
        return <Utensils size={24} color={colors.white} />;
      case 'shopping':
        return <ShoppingBag size={24} color={colors.white} />;
      case 'transit':
        return <Train size={24} color={colors.white} />;
      case 'office':
        return <Building size={24} color={colors.white} />;
      default:
        return <MapPin size={24} color={colors.white} />;
    }
  };
  
  const getLocationName = () => {
    switch (locationType) {
      case 'cafe':
        return 'Coffee Shop';
      case 'restaurant':
        return 'Restaurant';
      case 'shopping':
        return 'Shopping Mall';
      case 'transit':
        return 'Transit Station';
      case 'office':
        return 'Office Building';
      default:
        return 'Current Location';
    }
  };
  
  const toggleWordSelection = (index: number) => {
    const updatedWords = [...suggestedWords];
    updatedWords[index].selected = !updatedWords[index].selected;
    setSuggestedWords(updatedWords);
  };
  
  const handleAddToList = () => {
    if (!selectedListId) {
      Alert.alert('Select List', 'Please select a list to add words to');
      return;
    }
    
    const selectedWords = suggestedWords.filter(w => w.selected);
    
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
  
  if (isLoading) {
    return <LoadingIndicator fullScreen message="Finding location-based vocabulary..." />;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Contextual Learning" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Discover vocabulary relevant to your current location
        </Text>
        
        <Card style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationIconContainer}>
              {getLocationIcon()}
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationType}>{getLocationName()}</Text>
              <Text style={styles.locationHint}>
                We've found vocabulary relevant to this location
              </Text>
            </View>
          </View>
          
          {Platform.OS !== 'web' && location && (
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => {
                // In a real app, this would open a map
                Alert.alert('Map View', 'Map functionality would be implemented here');
              }}
            >
              <Navigation size={16} color={colors.primary} />
              <Text style={styles.mapButtonText}>View on Map</Text>
            </TouchableOpacity>
          )}
        </Card>
        
        <Text style={styles.sectionTitle}>Suggested Words</Text>
        <Text style={styles.sectionSubtitle}>
          Select words you want to learn based on your location
        </Text>
        
        {suggestedWords.map((item, index) => (
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
          disabled={!selectedListId || suggestedWords.filter(w => w.selected).length === 0}
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
  locationCard: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationType: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationHint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
  },
  mapButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    marginTop: 8,
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