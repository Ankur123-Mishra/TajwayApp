import React, {useState} from 'react';
import {
  Image,
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
import {FilterSlidersIcon} from '../../components/common';
import FreeVehicleCard from '../../components/booking/FreeVehicleCard';
import MarketBookingCard from '../../components/booking/MarketBookingCard';
import {ROUTES} from '../../constants/Routes';
import {mockFreeVehicles, mockMarketBookings} from '../../mockData';
import {Colors, Dimensions, Spacing} from '../../theme';

const AVATAR = require('../../assets/images/partner_deepesh.png');

const FEATURES = [
  {id: 'insurance', label: 'Car Insurance', icon: '🛡'},
  {id: 'videos', label: 'Tutorial Videos', icon: '▶'},
  {id: 'rules', label: 'Rules &\nRegulations', icon: '📋'},
];

const SETUP_FLOWS = [
  {
    id: 'personal',
    image: require('../../assets/images/PersonalInfo.png'),
    route: ROUTES.PERSONAL_INFO,
  },
  {
    id: 'vehicle',
    image: require('../../assets/images/AddVehicle.png'),
    route: ROUTES.MANAGE_VEHICLES,
  },
  {
    id: 'driver',
    image: require('../../assets/images/AddDriver.png'),
    route: ROUTES.MANAGE_DRIVERS,
  },
];

/**
 * Market home — Bookings setup / Free Vehicles listings.
 */
const MarketHomeScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [alerts, setAlerts] = useState(false);
  const [tab, setTab] = useState('bookings');
  const [dismissed, setDismissed] = useState({});
  const [showFab, setShowFab] = useState(true);
  const isVehicles = tab === 'vehicles';

  const handleAlertsChange = value => {
    setAlerts(value);
    if (value) {
      navigation.navigate(ROUTES.ROUTE_ALERT_SETUP);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BrandLogo size="sm" stacked showDivider={false} style={styles.logo} />
        <View style={styles.alertsWrap}>
          <Text style={styles.alertsLabel}>Alerts</Text>
          <Switch
            value={alerts}
            onValueChange={handleAlertsChange}
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

        {isVehicles ? (
          <>
            <View style={styles.applyRow}>
              <Text style={styles.applyText}>Apply Filters</Text>
              <TouchableOpacity style={styles.filterBtn} activeOpacity={0.85}>
                <FilterSlidersIcon />
              </TouchableOpacity>
            </View>

            {mockFreeVehicles.map(({id, hasAvatar, ...vehicle}) => (
              <FreeVehicleCard
                key={id}
                {...vehicle}
                avatarSource={hasAvatar ? AVATAR : undefined}
              />
            ))}
          </>
        ) : (
          <>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>⌕</Text>
                <TextInput
                  placeholder="Search by booking id..."
                  placeholderTextColor={Colors.textPlaceholder}
                  style={styles.searchInput}
                />
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <FilterSlidersIcon />
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
                <View key={flow.id} style={styles.flowImageWrap}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate(flow.route)}>
                    <Image
                      source={flow.image}
                      style={styles.flowImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.flowCloseBtn}
                    onPress={() =>
                      setDismissed(prev => ({...prev, [flow.id]: true}))
                    }
                    hitSlop={8}>
                    <Text style={styles.closeX}>✕</Text>
                  </TouchableOpacity>
                </View>
              ),
            )}

            {mockMarketBookings.map(({id, hasAvatar, ...booking}) => (
              <MarketBookingCard
                key={id}
                {...booking}
                avatarSource={hasAvatar ? AVATAR : undefined}
              />
            ))}
          </>
        )}
      </ScrollView>

      {showFab ? (
        <View style={styles.fabWrap}>
          <TouchableOpacity
            style={styles.fabClose}
            onPress={() => setShowFab(false)}
            hitSlop={6}
            accessibilityLabel="Dismiss chat">
            <Text style={styles.fabCloseX}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
            <Text style={styles.fabIcon}>🤖</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
  applyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 2,
  },
  applyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textNavy,
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
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
  flowImageWrap: {
    marginBottom: 12,
    marginHorizontal: -8,
    position: 'relative',
  },
  flowImage: {
    width: '100%',
    height: 118,
  },
  flowCloseBtn: {
    position: 'absolute',
    top: 6,
    right: 14,
    zIndex: 1,
  },
  closeX: {
    color: Colors.dashedRed,
    fontSize: 12,
    fontWeight: '700',
    width: 18,
    height: 18,
    textAlign: 'center',
    borderWidth: 1.2,
    borderColor: Colors.dashedRed,
    borderRadius: 9,
    overflow: 'hidden',
    lineHeight: 15,
    backgroundColor: Colors.surface,
  },
  fabWrap: {
    position: 'absolute',
    right: 16,
    bottom: 18,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Dimensions.shadow.medium,
  },
  fabClose: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.dashedRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabCloseX: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
    marginTop: -1,
  },
  fabIcon: {
    fontSize: 28,
  },
});

export default MarketHomeScreen;
