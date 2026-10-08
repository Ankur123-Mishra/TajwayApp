import React, {useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MarketFilterSheet, MyBookingCard} from '../../components/booking';
import {EMPTY_FILTERS} from '../../components/booking/MarketFilterSheet';
import {FilterSlidersIcon} from '../../components/common';
import {ROUTES} from '../../constants/Routes';
import {getChatByBookingId, mockMyBookings} from '../../mockData';
import {Colors, Spacing, Typography} from '../../theme';

const SAMPLE_PHONES = [
  '9876543210',
  '9123456780',
  '9988776655',
  '9170337201',
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

/**
 * My Bookings — posted/received list with screenshot-matching cards.
 */
const MyBookingsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('posted');
  const [query, setQuery] = useState('');
  const [bookingsList, setBookingsList] = useState(mockMyBookings);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);

  const bookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = bookingsList.filter(item => {
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
      list = list.filter(b =>
        String(b.vehicle || '')
          .toLowerCase()
          .includes(vehicle),
      );
    }

    if (appliedFilters.pickupLocation) {
      const pickup = appliedFilters.pickupLocation.toLowerCase();
      list = list.filter(b =>
        String(b.from || '')
          .toLowerCase()
          .includes(pickup),
      );
    }

    if (appliedFilters.dropLocation) {
      const drop = appliedFilters.dropLocation.toLowerCase();
      list = list.filter(b =>
        String(b.to || '')
          .toLowerCase()
          .includes(drop),
      );
    }

    return list;
  }, [tab, query, bookingsList, appliedFilters]);

  const navigateRoot = (routeName, params) => {
    const parent = navigation.getParent?.();
    if (parent) {
      parent.navigate(routeName, params);
      return;
    }
    navigation.navigate(routeName, params);
  };

  const handleHelpPress = () => {
    setHelpMenuOpen(prev => !prev);
  };

  const handleHelpCall = () => {
    setHelpMenuOpen(false);
    openDialer();
  };

  const handleEdit = item => {
    navigateRoot(ROUTES.POST_BOOKING, {booking: item, mode: 'edit'});
  };

  const handleChat = item => {
    const chat = getChatByBookingId(item.id);
    navigateRoot(ROUTES.CHAT, {
      chatId: chat?.id || 'chat-001',
      bookingId: item.id,
    });
  };

  const handleShare = async item => {
    const amount = Number(item.amount).toLocaleString('en-IN');
    const message = [
      `Tajway Booking #${item.id}`,
      `${item.from} → ${item.to}`,
      item.dateTime,
      `${item.vehicle} | ${item.tripType}`,
      `Amount: ₹${amount}`,
      item.pricingNote ? `Note: ${item.pricingNote}` : null,
      `Status: ${item.status}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await Share.share({
        message,
        title: `Booking #${item.id}`,
      });
    } catch {
      Alert.alert('Share failed', 'Unable to share this booking right now.');
    }
  };

  const handleDelete = item => {
    Alert.alert(
      'Delete Booking',
      `Are you sure you want to delete booking #${item.id}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBookingsList(prev => prev.filter(b => b.id !== item.id));
          },
        },
      ],
    );
  };

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
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>My Bookings</Text>
        <View style={styles.helpWrap}>
          <TouchableOpacity
            style={styles.helpBtn}
            activeOpacity={0.85}
            onPress={handleHelpPress}
            accessibilityRole="button"
            accessibilityLabel="Help">
            <Text style={styles.helpText}>Help</Text>
            <Text style={styles.helpIcon}>🎧</Text>
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
        <TouchableOpacity
          style={styles.filterBtn}
          activeOpacity={0.85}
          onPress={() => setFilterOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Apply filters">
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
            onEdit={() => handleEdit(item)}
            onChat={() => handleChat(item)}
            onShare={() => handleShare(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      <MarketFilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        initial={appliedFilters}
        onSave={setAppliedFilters}
      />

      {/* Support AI FAB — temporarily hidden
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Text style={styles.fabIcon}>🤖</Text>
        <View style={styles.fabClose}>
          <Text style={styles.fabCloseX}>×</Text>
        </View>
      </TouchableOpacity>
      */}
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
  headerRaised: {
    zIndex: 30,
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
  helpWrap: {
    position: 'relative',
    zIndex: 30,
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
    color: Colors.onPrimary,
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
