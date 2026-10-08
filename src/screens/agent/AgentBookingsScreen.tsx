import React, {useMemo, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {BookingCard, FilterSheet} from '../../components/booking';
import {EmptyState, ScreenHeader} from '../../components/common';
import {BOOKING_STATUS} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const TABS = [
  {key: 'all', label: 'All'},
  {key: BOOKING_STATUS.POSTED, label: 'Posted', match: ['posted', 'looking_for_driver', 'open']},
  {key: BOOKING_STATUS.INTERESTED, label: 'Interested', match: ['interested', 'quoted']},
  {key: BOOKING_STATUS.CONFIRMED, label: 'Confirmed', match: ['confirmed']},
  {key: BOOKING_STATUS.ONGOING, label: 'Ongoing', match: ['ongoing']},
  {key: BOOKING_STATUS.COMPLETED, label: 'Completed', match: ['completed']},
  {key: BOOKING_STATUS.CANCELLED, label: 'Cancelled', match: ['cancelled']},
];

const AgentBookingsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const bookings = useSelector(state => state.booking.bookings);
  const [tab, setTab] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const filtered = useMemo(() => {
    const tabDef = TABS.find(t => t.key === tab);
    return bookings.filter(b => {
      if (tab !== 'all' && tabDef?.match && !tabDef.match.includes(b.status)) {
        return false;
      }
      if (filters.status && b.status !== filters.status) {
        return false;
      }
      if (
        filters.vehicleType &&
        !(b.vehicleType || '')
          .toLowerCase()
          .includes(String(filters.vehicleType).toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [bookings, tab, filters]);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <ScreenHeader
        title="My Bookings"
        showBack={false}
        right={
          <TouchableOpacity onPress={() => setFilterOpen(true)}>
            <Text style={styles.filter}>Filter</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.tabsWrap}>
        <FlatList
          horizontal
          data={TABS}
          keyExtractor={item => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
          renderItem={({item}) => {
            const active = tab === item.key;
            return (
              <TouchableOpacity
                style={[styles.tab, active && styles.tabOn]}
                onPress={() => setTab(item.key)}>
                <Text style={[styles.tabText, active && styles.tabTextOn]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No bookings"
            description="Create a booking to start receiving driver interest."
            actionLabel="Create Booking"
            onAction={() => navigation.navigate(ROUTES.AGENT_CREATE_BOOKING)}
          />
        }
        renderItem={({item}) => (
          <BookingCard
            booking={item}
            onPress={() =>
              navigation.navigate(ROUTES.AGENT_BOOKING_DETAILS, {
                bookingId: item.id,
              })
            }
            onQuote={() =>
              navigation.navigate(ROUTES.AGENT_BOOKING_DETAILS, {
                bookingId: item.id,
              })
            }
          />
        )}
      />

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        initial={filters}
        onApply={setFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filter: {
    ...Typography.label,
    color: Colors.filterRed,
  },
  tabsWrap: {
    marginBottom: Spacing.sm,
  },
  tabs: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Dimensions.borderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabOn: {
    backgroundColor: Colors.plusButton,
    borderColor: Colors.plusButton,
  },
  tabText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextOn: {
    color: Colors.textInverse,
  },
  list: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxxl,
  },
});

export default AgentBookingsScreen;
