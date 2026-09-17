import React, {useState} from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import PostFormField from '../../components/post/PostFormField';
import {ROUTES} from '../../constants/Routes';
import {Colors, Spacing} from '../../theme';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatDate = date => {
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatTime = date => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  const mins = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${mins} ${ampm}`;
};

const VEHICLE_OPTIONS = [
  'Hatchback',
  'Sedan',
  'SUV',
  'Innova',
  'Ertiga',
  'Tempo',
  'Bus',
];

const AMOUNT_OPTIONS = ['Enter booking amount', 'Quote Best Price'];

const EXTRA_REQUIREMENTS = [
  'Only Diesel',
  'With Carrier',
  'Inc Airport Parking',
  'Inc AC in plains',
  'All inclusive',
  'All exclusive',
];

const SegmentTabs = ({options, value, onChange}) => (
  <View style={styles.segment}>
    {options.map(opt => {
      const active = value === opt;
      return (
        <TouchableOpacity
          key={opt}
          style={[styles.segmentBtn, active && styles.segmentBtnOn]}
          activeOpacity={0.85}
          onPress={() => onChange(opt)}>
          <Text style={[styles.segmentText, active && styles.segmentTextOn]}>
            {opt}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

/**
 * Post a Booking — full form (screenshots 2–4).
 */
const PostBookingScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [tripType, setTripType] = useState('One Way');
  const [vehicleType, setVehicleType] = useState('Hatchback');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [iosDraftDate, setIosDraftDate] = useState(new Date());
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('0');
  const [tourDescription, setTourDescription] = useState('');
  const [amountType, setAmountType] = useState('Enter booking amount');
  const [totalAmount, setTotalAmount] = useState('0');
  const [negotiable, setNegotiable] = useState(false);
  const [commission, setCommission] = useState('0');
  const [visibility, setVisibility] = useState('Public');
  const [secureBooking, setSecureBooking] = useState(true);
  const [hideProfile, setHideProfile] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [otherDetails, setOtherDetails] = useState('');

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerOptions, setPickerOptions] = useState([]);
  const [pickerOnSelect, setPickerOnSelect] = useState(null);

  const openPicker = (options, onSelect) => {
    setPickerOptions(options);
    setPickerOnSelect(() => onSelect);
    setPickerVisible(true);
  };

  const toggleExtra = label => {
    setSelectedExtras(prev =>
      prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label],
    );
  };

  const openLocationSelect = field => {
    navigation.navigate(ROUTES.LOCATION_SELECT, {
      onSelect: place => {
        if (field === 'pickup') {
          setPickupLocation(place);
        } else {
          setDropLocation(place);
        }
      },
    });
  };

  const openDatePicker = () => {
    setIosDraftDate(dateValue);
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    setIosDraftDate(timeValue);
    setShowTimePicker(true);
  };

  const onAndroidDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }
    setDateValue(selectedDate);
    setPickupDate(formatDate(selectedDate));
  };

  const onAndroidTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === 'dismissed' || !selectedTime) {
      return;
    }
    setTimeValue(selectedTime);
    setPickupTime(formatTime(selectedTime));
  };

  const confirmIosDate = () => {
    setDateValue(iosDraftDate);
    setPickupDate(formatDate(iosDraftDate));
    setShowDatePicker(false);
  };

  const confirmIosTime = () => {
    setTimeValue(iosDraftDate);
    setPickupTime(formatTime(iosDraftDate));
    setShowTimePicker(false);
  };

  const onPost = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Post a Booking</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <SegmentTabs
          options={['One Way', 'Round Trip']}
          value={tripType}
          onChange={setTripType}
        />

        <PostFormField
          label="Select Vehicle Type"
          value={vehicleType}
          onPress={() =>
            openPicker(VEHICLE_OPTIONS, v => setVehicleType(v))
          }
          icon="chevron-down"
        />

        <PostFormField
          label="Pick Up Date"
          placeholder="Set date"
          value={pickupDate}
          onPress={openDatePicker}
          icon="calendar-outline"
        />

        <PostFormField
          label="Pick Up Time"
          placeholder="Set time"
          value={pickupTime}
          onPress={openTimePicker}
          icon="time-outline"
        />

        <PostFormField
          label="Select Pickup Location"
          placeholder="Add"
          value={pickupLocation}
          onPress={() => openLocationSelect('pickup')}
          icon="location-outline"
        />

        {tripType === 'One Way' ? (
          <PostFormField
            label="Select Drop Location"
            placeholder="Add"
            value={dropLocation}
            onPress={() => openLocationSelect('drop')}
            icon="location-outline"
          />
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Enter Number of Days</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={numberOfDays}
                  onChangeText={setNumberOfDays}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.textPlaceholder}
                  style={styles.textInput}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Enter Tour Description</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={tourDescription}
                  onChangeText={setTourDescription}
                  placeholder="more details about your tour..."
                  placeholderTextColor={Colors.textPlaceholder}
                  multiline
                  style={[styles.textInput, styles.textArea]}
                />
              </View>
            </View>
          </>
        )}

        <PostFormField
          label="'Booking Amount' or 'Quote Best Price'?"
          value={amountType}
          onPress={() =>
            openPicker(AMOUNT_OPTIONS, v => setAmountType(v))
          }
          icon="chevron-down"
        />

        <View style={styles.field}>
          <Text style={styles.label}>Total Booking Amount</Text>
          <View style={styles.inputWrap}>
            <TextInput
              value={totalAmount}
              onChangeText={setTotalAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.textPlaceholder}
              style={styles.textInput}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkRow}
          activeOpacity={0.8}
          onPress={() => setNegotiable(v => !v)}>
          <View style={[styles.checkbox, negotiable && styles.checkboxOn]}>
            {negotiable ? (
              <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
            ) : null}
          </View>
          <Text style={styles.checkLabel}>Amount is negotiable</Text>
        </TouchableOpacity>

        <View style={styles.field}>
          <Text style={styles.label}>Enter Commission</Text>
          <View style={styles.inputWrap}>
            <TextInput
              value={commission}
              onChangeText={setCommission}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.textPlaceholder}
              style={styles.textInput}
            />
          </View>
          <Text style={styles.hint}>
            If there is no commission please enter amount as 0
          </Text>
        </View>

        <Text style={styles.label}>Post Visibility</Text>
        <SegmentTabs
          options={['Public', 'My Network']}
          value={visibility}
          onChange={setVisibility}
        />

        <View style={styles.secureCard}>
          <View style={styles.secureHead}>
            <View style={styles.secureTextWrap}>
              <Text style={styles.secureTitle}>Secure this booking</Text>
              <Text style={styles.secureSub}>
                Receiver pays a commission amount in advance.
              </Text>
            </View>
            <Switch
              value={secureBooking}
              onValueChange={setSecureBooking}
              trackColor={{false: Colors.border, true: Colors.primary}}
              thumbColor={Colors.surface}
            />
          </View>
          {secureBooking ? (
            <Text style={styles.secureDesc}>
              Bache payment frauds aur pickup cancellation se aaj hi istemaal
              kare payment security feature aur drivers se apna commission
              advance mai prapt karein
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.checkRow, !secureBooking && styles.checkRowDisabled]}
          activeOpacity={secureBooking ? 0.8 : 1}
          onPress={() => secureBooking && setHideProfile(v => !v)}>
          <View
            style={[
              styles.checkbox,
              hideProfile && secureBooking && styles.checkboxOn,
              !secureBooking && styles.checkboxDisabled,
            ]}>
            {hideProfile && secureBooking ? (
              <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
            ) : null}
          </View>
          <Text
            style={[
              styles.checkLabel,
              !secureBooking && styles.checkLabelDisabled,
            ]}>
            Hide my profile - feature only available for secure booking (Your
            profile photo and name will remain hidden and will be visible to
            driver only when booking is assigned)
          </Text>
        </TouchableOpacity>

        <Text style={[styles.label, styles.sectionTitle]}>Extra Requirements</Text>
        <View style={styles.chipGrid}>
          {EXTRA_REQUIREMENTS.map(item => {
            const active = selectedExtras.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, active && styles.chipOn]}
                activeOpacity={0.85}
                onPress={() => toggleExtra(item)}>
                <Text style={[styles.chipText, active && styles.chipTextOn]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.field}>
          <View style={styles.inputWrap}>
            <TextInput
              value={otherDetails}
              onChangeText={t => t.length <= 150 && setOtherDetails(t)}
              placeholder="Others..."
              placeholderTextColor={Colors.textPlaceholder}
              multiline
              style={[styles.textInput, styles.textArea]}
            />
          </View>
          <Text style={styles.charCount}>{otherDetails.length}/150</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <PrimaryButton title="Post Booking" onPress={onPost} />
      </View>

      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}>
          <View style={styles.pickerSheet}>
            {pickerOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={styles.pickerItem}
                onPress={() => {
                  pickerOnSelect?.(opt);
                  setPickerVisible(false);
                }}>
                <Text style={styles.pickerText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {Platform.OS === 'android' && showDatePicker ? (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={onAndroidDateChange}
          positiveButton={{label: 'OK', textColor: Colors.primary}}
          negativeButton={{label: 'Cancel', textColor: Colors.primary}}
        />
      ) : null}

      {Platform.OS === 'android' && showTimePicker ? (
        <DateTimePicker
          value={timeValue}
          mode="time"
          display="default"
          is24Hour={false}
          onChange={onAndroidTimeChange}
          positiveButton={{label: 'OK', textColor: Colors.primary}}
          negativeButton={{label: 'Cancel', textColor: Colors.primary}}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.dtOverlay}>
            <TouchableOpacity
              style={styles.dtBackdrop}
              activeOpacity={1}
              onPress={() => setShowDatePicker(false)}
            />
            <View
              style={[
                styles.dtSheet,
                {paddingBottom: insets.bottom + 12},
              ]}>
              <View style={styles.dtHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.dtCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.dtTitle}>Pick Up Date</Text>
                <TouchableOpacity onPress={confirmIosDate}>
                  <Text style={styles.dtDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={iosDraftDate}
                mode="date"
                display="spinner"
                themeVariant="light"
                textColor={Colors.primary}
                accentColor={Colors.primary}
                minimumDate={new Date()}
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    setIosDraftDate(selectedDate);
                  }
                }}
                style={styles.dtSpinner}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}>
          <View style={styles.dtOverlay}>
            <TouchableOpacity
              style={styles.dtBackdrop}
              activeOpacity={1}
              onPress={() => setShowTimePicker(false)}
            />
            <View
              style={[
                styles.dtSheet,
                {paddingBottom: insets.bottom + 12},
              ]}>
              <View style={styles.dtHeader}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={styles.dtCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.dtTitle}>Pick Up Time</Text>
                <TouchableOpacity onPress={confirmIosTime}>
                  <Text style={styles.dtDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={iosDraftDate}
                mode="time"
                display="spinner"
                themeVariant="light"
                textColor={Colors.primary}
                accentColor={Colors.primary}
                onChange={(_, selectedTime) => {
                  if (selectedTime) {
                    setIosDraftDate(selectedTime);
                  }
                }}
                style={styles.dtSpinner}
              />
            </View>
          </View>
        </Modal>
      ) : null}
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
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  segmentBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnOn: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  segmentTextOn: {
    color: Colors.textInverse,
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
  inputWrap: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  textInput: {
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  checkRowDisabled: {
    opacity: 0.45,
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
    marginTop: 2,
  },
  checkboxOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxDisabled: {
    borderColor: Colors.border,
  },
  checkLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSlate,
    lineHeight: 20,
  },
  checkLabelDisabled: {
    color: Colors.textMuted,
  },
  secureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
  },
  secureHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secureTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  secureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textNavy,
    marginBottom: 4,
  },
  secureSub: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '500',
  },
  secureDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 10,
    lineHeight: 18,
  },
  sectionTitle: {
    marginTop: 4,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.base,
  },
  chip: {
    width: '47%',
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  chipOn: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSlate,
    textAlign: 'center',
  },
  chipTextOn: {
    color: Colors.textNavy,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
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
  dtOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.overlay,
  },
  dtBackdrop: {
    flex: 1,
  },
  dtSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
  },
  dtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 8,
  },
  dtTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textNavy,
  },
  dtCancel: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  dtDone: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '700',
  },
  dtSpinner: {
    alignSelf: 'center',
    width: '100%',
  },
});

export default PostBookingScreen;
