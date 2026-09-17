import React, {useMemo, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MyBookingCard} from '../../components/booking';
import {FilterSlidersIcon} from '../../components/common';
import {mockMyBookings} from '../../mockData';
import {Colors, Spacing, Typography} from '../../theme';

/**
 * My Bookings — posted/received list with screenshot-matching cards.
 */
const MyBookingsScreen = () => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('posted');
  const [query, setQuery] = useState('');

  const bookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockMyBookings.filter(item => {
      if (item.tab !== tab) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        String(item.id).toLowerCase().includes(q) ||
        item.from.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q) ||
        item.vehicle.toLowerCase().includes(q)
      );
    });
  }, [tab, query]);

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>My Bookings</Text>
        <TouchableOpacity style={styles.helpBtn} activeOpacity={0.85}>
          <Text style={styles.helpText}>Help</Text>
          <Text style={styles.helpIcon}>🎧</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.segment}>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'posted' && styles.segBtnOn]}
          onPress={() => setTab('posted')}>
          <Text style={[styles.segText, tab === 'posted' && styles.segTextOn]}>
            Booking Posted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'received' && styles.segBtnOn]}
          onPress={() => setTab('received')}>
          <Text
            style={[styles.segText, tab === 'received' && styles.segTextOn]}>
            Booking Received
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for bookings..."
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.85}>
          <FilterSlidersIcon />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          bookings.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No Records found</Text>
          </View>
        }
        renderItem={({item}) => (
          <MyBookingCard
            bookingId={item.id}
            dateTime={item.dateTime}
            status={item.status}
            from={item.from}
            to={item.to}
            vehicle={item.vehicle}
            pricingNote={item.pricingNote}
            amount={item.amount}
            tripType={item.tripType}
          />
        )}
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Text style={styles.fabIcon}>🤖</Text>
        <View style={styles.fabClose}>
          <Text style={styles.fabCloseX}>×</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  headerSpacer: {
    width: 72,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
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
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 4,
    marginBottom: Spacing.md,
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
    fontSize: 13,
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
  list: {
    paddingBottom: 90,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
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
  },
  fabIcon: {
    fontSize: 28,
  },
  fabClose: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.filterRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabCloseX: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
});

export default MyBookingsScreen;
