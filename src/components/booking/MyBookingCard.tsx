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
const COMMISSION_ICON_BG = '#FFE4E8';
const COMMISSION_ICON = '#F07178';
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
 * My Bookings card — yellow frame with fare/commission panel and vehicle label.
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
  commission = 1000,
  tripType = 'ONE WAY',
  onAccept,
  onReject,
  onShare,
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

        <View style={styles.farePanel}>
          <View style={styles.fareItem}>
            <View style={styles.fareIcon}>
              <Text style={styles.fareIconMark}>₹</Text>
            </View>
            <View style={styles.fareCopy}>
              <Text style={styles.fareLabel}>Fare</Text>
              <Text style={styles.fareValue}>₹ {formatAmount(amount)}</Text>
            </View>
          </View>
          <View style={styles.fareDivider} />
          <View style={styles.fareItem}>
            <View style={[styles.fareIcon, styles.commissionIcon]}>
              <Text style={styles.commissionIconMark}>%</Text>
            </View>
            <View style={styles.fareCopy}>
              <Text style={styles.fareLabel}>Commission</Text>
              <Text style={styles.fareValue}>
                ₹ {formatAmount(commission)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnAccept]}
            activeOpacity={0.85}
            onPress={stop(onAccept)}
            accessibilityRole="button"
            accessibilityLabel="Accept">
            <Text style={[styles.actionLabel, styles.actionLabelAccept]}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnReject]}
            activeOpacity={0.85}
            onPress={stop(onReject)}
            accessibilityRole="button"
            accessibilityLabel="Reject">
            <Text style={[styles.actionLabel, styles.actionLabelReject]}>
              Reject
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
  farePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FARE_PANEL_BG,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  fareItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fareIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fareIconMark: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  commissionIcon: {
    backgroundColor: COMMISSION_ICON_BG,
  },
  commissionIconMark: {
    fontSize: 14,
    fontWeight: '800',
    color: COMMISSION_ICON,
  },
  fareCopy: {
    flexShrink: 1,
  },
  fareLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9AA1AA',
    marginBottom: 2,
  },
  fareValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  fareDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#E8D9A8',
    marginHorizontal: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderRadius: 22,
  },
  actionBtnAccept: {
    backgroundColor: '#FFF3C4',
  },
  actionBtnReject: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#FFD0D4',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionLabelAccept: {
    color: Colors.textPrimary,
  },
  actionLabelReject: {
    color: '#F07178',
  },
};

export default MyBookingCard;
