import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MarketFilterSheet} from '../../components/booking';
import {EMPTY_FILTERS} from '../../components/booking/MarketFilterSheet';
import {ChatListCard} from '../../components/chat';
import BannerHeader from '../../components/common/BannerHeader';
import Images from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {mockChats} from '../../mockData';
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
  const value = String(booking?.tripType || '')
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
 * Chats tab — Posted / Received list with search and filters.
 */
const AgentMessagesScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const [tab, setTab] = useState('posted');
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const chats = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = mockChats.filter(item => {
      if (item.tab !== tab) {
        return false;
      }
      if (!q) {
        return true;
      }
      const booking = item.booking || {};
      const haystack = [
        item.contactName,
        item.lastMessage,
        booking.from,
        booking.to,
        booking.vehicle,
        booking.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    if (appliedFilters.tripType) {
      list = list.filter(item =>
        matchesTrip(item.booking, appliedFilters.tripType),
      );
    }

    if (appliedFilters.vehicleType) {
      const vehicle = appliedFilters.vehicleType.toLowerCase();
      list = list.filter(item =>
        String(item.booking?.vehicle || '')
          .toLowerCase()
          .includes(vehicle),
      );
    }

    if (appliedFilters.pickupLocation) {
      const pickup = appliedFilters.pickupLocation.toLowerCase();
      list = list.filter(item =>
        String(item.booking?.from || '')
          .toLowerCase()
          .includes(pickup),
      );
    }

    if (appliedFilters.dropLocation) {
      const drop = appliedFilters.dropLocation.toLowerCase();
      list = list.filter(item =>
        String(item.booking?.to || '')
          .toLowerCase()
          .includes(drop),
      );
    }

    return list;
  }, [tab, query, appliedFilters]);

  const openChat = chat => {
    const parent = navigation.getParent?.();
    if (parent) {
      parent.navigate(ROUTES.CHAT, {chatId: chat.id});
      return;
    }
    navigation.navigate(ROUTES.CHAT, {chatId: chat.id});
  };

  const handleHelpPress = () => {
    setHelpMenuOpen(prev => !prev);
  };

  const handleHelpCall = () => {
    setHelpMenuOpen(false);
    openDialer();
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
            <Text style={styles.title}>Chats</Text>
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
          <Text style={[styles.segText, tab === 'posted' && styles.segTextOn]}>
            Posted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'received' && styles.segBtnOn]}
          activeOpacity={0.85}
          onPress={() => setTab('received')}>
          <Text
            style={[styles.segText, tab === 'received' && styles.segTextOn]}>
            Received
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="rgba(110, 107, 104, 1)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Chats..."
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
        data={chats}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          chats.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No Chats Found</Text>
          </View>
        }
        renderItem={({item}) => (
          <ChatListCard
            contactName={item.contactName}
            lastMessage={item.lastMessage}
            lastMessageAt={item.lastMessageAt}
            from={item.booking?.from}
            to={item.booking?.to}
            amount={item.booking?.amount}
            status={item.booking?.status}
            onPress={() => openChat(item)}
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
    borderRadius: 22,
    height: 44,
    padding: 4,
    marginTop: 14,
    marginHorizontal: Spacing.screenPadding,
    marginBottom: 12,
  },
  segBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnOn: {
    backgroundColor: Colors.primary,
  },
  segText: {
    fontWeight: '700',
    color: '#8B919A',
    fontSize: 15,
  },
  segTextOn: {
    color: Colors.textPrimary,
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

export default AgentMessagesScreen;
