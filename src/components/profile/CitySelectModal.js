import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors, Spacing, Typography} from '../../theme';

export const CITIES = [
  'Abhaneri',
  'Abhayapuri',
  'Abiramam',
  'Abohar',
  'Abrama',
  'Abu',
  'Abu Road',
  'Achalpur',
  'Adilabad',
  'Agartala',
  'Agra',
  'Ahmedabad',
  'Ahmednagar',
  'Aizawl',
  'Ajmer',
  'Akola',
  'Aligarh',
  'Allahabad',
  'Alwar',
  'Ambala',
  'Amravati',
  'Amritsar',
  'Anand',
  'Anantapur',
  'Asansol',
  'Aurangabad',
  'Ayodhya',
  'Bangalore',
  'Bareilly',
  'Belgaum',
  'Bhopal',
  'Bhubaneswar',
  'Bikaner',
  'Chandigarh',
  'Chennai',
  'Coimbatore',
  'Cuttack',
  'Dehradun',
  'Delhi',
  'Dhanbad',
  'Durgapur',
  'Faridabad',
  'Gandhinagar',
  'Ghaziabad',
  'Goa',
  'Gorakhpur',
  'Gurgaon',
  'Guwahati',
  'Gwalior',
  'Haridwar',
  'Hisar',
  'Howrah',
  'Hubli',
  'Hyderabad',
  'Indore',
  'Jabalpur',
  'Jaipur',
  'Jalandhar',
  'Jammu',
  'Jamshedpur',
  'Jhansi',
  'Jodhpur',
  'Kanpur',
  'Kochi',
  'Kolhapur',
  'Kolkata',
  'Kota',
  'Kozhikode',
  'Lucknow',
  'Ludhiana',
  'Madurai',
  'Mangalore',
  'Meerut',
  'Mumbai',
  'Mysore',
  'Nagpur',
  'Nashik',
  'Noida',
  'Patna',
  'Puducherry',
  'Pune',
  'Raipur',
  'Rajkot',
  'Ranchi',
  'Rishikesh',
  'Salem',
  'Shimla',
  'Siliguri',
  'Srinagar',
  'Surat',
  'Thane',
  'Thiruvananthapuram',
  'Tiruchirappalli',
  'Udaipur',
  'Vadodara',
  'Varanasi',
  'Vellore',
  'Vijayawada',
  'Visakhapatnam',
  'Warangal',
];

/**
 * Bottom sheet to pick a city — matches Select City design.
 */
const CitySelectModal = ({visible, selected = '', onClose, onDone}) => {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(selected);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) {
      setDraft(selected);
      setQuery('');
    }
  }, [visible, selected]);

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return CITIES;
    }
    return CITIES.filter(city => city.toLowerCase().includes(q));
  }, [query]);

  const handleCancel = () => {
    onClose?.();
  };

  const handleDone = () => {
    if (draft) {
      onDone?.(draft);
    }
    onClose?.();
  };

  const renderItem = ({item, index}) => {
    const isSelected = draft === item;
    const isLast = index === filteredCities.length - 1;

    return (
      <View>
        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.75}
          onPress={() => setDraft(item)}
          accessibilityRole="radio"
          accessibilityState={{selected: isSelected}}>
          <View
            style={[
              styles.radioOuter,
              isSelected && styles.radioOuterSelected,
            ]}>
            {isSelected ? <View style={styles.radioInner} /> : null}
          </View>
          <Text style={styles.optionLabel}>{item}</Text>
        </TouchableOpacity>
        {!isLast ? <View style={styles.divider} /> : null}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        />
        <View style={[styles.sheet, {paddingBottom: insets.bottom + 16}]}>
          <Text style={styles.title}>Select City</Text>

          <View style={styles.searchWrap}>
            <Ionicons
              name="search"
              size={18}
              color={Colors.textPlaceholder}
              style={styles.searchIcon}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor={Colors.textPlaceholder}
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>

          <FlatList
            data={filteredCities}
            keyExtractor={item => item}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.emptyText}>No cities found</Text>
            }
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={handleCancel}
              activeOpacity={0.85}>
              <Text style={styles.actionText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.doneBtn]}
              onPress={handleDone}
              activeOpacity={0.85}>
              <Text style={[styles.actionText, styles.doneText]}>DONE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    height: '78%',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
    marginBottom: Spacing.base,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 999,
    height: 44,
    paddingHorizontal: 14,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textNavy,
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    fontSize: 14,
    color: Colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: Colors.secondary,
  },
  doneBtn: {
    backgroundColor: Colors.primary,
  },
  actionText: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textInverse,
    letterSpacing: 0.4,
  },
  doneText: {
    color: Colors.textInverse,
  },
});

export default CitySelectModal;
