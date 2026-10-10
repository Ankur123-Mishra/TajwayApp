import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import Images from '../../constants/Images';
import {Colors} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const PIN_GREEN = '#22C55E';
const PIN_RED = '#F43F5E';
const ONE_WAY_BG = '#E5F8EE';
const ONE_WAY_TEXT = '#1E9B55';
const ROUND_BG = '#E7F0FF';
const ROUND_TEXT = '#3B6FD8';
const FRAME_RADIUS = 22;
const EDGE = 1.5;
const LEFT_EDGE = 10;

const splitDateTime = value => {
  const raw = String(value || '');
  const [datePart, timePart] = raw.split('@');
  return {
    date: (datePart || '').trim(),
    time: (timePart || '').trim(),
  };
};

const isRoundTrip = tripType => /round|two/i.test(String(tripType || ''));

const formatAmount = value => Number(value || 0).toLocaleString('en-IN');

const RouteStop = ({styles, origin, originState, destination, destinationState}) => (
  <View style={styles.routeRow}>
    <View style={styles.place}>
      <Ionicons name="location" size={16} color={PIN_GREEN} />
      <View style={styles.placeCopy}>
        <Text style={styles.city} numberOfLines={1}>
          {origin}
        </Text>
        {originState ? (
          <Text style={styles.state} numberOfLines={1}>
            {originState}
          </Text>
        ) : null}
      </View>
    </View>
    <Ionicons name="arrow-forward" size={16} color="#C5CAD1" />
    <View style={styles.place}>
      <Ionicons name="location" size={16} color={PIN_RED} />
      <View style={styles.placeCopy}>
        <Text style={styles.city} numberOfLines={1}>
          {destination}
        </Text>
        {destinationState ? (
          <Text style={styles.state} numberOfLines={1}>
            {destinationState}
          </Text>
        ) : null}
      </View>
    </View>
  </View>
);

/**
 * My Bookings card — yellow frame with a thicker left edge and a white inner card.
 */
const MyBookingCard = ({
  dateTime,
  date,
  time,
  bookingId = 'BK001',
  from = 'Dehradun',
  fromState = '',
  to = 'Mussoorie',
  toState = '',
  vehicle = 'Sedan',
  amount = 1500,
  tripType = 'ONE WAY',
  onEdit,
  onChat,
  onShare,
  onDelete,
  onPress,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const parsed = splitDateTime(dateTime);
  const dateLabel = date || parsed.date;
  const timeLabel = time || parsed.time;
  const roundTrip = isRoundTrip(tripType);
  const code = String(bookingId || '').replace(/^#/, '');

  const stop = handler => event => {
    event?.stopPropagation?.();
    handler?.();
  };

  return (
    <TouchableOpacity
      style={styles.shell}
      activeOpacity={0.92}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.card}>
      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <Ionicons name="calendar-outline" size={15} color="#8B919A" />
          <Text style={styles.metaText}>{dateLabel}</Text>
          <View style={styles.metaDivider} />
          <Ionicons name="time-outline" size={15} color="#8B919A" />
          <Text style={styles.metaText}>{timeLabel}</Text>
        </View>
        <TouchableOpacity
          onPress={stop(onShare)}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityRole="button"
          accessibilityLabel="Share booking">
          <Ionicons name="share-social-outline" size={18} color="#3E4A59" />
        </TouchableOpacity>
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.tripPill, roundTrip && styles.tripPillRound]}>
          <Text style={[styles.tripText, roundTrip && styles.tripTextRound]}>
            {roundTrip ? 'ROUND TRIP' : 'ONE WAY'}
          </Text>
        </View>
        <View style={styles.idPill}>
          <Text style={styles.idText}>ID: #{code}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyCopy}>
          <RouteStop
            styles={styles}
            origin={from}
            originState={fromState}
            destination={to}
            destinationState={toState}
          />
          {roundTrip ? (
            <RouteStop
              styles={styles}
              origin={to}
              originState={toState}
              destination={from}
              destinationState={fromState}
            />
          ) : null}
          <View style={styles.priceRow}>
            <View style={styles.rupeeBadge}>
              <Text style={styles.rupeeMark}>₹</Text>
            </View>
            <Text style={styles.price}>₹ {formatAmount(amount)}</Text>
            <View style={styles.priceDivider} />
            <Ionicons name="car-outline" size={16} color="#6B7280" />
            <Text style={styles.vehicle}>{vehicle}</Text>
          </View>
        </View>
        <Image source={Images.carImage} style={styles.car} resizeMode="cover" />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.85}
          onPress={stop(onEdit)}
          accessibilityRole="button"
          accessibilityLabel="Edit">
          <Ionicons name="pencil" size={15} color="#8A7340" />
          <Text style={styles.actionLabel}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.85}
          onPress={stop(onChat)}
          accessibilityRole="button"
          accessibilityLabel="Chat">
          <Ionicons
            name="chatbubble-ellipses"
            size={15}
            color="#C4922A"
          />
          <Text style={styles.actionLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnDelete]}
          activeOpacity={0.85}
          onPress={stop(onDelete)}
          accessibilityRole="button"
          accessibilityLabel="Delete">
          <Ionicons name="trash" size={15} color="#F07178" />
          <Text style={[styles.actionLabel, styles.actionLabelDelete]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </TouchableOpacity>
  );
};

const baseStyles = {
  shell: {
    backgroundColor: Colors.primary,
    borderRadius: FRAME_RADIUS,
    marginBottom: 14,
    paddingTop: EDGE,
    paddingRight: EDGE,
    paddingBottom: EDGE,
    paddingLeft: LEFT_EDGE,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: FRAME_RADIUS - LEFT_EDGE,
    borderBottomLeftRadius: FRAME_RADIUS - LEFT_EDGE,
    borderTopRightRadius: FRAME_RADIUS - EDGE,
    borderBottomRightRadius: FRAME_RADIUS - EDGE,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metaDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  tripPill: {
    backgroundColor: ONE_WAY_BG,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tripPillRound: {
    backgroundColor: ROUND_BG,
  },
  tripText: {
    fontSize: 11,
    fontWeight: '800',
    color: ONE_WAY_TEXT,
    letterSpacing: 0.4,
  },
  tripTextRound: {
    color: ROUND_TEXT,
  },
  idPill: {
    backgroundColor: '#FFF3C4',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bodyCopy: {
    flex: 1,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  place: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  placeCopy: {
    flex: 1,
  },
  city: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  state: {
    marginTop: 1,
    fontSize: 11,
    color: '#9AA1AA',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  rupeeBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupeeMark: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  priceDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E5E7EB',
  },
  vehicle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  car: {
    width: 92,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 40,
    borderRadius: 22,
    backgroundColor: '#FFF8E6',
    borderWidth: 1,
    borderColor: '#F6D56A',
  },
  actionBtnDelete: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFD0D4',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionLabelDelete: {
    color: '#F07178',
  },
};

export default MyBookingCard;
