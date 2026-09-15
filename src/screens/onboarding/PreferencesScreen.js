import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {
  BOOKING_TYPES,
  OPERATING_STATES,
} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {setPreferences} from '../../redux/slices/authSlice';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const BOOKING_OPTIONS = [
  {
    id: BOOKING_TYPES.ONE_WAY,
    title: 'One Way',
    subtitle: 'One side trip',
    icon: '→',
  },
  {
    id: BOOKING_TYPES.ROUND_TRIP,
    title: 'Round Trip',
    subtitle: 'Return trip',
    icon: '↻',
  },
  {
    id: BOOKING_TYPES.BOTH,
    title: 'Both',
    subtitle: 'Both options',
    icon: '⇄',
  },
];

/**
 * Preferences — operate states + preferred booking type (screenshots 5–6).
 */
const PreferencesScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [selectedStates, setSelectedStates] = useState(['delhi']);
  const [bookingType, setBookingType] = useState(BOOKING_TYPES.ONE_WAY);

  const states = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return OPERATING_STATES;
    }
    return OPERATING_STATES.filter(s => s.name.toLowerCase().includes(q));
  }, [query]);

  const toggleState = id => {
    setSelectedStates(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const onContinue = () => {
    if (!selectedStates.length || !bookingType) {
      return;
    }
    dispatch(
      setPreferences({
        states: selectedStates,
        bookingType,
      }),
    );
    navigation.reset({
      index: 0,
      routes: [{name: ROUTES.AGENT_ROOT}],
    });
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 12}]}>
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>
            Let’s set your <Text style={styles.prefWord}>preferences</Text>
          </Text>
          <View style={styles.underline} />
          <Text style={styles.heroSub}>
            Select the states where you operate and your preferred booking type.
            You can update this anytime from settings.
          </Text>
        </View>
        <View style={styles.carBlock}>
          <Text style={styles.pin}>📍</Text>
          <View style={styles.carBody}>
            <View style={styles.carRoof} />
            <View style={styles.carCabin} />
            <View style={styles.wheelRow}>
              <View style={styles.wheel} />
              <View style={styles.wheel} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHead}>
          <View style={styles.iconBox}>
            <Text>📍</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.sectionTitle}>Where do you operate?</Text>
            <Text style={styles.sectionSub}>Choose all that apply</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search State"
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.grid}>
          {states.map(state => {
            const selected = selectedStates.includes(state.id);
            return (
              <TouchableOpacity
                key={state.id}
                activeOpacity={0.85}
                onPress={() => toggleState(state.id)}
                style={[styles.stateCard, selected && styles.stateCardOn]}>
                <View
                  style={[styles.radio, selected && styles.radioOn]}>
                  {selected ? <Text style={styles.radioTick}>✓</Text> : null}
                </View>
                <Text style={styles.landmark}>{state.landmark}</Text>
                <View style={styles.monument}>
                  <View style={styles.monumentBase} />
                  <View style={styles.monumentTop} />
                </View>
                <Text style={styles.stateName}>{state.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.sectionHead, {marginTop: Spacing.xl}]}>
          <View style={[styles.iconBox, styles.iconBoxCal]}>
            <Text>📅</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.sectionTitle}>Preferred Booking Type</Text>
            <Text style={styles.sectionSub}>
              Choose the type of bookings you want to work with
            </Text>
          </View>
        </View>

        <View style={styles.bookingRow}>
          {BOOKING_OPTIONS.map(opt => {
            const selected = bookingType === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.85}
                onPress={() => setBookingType(opt.id)}
                style={[styles.bookingCard, selected && styles.stateCardOn]}>
                <View style={[styles.radioSm, selected && styles.radioOn]}>
                  {selected ? <Text style={styles.radioTick}>✓</Text> : null}
                </View>
                <Text style={styles.bookingIcon}>{opt.icon}</Text>
                <Text style={styles.bookingTitle}>{opt.title}</Text>
                <Text style={styles.bookingSub}>{opt.subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <PrimaryButton
          title="Continue"
          showArrow
          darkText
          onPress={onContinue}
          disabled={!selectedStates.length}
        />
        <View style={styles.lockRow}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockText}>
            You can change this anytime from settings
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF7',
  },
  hero: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.base,
  },
  heroText: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    lineHeight: 32,
  },
  prefWord: {
    color: Colors.primary,
  },
  underline: {
    width: 110,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 4,
    marginBottom: Spacing.sm,
  },
  heroSub: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  carBlock: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    fontSize: 22,
    marginBottom: 4,
  },
  carBody: {
    width: 96,
    height: 48,
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  carRoof: {
    position: 'absolute',
    top: -10,
    width: 50,
    height: 18,
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  carCabin: {
    position: 'absolute',
    top: 6,
    width: 70,
    height: 18,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  wheelRow: {
    flexDirection: 'row',
    width: 76,
    justifyContent: 'space-between',
  },
  wheel: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#424242',
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Dimensions.shadow.soft,
  },
  cardContent: {
    padding: Spacing.screenPadding,
    paddingBottom: 24,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxCal: {
    backgroundColor: '#FFE8CC',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    height: 44,
    paddingHorizontal: 14,
    marginBottom: Spacing.base,
  },
  searchIcon: {
    fontSize: 16,
    color: Colors.textMuted,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stateCard: {
    width: '48%',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    minHeight: 140,
    backgroundColor: Colors.surface,
  },
  stateCardOn: {
    borderColor: Colors.primary,
  },
  radio: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSm: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  radioTick: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  landmark: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  monument: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 60,
    marginBottom: 8,
  },
  monumentBase: {
    width: 48,
    height: 28,
    backgroundColor: '#CFCFCF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  monumentTop: {
    position: 'absolute',
    top: 8,
    width: 10,
    height: 36,
    backgroundColor: '#BDBDBD',
  },
  stateName: {
    textAlign: 'center',
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingCard: {
    width: '31.5%',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingTop: 28,
    paddingBottom: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    minHeight: 120,
  },
  bookingIcon: {
    fontSize: 28,
    color: Colors.primary,
    marginBottom: 8,
  },
  bookingTitle: {
    fontWeight: Typography.fontWeights.bold,
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  bookingSub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 12,
    backgroundColor: Colors.surface,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  lockIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  lockText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});

export default PreferencesScreen;
