import React, {useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BannerHeader from '../../components/common/BannerHeader';
import {Images} from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {Colors, Spacing} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const STEPS = ['Vehicle', 'One Way', 'Round Trip'];

const VEHICLES = [
  {id: 'hatchback', label: 'Hatchback'},
  {id: 'sedan', label: 'Sedan'},
  {id: 'suv', label: 'SUV'},
  {id: 'innova', label: 'Innova'},
  {id: 'innova_crysta', label: 'Innova Crysta'},
  {id: 'force', label: 'Force Traveller'},
  {id: 'bus', label: 'Bus'},
  {id: 'other', label: 'Other'},
];

const STATE_CHIPS = [
  {id: 'all_india', label: 'All India'},
  {id: 'delhi', label: 'Delhi'},
  {id: 'rajasthan', label: 'Rajasthan'},
  {id: 'haryana', label: 'Haryana'},
];

const MORE_STATES = [
  'Uttarakhand',
  'Uttar Pradesh',
  'Punjab',
  'Gujarat',
  'Maharashtra',
  'Himachal Pradesh',
  'Madhya Pradesh',
  'Bihar',
  'West Bengal',
  'Goa',
  'Karnataka',
  'Tamil Nadu',
];

const PICKUP_PIN = '#F0C43A';
const DROP_PIN = '#F2A7B0';

const Stepper = ({step, onStep, styles}) => (
  <View style={styles.stepperRow}>
    {STEPS.map((label, index) => {
      const active = index === step;
      return (
        <React.Fragment key={label}>
          <TouchableOpacity
            style={styles.stepNode}
            onPress={() => onStep(index)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={label}>
            <View style={[styles.stepCircle, active && styles.stepCircleOn]}>
              <Text style={[styles.stepNum, active && styles.stepNumOn]}>
                {index + 1}
              </Text>
            </View>
            <Text
              style={[styles.stepLabel, active && styles.stepLabelOn]}
              numberOfLines={1}>
              {label}
            </Text>
          </TouchableOpacity>
          {index < STEPS.length - 1 ? <View style={styles.stepLine} /> : null}
        </React.Fragment>
      );
    })}
  </View>
);

const CheckBadge = ({styles, style}) => (
  <View style={[styles.checkBadge, style]}>
    <Ionicons name="checkmark" size={11} color={Colors.onPrimary} />
  </View>
);

const LocationField = ({
  placeholder,
  value,
  pinColor,
  onPress,
  styles,
}) => (
  <TouchableOpacity
    style={styles.locationField}
    onPress={onPress}
    activeOpacity={0.85}>
    <Ionicons name="location" size={18} color={pinColor} />
    <Text
      style={[styles.locationText, !value && styles.locationPlaceholder]}
      numberOfLines={1}>
      {value || placeholder}
    </Text>
    <Ionicons name="search-outline" size={18} color="#C5CCD6" />
  </TouchableOpacity>
);

/**
 * Route Alert Setup — vehicle, one-way, then round trip.
 * Opened from the Market alerts switch.
 */
const RouteAlertSetupScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);

  const [selectedVehicle, setSelectedVehicle] = useState('suv');
  const [selectedStates, setSelectedStates] = useState(['all_india']);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [oneWayPickupOnly, setOneWayPickupOnly] = useState('');
  const [moreStatesVisible, setMoreStatesVisible] = useState(false);
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

  const handleContinue = () => {
    if (step < STEPS.length - 1) {
      setStep(prev => prev + 1);
      return;
    }
    finishSetup();
  };

  const clearStepSelection = () => {
    if (step === 0) {
      setSelectedVehicle(null);
      return;
    }
    if (step === 1) {
      setSelectedStates([]);
      setPickupLocation('');
      setDropLocation('');
      setOneWayPickupOnly('');
      return;
    }
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
      const withoutAll = prev.filter(item => item !== 'all_india');
      if (withoutAll.includes(id)) {
        return withoutAll.filter(item => item !== id);
      }
      return [...withoutAll, id];
    });
  };

  const extraStates = selectedStates.filter(
    id => !STATE_CHIPS.some(chip => chip.id === id),
  );

  const openLocation = onSelect => {
    navigation.navigate(ROUTES.LOCATION_SELECT, {onSelect});
  };

  const renderVehicleStep = () => (
    <View>
      <Text style={styles.question}>Which vehicle do you drive?</Text>
      <Text style={styles.hint}>
        Choose the vehicle type you want to receive route alerts for.
      </Text>
      <View style={styles.vehicleGrid}>
        {VEHICLES.map(item => {
          const selected = selectedVehicle === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.vehicleCard, selected && styles.vehicleCardOn]}
              activeOpacity={0.9}
              onPress={() =>
                setSelectedVehicle(prev => (prev === item.id ? null : item.id))
              }>
              {selected ? <CheckBadge styles={styles} /> : null}
              <Image
                source={Images.carImage}
                style={styles.vehicleImage}
                resizeMode="contain"
              />
              <Text style={styles.vehicleLabel}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStateChip = chip => {
    const active = selectedStates.includes(chip.id);
    return (
      <TouchableOpacity
        key={chip.id}
        style={[styles.chip, active && styles.chipOn]}
        onPress={() => toggleState(chip.id)}
        activeOpacity={0.85}>
        <Text style={styles.chipText}>{chip.label}</Text>
        {active ? (
          <CheckBadge styles={styles} style={styles.chipCheck} />
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderOneWayStep = () => (
    <View>
      <Text style={styles.question}>Select your preferred states</Text>
      <Text style={styles.hint}>
        Choose the states from where you want to receive one-way alerts.
      </Text>
      <View style={styles.chipWrap}>
        {STATE_CHIPS.map(renderStateChip)}
        {extraStates.map(name =>
          renderStateChip({id: name, label: name}),
        )}
      </View>
      <TouchableOpacity
        style={styles.moreChip}
        onPress={() => setMoreStatesVisible(true)}
        activeOpacity={0.85}>
        <Ionicons name="add" size={16} color={Colors.textPrimary} />
        <Text style={styles.moreText}>More</Text>
      </TouchableOpacity>

      <Text style={[styles.question, styles.sectionGap]}>
        Select your preferred one-way routes
      </Text>
      <Text style={styles.hint}>
        Set your pickup and drop locations to receive one-way alerts
      </Text>
      <LocationField
        placeholder="Pickup Location"
        value={pickupLocation}
        pinColor={PICKUP_PIN}
        onPress={() => openLocation(setPickupLocation)}
        styles={styles}
      />
      <LocationField
        placeholder="Drop To"
        value={dropLocation}
        pinColor={DROP_PIN}
        onPress={() => openLocation(setDropLocation)}
        styles={styles}
      />

      <Text style={[styles.question, styles.sectionGap]}>
        Select your a one-way pickup location
      </Text>
      <Text style={styles.hint}>
        You will receive alerts only for the selected pickup location.
      </Text>
      <LocationField
        placeholder="Pickup Location"
        value={oneWayPickupOnly}
        pinColor={PICKUP_PIN}
        onPress={() => openLocation(setOneWayPickupOnly)}
        styles={styles}
      />
    </View>
  );

  const renderRoundTripStep = () => (
    <View>
      <Text style={styles.question}>Select your preferred pickup cities</Text>
      <Text style={styles.hint}>
        Choose the cities from where you want to receive round trip alerts.
      </Text>
      <LocationField
        placeholder="Pickup Location"
        value={pickupCities}
        pinColor={PICKUP_PIN}
        onPress={() => openLocation(setPickupCities)}
        styles={styles}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <BannerHeader
        title="Route Alert Setup"
        onBack={handleBack}
        right={
          <TouchableOpacity onPress={finishSetup} hitSlop={8} activeOpacity={0.85}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        }
      />
      <Stepper step={step} onStep={setStep} styles={styles} />
      <ScrollView
        key={step}
        style={styles.body}
        contentContainerStyle={styles.stepPad}
        showsVerticalScrollIndicator={false}>
        {step === 0
          ? renderVehicleStep()
          : step === 1
            ? renderOneWayStep()
            : renderRoundTripStep()}
      </ScrollView>
      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 16)}]}>
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
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={moreStatesVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMoreStatesVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setMoreStatesVisible(false)}
          />
          <View
            style={[
              styles.modalCard,
              {paddingBottom: Math.max(insets.bottom, 16)},
            ]}>
            <Text style={styles.modalTitle}>Select more states</Text>
            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}>
              {MORE_STATES.map(name => {
                const active = selectedStates.includes(name);
                return (
                  <TouchableOpacity
                    key={name}
                    style={styles.modalRow}
                    onPress={() => toggleState(name)}
                    activeOpacity={0.85}>
                    <Text style={styles.modalRowText}>{name}</Text>
                    <View
                      style={[styles.modalBox, active && styles.modalBoxOn]}>
                      {active ? (
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color={Colors.onPrimary}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalDone}
              onPress={() => setMoreStatesVisible(false)}
              activeOpacity={0.85}>
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  skipText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 4,
  },
  stepNode: {
    alignItems: 'center',
    width: 32,
    paddingBottom: 22,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#E4E4E4',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C5C5C5',
  },
  stepNumOn: {
    color: Colors.onPrimary,
    fontWeight: '700',
  },
  stepLabel: {
    position: 'absolute',
    top: 36,
    width: 78,
    left: -23,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#B0B0B0',
  },
  stepLabelOn: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#E6E6E6',
    marginTop: 14,
    marginHorizontal: 8,
  },
  body: {
    flex: 1,
  },
  stepPad: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 14,
    paddingBottom: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: '#9A9A9A',
    marginTop: 4,
    marginBottom: 14,
  },
  sectionGap: {
    marginTop: 22,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vehicleCard: {
    width: '48%',
    minHeight: 128,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6E8EE',
    backgroundColor: Colors.surface,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleCardOn: {
    backgroundColor: '#FFF8DE',
    borderColor: Colors.primary,
  },
  vehicleImage: {
    width: '100%',
    height: 64,
  },
  vehicleLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 6,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: '#E4E6EA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOn: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF8DE',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chipCheck: {
    top: -7,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  moreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#E4E6EA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    marginTop: 2,
  },
  moreText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  locationField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  locationPlaceholder: {
    color: '#B7BEC8',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    backgroundColor: Colors.surface,
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  continueBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  modalList: {
    maxHeight: 360,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  modalRowText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  modalBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D5D8DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBoxOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modalDone: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneText: {
    color: Colors.onPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
};

export default RouteAlertSetupScreen;
