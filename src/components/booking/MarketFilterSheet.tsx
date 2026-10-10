import React, {useEffect, useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors, Spacing, Typography} from '../../theme';
import CitySelectModal from '../profile/CitySelectModal';
import {useResponsiveStyles} from '../../hooks';

const TRIP_TYPE_OPTIONS = ['Both', 'One Way', 'Round Trip'];

const VEHICLE_TYPE_OPTIONS = [
  'Hatchback',
  'Sedan',
  'SUV',
  'Innova',
  'Ertiga',
  'Tempo',
  'Bus',
];

const EMPTY_FILTERS = {
  tripType: 'Both',
  vehicleType: '',
  pickupLocation: '',
  dropLocation: '',
};

/**
 * Bottom sheet — Apply Filter (Market Home / My Bookings).
 */
const MarketFilterSheet = ({
  visible,
  onClose,
  initial = EMPTY_FILTERS,
  onSave,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const [tripType, setTripType] = useState(initial.tripType || 'Both');
  const [vehicleType, setVehicleType] = useState(initial.vehicleType || '');
  const [pickupLocation, setPickupLocation] = useState(
    initial.pickupLocation || '',
  );
  const [dropLocation, setDropLocation] = useState(initial.dropLocation || '');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerOptions, setPickerOptions] = useState([]);
  const [pickerOnSelect, setPickerOnSelect] = useState(null);
  const [cityField, setCityField] = useState(null);

  useEffect(() => {
    if (!visible) {
      setCityField(null);
      return;
    }
    setTripType(initial.tripType || 'Both');
    setVehicleType(initial.vehicleType || '');
    setPickupLocation(initial.pickupLocation || '');
    setDropLocation(initial.dropLocation || '');
    setCityField(null);
  }, [visible, initial]);

  const openPicker = (options, onSelect) => {
    setPickerOptions(options);
    setPickerOnSelect(() => onSelect);
    setPickerVisible(true);
  };

  const handleClear = () => {
    setTripType('Both');
    setVehicleType('');
    setPickupLocation('');
    setDropLocation('');
    onSave?.(EMPTY_FILTERS);
    onClose?.();
  };

  const handleSave = () => {
    onSave?.({
      tripType,
      vehicleType,
      pickupLocation: pickupLocation.trim(),
      dropLocation: dropLocation.trim(),
    });
    onClose?.();
  };

  const citySelected =
    cityField === 'pickup'
      ? pickupLocation
      : cityField === 'drop'
        ? dropLocation
        : '';

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.sheetTouch}>
            <View style={[styles.sheet, {paddingBottom: insets.bottom + 16}]}>
              <View style={styles.head}>
                <Text style={styles.title}>Apply Filter</Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                  accessibilityRole="button"
                  accessibilityLabel="Close">
                  <Ionicons name="close" size={22} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Select Trip Type</Text>
                <TouchableOpacity
                  style={styles.inputWrap}
                  activeOpacity={0.75}
                  onPress={() => openPicker(TRIP_TYPE_OPTIONS, setTripType)}>
                  <Text style={styles.value}>{tripType || 'Both'}</Text>
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={Colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Select Vehicle Type</Text>
                <TouchableOpacity
                  style={styles.inputWrap}
                  activeOpacity={0.75}
                  onPress={() =>
                    openPicker(VEHICLE_TYPE_OPTIONS, setVehicleType)
                  }>
                  <Text style={styles.value}>
                    {vehicleType || 'Select Vehicle Type'}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={Colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Pickup Location</Text>
                <TouchableOpacity
                  style={styles.inputWrap}
                  activeOpacity={0.75}
                  onPress={() => setCityField('pickup')}>
                  <Text style={styles.value}>{pickupLocation || 'Add'}</Text>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={ICON_MUTED}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Drop Location</Text>
                <TouchableOpacity
                  style={styles.inputWrap}
                  activeOpacity={0.75}
                  onPress={() => setCityField('drop')}>
                  <Text style={styles.value}>{dropLocation || 'Add'}</Text>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={ICON_MUTED}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.clearBtn]}
                  activeOpacity={0.85}
                  onPress={handleClear}>
                  <Text style={styles.clearLabel}>Clear Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.saveBtn]}
                  activeOpacity={0.85}
                  onPress={handleSave}>
                  <Text style={styles.saveLabel}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>

        <Modal
          visible={pickerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerVisible(false)}>
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
      </Modal>

      <CitySelectModal
        visible={!!cityField}
        selected={citySelected}
        onClose={() => setCityField(null)}
        onDone={city => {
          if (cityField === 'pickup') {
            setPickupLocation(city);
          } else if (cityField === 'drop') {
            setDropLocation(city);
          }
        }}
      />
    </>
  );
};

const LABEL_GRAY = '#8B929E';
const ICON_MUTED = '#8B929E';
const FIELD_BORDER = '#E6E8EC';

const baseStyles = {
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheetTouch: {
    width: '100%',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  head: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    minHeight: 28,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: Typography.fontWeights.medium,
    color: LABEL_GRAY,
    paddingVertical: 14,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
  },
  clearLabel: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  saveLabel: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.onPrimary,
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
    paddingVertical: 12,
    paddingBottom: 28,
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.screenPadding,
  },
  pickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
};

export default MarketFilterSheet;
export {EMPTY_FILTERS};
