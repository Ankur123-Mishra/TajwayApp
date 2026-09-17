import React, {useMemo, useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors, Dimensions, Spacing} from '../../theme';

const TOTAL_STEPS = 3;

const carInnova = require('../../assets/images/car_innova.png');

const VEHICLE_OPTIONS = [
  {id: 'hatchback', label: 'Hatchback', image: carInnova},
  {id: 'sedan', label: 'Sedan', image: carInnova},
  {id: 'ertiga', label: 'Ertiga', image: carInnova},
  {id: 'suv', label: 'SUV', image: carInnova},
  {id: 'innova', label: 'INNOVA', image: carInnova},
  {id: 'innova_crysta', label: 'INNOVA CRYSTA', image: carInnova},
  {id: 'force', label: 'FORCE Traveller', image: carInnova},
  {id: 'bus', label: 'Bus', image: carInnova},
];

const STATE_CHIPS = [
  {id: 'all_india', label: 'All India'},
  {id: 'delhi', label: 'Delhi'},
  {id: 'rajasthan', label: 'Rajasthan'},
];

const MORE_STATES = [
  'Uttarakhand',
  'Haryana',
  'Uttar Pradesh',
  'Punjab',
  'Gujarat',
  'Maharashtra',
];

const ProgressBar = ({step}) => (
  <View style={styles.progressRow}>
    {Array.from({length: TOTAL_STEPS}).map((_, index) => (
      <View
        key={index}
        style={[
          styles.progressSeg,
          index <= step ? styles.progressSegOn : styles.progressSegOff,
        ]}
      />
    ))}
  </View>
);

const SearchField = ({
  placeholder,
  value,
  onChangeText,
  style,
  editable = true,
}) => (
  <View style={[styles.searchField, style]}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textPlaceholder}
      style={styles.searchInput}
      editable={editable}
    />
    <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
  </View>
);

/**
 * Route Alert Setup — 3-step wizard opened from Market Alerts switch.
 */
const RouteAlertSetupScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);

  const allVehicleIds = useMemo(
    () => VEHICLE_OPTIONS.map(v => v.id),
    [],
  );
  const [selectedVehicles, setSelectedVehicles] = useState(allVehicleIds);

  const [allOneWayAlerts, setAllOneWayAlerts] = useState(true);
  const [selectedStates, setSelectedStates] = useState(['delhi']);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [oneWayPickupOnly, setOneWayPickupOnly] = useState('');
  const [moreStatesVisible, setMoreStatesVisible] = useState(false);

  const [allRoundTripAlerts, setAllRoundTripAlerts] = useState(true);
  const [pickupCities, setPickupCities] = useState('');

  const finishSetup = () => {
    navigation.goBack();
  };

  const handleBack = () => {
    if (step === 0) {
      finishSetup();
      return;
    }
    setStep(prev => prev - 1);
  };

  const handleSkip = () => {
    finishSetup();
  };

  const handleContinue = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(prev => prev + 1);
      return;
    }
    finishSetup();
  };

  const toggleVehicle = id => {
    setSelectedVehicles(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
    );
  };

  const clearStepSelection = () => {
    if (step === 0) {
      setSelectedVehicles([]);
      return;
    }
    if (step === 1) {
      setAllOneWayAlerts(false);
      setSelectedStates([]);
      setPickupLocation('');
      setDropLocation('');
      setOneWayPickupOnly('');
      return;
    }
    setAllRoundTripAlerts(false);
    setPickupCities('');
  };

  const toggleState = id => {
    if (id === 'all_india') {
      setSelectedStates(prev =>
        prev.includes('all_india') ? [] : ['all_india'],
      );
      return;
    }
    setSelectedStates(prev => {
      const withoutAll = prev.filter(s => s !== 'all_india');
      if (withoutAll.includes(id)) {
        return withoutAll.filter(s => s !== id);
      }
      return [...withoutAll, id];
    });
  };

  const toggleMoreState = name => {
    setSelectedStates(prev => {
      const withoutAll = prev.filter(s => s !== 'all_india');
      if (withoutAll.includes(name)) {
        return withoutAll.filter(s => s !== name);
      }
      return [...withoutAll, name];
    });
  };

  const renderHeader = () => (
    <View style={[styles.header, {paddingTop: insets.top + 6}]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={handleBack}
          activeOpacity={0.85}
          accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Alert Setup</Text>
        <TouchableOpacity onPress={handleSkip} hitSlop={8} activeOpacity={0.85}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <ProgressBar step={step} />
    </View>
  );

  const renderFooter = () => (
    <View
      style={[
        styles.footer,
        {paddingBottom: Math.max(insets.bottom, 12)},
      ]}>
      <TouchableOpacity
        style={styles.clearBtn}
        onPress={clearStepSelection}
        activeOpacity={0.85}>
        <Text style={styles.clearText}>Clear Selection</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleContinue}
        activeOpacity={0.85}>
        <Text style={styles.continueText}>
          {step === TOTAL_STEPS - 1 ? 'Save' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderVehicleStep = () => (
    <ScrollView
      contentContainerStyle={styles.stepPad}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.question}>Which Vehicle do you drive?</Text>
      <Text style={styles.hint}>
        Only get notified for bookings that matter{'\n'}Uncheck types you don't
        drive.
      </Text>

      <View style={styles.vehicleGrid}>
        {VEHICLE_OPTIONS.map(item => {
          const selected = selectedVehicles.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.vehicleCard,
                selected ? styles.vehicleCardOn : styles.vehicleCardOff,
              ]}
              activeOpacity={0.9}
              onPress={() => toggleVehicle(item.id)}>
              <View
                style={[
                  styles.checkCircle,
                  selected ? styles.checkCircleOn : styles.checkCircleOff,
                ]}>
                {selected ? (
                  <Ionicons name="checkmark" size={12} color={Colors.primary} />
                ) : null}
              </View>
              <View style={styles.vehicleImageWrap}>
                <Image
                  source={item.image}
                  style={styles.vehicleImage}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={[
                  styles.vehicleLabel,
                  !selected && styles.vehicleLabelOff,
                ]}
                numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderOneWayStep = () => (
    <ScrollView
      contentContainerStyle={styles.stepPadAlt}
      showsVerticalScrollIndicator={false}>
      <View style={styles.alertCard}>
        <View style={styles.alertTextWrap}>
          <Text style={styles.alertTitle}>
            You will receive all one way alerts
          </Text>
          <Text style={styles.alertHintGreen}>
            Its suggested to keep it off and select preferred routes below
          </Text>
        </View>
        <Switch
          value={allOneWayAlerts}
          onValueChange={setAllOneWayAlerts}
          trackColor={{false: '#D0D0D0', true: Colors.primary}}
          thumbColor="#fff"
        />
      </View>

      <Text style={styles.redNote}>
        Select your preferred states from which you want to receive all one way
        notifications, to get notifications from around the country select 'All
        India'
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
        {STATE_CHIPS.map(chip => {
          const active = selectedStates.includes(chip.id);
          return (
            <TouchableOpacity
              key={chip.id}
              style={[styles.chip, active && styles.chipOn]}
              onPress={() => toggleState(chip.id)}
              activeOpacity={0.85}>
              <Text style={[styles.chipText, active && styles.chipTextOn]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={styles.chip}
          onPress={() => setMoreStatesVisible(true)}
          activeOpacity={0.85}>
          <Text style={styles.chipText}>More</Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={Colors.textSecondary}
            style={styles.chipIcon}
          />
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.sectionTitle}>Select your preferred one way routes</Text>
      <View style={styles.routeRow}>
        <SearchField
          placeholder="Pickup Location"
          value={pickupLocation}
          onChangeText={setPickupLocation}
          style={styles.routeHalf}
        />
        <SearchField
          placeholder="Drop To"
          value={dropLocation}
          onChangeText={setDropLocation}
          style={styles.routeHalf}
        />
      </View>

      <Text style={styles.sectionTitle}>
        Or select only a one way pickup location
      </Text>
      <Text style={styles.redNoteTight}>
        You will receive notification of all one way bookings from selected
        cities
      </Text>
      <SearchField
        placeholder="Pickup Location"
        value={oneWayPickupOnly}
        onChangeText={setOneWayPickupOnly}
      />
    </ScrollView>
  );

  const renderRoundTripStep = () => (
    <ScrollView
      contentContainerStyle={styles.stepPadAlt}
      showsVerticalScrollIndicator={false}>
      <View style={styles.alertCard}>
        <View style={styles.alertTextWrap}>
          <Text style={styles.alertTitle}>
            You will receive all round trip alerts
          </Text>
          <Text style={styles.alertHintRed}>
            Oneway notifications are disabled now
          </Text>
        </View>
        <Switch
          value={allRoundTripAlerts}
          onValueChange={setAllRoundTripAlerts}
          trackColor={{false: '#D0D0D0', true: Colors.primary}}
          thumbColor="#fff"
        />
      </View>

      <Text style={styles.sectionTitle}>Select your preferred pickup cities</Text>
      <SearchField
        placeholder="Select Pickup Cities"
        value={pickupCities}
        onChangeText={setPickupCities}
      />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.body}>
        {step === 0
          ? renderVehicleStep()
          : step === 1
            ? renderOneWayStep()
            : renderRoundTripStep()}
      </View>
      {renderFooter()}

      <Modal
        visible={moreStatesVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMoreStatesVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMoreStatesVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select more states</Text>
            {MORE_STATES.map(name => {
              const active = selectedStates.includes(name);
              return (
                <TouchableOpacity
                  key={name}
                  style={styles.modalRow}
                  onPress={() => toggleMoreState(name)}
                  activeOpacity={0.85}>
                  <Text style={styles.modalRowText}>{name}</Text>
                  <Ionicons
                    name={active ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={active ? Colors.primary : Colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.modalDone}
              onPress={() => setMoreStatesVisible(false)}
              activeOpacity={0.85}>
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerBack: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  skipText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    minWidth: 34,
    textAlign: 'right',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 5,
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressSegOn: {
    backgroundColor: '#FFFFFF',
  },
  progressSegOff: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  body: {
    flex: 1,
  },
  stepPad: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 18,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
  },
  stepPadAlt: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 24,
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textNavy,
    marginBottom: 6,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vehicleCard: {
    width: '47.5%',
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 6,
    marginBottom: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  vehicleCardOn: {
    backgroundColor: Colors.primary,
  },
  vehicleCardOff: {
    backgroundColor: '#FFE8B0',
  },
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleOn: {
    backgroundColor: '#fff',
  },
  checkCircleOff: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  vehicleImageWrap: {
    width: '100%',
    height: 54,
    marginTop: 10,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleLabel: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },
  vehicleLabelOff: {
    color: Colors.textNavy,
  },
  alertCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    ...Dimensions.shadow.soft,
  },
  alertTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  alertHintGreen: {
    fontSize: 12,
    lineHeight: 16,
    color: '#2E7D32',
  },
  alertHintRed: {
    fontSize: 12,
    lineHeight: 16,
    color: '#E57373',
  },
  redNote: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.filterRed,
    marginBottom: 12,
  },
  redNoteTight: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.filterRed,
    marginBottom: 10,
    marginTop: -4,
  },
  chipRow: {
    paddingBottom: 4,
    marginBottom: 18,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextOn: {
    color: '#fff',
  },
  chipIcon: {
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSlate,
    marginBottom: 10,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  routeHalf: {
    width: '48.5%',
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    height: 46,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    color: Colors.textPrimary,
    marginRight: 6,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    gap: 10,
  },
  clearBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  continueBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textNavy,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  modalRowText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  modalDone: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default RouteAlertSetupScreen;
