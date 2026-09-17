import React, {useMemo, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors, Spacing} from '../../theme';

const POPULAR_LOCATIONS = [
  'Delhi',
  'New Delhi',
  'Nizammudin railway station Delhi',
  'New Delhi railway station',
  'T1 IGI Airport',
  'T2 IGI Airport',
  'Noida',
  'Ghaziabad',
  'Gurgaon',
  'Jaipur',
  'Dehradun',
  'Haridwar',
  'Rishikesh',
  'Agra',
  'Mathura',
  'Vrindhavan',
  'Lucknow',
  'Ayodhya',
  'Kanpur',
  'Varanasi',
  'Chandigarh',
];

/**
 * Location picker — search + popular pickup/drop cities (design match).
 */
const LocationSelectScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const onSelect = route.params?.onSelect;

  const trimmed = query.trim();
  const showSearchResults = trimmed.length > 3;

  const searchResults = useMemo(() => {
    if (!showSearchResults) {
      return [];
    }
    const q = trimmed.toLowerCase();
    return POPULAR_LOCATIONS.filter(place =>
      place.toLowerCase().includes(q),
    );
  }, [showSearchResults, trimmed]);

  const handleSelect = place => {
    onSelect?.(place);
    navigation.goBack();
  };

  const renderPopularGrid = () => (
    <View style={styles.grid}>
      {POPULAR_LOCATIONS.map(place => (
        <TouchableOpacity
          key={place}
          style={styles.placeChip}
          activeOpacity={0.85}
          onPress={() => handleSelect(place)}>
          <Text style={styles.placeChipText} numberOfLines={2}>
            {place}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.searchBar}>
        <TouchableOpacity
          style={styles.searchIconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Ionicons name="arrow-back" size={22} color={Colors.textSlate} />
        </TouchableOpacity>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search a place"
          placeholderTextColor={Colors.textPlaceholder}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
        />

        {query.length > 0 ? (
          <TouchableOpacity
            style={styles.searchIconBtn}
            onPress={() => setQuery('')}
            activeOpacity={0.7}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Ionicons name="close" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.searchIconBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Ionicons name="close" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.hint}>Type more than 3 character</Text>

      {showSearchResults ? (
        <FlatList
          data={searchResults}
          keyExtractor={item => item}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            {paddingBottom: insets.bottom + 24},
          ]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No places found</Text>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.resultRow}
              activeOpacity={0.8}
              onPress={() => handleSelect(item)}>
              <Ionicons
                name="location-outline"
                size={18}
                color={Colors.textMuted}
              />
              <Text style={styles.resultText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: insets.bottom + 24},
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>
            Directly select most popular pickup and drop cities
          </Text>
          {renderPopularGrid()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.screenPadding,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 48,
    paddingHorizontal: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  hint: {
    marginTop: 14,
    marginHorizontal: Spacing.screenPadding,
    fontSize: 13,
    color: Colors.textSlate,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textNavy,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  placeChip: {
    width: '48.5%',
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  placeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textNavy,
    textAlign: 'center',
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  resultText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textNavy,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    fontSize: 14,
    color: Colors.textMuted,
  },
});

export default LocationSelectScreen;
