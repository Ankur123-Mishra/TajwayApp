import React, {useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MarketFilterSheet, MyBookingCard} from '../../components/booking';
import {EMPTY_FILTERS} from '../../components/booking/MarketFilterSheet';
import BannerHeader from '../../components/common/BannerHeader';
import Images from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {getChatByBookingId, mockMyBookings} from '../../mockData';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

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

const matchesTrip = (booking, trip) => {
  const value = String(booking.tripType || '')
    .toLowerCase()
    .replace(/\s/g, '');
  const selected = String(trip || '')
    .toLowerCase()
    .replace(/\s/g, '');
  if (!selected || selected === 'both') {
    return true;
  }
  if (selected === 'oneway') {
    return value.includes('one');
  }
  return value.includes('round') || value.includes('two');
};

/**
 * My Bookings — posted and received lists matching the bookings screenshot.
 */
const MyBookingsScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const [tab, setTab] = useState('posted');
  const [query, setQuery] = useState('');
  const [bookingsList, setBookingsList] = useState(mockMyBookings);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const bookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = bookingsList.filter(item => {
      if (item.tab !== tab) {
        return false;
      }
      if (!q) {
        return true;
      }
      const haystack = [
        item.id,
        item.code,
        item.from,
        item.fromState,
        item.to,
        item.toState,
        item.vehicle,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    if (appliedFilters.tripType) {
      list = list.filter(item => matchesTrip(item, appliedFilters.tripType));
    }

    if (appliedFilters.vehicleType) {
      const vehicle = appliedFilters.vehicleType.toLowerCase();
      list = list.filter(item =>
        String(item.vehicle || '')
          .toLowerCase()
          .includes(vehicle),
      );
    }

    if (appliedFilters.pickupLocation) {
      const pickup = appliedFilters.pickupLocation.toLowerCase();
      list = list.filter(item =>
        String(item.from || '')
          .toLowerCase()
          .includes(pickup),
      );
    }

    if (appliedFilters.dropLocation) {
      const drop = appliedFilters.dropLocation.toLowerCase();
      list = list.filter(item =>
        String(item.to || '')
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
      `Tajway Booking #${item.code || item.id}`,
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
        title: `Booking #${item.code || item.id}`,
      });
    } catch {
      Alert.alert('Share failed', 'Unable to share this booking right now.');
    }
  };

  const handleDelete = item => {
    Alert.alert(
      'Delete Booking',
      `Are you sure you want to delete booking #${item.code || item.id}?`,
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
    <View style={styles.container}>
      {helpMenuOpen ? (
        <TouchableOpacity
          style={styles.helpBackdrop}
          activeOpacity={1}
          onPress={() => setHelpMenuOpen(false)}
        />
      ) : null}

      <View
        onLayout={event => setHeaderHeight(event.nativeEvent.layout.height)}>
        <BannerHeader raised={helpMenuOpen}>
          <View style={styles.headerRow}>
            <View style={styles.headerSide} />
            <Text style={styles.title}>My Bookings</Text>
            <View style={styles.headerSide}>
              <TouchableOpacity
                style={styles.helpBtn}
                activeOpacity={0.85}
                onPress={handleHelpPress}
                accessibilityRole="button"
                accessibilityLabel="Help">
                <Ionicons name="headset" size={14} color={Colors.textPrimary} />
                <Text style={styles.helpText}>Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BannerHeader>
      </View>

      {helpMenuOpen ? (
        <View style={[styles.helpPopup, {top: Math.max(headerHeight - 8, 0)}]}>
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

      <View style={styles.segment}>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'posted' && styles.segBtnOn]}
          activeOpacity={0.85}
          onPress={() => setTab('posted')}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={Colors.textPrimary}
          />
          <Text style={styles.segText} numberOfLines={1}>
            Bookings Posted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'received' && styles.segBtnOn]}
          activeOpacity={0.85}
          onPress={() => setTab('received')}>
          <Ionicons name="car-outline" size={16} color={Colors.textPrimary} />
          <Text style={styles.segText} numberOfLines={1}>
            Booking Received
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="rgba(110, 107, 104, 1)" />
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
          accessibilityLabel="Apply filters">
          <Image
            source={Images.filterIcon}
            style={styles.filterIcon}
            resizeMode="contain"
          />
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
            bookingId={item.code || item.id}
            dateTime={item.dateTime}
            from={item.from}
            fromState={item.fromState}
            to={item.to}
            toState={item.toState}
            vehicle={item.vehicle}
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
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  headerSide: {
    width: 88,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
  },
  helpText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  helpBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  helpPopup: {
    position: 'absolute',
    right: Spacing.screenPadding,
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
    elevation: 8,
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
  helpPopupText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textNavy,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 244, 244, 1)',
    borderRadius: 20,
    height: 40,
    marginTop: 14,
    marginHorizontal: Spacing.screenPadding,
    marginBottom: 12,
    overflow: 'hidden',
  },
  segBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
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
    marginHorizontal: Spacing.screenPadding,
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
  list: {
    paddingHorizontal: Spacing.screenPadding,
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
};

export default MyBookingsScreen;
