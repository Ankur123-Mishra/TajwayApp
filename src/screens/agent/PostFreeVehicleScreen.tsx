import React, {useState} from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
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

const VEHICLE_OPTIONS = [
  'Hatchback',
  'Sedan',
  'SUV',
  'Innova',
  'Ertiga',
  'Tempo',
  'Bus',
];

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

const formatDateTime = date => `${formatDate(date)}, ${formatTime(date)}`;

/**
 * Post Free Vehicle form (screenshot 5).
 */
const PostFreeVehicleScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [vehicleType, setVehicleType] = useState('Hatchback');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startValue, setStartValue] = useState(new Date());
  const [endValue, setEndValue] = useState(new Date());
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [pickAnyLocation, setPickAnyLocation] = useState(false);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeField, setActiveField] = useState('start');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [iosDraftDate, setIosDraftDate] = useState(new Date());
  const [pendingDate, setPendingDate] = useState(new Date());

  const getFieldValue = field => (field === 'start' ? startValue : endValue);

  const applyDateTime = (field, date) => {
    if (field === 'start') {
      setStartValue(date);
      setStartTime(formatDateTime(date));
    } else {
      setEndValue(date);
      setEndTime(formatDateTime(date));
    }
  };

  const openDateTimePicker = field => {
    const current = getFieldValue(field);
    setActiveField(field);
    setIosDraftDate(current);
    setPendingDate(current);
    setShowDatePicker(true);
  };

  const mergeDateKeepTime = (baseDate, selectedDate) => {
    const next = new Date(baseDate);
    next.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    return next;
  };

  const mergeTimeKeepDate = (baseDate, selectedTime) => {
    const next = new Date(baseDate);
    next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    return next;
  };

  const onAndroidDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }
    const merged = mergeDateKeepTime(getFieldValue(activeField), selectedDate);
    setPendingDate(merged);
    setTimeout(() => setShowTimePicker(true), 50);
  };

  const onAndroidTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === 'dismissed' || !selectedTime) {
      return;
    }
    const merged = mergeTimeKeepDate(pendingDate, selectedTime);
    applyDateTime(activeField, merged);
  };

  const confirmIosDate = () => {
    const merged = mergeDateKeepTime(getFieldValue(activeField), iosDraftDate);
    setPendingDate(merged);
    setShowDatePicker(false);
    setIosDraftDate(merged);
    setShowTimePicker(true);
  };

  const confirmIosTime = () => {
    const merged = mergeTimeKeepDate(pendingDate, iosDraftDate);
    applyDateTime(activeField, merged);
    setShowTimePicker(false);
  };

  const openLocationSelect = () => {
    navigation.navigate(ROUTES.LOCATION_SELECT, {
      onSelect: place => {
        setLocation(place);
      },
    });
  };

  const onSubmit = () => {
    navigation.goBack();
  };

  const datePickerTitle =
    activeField === 'start' ? 'Vehicle Start Date' : 'Vehicle End Date';
  const timePickerTitle =
    activeField === 'start' ? 'Vehicle Start Time' : 'Vehicle End Time';

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
          onPress={() => openDateTimePicker('start')}
          icon="calendar-outline"
        />

        <PostFormField
          label="Vehicle Free End Time"
          placeholder="Date & time"
          value={endTime}
          onPress={() => openDateTimePicker('end')}
          icon="calendar-outline"
        />

        <PostFormField
          label="Vehicle Location"
          placeholder="Location"
          value={location}
          onPress={openLocationSelect}
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
              <Ionicons name="checkmark" size={14} color={Colors.onPrimary} />
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

      {Platform.OS === 'android' && showDatePicker ? (
        <DateTimePicker
          value={getFieldValue(activeField)}
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
          value={pendingDate}
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
              style={[styles.dtSheet, {paddingBottom: insets.bottom + 12}]}>
              <View style={styles.dtHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.dtCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.dtTitle}>{datePickerTitle}</Text>
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
              style={[styles.dtSheet, {paddingBottom: insets.bottom + 12}]}>
              <View style={styles.dtHeader}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={styles.dtCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.dtTitle}>{timePickerTitle}</Text>
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

export default PostFreeVehicleScreen;
