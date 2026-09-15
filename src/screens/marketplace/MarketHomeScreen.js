import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BrandLogo from '../../components/brand/BrandLogo';
import MarketBookingCard from '../../components/booking/MarketBookingCard';
import {ROUTES} from '../../constants/Routes';
import {Colors, Dimensions, Spacing} from '../../theme';

const FEATURES = [
  {id: 'insurance', label: 'Car Insurance', icon: '🛡'},
  {id: 'videos', label: 'Tutorial Videos', icon: '▶'},
  {id: 'rules', label: 'Rules &\nRegulations', icon: '📋'},
];

const SETUP_FLOWS = [
  {
    id: 'personal',
    title: 'Personal Information',
    subtitle: 'Provide location permission to see bookings',
    steps: ['Click Profile', 'Personal Information', 'Set Profile Pic', 'Update'],
    route: ROUTES.PERSONAL_INFO,
  },
  {
    id: 'vehicle',
    title: 'Add Vehicle',
    subtitle: null,
    steps: ['Click Profile', 'Manage Vehicle', 'Add Button', 'Add details', 'Submit'],
    route: ROUTES.MANAGE_VEHICLES,
  },
  {
    id: 'driver',
    title: 'Add Driver',
    subtitle: null,
    steps: ['Click Profile', 'Manage Driver', 'Add Button', 'Add details', 'Submit'],
    route: ROUTES.MANAGE_DRIVERS,
  },
];

/**
 * Market home — empty setup state matching screenshot 7.
 */
const MarketHomeScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [alerts, setAlerts] = useState(true);
  const [tab, setTab] = useState('bookings');
  const [dismissed, setDismissed] = useState({});

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BrandLogo size="sm" stacked showDivider={false} style={styles.logo} />
        <View style={styles.alertsWrap}>
          <Text style={styles.alertsLabel}>Alerts</Text>
          <Switch
            value={alerts}
            onValueChange={setAlerts}
            trackColor={{false: '#D0D0D0', true: Colors.primary}}
            thumbColor="#fff"
          />
        </View>
        <TouchableOpacity style={styles.helpBtn} activeOpacity={0.85}>
          <Text style={styles.helpText}>Help</Text>
          <Text style={styles.helpIcon}>🎧</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'bookings' && styles.segBtnOn]}
            onPress={() => setTab('bookings')}>
            <Text
              style={[styles.segText, tab === 'bookings' && styles.segTextOn]}>
              Bookings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'vehicles' && styles.segBtnOn]}
            onPress={() => setTab('vehicles')}>
            <Text
              style={[styles.segText, tab === 'vehicles' && styles.segTextOn]}>
              Free Vehicles
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              placeholder="Search"
              placeholderTextColor={Colors.textPlaceholder}
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featureRow}>
          {FEATURES.map(f => (
            <View key={f.id} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.instruction}>
          Please complete your profile and add at-least one vehicle and one
          driver in order to take a booking.
        </Text>

        {SETUP_FLOWS.map(flow =>
          dismissed[flow.id] ? null : (
            <TouchableOpacity
              key={flow.id}
              activeOpacity={0.9}
              style={styles.flowCard}
              onPress={() => navigation.navigate(flow.route)}>
              <View style={styles.flowHead}>
                <View style={styles.flowHeadText}>
                  <Text style={styles.flowTitle}>{flow.title}</Text>
                  {flow.subtitle ? (
                    <Text style={styles.flowSub}>{flow.subtitle}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setDismissed(prev => ({...prev, [flow.id]: true}))
                  }
                  hitSlop={8}>
                  <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.stepsWrap}>
                {flow.steps.map((step, idx) => (
                  <View key={step} style={styles.stepItem}>
                    <View style={styles.stepPill}>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                    {idx < flow.steps.length - 1 ? (
                      <Text style={styles.dash}>···</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ),
        )}

        <MarketBookingCard />
        <MarketBookingCard
          tripType="One Way"
          vehicle="INNOVA CRYSTA"
          when="Today"
          time="09:30 AM"
          notes="Airport pickup, wait time included"
          extras="All inclusive, AC, toll tax sath me"
          reviews={128}
        />
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Text style={styles.fabIcon}>🤖</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  logo: {
    flex: 1,
  },
  alertsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  alertsLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
    color: Colors.textPrimary,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEFF3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  helpText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textNavy,
    marginRight: 4,
  },
  helpIcon: {
    fontSize: 12,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 100,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 4,
    marginBottom: Spacing.md,
    ...Dimensions.shadow.soft,
  },
  segBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnOn: {
    backgroundColor: Colors.primary,
  },
  segText: {
    fontWeight: '700',
    color: Colors.textNavy,
    fontSize: 14,
  },
  segTextOn: {
    color: Colors.textInverse,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    marginRight: 10,
    ...Dimensions.shadow.soft,
  },
  searchIcon: {
    fontSize: 16,
    color: Colors.textMuted,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Dimensions.shadow.soft,
  },
  filterIcon: {
    color: Colors.filterRed,
    fontSize: 18,
    fontWeight: '700',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  featureCard: {
    width: '31.5%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    ...Dimensions.shadow.soft,
  },
  featureIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontWeight: '600',
    lineHeight: 14,
  },
  instruction: {
    textAlign: 'center',
    color: Colors.secondaryLight,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.base,
    paddingHorizontal: 8,
  },
  flowCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...Dimensions.shadow.soft,
  },
  flowHead: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  flowHeadText: {
    flex: 1,
  },
  flowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textNavy,
  },
  flowSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeX: {
    color: Colors.dashedRed,
    fontSize: 16,
    fontWeight: '700',
    width: 24,
    height: 24,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: Colors.dashedRed,
    borderRadius: 12,
    overflow: 'hidden',
    lineHeight: 20,
  },
  stepsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepPill: {
    backgroundColor: '#EEF0F3',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  stepText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  dash: {
    color: Colors.dashedRed,
    marginHorizontal: 4,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Dimensions.shadow.medium,
  },
  fabIcon: {
    fontSize: 28,
  },
});

export default MarketHomeScreen;
