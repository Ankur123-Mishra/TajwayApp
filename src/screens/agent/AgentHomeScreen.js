import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {BookingCard, DriverCard} from '../../components/booking';
import {
  AppButton,
  AppTextInput,
  BrandLogo,
} from '../../components/common';
import {ROUTES} from '../../constants/Routes';
import {useAuth} from '../../hooks';
import {mockDrivers} from '../../mockData';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';
import {formatCurrency} from '../../utils/helpers';

const QUICK_ACTIONS = [
  {id: 'create', icon: '➕', label: 'New Booking'},
  {id: 'drivers', icon: '🚕', label: 'Find Drivers'},
  {id: 'quotes', icon: '💰', label: 'Quotes'},
  {id: 'help', icon: '🆘', label: 'Help'},
];

const CHECKLIST = [
  {id: 1, title: 'Complete agency profile', done: true},
  {id: 2, title: 'Post your first booking', done: false},
  {id: 3, title: 'Verify GST / documents', done: false},
];

/**
 * Agent home — Taxi Sanchalak style marketplace dashboard.
 */
const AgentHomeScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {user} = useAuth();
  const bookings = useSelector(state => state.booking.bookings);
  const [alertsOn, setAlertsOn] = useState(true);
  const [homeTab, setHomeTab] = useState('bookings');
  const [search, setSearch] = useState('');

  const stats = useMemo(() => {
    const open = bookings.filter(
      b =>
        b.status === 'looking_for_driver' ||
        b.status === 'posted' ||
        b.status === 'interested',
    ).length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const ongoing = bookings.filter(b => b.status === 'ongoing').length;
    return {open, confirmed, ongoing, total: bookings.length};
  }, [bookings]);

  const recent = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings
      .filter(b => {
        if (!q) {
          return true;
        }
        return (
          b.pickup?.toLowerCase().includes(q) ||
          b.drop?.toLowerCase().includes(q) ||
          b.id?.toLowerCase().includes(q)
        );
      })
      .slice(0, 4);
  }, [bookings, search]);

  const goCreate = () => navigation.navigate(ROUTES.AGENT_CREATE_BOOKING);
  const openBooking = id =>
    navigation.navigate(ROUTES.AGENT_BOOKING_DETAILS, {bookingId: id});

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <BrandLogo size="sm" />
        <View style={styles.topActions}>
          <View style={styles.alertRow}>
            <Text style={styles.alertLabel}>Alerts</Text>
            <Switch
              value={alertsOn}
              onValueChange={setAlertsOn}
              trackColor={{false: Colors.border, true: Colors.primaryLight}}
              thumbColor={alertsOn ? Colors.primary : Colors.surface}
            />
          </View>
          <TouchableOpacity style={styles.helpBtn} activeOpacity={0.85}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>
          Hello, {user?.name?.split(' ')[0] || 'Agent'} 👋
        </Text>
        <Text style={styles.company}>
          {user?.company || 'Travel Agent workspace'}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.open}</Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.confirmed}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.ongoing}</Text>
            <Text style={styles.statLabel}>Ongoing</Text>
          </View>
        </View>

        <AppButton
          title="Create New Booking"
          onPress={goCreate}
          style={styles.cta}
        />

        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segBtn, homeTab === 'bookings' && styles.segOn]}
            onPress={() => setHomeTab('bookings')}>
            <Text
              style={[
                styles.segText,
                homeTab === 'bookings' && styles.segTextOn,
              ]}>
              Bookings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, homeTab === 'vehicles' && styles.segOn]}
            onPress={() => setHomeTab('vehicles')}>
            <Text
              style={[
                styles.segText,
                homeTab === 'vehicles' && styles.segTextOn,
              ]}>
              Free Vehicles
            </Text>
          </TouchableOpacity>
        </View>

        <AppTextInput
          placeholder="Search routes, booking ID…"
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.search}
        />

        <Text style={styles.section}>Quick Actions</Text>
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity
              key={a.id}
              style={styles.quickCard}
              activeOpacity={0.85}
              onPress={() => {
                if (a.id === 'create') {
                  goCreate();
                } else if (a.id === 'drivers') {
                  navigation.navigate(ROUTES.AGENT_MARKETPLACE);
                }
              }}>
              <Text style={styles.quickIcon}>{a.icon}</Text>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.section}>Getting Started</Text>
        {CHECKLIST.map(item => (
          <View key={item.id} style={styles.checkCard}>
            <Text style={styles.checkMark}>{item.done ? '✓' : '○'}</Text>
            <Text
              style={[styles.checkText, item.done && styles.checkDone]}>
              {item.title}
            </Text>
          </View>
        ))}

        {homeTab === 'bookings' ? (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.section}>Recent Bookings</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.AGENT_BOOKINGS)}>
                <Text style={styles.link}>See all</Text>
              </TouchableOpacity>
            </View>
            {recent.length === 0 ? (
              <Text style={styles.empty}>No bookings match your search.</Text>
            ) : (
              recent.map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onPress={() => openBooking(b.id)}
                  onQuote={() => openBooking(b.id)}
                />
              ))
            )}
          </>
        ) : (
          <>
            <Text style={styles.section}>Available Drivers</Text>
            {mockDrivers.slice(0, 3).map(d => (
              <DriverCard
                key={d.id}
                driver={d}
                onViewProfile={() => {}}
                onChat={() => {}}
                onCall={() => {}}
              />
            ))}
          </>
        )}

        <View style={styles.budgetHint}>
          <Text style={styles.budgetHintText}>
            Avg open budget{' '}
            {formatCurrency(
              recent.reduce((s, b) => s + (b.budget || 0), 0) /
                Math.max(recent.length, 1),
            )}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.sm,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  helpBtn: {
    backgroundColor: Colors.helpRed,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Dimensions.borderRadius.full,
  },
  helpText: {
    color: Colors.textInverse,
    fontWeight: '700',
    fontSize: 12,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxxl,
  },
  greeting: {
    ...Typography.h3,
    color: Colors.textNavy,
  },
  company: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.primaryDark,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  cta: {
    marginBottom: Spacing.base,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.full,
    padding: 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Dimensions.borderRadius.full,
    alignItems: 'center',
  },
  segOn: {
    backgroundColor: Colors.plusButton,
  },
  segText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  segTextOn: {
    color: Colors.textInverse,
  },
  search: {
    marginBottom: Spacing.sm,
  },
  section: {
    ...Typography.h4,
    color: Colors.textNavy,
    marginTop: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    ...Typography.label,
    color: Colors.primaryDark,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickCard: {
    width: '23%',
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickIcon: {
    fontSize: 22,
  },
  quickLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  checkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkMark: {
    fontSize: 18,
    color: Colors.primaryDark,
    marginRight: Spacing.md,
    fontWeight: '700',
  },
  checkText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    flex: 1,
  },
  checkDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  empty: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.base,
  },
  budgetHint: {
    marginTop: Spacing.base,
    alignItems: 'center',
  },
  budgetHintText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});

export default AgentHomeScreen;
