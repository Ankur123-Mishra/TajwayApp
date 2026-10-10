import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  AppState,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FreeVehicleCard from '../../components/booking/FreeVehicleCard';
import MarketBookingCard from '../../components/booking/MarketBookingCard';
import MarketFilterSheet, {
  EMPTY_FILTERS,
} from '../../components/booking/MarketFilterSheet';
import VerificationPromptSheet from '../../components/booking/VerificationPromptSheet';
import MarketAppTour from '../../components/tour/MarketAppTour';
import {
  getTourTarget,
  subscribeTourTargets,
} from '../../components/tour/tourTargets';
import {STORAGE_KEYS} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {mockFreeVehicles, mockMarketBookings} from '../../mockData';
import {Images} from '../../constants/Images';
import {Colors, Dimensions, Spacing} from '../../theme';
import {useResponsiveStyles} from '../../hooks';
import {moderateScale} from '../../utils/responsive';

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

const VERIFY_PROMPT_DELAY_MS = 3000;

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
    label: 'Car\nInsurance',
    icon: Images.carInsuranceIcon,
  },
  {
    id: 'videos',
    label: 'Tutorial\nVideos',
    icon: Images.tutorialVideoIcon,
  },
  {
    id: 'rules',
    label: 'Rules &\nRegulation',
    icon: Images.rulesRegulationIcon,
  },
];

const SETUP_FLOWS = [
  {
    id: 'personal',
    title: 'Personal Information',
    subtitle: 'Name, Contact, Address, etc.',
    icon: 'person',
    route: ROUTES.PERSONAL_INFO,
    completed: true,
  },
  {
    id: 'vehicle',
    title: 'Add Vehicle',
    subtitle: 'Vehicle details & documents',
    icon: 'car',
    route: ROUTES.MANAGE_VEHICLES,
    completed: false,
  },
  {
    id: 'driver',
    title: 'Add Driver',
    subtitle: 'Driver details & documents',
    icon: 'person',
    route: ROUTES.MANAGE_DRIVERS,
    completed: false,
  },
];

const ProgressRing = ({percent}) => {
  const styles = useResponsiveStyles(baseStyles);
  const {width, height} = useWindowDimensions();
  const size = moderateScale(78, width, height);
  const stroke = moderateScale(7, width, height);
  const segments = 72;
  const clamped = Math.max(0, Math.min(100, percent));
  const active = Math.round((clamped / 100) * segments);
  const dash = (Math.PI * (size - stroke)) / segments + 1.4;

  return (
    <View style={[styles.ringWrap, {width: size, height: size}]}>
      <View
        style={[
          styles.ringTrack,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
          },
        ]}
      />
      {Array.from({length: active}).map((_, index) => (
        <View
          key={index}
          style={[
            styles.ringTick,
            {
              width: size,
              height: size,
              transform: [{rotate: `${(index / segments) * 360}deg`}],
            },
          ]}>
          <View
            style={[
              styles.ringDash,
              {width: dash, height: stroke, borderRadius: stroke / 2},
            ]}
          />
        </View>
      ))}
      <View style={styles.ringCenter}>
        <Text style={styles.ringPct}>{clamped}%</Text>
        <Text style={styles.ringLabel}>Complete</Text>
      </View>
    </View>
  );
};

/**
 * Market home — Bookings setup / Free Vehicles listings.
 */

const MarketHomeScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [alerts, setAlerts] = useState(false);
  const [tab, setTab] = useState('bookings');
  const [query, setQuery] = useState('');
  // const [showFab, setShowFab] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [comingSoonVisible, setComingSoonVisible] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState(
    'This feature is coming soon.',
  );
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [verifyPromptVisible, setVerifyPromptVisible] = useState(false);
  const [spotlight, setSpotlight] = useState(null);
  const [activeTourTarget, setActiveTourTarget] = useState(null);
  const isVehicles = tab === 'vehicles';
  const scrollRef = useRef(null);
  const scrollYRef = useRef(0);
  const targetRefs = useRef({});
  const revealGen = useRef(0);
  const mountedRef = useRef(true);
  const tourPendingRef = useRef(false);
  const resumeTourOnFocus = useRef(false);
  const verifyDismissedRef = useRef(false);
  const isFocusedRef = useRef(isFocused);
  const sawBackgroundRef = useRef(false);
  const [appForegroundId, setAppForegroundId] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setTargetRef = id => node => {
    targetRefs.current[id] = node;
  };

  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEYS.MARKET_TOUR)
      .then(value => {
        if (mounted && value !== 'done') {
          tourPendingRef.current = true;
        }
      })
      .catch(() => {
        if (mounted) {
          tourPendingRef.current = true;
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'background') {
        sawBackgroundRef.current = true;
        return;
      }
      if (nextState === 'active' && sawBackgroundRef.current) {
        sawBackgroundRef.current = false;
        verifyDismissedRef.current = false;
        setVerifyPromptVisible(false);
        setAppForegroundId(id => id + 1);
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (verifyDismissedRef.current) {
      return undefined;
    }
    const timer = setTimeout(() => {
      if (!mountedRef.current || verifyDismissedRef.current) {
        return;
      }
      if (!isFocusedRef.current) {
        return;
      }
      setVerifyPromptVisible(true);
    }, VERIFY_PROMPT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [appForegroundId]);

  useEffect(() => {
    if (!tourOpen) {
      return undefined;
    }
    setTab('bookings');
    setHelpMenuOpen(false);
    setFilterOpen(false);
    return undefined;
  }, [tourOpen]);

  useEffect(() => {
    if (!tourOpen || activeTourTarget !== 'post') {
      return undefined;
    }
    const sync = () => setSpotlight(getTourTarget('post'));
    sync();
    return subscribeTourTargets(id => {
      if (id === 'post') {
        sync();
      }
    });
  }, [tourOpen, activeTourTarget]);

  const measureNode = node =>
    new Promise(resolve => {
      if (!node || typeof node.measureInWindow !== 'function') {
        resolve(null);
        return;
      }
      node.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) {
          resolve({x, y, width, height});
        } else {
          resolve(null);
        }
      });
    });

  const revealTourStep = useCallback(
    async step => {
      const gen = ++revealGen.current;
      const targetId = step?.target || null;
      setActiveTourTarget(targetId);

      if (!targetId) {
        scrollRef.current?.scrollTo({y: 0, animated: false});
        scrollYRef.current = 0;
        setSpotlight(null);
        return;
      }

      if (targetId === 'post') {
        const rect = getTourTarget('post');
        if (rect) {
          setSpotlight(rect);
          return;
        }
        const size = 64;
        setSpotlight({
          x: (windowWidth - size) / 2,
          y: windowHeight - Math.max(insets.bottom, 8) - 78,
          width: size,
          height: size,
        });
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 80));
      if (gen !== revealGen.current || !mountedRef.current) {
        return;
      }

      const node =
        targetRefs.current[targetId] ||
        (step.fallback ? targetRefs.current[step.fallback] : null);
      if (!node) {
        setSpotlight(null);
        return;
      }

      setSpotlight(null);
      const first = await measureNode(node);
      if (gen !== revealGen.current || !mountedRef.current) {
        return;
      }
      if (first && scrollRef.current && !step.fixed) {
        const anchor = step.placement === 'below' ? 148 : windowHeight * 0.52;
        const delta = first.y - anchor;
        if (Math.abs(delta) > 20) {
          const nextY = Math.max(0, scrollYRef.current + delta);
          scrollRef.current.scrollTo({y: nextY, animated: true});
          scrollYRef.current = nextY;
          await new Promise(resolve => setTimeout(resolve, 480));
        }
      }
      if (gen !== revealGen.current || !mountedRef.current) {
        return;
      }
      const rect = await measureNode(
        targetRefs.current[targetId] ||
          (step.fallback ? targetRefs.current[step.fallback] : null),
      );
      if (gen === revealGen.current && mountedRef.current) {
        setSpotlight(rect);
      }
    },
    [insets.bottom, windowWidth, windowHeight],
  );

  const finishTour = useCallback(() => {
    revealGen.current += 1;
    setTourOpen(false);
    setSpotlight(null);
    setActiveTourTarget(null);
    AsyncStorage.setItem(STORAGE_KEYS.MARKET_TOUR, 'done').catch(() => {});
  }, []);

  const openTourIfPending = useCallback(() => {
    if (!tourPendingRef.current) {
      return;
    }
    tourPendingRef.current = false;
    setTourOpen(true);
  }, []);

  const closeVerifyPrompt = useCallback(() => {
    verifyDismissedRef.current = true;
    setVerifyPromptVisible(false);
    openTourIfPending();
  }, [openTourIfPending]);

  const handleVerifyNow = useCallback(() => {
    verifyDismissedRef.current = true;
    setVerifyPromptVisible(false);
    resumeTourOnFocus.current = tourPendingRef.current;
    tourPendingRef.current = false;
    navigation.navigate(ROUTES.VERIFICATION);
  }, [navigation]);

  useEffect(() => {
    if (!isFocused || verifyPromptVisible || !resumeTourOnFocus.current) {
      return undefined;
    }
    const timer = setTimeout(() => {
      if (!resumeTourOnFocus.current) {
        return;
      }
      resumeTourOnFocus.current = false;
      setTourOpen(true);
    }, 350);
    return () => clearTimeout(timer);
  }, [isFocused, verifyPromptVisible]);

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

  const filteredBookings = useMemo(() => {
    let list = mockMarketBookings;
    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter(booking =>
        [booking.name, booking.company, booking.from, booking.to, booking.vehicle, booking.id]
          .filter(Boolean)
          .some(value => String(value).toLowerCase().includes(needle)),
      );
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
  }, [query, appliedFilters]);

  const filteredVehicles = useMemo(() => {
    let list = mockFreeVehicles;
    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter(vehicle =>
        [
          vehicle.vehicleName,
          vehicle.vehicleType,
          vehicle.location,
          vehicle.name,
          vehicle.company,
          vehicle.otherDetails,
        ]
          .filter(Boolean)
          .some(value => String(value).toLowerCase().includes(needle)),
      );
    }

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
  }, [query, appliedFilters]);

  return (
    <View style={styles.container}>
      {helpMenuOpen ? (
        <TouchableOpacity
          style={styles.helpBackdrop}
          activeOpacity={1}
          onPress={() => setHelpMenuOpen(false)}
        />
      ) : null}

      <ImageBackground
        source={Images.headerImage}
        style={[styles.headerBg, helpMenuOpen && styles.headerRaised]}
        imageStyle={styles.headerImage}
        resizeMode="cover">
        <View style={[styles.header, {paddingTop: insets.top + 8}]}>
          <View style={styles.logoBlock}>
            <View style={styles.taxiBadge}>
              <Ionicons name="car-sport" size={18} color={Colors.onPrimary} />
            </View>
            <View>
              <Text style={styles.brandLine}>Tajway</Text>
              <Text style={styles.brandLine}>Hub</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <View
              ref={setTargetRef('alerts')}
              collapsable={false}
              style={[
                styles.alertsWrap,
                activeTourTarget === 'alerts' && styles.tourChip,
              ]}>
              <Image
                source={Images.notificationIcon}
                style={styles.alertsIcon}
                resizeMode="contain"
              />
              <Text style={styles.alertsLabel}>Alerts</Text>
              <Switch
                value={alerts}
                onValueChange={handleAlertsChange}
                trackColor={{false: '#D0D0D0', true: '#34C759'}}
                thumbColor="#fff"
                style={styles.alertsSwitch}
              />
            </View>
            <View
              ref={setTargetRef('help')}
              collapsable={false}
              style={[
                styles.helpWrap,
                activeTourTarget === 'help' && styles.tourChip,
              ]}>
              <TouchableOpacity
                style={styles.helpBtn}
                activeOpacity={0.85}
                onPress={handleHelpPress}
                accessibilityRole="button"
                accessibilityLabel="Help">
                <Ionicons name="headset" size={14} color={Colors.onPrimary} />
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
                      <Ionicons name="call" size={12} color={Colors.onPrimary} />
                    </View>
                    <Text style={styles.helpPopupText}>Call</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'bookings' && styles.segBtnOn]}
            onPress={() => setTab('bookings')}
            activeOpacity={0.85}>
            <Image
              source={Images.bookingIcon}
              style={styles.segIcon}
              resizeMode="contain"
            />
            <Text style={styles.segText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'vehicles' && styles.segBtnOn]}
            onPress={() => setTab('vehicles')}
            activeOpacity={0.85}>
            <Image
              source={Images.freeVehiclesIcon}
              style={styles.segIcon}
              resizeMode="contain"
            />
            <Text style={styles.segText}>Free Vehicles</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <ScrollView
        ref={scrollRef}
        scrollEnabled={!tourOpen}
        onScroll={event => {
          scrollYRef.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {isVehicles ? (
          <>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons
                  name="search"
                  size={18}
                  color="rgba(110, 107, 104, 1)"
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search bookings..."
                  placeholderTextColor="rgba(110, 107, 104, 1)"
                  style={styles.searchInput}
                />
              </View>
              <TouchableOpacity
                style={styles.searchFilter}
                activeOpacity={0.85}
                onPress={() => setFilterOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Filter vehicles">
                <Image
                  source={Images.filterIcon}
                  style={styles.filterIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {filteredVehicles.length === 0 ? (
              <Text style={styles.emptyText}>No vehicles found.</Text>
            ) : null}

            {filteredVehicles.map(({id, hasAvatar, phone, ...vehicle}) => (
              <FreeVehicleCard
                key={id}
                {...vehicle}
                phone={phone}
                avatarSource={hasAvatar ? Images.partnerDeepesh : undefined}
                onCall={() => handleOpenDialer(getRandomPhone())}
              />
            ))}
          </>
        ) : (
          <>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons
                  name="search"
                  size={18}
                  color="rgba(110, 107, 104, 1)"
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search bookings..."
                  placeholderTextColor="rgba(110, 107, 104, 1)"
                  style={styles.searchInput}
                />
              </View>
              <TouchableOpacity
                ref={setTargetRef('filter')}
                collapsable={false}
                style={[
                  styles.searchFilter,
                  activeTourTarget === 'filter' && styles.tourFilter,
                ]}
                activeOpacity={0.85}
                onPress={() => setFilterOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Filter bookings">
                <Image
                  source={Images.filterIcon}
                  style={styles.filterIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.bookingBannerWrap}
              onPress={handleStartDriving}>
              <Image
                source={Images.bookingBanner}
                style={styles.bannerImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.featureRow}>
              {FEATURES.map(f => (
                <TouchableOpacity
                  key={f.id}
                  ref={f.id === 'videos' ? setTargetRef('videos') : undefined}
                  collapsable={false}
                  style={styles.featureCard}
                  activeOpacity={0.85}
                  onPress={() => handleFeaturePress(f.id)}>
                  <Image
                    source={f.icon}
                    style={styles.featureIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.featureLabel}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              ref={setTargetRef('progress')}
              collapsable={false}
              style={[
                styles.progressCard,
                activeTourTarget === 'progress' && styles.tourLift,
              ]}>
              <View style={styles.progressTop}>
                <View style={styles.progressCopy}>
                  <Text style={styles.progressTitle}>Your Profile</Text>
                  <Text style={styles.progressSub}>
                    Complete your profile to start receiving bookings and unlock
                    more opportunities.
                  </Text>
                </View>
                <ProgressRing percent={profileProgress.percent} />
              </View>

              {SETUP_FLOWS.map(flow => {
                const done = !!flow.completed;
                return (
                  <TouchableOpacity
                    key={flow.id}
                    ref={
                      flow.id === 'vehicle' ? setTargetRef('vehicle') : undefined
                    }
                    collapsable={false}
                    style={[
                      styles.profileRow,
                      activeTourTarget === 'vehicle' &&
                        flow.id === 'vehicle' &&
                        styles.tourLift,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => handleProfileSectionPress(flow)}>
                    <View style={styles.profileIcon}>
                      <Ionicons name={flow.icon} size={18} color="#1B2437" />
                    </View>
                    <View style={styles.profileCopy}>
                      <Text style={styles.profileTitle}>{flow.title}</Text>
                      <Text style={styles.profileSub} numberOfLines={1}>
                        {flow.subtitle}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        done ? styles.statusDone : styles.statusPending,
                      ]}>
                      {done ? (
                        <Ionicons name="checkmark" size={12} color="#3BA55D" />
                      ) : null}
                      <Text
                        style={[
                          styles.statusText,
                          done ? styles.statusTextDone : styles.statusTextPending,
                        ]}>
                        {done ? 'Done' : 'Pending'}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#B0B6C0"
                      style={styles.profileChevron}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.staySafeBannerWrap}>
              <Image
                source={Images.staySafeBanner}
                style={styles.bannerImage}
                resizeMode="contain"
              />
            </View>

            {filteredBookings.length === 0 ? (
              <Text style={styles.emptyText}>No bookings found.</Text>
            ) : null}

            {filteredBookings.map(({id, hasAvatar, ...booking}, index) => (
              <View
                key={id}
                ref={index === 0 ? setTargetRef('booking') : undefined}
                collapsable={false}
                style={
                  index === 0 && activeTourTarget === 'booking'
                    ? styles.tourLift
                    : null
                }>
                <MarketBookingCard
                  {...booking}
                  avatarSource={hasAvatar ? Images.partnerDeepesh : undefined}
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
              </View>
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

      <VerificationPromptSheet
        visible={verifyPromptVisible && isFocused}
        onClose={closeVerifyPrompt}
        onVerify={handleVerifyNow}
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

      <MarketAppTour
        visible={tourOpen && isFocused}
        spotlight={spotlight}
        onStepChange={revealTourStep}
        onFinish={finishTour}
      />
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tourChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
  },
  tourLift: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  tourFilter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 6,
  },
  headerBg: {
    width: '100%',
    paddingBottom: 14,
    overflow: 'hidden',
  },
  headerImage: {
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: 12,
  },
  headerRaised: {
    zIndex: 30,
    elevation: 30,
  },
  logoBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taxiBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandLine: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.onPrimary,
    lineHeight: 18,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 20,
  },
  alertsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertsIcon: {
    width: 16,
    height: 16,
  },
  alertsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  alertsSwitch: {
    transform: [{scaleX: 0.85}, {scaleY: 0.85}],
    marginHorizontal: -4,
  },
  helpWrap: {
    position: 'relative',
    zIndex: 30,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
  },
  helpText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onPrimary,
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
    paddingTop: 14,
    paddingBottom: 100,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 244, 244, 1)',
    borderRadius: 20,
    height: 40,
    marginHorizontal: Spacing.screenPadding,
    overflow: 'hidden',
  },
  segBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  segIcon: {
    width: 18,
    height: 18,
  },
  segBtnOn: {
    backgroundColor: Colors.primary,
  },
  segText: {
    fontWeight: '700',
    color: Colors.onPrimary,
    fontSize: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    color: 'rgba(110, 107, 104, 1)',
  },
  searchFilter: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  bookingBannerWrap: {
    width: '100%',
    aspectRatio: 512 / 179,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B2437',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
  },
  featureIcon: {
    width: 34,
    height: 34,
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 13,
    textAlign: 'center',
    color: '#1B2437',
    fontWeight: '700',
    lineHeight: 17,
  },
  progressCard: {
    backgroundColor: '#FFFCF5',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
    marginBottom: 14,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTrack: {
    position: 'absolute',
    borderColor: '#E6E6E6',
  },
  ringTick: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringDash: {
    backgroundColor: '#F5C518',
  },
  ringCenter: {
    alignItems: 'center',
  },
  ringPct: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B2437',
  },
  ringLabel: {
    fontSize: 10,
    color: '#8B919A',
    marginTop: 1,
  },
  progressCopy: {
    flex: 1,
    paddingRight: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B2437',
  },
  progressSub: {
    fontSize: 13,
    color: '#8B919A',
    marginTop: 6,
    lineHeight: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6CC54',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  profileCopy: {
    flex: 1,
    paddingRight: 8,
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B2437',
  },
  profileSub: {
    fontSize: 12,
    color: '#8B919A',
    marginTop: 2,
  },
  profileChevron: {
    marginLeft: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 3,
  },
  statusDone: {
    backgroundColor: '#E5F6EA',
  },
  statusPending: {
    backgroundColor: '#FFF1CC',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextDone: {
    color: '#3BA55D',
  },
  statusTextPending: {
    color: '#E29A2D',
  },
  staySafeBannerWrap: {
    width: '100%',
    aspectRatio: 512 / 90,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginBottom: 12,
    fontSize: 13,
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
};

export default MarketHomeScreen;
