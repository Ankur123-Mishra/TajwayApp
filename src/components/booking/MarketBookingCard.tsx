import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Images} from '../../constants/Images';
import {useResponsiveStyles} from '../../hooks';

const formatInr = value => `₹${Number(value).toLocaleString('en-IN')}`;

const isRoundTrip = tripType => /round|two/i.test(String(tripType || ''));

const tripTypeLabel = tripType =>
  isRoundTrip(tripType) ? 'Round Trip' : 'One Way';

/** Short city label from "City, State, Country" style strings. */

const shortCity = value => {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }
  return raw.split(',')[0].trim();
};

const splitExtras = extras => {
  if (Array.isArray(extras)) {
    return extras.map(item => String(item).trim()).filter(Boolean);
  }
  return String(extras || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 3);
};

const noteParts = text =>
  String(text || '')
    .split(/,|→|->/)
    .map(part => part.trim())
    .filter(Boolean);

/**
 * Market trip request card — matches the marketplace booking screenshot.
 */


const MarketBookingCard = ({
  name = 'Travel Partner',
  company,
  when = 'Tomorrow',
  time = '07:00 AM',
  from = 'Gurugram',
  to,
  pickupFrom,
  dropTo,
  tripType = 'One Way',
  vehicle = 'Sedan',
  vehicleType = 'sedan',
  notes,
  extras,
  totalAmount,
  driverEarning,
  commission,
  reviews = 0,
  rating = 5,
  partnerHidden = false,
  onPress,
  onQuote,
  onChat,
  onContact,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const hasQuote = totalAmount == null || totalAmount === '';
  const handleContact = onChat || onContact;
  const extraItems = splitExtras(extras);
  const origin = shortCity(from) || shortCity(pickupFrom) || '—';
  const destination = shortCity(to) || shortCity(dropTo) || '—';
  const noteText =
    notes ||
    [pickupFrom, dropTo].filter(Boolean).join(' → ') ||
    [from, to].filter(Boolean).join(' → ');
  const stops = noteParts(noteText);
  const roundTrip = isRoundTrip(tripType);
  const tripLabel = tripTypeLabel(tripType);
  const typeLabel =
    String(vehicleType || 'sedan').charAt(0).toUpperCase() +
    String(vehicleType || 'sedan').slice(1);

  const stopAndRun = handler => e => {
    e?.stopPropagation?.();
    handler?.();
  };

  const prices = [
    {
      key: 'total',
      icon: 'cash',
      label: 'Total Amount',
      amount: formatInr(totalAmount),
    },
    {
      key: 'earn',
      icon: 'wallet',
      label: 'Driver Earning',
      amount: formatInr(driverEarning),
    },
    {
      key: 'comm',
      icon: 'percent',
      label: 'Commission',
      amount: formatInr(commission),
    },
  ];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel="Open booking details">
      <View style={styles.head}>
        <View style={styles.timeRow}>
          <Image source={Images.timeIcon} style={styles.timeIcon} />
          <Text style={styles.when} numberOfLines={1}>
            {when} at {time}
          </Text>
          <View style={styles.tripBadge}>
            <Text style={styles.tripBadgeText} numberOfLines={1}>
              {tripLabel}
            </Text>
          </View>
        </View>

        <View style={styles.locationBar}>
          <View style={styles.place}>
            <Image source={Images.locationIcon} style={styles.pin} />
            <Text style={styles.city} numberOfLines={1}>
              {origin}
            </Text>
          </View>

          {roundTrip ? (
            <Ionicons
              name="swap-horizontal"
              size={18}
              color="#1A1A1A"
              style={styles.routeIcon}
            />
          ) : (
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#1A1A1A"
              style={styles.routeIcon}
            />
          )}

          <View style={[styles.place, styles.placeEnd]}>
            <Image source={Images.locationIcon} style={styles.pin} />
            <Text style={styles.city} numberOfLines={1}>
              {destination}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.detailBox}>
          <View style={styles.vehicleCol}>
            <Image
              source={Images.carImage}
              style={styles.carImage}
              resizeMode="contain"
            />
            <View style={styles.vehicleCopy}>
              <Text style={styles.vehicle} numberOfLines={2}>
                {vehicle}
              </Text>
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>{typeLabel}</Text>
              </View>
            </View>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.notesCol}>
            <View style={styles.notesTitleRow}>
              <Ionicons name="document-text-outline" size={14} color="#1B2437" />
              <Text style={styles.notesTitle}>Trip Notes</Text>
            </View>
            <Text style={styles.notesText} numberOfLines={3}>
              {stops.length
                ? stops.map((part, index) => (
                    <Text key={`${part}-${index}`}>
                      {index > 0 ? (
                        <Text style={styles.noteArrow}> → </Text>
                      ) : null}
                      {part}
                    </Text>
                  ))
                : noteText}
            </Text>
          </View>
        </View>

      {extraItems.length ? (
        <View style={styles.extrasBlock}>
          <View style={styles.extrasTitleRow}>
            <View style={styles.starBadge}>
              <Ionicons name="star-outline" size={13} color="#1B2437" />
            </View>
            <Text style={styles.extrasTitle}>Extra Requirements</Text>
          </View>
          <View style={styles.extraList}>
            {extraItems.map(item => (
              <View key={item} style={styles.extraItem}>
                <Text style={styles.extraCheck}>✓</Text>
                <Text style={styles.extraText} numberOfLines={1}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {hasQuote ? (
        <TouchableOpacity
          onPress={stopAndRun(onQuote)}
          activeOpacity={0.8}
          style={styles.quoteWrap}>
          <Text style={styles.quote}>Quote Best Price</Text>
          <Text style={styles.totalHint}>Total Amount</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.priceBar}>
          {prices.map((item, index) => (
            <View
              key={item.key}
              style={[styles.priceItem, index > 0 && styles.priceItemBorder]}>
              <View style={styles.priceIcon}>
                {item.icon === 'percent' ? (
                  <Text style={styles.percentMark}>%</Text>
                ) : (
                  <Ionicons name={item.icon} size={14} color="#1B2437" />
                )}
              </View>
              <View style={styles.priceCopy}>
                <Text style={styles.priceLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.priceAmt} numberOfLines={1}>
                  {item.amount}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        {partnerHidden ? (
          <View style={styles.avatar}>
            <Ionicons name="lock-closed" size={16} color="#fff" />
          </View>
        ) : (
          <Image source={Images.profile} style={styles.avatarImg} />
        )}

        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName} numberOfLines={1}>
            {partnerHidden ? 'Hidden' : name}
          </Text>
          {company && !partnerHidden ? (
            <Text style={styles.partnerCompany} numberOfLines={1}>
              {company}
            </Text>
          ) : null}
          <View style={styles.reviewRow}>
            <Ionicons name="star" size={12} color="#F5C518" />
            <Text style={styles.ratingText}>{Number(rating).toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({reviews} reviews)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.chatBtn}
          onPress={stopAndRun(handleContact)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Chat">
          <Ionicons name="chatbubble-ellipses" size={14} color="#1B2437" />
          <Text style={styles.chatText}>Chat</Text>
        </TouchableOpacity>
      </View>
      </View>
    </TouchableOpacity>
  );
};

const baseStyles = {
  card: {
    backgroundColor: '#F6CC54',
    borderRadius: 22,
    marginBottom: 14,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F8E7A8',
    elevation: 0,
    shadowOpacity: 0,
  },
  head: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  when: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  tripBadge: {
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tripBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6D4',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flexGrow: 1,
    gap: 4,
  },
  placeEnd: {
    justifyContent: 'flex-end',
  },
  pin: {
    width: 16,
    height: 20,
    resizeMode: 'contain',
  },
  city: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  routeIcon: {
    marginHorizontal: 8,
    flexShrink: 0,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
  },
  detailBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  vehicleCol: {
    width: 118,
    flexDirection: 'row',
    alignItems: 'center',
  },
  carImage: {
    width: 58,
    height: 36,
  },
  vehicleCopy: {
    flex: 1,
    marginLeft: 4,
  },
  vehicle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B2437',
  },
  typePill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#EEF3FA',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5C6B80',
  },
  detailDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginHorizontal: 8,
  },
  notesCol: {
    flex: 1,
    justifyContent: 'center',
  },
  notesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B2437',
  },
  notesText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#3E4A59',
  },
  noteArrow: {
    color: '#F5C518',
    fontWeight: '800',
  },
  extrasBlock: {
    marginTop: 12,
    marginBottom: 12,
  },
  extrasTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  starBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F6CC54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extrasTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1B2437',
  },
  extraList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 30,
    gap: 12,
  },
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '48%',
  },
  extraCheck: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B2437',
  },
  extraText: {
    flexShrink: 1,
    fontSize: 12,
    color: '#1B2437',
  },
  quoteWrap: {
    alignItems: 'center',
    backgroundColor: '#FFF6D4',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B2437',
  },
  totalHint: {
    fontSize: 12,
    color: '#8B919A',
    marginTop: 2,
  },
  priceBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF6D4',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  priceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  priceItemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0, 0, 0, 0.08)',
  },
  priceIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F6CC54',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  percentMark: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B2437',
  },
  priceCopy: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 9,
    color: '#3E4A59',
  },
  priceAmt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B2437',
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#3E4A40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1B2437',
  },
  partnerCompany: {
    fontSize: 12,
    color: '#8B919A',
    marginTop: 1,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B2437',
  },
  reviewCount: {
    fontSize: 12,
    color: '#8B919A',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6CC54',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 5,
  },
  chatText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1B2437',
  },
};

export default MarketBookingCard;
