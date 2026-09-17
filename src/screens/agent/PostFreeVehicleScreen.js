import React, {useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import PostFormField from '../../components/post/PostFormField';
import {Colors, Spacing} from '../../theme';

const VEHICLE_OPTIONS = [
  'Hatchback',
  'Sedan',
  'SUV',
  'Innova',
  'Ertiga',
  'Tempo',
  'Bus',
];

/**
 * Post Free Vehicle form (screenshot 5).
 */
const PostFreeVehicleScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [vehicleType, setVehicleType] = useState('Hatchback');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [pickAnyLocation, setPickAnyLocation] = useState(false);

  const [pickerVisible, setPickerVisible] = useState(false);

  const onSubmit = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Post Free Vehicle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <PostFormField
          label="Select Vehicle Type"
          value={vehicleType}
          onPress={() => setPickerVisible(true)}
          icon="chevron-down"
        />

        <PostFormField
          label="Vehicle Free Start Time"
          placeholder="Date & time"
          value={startTime}
          onPress={() => setStartTime('16 Sep 2026, 10:00 AM')}
          icon="calendar-outline"
        />

        <PostFormField
          label="Vehicle Free End Time"
          placeholder="Date & time"
          value={endTime}
          onPress={() => setEndTime('16 Sep 2026, 6:00 PM')}
          icon="calendar-outline"
        />

        <PostFormField
          label="Vehicle Location"
          placeholder="Location"
          value={location}
          onPress={() => setLocation('Noida')}
          icon="location-outline"
        />

        <View style={styles.field}>
          <Text style={styles.label}>Add details</Text>
          <View style={styles.textAreaWrap}>
            <TextInput
              value={details}
              onChangeText={setDetails}
              placeholder="More details about your free vehicle..."
              placeholderTextColor={Colors.textPlaceholder}
              multiline
              style={styles.textArea}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkRow}
          activeOpacity={0.8}
          onPress={() => setPickAnyLocation(v => !v)}>
          <View style={[styles.checkbox, pickAnyLocation && styles.checkboxOn]}>
            {pickAnyLocation ? (
              <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
            ) : null}
          </View>
          <Text style={styles.checkLabel}>
            Available to Pick booking from any location?
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <PrimaryButton title="Submit" onPress={onSubmit} />
      </View>

      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}>
          <View style={styles.pickerSheet}>
            {VEHICLE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={styles.pickerItem}
                onPress={() => {
                  setVehicleType(opt);
                  setPickerVisible(false);
                }}>
                <Text style={styles.pickerText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.base,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSlate,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 24,
  },
  field: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSlate,
    marginBottom: 8,
  },
  textAreaWrap: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    minHeight: 100,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  textArea: {
    fontSize: 15,
    color: Colors.textPrimary,
    minHeight: 72,
    textAlignVertical: 'top',
    padding: 0,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSlate,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    backgroundColor: Colors.backgroundAlt,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.screenPadding,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  pickerText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
});

export default PostFreeVehicleScreen;
