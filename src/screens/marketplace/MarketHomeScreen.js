import React, {useMemo, useState} from 'react';
import {
  Linking,
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
import BrandLogo from '../../components/brand/BrandLogo';
import {FilterSlidersIcon} from '../../components/common';
import FreeVehicleCard from '../../components/booking/FreeVehicleCard';
import MarketBookingCard from '../../components/booking/MarketBookingCard';
import MarketFilterSheet, {
  EMPTY_FILTERS,
} from '../../components/booking/MarketFilterSheet';
import {ROUTES} from '../../constants/Routes';
import {mockFreeVehicles, mockMarketBookings} from '../../mockData';
import {Colors, Dimensions, Spacing} from '../../theme';

const AVATAR = require('../../assets/images/partner_deepesh.png');

const BOOKING_FILTERS = ['All', 'Today', 'Upcoming', 'Completed'];

const SAMPLE_PHONES = [
  '9876543210',
  '9123456780',
  '9988776655',
  '9170337201',
  '9414653454',
  '7390995460',
  '9897219634',
  '9389173930',
];

const getRandomPhone = () =>
  SAMPLE_PHONES[Math.floor(Math.random() * SAMPLE_PHONES.length)];

const openDialer = (phone = getRandomPhone()) => {
  const digits = String(phone).replace(/[^\d+]/g, '');
  if (!digits) {
    return;
  }
  Linking.openURL(`tel:${digits}`).catch(() => {});
};

const FEATURES = [
  {
    id: 'insurance',
    label: 'Car Insurance',
    icon: '🛡',
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
  },
  {
    id: 'videos',
    label: 'Tutorial Videos',
    icon: '▶',
    iconBg: '#FFEBEE',
    iconColor: '#E53935',
  },
  {
    id: 'rules',
    label: 'Rules &\nRegulations',
    icon: '📄',
    iconBg: '#E3F2FD',
    iconColor: '#1A73E8',
  },
];

const SETUP_FLOWS = [
  {
    id: 'personal',
    title: 'Personal Information',
    subtitle: 'Add your basic details to get verified',
    icon: '👤',
    iconBg: '#FFF6D6',
    steps: ['Profile Information', 'Update', 'Set Profile Pic'],
    route: ROUTES.PERSONAL_INFO,
    completed: true,
  },
  {
    id: 'vehicle',
    title: 'Add Vehicle',
    subtitle: 'Register at least one vehicle to take rides',
    icon: '🚗',
    iconBg: '#E8F5E9',
    steps: ['Manage Vehicle', 'Add Details', 'Submit'],
    route: ROUTES.MANAGE_VEHICLES,
    completed: false,
  },
  {
    id: 'driver',
    title: 'Add Driver',
    subtitle: 'Add a driver linked to your vehicle',
    icon: '🧑‍✈️',
    iconBg: '#E3F2FD',
    steps: ['Manage Driver', 'Add Details', 'Submit'],
    route: ROUTES.MANAGE_DRIVERS,
    completed: false,
  },
];

const SetupMiniSteps = ({steps}) => (
  <View style={styles.miniSteps}>
    {steps.map((label, index) => (
      <React.Fragment key={label}>
        <View style={styles.miniStepItem}>
          <View style={styles.miniStepPlus}>
            <Text style={styles.miniStepPlusText}>+</Text>
          </View>
          <Text style={styles.miniStepLabel} numberOfLines={2}>
            {label}
          </Text>
        </View>
        {index < steps.length - 1 ? <View style={styles.miniStepLine} /> : null}
      </React.Fragment>
    ))}
  </View>
);

const ProfileProgressChecklist = ({flows, onItemPress}) => (
  <View style={styles.progressChecklist}>
    {flows.map((flow, index) => {
      const done = !!flow.completed;
      return (
        <TouchableOpacity
          key={flow.id}
          style={[
            styles.progressCheckRow,
            index < flows.length - 1 && styles.progressCheckRowBorder,
          ]}
          activeOpacity={0.8}
          onPress={() => onItemPress?.(flow)}
          accessibilityRole="button"
          accessibilityLabel={`${flow.title}, ${done ? 'completed' : 'pending'}`}>
          <View
            style={[
              styles.progressCheckIcon,
              done ? styles.progressCheckIconDone : styles.progressCheckIconPending,
            ]}>
            <Text
              style={[
                styles.progressCheckMark,
                done
                  ? styles.progressCheckMarkDone
                  : styles.progressCheckMarkPending,
              ]}>
              {done ? '✓' : index + 1}
            </Text>
          </View>
          <View style={styles.progressCheckCopy}>
            <Text
              style={[
                styles.progressCheckTitle,
                done && styles.progressCheckTitleDone,
              ]}
              numberOfLines={1}>
              {flow.title}
            </Text>
            <Text style={styles.progressCheckSub} numberOfLines={1}>
              {done ? 'Completed' : 'Pending — tap to continue'}
            </Text>
          </View>
          <View
            style={[
              styles.progressStatusPill,
              done ? styles.progressStatusDone : styles.progressStatusPending,
            ]}>
            <Text
              style={[
                styles.progressStatusText,
                done
                  ? styles.progressStatusTextDone
                  : styles.progressStatusTextPending,
              ]}>
              {done ? 'Done' : 'Left'}
            </Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

/**
 * Market home — Bookings setup / Free Vehicles listings.
 */
const MarketHomeScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [alerts, setAlerts] = useState(false);
  const [tab, setTab] = useState('bookings');
  const [dismissed, setDismissed] = useState({});
  const [bookingFilter, setBookingFilter] = useState('All');
  // const [showFab, setShowFab] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [comingSoonVisible, setComingSoonVisible] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState(
    'This feature is coming soon.',
  );
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const isVehicles = tab === 'vehicles';

  const showComingSoon = (message = 'This feature is coming soon.') => {
    setComingSoonMessage(message);
    setComingSoonVisible(true);
  };

  const handleOpenDialer = (phone) => {
    setHelpMenuOpen(false);
    openDialer(phone);
  };

  const handleHelpPress = () => {
    setHelpMenuOpen(prev => !prev);
  };

  const handleHelpCall = () => {
    handleOpenDialer();
  };

  const handleAlertsChange = value => {
    setAlerts(value);
    if (value) {
      navigation.navigate(ROUTES.ROUTE_ALERT_SETUP);
    }
  };

  const handleStartDriving = () => {
    navigation.navigate(ROUTES.PERSONAL_INFO);
  };

  const handleFeaturePress = featureId => {
    const labels = {
      insurance: 'Car Insurance',
      videos: 'Tutorial Videos',
      rules: 'Rules & Regulations',
    };
    showComingSoon(
      `${labels[featureId] || 'This feature'} will be available soon.`,
    );
  };

  const visibleSetups = useMemo(
    () => SETUP_FLOWS.filter(flow => !dismissed[flow.id] && !flow.completed),
    [dismissed],
  );

  const profileProgress = useMemo(() => {
    const total = SETUP_FLOWS.length;
    const completedCount = SETUP_FLOWS.filter(flow => flow.completed).length;
    const remainingCount = total - completedCount;
    const percent =
      total === 0 ? 0 : Math.round((completedCount / total) * 100);
    const nextIncomplete = SETUP_FLOWS.find(flow => !flow.completed);
    return {
      total,
      completedCount,
      remainingCount,
      percent,
      nextIncomplete,
    };
  }, []);

  const handleProfileSectionPress = flow => {
    if (flow?.route) {
      navigation.navigate(flow.route);
    }
  };

  const handleProgressCardPress = () => {
    const target =
      profileProgress.nextIncomplete?.route || ROUTES.PERSONAL_INFO;
    navigation.navigate(target);
  };

  const filteredBookings = useMemo(() => {
    let list = mockMarketBookings;

    if (bookingFilter === 'Today') {
      list = list.filter(b => String(b.when).toLowerCase().includes('today'));
    } else if (bookingFilter === 'Upcoming') {
      list = list.filter(
        b => !String(b.when).toLowerCase().includes('today'),
      );
    } else if (bookingFilter === 'Completed') {
      list = [];
    }

    const trip = String(appliedFilters.tripType || '').toLowerCase();
    if (trip && trip !== 'both') {
      list = list.filter(b =>
        String(b.tripType || '')
          .toLowerCase()
          .includes(trip.replace(' ', '') === 'oneway' ? 'one' : 'round'),
      );
    }

    if (appliedFilters.vehicleType) {
      const vehicle = appliedFilters.vehicleType.toLowerCase();
      list = list.filter(
        b =>
          String(b.vehicle || '')
            .toLowerCase()
            .includes(vehicle) ||
          String(b.vehicleType || '')
            .toLowerCase()
            .includes(vehicle),
      );
    }

    if (appliedFilters.pickupLocation) {
      const pickup = appliedFilters.pickupLocation.toLowerCase();
      list = list.filter(
        b =>
          String(b.from || '')
            .toLowerCase()
            .includes(pickup) ||
          String(b.pickupFrom || '')
            .toLowerCase()
            .includes(pickup),
      );
    }

    if (appliedFilters.dropLocation) {
      const drop = appliedFilters.dropLocation.toLowerCase();
      list = list.filter(
        b =>
          String(b.to || '')
            .toLowerCase()
            .includes(drop) ||
          String(b.dropTo || '')
            .toLowerCase()
            .includes(drop),
      );
    }

    return list;
  }, [bookingFilter, appliedFilters]);

  const filteredVehicles = useMemo(() => {
    let list = mockFreeVehicles;

    if (appliedFilters.vehicleType) {
      const vehicle = appliedFilters.vehicleType.toLowerCase();
      list = list.filter(v =>
        String(v.vehicleType || '')
          .toLowerCase()
          .includes(vehicle),
      );
    }

    if (appliedFilters.pickupLocation) {
      const pickup = appliedFilters.pickupLocation.toLowerCase();
      list = list.filter(v =>
        String(v.location || '')
          .toLowerCase()
          .includes(pickup),
      );
    }

    return list;
  }, [appliedFilters]);

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      {helpMenuOpen ? (
        <TouchableOpacity
          style={styles.helpBackdrop}
          activeOpacity={1}
          onPress={() => setHelpMenuOpen(false)}
        />
      ) : null}

      <View style={[styles.header, helpMenuOpen && styles.headerRaised]}>
        <View style={styles.logoBlock}>
          <BrandLogo size="sm" stacked showDivider={false} style={styles.logo} />
          <Text style={styles.tagline}>Your Ride, Our Priority</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.alertsWrap}>
            <Text style={styles.bellIcon}>🔔</Text>
            <Text style={styles.alertsLabel}>Alerts</Text>
            <Switch
              value={alerts}
              onValueChange={handleAlertsChange}
              trackColor={{false: '#D0D0D0', true: Colors.primary}}
              thumbColor="#fff"
              style={styles.alertsSwitch}
            />
          </View>
          <View style={styles.helpWrap}>
            <TouchableOpacity
              style={styles.helpBtn}
              activeOpacity={0.85}
              onPress={handleHelpPress}
              accessibilityRole="button"
              accessibilityLabel="Help">
              <Text style={styles.helpIcon}>🎧</Text>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
            {helpMenuOpen ? (
              <View style={styles.helpPopup}>
                <TouchableOpacity
                  style={styles.helpPopupItem}
                  activeOpacity={0.85}
                  onPress={handleHelpCall}
                  accessibilityRole="button"
                  accessibilityLabel="Call support">
                  <View style={styles.helpPopupCallBadge}>
                    <Text style={styles.helpPopupCallIcon}>📞</Text>
                  </View>
                  <Text style={styles.helpPopupText}>Call</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'bookings' && styles.segBtnOn]}
            onPress={() => setTab('bookings')}
            activeOpacity={0.85}>
            <Text
              style={[styles.segText, tab === 'bookings' && styles.segTextOn]}>
              Bookings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'vehicles' && styles.segBtnOn]}
            onPress={() => setTab('vehicles')}
            activeOpacity={0.85}>
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
              <TouchableOpacity
                style={styles.filterBtn}
                activeOpacity={0.85}
                onPress={() => setFilterOpen(true)}>
                <FilterSlidersIcon />
              </TouchableOpacity>
            </View>

            {filteredVehicles.map(({id, hasAvatar, phone, ...vehicle}) => (
              <FreeVehicleCard
                key={id}
                {...vehicle}
                phone={phone}
                avatarSource={hasAvatar ? AVATAR : undefined}
                onCall={() => handleOpenDialer(getRandomPhone())}
              />
            ))}
          </>
        ) : (
          <>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>⌕</Text>
                <TextInput
                  placeholder="Search by booking id, city, vehicle..."
                  placeholderTextColor={Colors.textPlaceholder}
                  style={styles.searchInput}
                />
                <TouchableOpacity
                  style={styles.searchFilter}
                  activeOpacity={0.85}
                  onPress={() => setFilterOpen(true)}>
                  <FilterSlidersIcon />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.promoCard}>
              <View style={styles.promoCopy}>
                <Text style={styles.promoTitle}>Drive More Earn More</Text>
                <Text style={styles.promoSub}>
                  More Rides. Better Earnings. Be Your Own Boss.
                </Text>
                <TouchableOpacity
                  style={styles.promoBtn}
                  activeOpacity={0.85}
                  onPress={handleStartDriving}>
                  <Text style={styles.promoBtnText}>Start Driving →</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.promoArt}>
                <Text style={styles.promoTaxi}>🚕</Text>
                <View style={styles.promoHill} />
              </View>
            </View>

            <View style={styles.featureRow}>
              {FEATURES.map(f => (
                <TouchableOpacity
                  key={f.id}
                  style={styles.featureCard}
                  activeOpacity={0.85}
                  onPress={() => handleFeaturePress(f.id)}>
                  <View style={[styles.featureIconWrap, {backgroundColor: f.iconBg}]}>
                    <Text style={[styles.featureIcon, {color: f.iconColor}]}>
                      {f.icon}
                    </Text>
                  </View>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.progressCard}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleProgressCardPress}>
                <View style={styles.progressTop}>
                  <View style={styles.progressIconWrap}>
                    <Text style={styles.progressIcon}>📋</Text>
                  </View>
                  <View style={styles.progressCopy}>
                    <Text style={styles.progressTitle}>
                      Complete Your Profile
                    </Text>
                    <Text style={styles.progressSub}>
                      {profileProgress.remainingCount > 0
                        ? `${profileProgress.completedCount} of ${profileProgress.total} done · ${profileProgress.remainingCount} left`
                        : 'All setup steps completed'}
                    </Text>
                  </View>
                  <Text style={styles.progressPct}>
                    {profileProgress.percent}%
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {width: `${profileProgress.percent}%`},
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <ProfileProgressChecklist
                flows={SETUP_FLOWS}
                onItemPress={handleProfileSectionPress}
              />
            </View>

            {visibleSetups.map(flow => (
              <View key={flow.id} style={styles.setupCard}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate(flow.route)}>
                  <View style={styles.setupHeader}>
                    <View
                      style={[
                        styles.setupIconWrap,
                        {backgroundColor: flow.iconBg},
                      ]}>
                      <Text style={styles.setupIcon}>{flow.icon}</Text>
                    </View>
                    <View style={styles.setupCopy}>
                      <Text style={styles.setupTitle}>{flow.title}</Text>
                      <Text style={styles.setupSub}>{flow.subtitle}</Text>
                    </View>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.setupClose}
                      onPress={e => {
                        e?.stopPropagation?.();
                        setDismissed(prev => ({...prev, [flow.id]: true}));
                      }}
                      hitSlop={8}>
                      <Text style={styles.closeX}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <SetupMiniSteps steps={flow.steps} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.communityCard}>
              <Text style={styles.communityStars}>✦ ✦ ✦</Text>
              <Text style={styles.communityTitle}>
                Join the Tajway Partner Community
              </Text>
              <Text style={styles.communitySub}>
                Complete your profile and start earning with verified bookings.
              </Text>
              <TouchableOpacity
                style={styles.communityBtn}
                activeOpacity={0.85}
                onPress={handleProgressCardPress}>
                <Text style={styles.communityBtnText}>Complete Now →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
              style={styles.filterScroll}>
              {BOOKING_FILTERS.map(filter => {
                const on = bookingFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.filterChip, on && styles.filterChipOn]}
                    onPress={() => setBookingFilter(filter)}
                    activeOpacity={0.85}>
                    <Text
                      style={[styles.filterChipText, on && styles.filterChipTextOn]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {filteredBookings.map(({id, hasAvatar, ...booking}) => (
              <MarketBookingCard
                key={id}
                {...booking}
                avatarSource={hasAvatar ? AVATAR : undefined}
                onPress={() =>
                  navigation.navigate(ROUTES.MARKET_BOOKING_DETAIL, {
                    booking: {id, ...booking},
                  })
                }
                onMenu={() =>
                  showComingSoon('More options will be available soon.')
                }
                onQuote={() =>
                  showComingSoon('Quote best price will be available soon.')
                }
                onContact={() => handleOpenDialer()}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Support AI FAB — temporarily hidden
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
      */}

      <MarketFilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        initial={appliedFilters}
        onSave={setAppliedFilters}
      />

      <Modal
        visible={comingSoonVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setComingSoonVisible(false)}>
        <TouchableOpacity
          style={styles.comingSoonOverlay}
          activeOpacity={1}
          onPress={() => setComingSoonVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.comingSoonCard}>
              <Text style={styles.comingSoonTitle}>Coming Soon</Text>
              <Text style={styles.comingSoonMsg}>{comingSoonMessage}</Text>
              <TouchableOpacity
                style={styles.comingSoonBtn}
                activeOpacity={0.85}
                onPress={() => setComingSoonVisible(false)}>
                <Text style={styles.comingSoonBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  headerRaised: {
    zIndex: 30,
    elevation: 30,
  },
  logoBlock: {
    flex: 1,
  },
  logo: {
    alignSelf: 'flex-start',
  },
  tagline: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    marginLeft: 34,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  alertsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  bellIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  alertsLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
    color: Colors.textPrimary,
  },
  alertsSwitch: {
    transform: [{scaleX: 0.85}, {scaleY: 0.85}],
  },
  helpWrap: {
    position: 'relative',
    zIndex: 30,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEFF3',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  helpIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  helpText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textNavy,
  },
  helpBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
  },
  helpPopup: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: -10,
    minWidth: 128,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    shadowColor: Colors.secondaryDark,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 40,
  },
  helpPopupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  helpPopupCallBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  helpPopupCallIcon: {
    fontSize: 12,
  },
  helpPopupText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textNavy,
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
    marginBottom: Spacing.sm,
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
    color: Colors.onPrimary,
  },
  searchRow: {
    marginBottom: Spacing.sm,
  },
  applyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 2,
  },
  applyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textNavy,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 48,
    paddingLeft: 14,
    paddingRight: 6,
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
  searchFilter: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  promoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    minHeight: 120,
  },
  promoCopy: {
    flex: 1,
    paddingRight: 8,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onPrimary,
    marginBottom: 4,
  },
  promoSub: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  promoBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondaryDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  promoBtnText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  promoArt: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  promoTaxi: {
    fontSize: 52,
    marginBottom: -6,
    zIndex: 1,
  },
  promoHill: {
    position: 'absolute',
    bottom: -20,
    right: -10,
    width: 110,
    height: 70,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  featureCard: {
    width: '31.5%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontWeight: '600',
    lineHeight: 14,
  },
  progressCard: {
    backgroundColor: '#FFF8E7',
    borderRadius: 16,
    padding: 14,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F3E4B8',
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  progressIcon: {
    fontSize: 18,
  },
  progressCopy: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  progressPct: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onPrimary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EDE4C8',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primaryDark,
  },
  progressChecklist: {
    marginTop: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E6C2',
    overflow: 'hidden',
  },
  progressCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  progressCheckRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  progressCheckIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  progressCheckIconDone: {
    backgroundColor: Colors.successSoft,
  },
  progressCheckIconPending: {
    backgroundColor: Colors.primaryMuted,
  },
  progressCheckMark: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressCheckMarkDone: {
    color: Colors.success,
  },
  progressCheckMarkPending: {
    color: Colors.onPrimary,
  },
  progressCheckCopy: {
    flex: 1,
    paddingRight: 8,
  },
  progressCheckTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressCheckTitleDone: {
    color: Colors.textSecondary,
  },
  progressCheckSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  progressStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  progressStatusDone: {
    backgroundColor: Colors.successSoft,
  },
  progressStatusPending: {
    backgroundColor: Colors.errorSoft,
  },
  progressStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  progressStatusTextDone: {
    color: Colors.success,
  },
  progressStatusTextPending: {
    color: Colors.error,
  },
  setupCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  setupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  setupIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  setupIcon: {
    fontSize: 18,
  },
  setupCopy: {
    flex: 1,
    paddingRight: 6,
  },
  setupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  setupSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  pendingBadge: {
    backgroundColor: Colors.errorSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginTop: 2,
  },
  pendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.error,
  },
  setupClose: {
    marginTop: 2,
  },
  closeX: {
    color: Colors.dashedRed,
    fontSize: 11,
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
  miniSteps: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  miniStepItem: {
    alignItems: 'center',
    width: 78,
  },
  miniStepPlus: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  miniStepPlusText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onPrimary,
    lineHeight: 16,
  },
  miniStepLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontWeight: '600',
    lineHeight: 13,
  },
  miniStepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.primary,
    marginTop: 10,
    marginHorizontal: 2,
    opacity: 0.7,
  },
  communityCard: {
    backgroundColor: Colors.secondaryDark,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  communityStars: {
    color: Colors.primary,
    fontSize: 12,
    letterSpacing: 6,
    marginBottom: 8,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: 6,
  },
  communitySub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 16,
  },
  communityBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 22,
  },
  communityBtnText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterRow: {
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginRight: 8,
  },
  filterChipOn: {
    backgroundColor: Colors.secondaryDark,
    borderColor: Colors.secondaryDark,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextOn: {
    color: Colors.textInverse,
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
  comingSoonOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  comingSoonCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  comingSoonMsg: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  comingSoonBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 11,
    borderRadius: 22,
    minWidth: 120,
    alignItems: 'center',
  },
  comingSoonBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onPrimary,
  },
});

export default MarketHomeScreen;
