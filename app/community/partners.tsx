import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Globe, BookOpen, Users, ArrowDownUp } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCommunityStore } from '@/store/community-store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { UserCard } from '@/components/UserCard';
import { Card } from '@/components/Card';

export default function PartnersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  
  const { languagePartners, fetchPartners } = useCommunityStore();
  
  useEffect(() => {
    fetchPartners();
  }, []);
  
  const filteredPartners = languagePartners.filter(partner => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.nativeLanguage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.learningLanguage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Language filter
    const matchesLanguage = selectedLanguage === 'All' || 
      partner.learningLanguage === selectedLanguage ||
      partner.nativeLanguage === selectedLanguage;
    
    // Level filter
    const matchesLevel = selectedLevel === 'All' || 
      partner.proficiencyLevel === selectedLevel;
    
    return matchesSearch && matchesLanguage && matchesLevel;
  }).sort((a, b) => {
    if (sortBy === 'match') {
      return (b.matchPercentage || 0) - (a.matchPercentage || 0);
    } else if (sortBy === 'activity') {
      return a.lastActive?.localeCompare(b.lastActive || '') || 0;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
  
  const languages = ['All', 'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Russian', 'Italian', 'Portuguese'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Fluent'];
  
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Language Partners',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search by name, language, or interests"
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.textSecondary} />}
            style={styles.searchInput}
          />
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {showFilters && (
          <Card style={styles.filtersCard}>
            <Text style={styles.filterTitle}>Filter Partners</Text>
            
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <Globe size={16} color={colors.primary} />
                <Text style={styles.filterLabel}>Language</Text>
              </View>
              <View style={styles.filterOptions}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.filterOption,
                      selectedLanguage === language && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedLanguage(language)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedLanguage === language && styles.filterOptionTextSelected
                    ]}>
                      {language}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <BookOpen size={16} color={colors.primary} />
                <Text style={styles.filterLabel}>Proficiency Level</Text>
              </View>
              <View style={styles.filterOptions}>
                {levels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.filterOption,
                      selectedLevel === level && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedLevel(level)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedLevel === level && styles.filterOptionTextSelected
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <ArrowDownUp size={16} color={colors.primary} />
                <Text style={styles.filterLabel}>Sort By</Text>
              </View>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    sortBy === 'match' && styles.filterOptionSelected
                  ]}
                  onPress={() => setSortBy('match')}
                >
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === 'match' && styles.filterOptionTextSelected
                  ]}>
                    Best Match
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    sortBy === 'activity' && styles.filterOptionSelected
                  ]}
                  onPress={() => setSortBy('activity')}
                >
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === 'activity' && styles.filterOptionTextSelected
                  ]}>
                    Recent Activity
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    sortBy === 'name' && styles.filterOptionSelected
                  ]}
                  onPress={() => setSortBy('name')}
                >
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === 'name' && styles.filterOptionTextSelected
                  ]}>
                    Name
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.filterActions}>
              <Button
                title="Reset Filters"
                onPress={() => {
                  setSelectedLanguage('All');
                  setSelectedLevel('All');
                  setSortBy('match');
                }}
                variant="outline"
                style={styles.filterActionButton}
              />
              <Button
                title="Apply Filters"
                onPress={() => setShowFilters(false)}
                style={styles.filterActionButton}
              />
            </View>
          </Card>
        )}
        
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredPartners.length} {filteredPartners.length === 1 ? 'partner' : 'partners'} found
          </Text>
        </View>
        
        <FlatList
          data={filteredPartners}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onPress={() => router.push(`/community/profile/${item.id}`)}
              style={styles.partnerCard}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  filtersCard: {
    margin: 16,
    padding: 16,
    marginTop: 0,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterOptionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  filterActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  partnerCard: {
    width: '48%',
    marginHorizontal: 4,
    marginBottom: 16,
  },
});