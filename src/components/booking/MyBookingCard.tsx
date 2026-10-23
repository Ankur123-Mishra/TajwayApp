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
const FARE_PANEL_BG = '#FFF8E6';
const FRAME_RADIUS = 18;
const EDGE = 1.5;
const LEFT_EDGE = 6;

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

const RouteDash = ({styles, bidirectional = false}) => {
  const dots = Array.from({length: 4}).map((_, index) => (
    <View key={index} style={styles.dashDot} />
  ));

  return (
    <View style={styles.dashCol}>
      {bidirectional ? (
        <Ionicons name="caret-up" size={10} color="#C5CAD1" />
      ) : null}
      {dots}
      <Ionicons name="caret-down" size={10} color="#C5CAD1" />
    </View>
  );
};

const RouteTimeline = ({
  styles,
  origin,
  originState,
  destination,
  destinationState,
  showReturnArrow = false,
}) => (
  <View style={styles.timeline}>
    <View style={styles.timelineRail}>
      <Ionicons name="location" size={16} color={PIN_GREEN} />
      <View style={styles.dashRow}>
        <RouteDash styles={styles} bidirectional={showReturnArrow} />
      </View>
      <Ionicons name="location" size={16} color={PIN_RED} />
    </View>
    <View style={styles.timelineCopy}>
      <View>
        <Text style={styles.city} numberOfLines={1}>
          {origin || '—'}
        </Text>
        {originState ? (
          <Text style={styles.state} numberOfLines={1}>
            {originState}
          </Text>
        ) : null}
      </View>
      <View style={styles.cityDrop}>
        <Text style={styles.city} numberOfLines={1}>
          {destination || '—'}
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
 * My Bookings card — yellow frame with amount breakdown and partner contact row.
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
  totalAmount,
  driverEarning,
  commission = 1000,
  tripType = 'ONE WAY',
  name = 'Rohit Sharma',
  company = 'Shree Travel Agency',
  rating = 4.8,
  reviews = 2,
  avatarSource,
  onChat,
  onCall,
  onShare,
  onPress,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const parsed = splitDateTime(dateTime);
  const dateLabel = date || parsed.date;
  const timeLabel = time || parsed.time;
  const roundTrip = isRoundTrip(tripType);
  const code = String(bookingId || '').replace(/^#/, '');
  const total = totalAmount ?? Number(amount || 0) + Number(commission || 0);
  const earning = driverEarning ?? amount;
  const initials = String(name || 'TP')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const stop = handler => event => {
    event?.stopPropagation?.();
    handler?.();
  };

  const amounts = [
    {key: 'total', label: 'Total Amount', value: total},
    {key: 'earn', label: 'Driver Earning', value: earning},
    {key: 'comm', label: 'Commission', value: commission},
  ];

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

        <View style={styles.routePanel}>
          <View style={styles.routeCopy}>
            <RouteTimeline
              styles={styles}
              origin={from}
              originState={fromState}
              destination={to}
              destinationState={toState}
              showReturnArrow={roundTrip}
            />
          </View>
          <View style={styles.carCol}>
            <View style={styles.carWrap}>
              <Image
                source={Images.carImage}
                style={styles.car}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.vehicleName} numberOfLines={1}>
              {vehicle}
            </Text>
          </View>
        </View>

        <View style={styles.amountPanel}>
          {amounts.map((item, index) => (
            <React.Fragment key={item.key}>
              {index > 0 ? <View style={styles.amountDivider} /> : null}
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.amountValue} numberOfLines={1}>
                  ₹ {formatAmount(item.value)}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.partnerPanel}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}

          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName} numberOfLines={1}>
              {name}
            </Text>
            {company ? (
              <Text style={styles.partnerCompany} numberOfLines={1}>
                {company}
              </Text>
            ) : null}
            <View style={styles.reviewRow}>
              <Ionicons name="star" size={12} color="#F5C518" />
              <Text style={styles.ratingText}>
                {Number(rating).toFixed(1)}
              </Text>
              <Text style={styles.reviewCount}>
                ({reviews} {Number(reviews) === 1 ? 'Review' : 'Reviews'})
              </Text>
            </View>
          </View>

          <View style={styles.contactActions}>
            <TouchableOpacity
              style={styles.contactBtn}
              activeOpacity={0.85}
              onPress={stop(onChat)}
              accessibilityRole="button"
              accessibilityLabel="Chat">
              <Ionicons
                name="chatbubble-ellipses"
                size={18}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactBtn}
              activeOpacity={0.85}
              onPress={stop(onCall)}
              accessibilityRole="button"
              accessibilityLabel="Call">
              <Ionicons name="call" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
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
    color: '#8A6A1A',
  },
  routePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 8,
  },
  routeCopy: {
    flex: 1,
    minWidth: 0,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
  timelineRail: {
    alignItems: 'center',
    minWidth: 16,
  },
  dashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 2,
  },
  dashCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    gap: 2,
  },
  dashDot: {
    width: 2,
    height: 3,
    borderRadius: 1,
    backgroundColor: '#D1D5DB',
  },
  timelineCopy: {
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 0,
    paddingVertical: 1,
  },
  city: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  state: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: '400',
    color: '#9AA1AA',
  },
  cityDrop: {
    marginTop: 12,
  },
  carCol: {
    width: 96,
    alignItems: 'center',
    gap: 6,
  },
  carWrap: {
    width: 96,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#EEF0F3',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  car: {
    width: 88,
    height: 52,
  },
  vehicleName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3E4A59',
    textAlign: 'center',
  },
  amountPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FARE_PANEL_BG,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  amountDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#E5E7EB',
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9AA1AA',
    marginBottom: 4,
    textAlign: 'center',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  partnerPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FARE_PANEL_BG,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
    minWidth: 0,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
  },
  reviewCount: {
    fontSize: 12,
    color: '#8B919A',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default MyBookingCard;
