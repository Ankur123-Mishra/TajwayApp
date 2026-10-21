import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BannerHeader from '../../components/common/BannerHeader';
import AddNetworkContactModal from '../../components/profile/AddNetworkContactModal';
import Images from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {mockNetworkContacts} from '../../mockData';
import {Colors, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatInviteStatus = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  return `Invitation Sent On ${MONTHS[now.getMonth()]} ${day}, ${now.getFullYear()}`;
};

const formatPhone = phone => {
  const raw = String(phone || '').trim();
  if (!raw) {
    return '';
  }
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`;
  }
  return raw.startsWith('+') ? raw : `+91 ${raw}`;
};

const tripBadge = tripType => {
  const value = String(tripType || '').trim();
  if (!value) {
    return null;
  }
  const roundTrip = /round/i.test(value);
  return {
    label: roundTrip ? 'Round Trip' : 'ONE WAY',
    roundTrip,
  };
};

const NetworkRow = ({item, onPress}) => {
  const styles = useResponsiveStyles(baseStyles);
  const phone = formatPhone(item.phones?.[0]);
  const badge = tripBadge(item.tripType);
  const vehicle = String(item.vehicleType || '').trim();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name || 'Contact'} details`}>
      <Image source={Images.profile} style={styles.avatar} />

      <View style={styles.copy}>
        {item.name ? (
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
        ) : null}
        {phone ? (
          <View style={styles.metaRow}>
            <Image
              source={Images.phoneIcon}
              style={styles.phoneIcon}
              resizeMode="contain"
            />
            <Text style={styles.metaText} numberOfLines={1}>
              {phone}
            </Text>
          </View>
        ) : null}
        {item.company ? (
          <View style={styles.metaRow}>
            <Ionicons
              name="business-outline"
              size={14}
              color={Colors.textMuted}
            />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.company}
            </Text>
          </View>
        ) : null}
        {item.status && !item.company ? (
          <Text style={styles.status} numberOfLines={2}>
            {item.status}
          </Text>
        ) : null}
      </View>

      <View style={styles.side}>
        {badge ? (
          <View
            style={[
              styles.badge,
              badge.roundTrip ? styles.badgeRound : styles.badgeOneWay,
            ]}>
            <Text
              style={[
                styles.badgeText,
                badge.roundTrip ? styles.badgeTextRound : styles.badgeTextOneWay,
              ]}>
              {badge.label}
            </Text>
          </View>
        ) : (
          <View style={styles.badgeSpacer} />
        )}
        {vehicle ? (
          <View style={styles.vehicle}>
            <View style={styles.carClip}>
              <Image
                source={Images.carImage}
                style={styles.carImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.vehicleLabel} numberOfLines={1}>
              {vehicle}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

/**
 * My Network — contact cards with trip type and vehicle.
 */

const MyNetworkScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState(mockNetworkContacts);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleAddContact = contact => {
    const nextContact = {
      id: `net-${Date.now()}`,
      name: contact.name,
      phones: contact.phone ? [contact.phone] : [],
      status: formatInviteStatus(),
      company: contact.company,
      tripType: contact.tripType,
      vehicleType: contact.vehicleType,
      location: contact.location || 'Delhi NCR',
      rating: 4.5,
      networkSince: formatInviteStatus().replace('Invitation Sent On ', ''),
      activeStatus: 'Invitation pending',
    };
    setContacts(prev => [nextContact, ...prev]);
  };

  const openContactDetails = contact => {
    navigation.navigate(ROUTES.CONTACT_DETAILS, {contact});
  };

  return (
    <View style={styles.container}>
      <BannerHeader title="My Network" onBack={() => navigation.goBack()} />

      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <NetworkRow item={item} onPress={openContactDetails} />
        )}
        contentContainerStyle={[
          styles.list,
          {paddingBottom: insets.bottom + 88},
        ]}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fab, {bottom: insets.bottom + 20}]}
        activeOpacity={0.9}
        onPress={() => setSheetOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Add to network">
        <Ionicons name="add" size={32} color={Colors.onPrimary} />
      </TouchableOpacity>

      <AddNetworkContactModal
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={handleAddContact}
      />
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
    marginTop: 2,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
    paddingTop: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phoneIcon: {
    width: 14,
    height: 14,
  },
  metaText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    fontWeight: Typography.fontWeights.medium,
    color: '#3A4250',
  },
  status: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textMuted,
  },
  side: {
    width: 92,
    alignItems: 'flex-end',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeSpacer: {
    height: 22,
  },
  badgeOneWay: {
    backgroundColor: '#E5F6EA',
  },
  badgeRound: {
    backgroundColor: '#E7F0FF',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
  },
  badgeTextOneWay: {
    color: '#3EAE62',
  },
  badgeTextRound: {
    color: '#4C8DFF',
  },
  vehicle: {
    marginTop: 8,
    width: 84,
    alignItems: 'center',
  },
  carClip: {
    width: 84,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: 84,
    height: 52,
  },
  vehicleLabel: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: Typography.fontWeights.bold,
    color: '#1E293B',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
};

export default MyNetworkScreen;
