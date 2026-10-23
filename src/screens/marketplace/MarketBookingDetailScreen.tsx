import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BannerHeader from '../../components/common/BannerHeader';
import {ROUTES} from '../../constants/Routes';
import {Images} from '../../constants/Images';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const NAVY = '#1B2A4A';
const MUTED = '#8A93A6';
const GREEN = '#1FA85A';
const RED = '#E23B3B';
const GOLD = '#E0B43A';

const formatInr = value => `₹${Number(value).toLocaleString('en-IN')}`;

const tripBadge = tripType =>
  String(tripType || 'One Way')
    .trim()
    .replace(/\s+/g, '-')
    .toUpperCase();

const initialsOf = name =>
  String(name || 'D')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

const RouteDash = () => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.routeDash}>
      {Array.from({length: 5}).map((_, index) => (
        <View key={index} style={styles.routeDashSeg} />
      ))}
    </View>
  );
};

/**
 * Market booking detail — Trip Details layout from the product screenshot.
 */

const MarketBookingDetailScreen = ({navigation, route}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const booking = route?.params?.booking || {};

  const {
    when = 'Today',
    time = '10:00 AM',
    duration,
    from = '',
    to,
    pickupFrom,
    dropTo,
    tripType = 'One Way',
    vehicle = 'Sedan',
    notes,
    extras,
    bookingType = 'Public Booking',
    totalAmount,
    driverEarning,
    commission,
    reviews = 0,
    rating = 5,
    name = 'Travel Partner',
    hasAvatar = false,
  } = booking;

  const hasQuote = totalAmount == null || totalAmount === '';
  const pickupValue = pickupFrom || from;
  const dropValue = dropTo || to;
  const extraText = extras || notes;
  const schedule = duration ? `${when}, ${time} · ${duration}` : `${when}, ${time}`;
  const ratingLabel = Number(rating).toFixed(1);

  const handleChat = () => {
    navigation.navigate(ROUTES.CHAT, {
      chatId: booking.chatId || `booking-${booking.id || 'market'}`,
      contactName: booking.name,
      booking,
      fromMarket: true,
    });
  };

  const amounts = [
    {key: 'total', icon: 'cash-outline', label: 'Total Amount', value: totalAmount},
    {key: 'earn', icon: 'person-outline', label: 'Driver Earning', value: driverEarning},
    {key: 'comm', icon: 'percent', label: 'Commission', value: commission},
  ].filter(item => item.value != null && item.value !== '');

  return (
    <View style={styles.container}>
      <BannerHeader title="Trip Details" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 28},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.vehicleRow}>
            <View style={styles.carWrap}>
              <View style={styles.carHalo} />
              <Image
                source={Images.carImage}
                style={styles.carImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.vehicleCopy}>
              <Text style={styles.vehicleName} numberOfLines={2}>
                {vehicle}
              </Text>
              <View style={styles.tripPill}>
                <Text style={styles.tripPillText}>{tripBadge(tripType)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.scheduleBar}>
            <Ionicons name="calendar-outline" size={18} color={GOLD} />
            <Text style={styles.scheduleText} numberOfLines={1}>
              {schedule}
            </Text>
            <Ionicons name="time-outline" size={18} color={GOLD} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.stopBlock}>
            <View style={styles.stopRail}>
              <View style={styles.pickupRing}>
                <View style={styles.pickupDot} />
              </View>
              {dropValue ? <RouteDash /> : null}
            </View>
            <View style={styles.stopCopy}>
              <Text style={styles.pickupLabel}>PICKUP</Text>
              <Text style={styles.stopAddress}>{pickupValue}</Text>
            </View>
          </View>

          {dropValue ? (
            <View style={styles.stopBlock}>
              <View style={styles.stopRail}>
                <Ionicons name="location" size={22} color={RED} />
              </View>
              <View style={styles.stopCopy}>
                <Text style={styles.dropLabel}>DROP</Text>
                <Text style={styles.stopAddress}>{dropValue}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {extraText ? (
          <View style={[styles.card, styles.rowCard]}>
            <View style={styles.iconTile}>
              <Ionicons name="document-text-outline" size={22} color={GOLD} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Extra Requirement</Text>
              <Text style={styles.rowBody}>{extraText}</Text>
            </View>
          </View>
        ) : null}

        <View style={[styles.card, styles.typeCard]}>
          <View style={styles.iconTile}>
            <Ionicons name="pricetag" size={20} color={GOLD} />
          </View>
          <Text style={styles.typeTitle}>Booking Type</Text>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{bookingType}</Text>
          </View>
        </View>

        <View style={styles.amountCard}>
          {hasQuote ? (
            <View style={styles.quoteBlock}>
              <Text style={styles.quoteText}>Quote Best Price</Text>
              <Text style={styles.quoteHint}>Total Amount</Text>
            </View>
          ) : (
            amounts.map(item => (
              <View key={item.key} style={styles.amountCol}>
                {item.icon === 'percent' ? (
                  <View style={styles.percentBadge}>
                    <Text style={styles.percentMark}>%</Text>
                  </View>
                ) : (
                  <Ionicons name={item.icon} size={22} color={GOLD} />
                )}
                <Text style={styles.amountLabel}>{item.label}</Text>
                <Text style={styles.amountValue}>{formatInr(item.value)}</Text>
              </View>
            ))
          )}
        </View>

        <View style={[styles.card, styles.driverCard]}>
          <View style={styles.avatarWrap}>
            {hasAvatar ? (
              <Image
                source={Images.partnerDeepesh}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initialsOf(name)}</Text>
              </View>
            )}
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.driverCopy}>
            <Text style={styles.driverName} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.driverRole}>Driver</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingValue}>{ratingLabel}</Text>
              <Text style={styles.ratingCount}>({reviews} reviews)</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.chatBtn}
            activeOpacity={0.85}
            onPress={handleChat}
            accessibilityRole="button"
            accessibilityLabel="Chat">
            <Ionicons name="chatbubble-ellipses" size={16} color={NAVY} />
            <Text style={styles.chatBtnText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    paddingHorizontal: Spacing.base,
    paddingTop: 14,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carWrap: {
    width: 118,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  carHalo: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF3C4',
    left: 10,
    top: 3,
  },
  carImage: {
    width: 112,
    height: 64,
  },
  vehicleCopy: {
    flex: 1,
    paddingTop: 4,
  },
  vehicleName: {
    fontSize: 22,
    lineHeight: 28,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  tripPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tripPillText: {
    fontSize: 11,
    letterSpacing: 0.4,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  scheduleBar: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  scheduleText: {
    flex: 1,
    fontSize: 14,
    color: '#5C6578',
    fontWeight: Typography.fontWeights.medium,
  },
  stopBlock: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  stopRail: {
    width: 28,
    alignItems: 'center',
    marginRight: 10,
  },
  pickupRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
  },
  routeDash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 4,
    minHeight: 16,
  },
  routeDashSeg: {
    width: 2,
    height: 5,
    borderRadius: 1,
    backgroundColor: '#C5CAD3',
  },
  stopCopy: {
    flex: 1,
    paddingBottom: 4,
  },
  pickupLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: GREEN,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 3,
  },
  dropLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: RED,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 3,
    marginTop: 2,
  },
  stopAddress: {
    fontSize: 16,
    lineHeight: 22,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF4CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowCopy: {
    flex: 1,
    paddingTop: 2,
  },
  rowTitle: {
    fontSize: 16,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  rowBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: MUTED,
    fontWeight: Typography.fontWeights.medium,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeTitle: {
    flex: 1,
    fontSize: 16,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  typePill: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  typePillText: {
    fontSize: 12,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  amountCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9EE',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  amountCol: {
    flex: 1,
    alignItems: 'center',
  },
  percentBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentMark: {
    fontSize: 12,
    color: GOLD,
    fontWeight: Typography.fontWeights.bold,
    marginTop: -1,
  },
  amountLabel: {
    marginTop: 8,
    fontSize: 11,
    color: MUTED,
    textAlign: 'center',
    fontWeight: Typography.fontWeights.medium,
  },
  amountValue: {
    marginTop: 4,
    fontSize: 16,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  quoteBlock: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  quoteText: {
    fontSize: 18,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  quoteHint: {
    marginTop: 4,
    fontSize: 12,
    color: MUTED,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarWrap: {
    width: 58,
    height: 58,
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF1F6',
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF1F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  driverCopy: {
    flex: 1,
    marginRight: 8,
  },
  driverName: {
    fontSize: 16,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
  driverRole: {
    marginTop: 1,
    fontSize: 12,
    color: MUTED,
    fontWeight: Typography.fontWeights.medium,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingStar: {
    fontSize: 13,
    color: Colors.primary,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 13,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: MUTED,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  chatBtnText: {
    fontSize: 14,
    color: NAVY,
    fontWeight: Typography.fontWeights.bold,
  },
};

export default MarketBookingDetailScreen;
