import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Images} from '../../constants/Images';
import {Colors} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const PIN_GREEN = '#22C55E';
const PIN_RED = '#F43F5E';
const ONE_WAY_BG = '#E5F8EE';
const ONE_WAY_TEXT = '#1E9B55';
const ROUND_BG = '#E7F0FF';
const ROUND_TEXT = '#3B6FD8';
const NETWORK_BG = '#E8F0FE';
const NETWORK_TEXT = '#3B7DFF';

const isRoundTrip = tripType => /round|two/i.test(String(tripType || ''));

const shortCity = value => {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }
  return raw.split(',')[0].trim();
};

const placeState = value => {
  const parts = String(value || '')
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);
  if (parts.length < 2) {
    return '';
  }
  return parts.length >= 3 ? parts[1] : parts[1];
};

const tripNotesText = (notes, extras) => {
  if (Array.isArray(extras) && extras.length) {
    return extras.map(item => String(item).trim()).filter(Boolean).join(', ');
  }
  const extraStr = String(extras || '').trim();
  if (extraStr) {
    return extraStr;
  }
  return String(notes || '').trim();
};

/**
 * Compact booking summary for chat — matches product screenshot.
 * Pay Commission shows only when driverPaysCommissionFirst is true.
 */
const ChatBookingDetailsCard = ({
  booking,
  onPayCommission,
  onShareDriverDetails,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  if (!booking) {
    return null;
  }

  const roundTrip = isRoundTrip(booking.tripType);
  const origin =
    shortCity(booking.from) || shortCity(booking.pickupFrom) || '—';
  const destination =
    shortCity(booking.to) || shortCity(booking.dropTo) || '—';
  const originState =
    booking.fromState || placeState(booking.pickupFrom || booking.from);
  const destinationState =
    booking.toState || placeState(booking.dropTo || booking.to);
  const dateLabel = booking.date || booking.when || '';
  const timeLabel = booking.time || '';
  const code = String(
    booking.bookingCode || booking.id || booking.bookingId || '',
  ).replace(/^#/, '');
  const vehicleLabel = booking.vehicle || 'Sedan';
  const notes = tripNotesText(booking.notes, booking.extras);
  const showNetwork =
    /network/i.test(String(booking.bookingType || '')) ||
    /network/i.test(String(booking.network || '')) ||
    booking.visibility === 'my_network';
  const showPayCommission = Boolean(booking.driverPaysCommissionFirst);

  return (
    <View style={styles.card}>
      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          {dateLabel ? (
            <>
              <Ionicons name="calendar-outline" size={14} color="#8B919A" />
              <Text style={styles.metaText}>{dateLabel}</Text>
            </>
          ) : null}
          {timeLabel ? (
            <>
              <View style={styles.metaDivider} />
              <Ionicons name="time-outline" size={14} color="#8B919A" />
              <Text style={styles.metaText}>{timeLabel}</Text>
            </>
          ) : null}
        </View>
        <View style={[styles.tripPill, roundTrip && styles.tripPillRound]}>
          <Text style={[styles.tripText, roundTrip && styles.tripTextRound]}>
            {roundTrip ? 'ROUND TRIP' : 'ONE WAY'}
          </Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        {code ? (
          <View style={styles.idPill}>
            <Text style={styles.idText}>ID: #{code}</Text>
          </View>
        ) : (
          <View />
        )}
        {showNetwork ? (
          <View style={styles.networkPill}>
            <Ionicons name="star" size={11} color={NETWORK_TEXT} />
            <Text style={styles.networkText}>My Network</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.routePanel}>
        <View style={styles.routeCopy}>
          <View style={styles.timelineRail}>
            <Ionicons name="location" size={16} color={PIN_GREEN} />
            <View style={styles.dashCol}>
              {Array.from({length: 4}).map((_, index) => (
                <View key={index} style={styles.dashDot} />
              ))}
              <Ionicons name="caret-down" size={10} color="#C5CAD1" />
            </View>
            <Ionicons name="location" size={16} color={PIN_RED} />
          </View>
          <View style={styles.timelineCopy}>
            <View>
              <Text style={styles.city} numberOfLines={1}>
                {origin}
              </Text>
              {originState ? (
                <Text style={styles.state} numberOfLines={1}>
                  {originState}
                </Text>
              ) : null}
            </View>
            <View style={styles.cityDrop}>
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

        <View style={styles.carCol}>
          <Image
            source={Images.carImage}
            style={styles.car}
            resizeMode="contain"
          />
          <Text style={styles.carTypeLabel}>Car Type</Text>
          <Text style={styles.carTypeValue} numberOfLines={1}>
            {vehicleLabel}
          </Text>
        </View>
      </View>

      {notes ? (
        <View style={styles.notesBox}>
          <Ionicons
            name="document-text-outline"
            size={16}
            color="#6B7280"
            style={styles.notesIcon}
          />
          <View style={styles.notesCopy}>
            <Text style={styles.notesTitle}>Trip Notes</Text>
            <Text style={styles.notesText} numberOfLines={2}>
              {notes}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        {showPayCommission ? (
          <TouchableOpacity
            style={[styles.actionBtn, styles.payBtn]}
            activeOpacity={0.85}
            onPress={onPayCommission}
            accessibilityRole="button"
            accessibilityLabel="Pay Commission">
            <Text style={styles.payBtnText}>Pay Commission</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.shareBtn,
            !showPayCommission && styles.shareBtnFull,
          ]}
          activeOpacity={0.85}
          onPress={onShareDriverDetails}
          accessibilityRole="button"
          accessibilityLabel="Share Driver Details">
          <Text style={styles.shareBtnText}>Share Driver Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const baseStyles = {
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  idPill: {
    backgroundColor: '#FFE8C8',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  networkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: NETWORK_BG,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  networkText: {
    fontSize: 11,
    fontWeight: '700',
    color: NETWORK_TEXT,
  },
  routePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeCopy: {
    flex: 1,
    flexDirection: 'row',
    minWidth: 0,
    paddingRight: 8,
  },
  timelineRail: {
    alignItems: 'center',
    width: 18,
    marginRight: 8,
  },
  dashCol: {
    alignItems: 'center',
    paddingVertical: 2,
    gap: 3,
  },
  dashDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#C5CAD1',
  },
  timelineCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
    minHeight: 72,
  },
  city: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  state: {
    marginTop: 1,
    fontSize: 12,
    color: '#8B919A',
    fontWeight: '500',
  },
  cityDrop: {
    marginTop: 10,
  },
  carCol: {
    width: 96,
    alignItems: 'center',
  },
  car: {
    width: 92,
    height: 52,
  },
  carTypeLabel: {
    marginTop: 2,
    fontSize: 11,
    color: '#8B919A',
    fontWeight: '500',
  },
  carTypeValue: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 12,
  },
  notesIcon: {
    marginTop: 1,
    marginRight: 8,
  },
  notesCopy: {
    flex: 1,
    minWidth: 0,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8B919A',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  payBtn: {
    backgroundColor: Colors.primary,
  },
  payBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  shareBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  shareBtnFull: {
    flex: 1,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
};

export default ChatBookingDetailsCard;
