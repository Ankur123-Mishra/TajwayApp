import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors, Spacing, Typography} from '../../theme';

const TRIP_TYPES = ['One Way', 'Round Trip'];

const VEHICLE_TYPES = [
  'Hatchback',
  'Sedan',
  'Ertiga',
  'SUV',
  'INNOVA',
  'INNOVA CRYSTA',
  'FORCE Traveller',
  'Bus',
];

const EMPTY_FORM = {
  name: '',
  phone: '',
  company: '',
  tripType: '',
  vehicleType: '',
};

const RadioOption = ({label, selected, onPress}) => (
  <TouchableOpacity
    style={styles.radioItem}
    activeOpacity={0.8}
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{selected}}>
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected ? <View style={styles.radioInner} /> : null}
    </View>
    <Text style={styles.radioLabel} numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);

/**
 * Bottom sheet to add a network contact — matches Add Network Contacts screenshot.
 */
const AddNetworkContactModal = ({visible, onClose, onAdd}) => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (visible) {
      setForm(EMPTY_FORM);
    }
  }, [visible]);

  const updateField = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const handleAdd = () => {
    const name = form.name.trim();
    const phone = form.phone.trim();
    const company = form.company.trim();

    if (!name && !phone) {
      return;
    }

    onAdd?.({
      name,
      phone,
      company,
      tripType: form.tripType,
      vehicleType: form.vehicleType,
    });
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={[styles.sheet, {paddingBottom: insets.bottom + 16}]}>
            <Text style={styles.title}>Add Network Contacts</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}>
              <Text style={styles.label}>Enter Contact Name</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={form.name}
                  onChangeText={value => updateField('name', value)}
                  placeholder="Enter Contact Name"
                  placeholderTextColor={Colors.textPlaceholder}
                  style={styles.input}
                  autoCorrect={false}
                />
                <Ionicons name="person" size={20} color={Colors.primary} />
              </View>

              <Text style={styles.label}>Contact Number</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={form.phone}
                  onChangeText={value => updateField('phone', value)}
                  placeholder="Contact Number"
                  placeholderTextColor={Colors.textPlaceholder}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>

              <Text style={styles.label}>Company Name</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={form.company}
                  onChangeText={value => updateField('company', value)}
                  placeholder="Company Name"
                  placeholderTextColor={Colors.textPlaceholder}
                  style={styles.input}
                  autoCorrect={false}
                />
              </View>

              <Text style={styles.label}>Select Trip Type</Text>
              <View style={styles.radioGrid}>
                {TRIP_TYPES.map(type => (
                  <RadioOption
                    key={type}
                    label={type}
                    selected={form.tripType === type}
                    onPress={() => updateField('tripType', type)}
                  />
                ))}
              </View>

              <Text style={styles.label}>Select Vehicle Type</Text>
              <View style={styles.radioGrid}>
                {VEHICLE_TYPES.map(type => (
                  <RadioOption
                    key={type}
                    label={type}
                    selected={form.vehicleType === type}
                    onPress={() => updateField('vehicleType', type)}
                  />
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.addBtn}
              activeOpacity={0.85}
              onPress={handleAdd}
              accessibilityRole="button"
              accessibilityLabel="Add network contact">
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.surfaceAlt,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xl,
    maxHeight: '94%',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingBottom: Spacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: 10,
    marginTop: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 28,
    height: 52,
    paddingHorizontal: 18,
    marginBottom: Spacing.base,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  radioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  radioItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 8,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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
  radioLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textSlate,
  },
  addBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  addBtnText: {
    fontSize: 17,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textInverse,
  },
});

export default AddNetworkContactModal;
