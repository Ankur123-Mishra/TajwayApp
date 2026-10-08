import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors} from '../../theme';

const formatInr = value => `₹${Number(value).toLocaleString('en-IN')}*`;

const ACTIONS = [
  {key: 'edit', label: 'Edit', icon: 'create-outline'},
  {key: 'chat', label: 'Chat', icon: 'chatbubble-outline'},
  {key: 'share', label: 'Share', icon: 'share-social-outline'},
  {key: 'delete', label: 'Delete', icon: 'trash-outline'},
];

/**
 * My Bookings list card — matches posted booking screenshot.
 */
const MyBookingCard = ({
  dateTime = 'Jan 01, 2023 @ 09:00 PM',
  bookingId = '7313',
  status = 'Assigned',
  from = 'Dehradun',
  to = 'Mussoorie',
  vehicle = 'Sedan',
  pricingNote = 'All inclusive',
  amount = 1200,
  tripType = 'ONE WAY',
  onEdit,
  onChat,
  onShare,
  onDelete,
  onPress,
}) => {
  const handlers = {
    edit: onEdit,
    chat: onChat,
    share: onShare,
    delete: onDelete,
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{dateTime}</Text>
        <Text style={styles.metaText}>
          ID:{bookingId} ({status})
        </Text>
      </View>

      <View style={styles.bodyRow}>
        <View style={styles.routeCol}>
          <Text style={styles.city} numberOfLines={1}>
            {from}
          </Text>
          <Text style={styles.city} numberOfLines={1}>
            {to}
          </Text>
          <View style={styles.vehiclePill}>
            <Text style={styles.vehicleText}>{vehicle}</Text>
          </View>
          {pricingNote ? (
            <Text style={styles.pricingNote}>{pricingNote}</Text>
          ) : null}
        </View>

        <View style={styles.priceCol}>
          <Text style={styles.price}>{formatInr(amount)}</Text>
          <View style={styles.tripPill}>
            <Text style={styles.tripText}>{String(tripType).toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        {ACTIONS.map(action => {
          const isDelete = action.key === 'delete';
          return (
            <TouchableOpacity
              key={action.key}
              style={[styles.actionBtn, isDelete && styles.actionBtnDelete]}
              activeOpacity={0.85}
              onPress={event => {
                event?.stopPropagation?.();
                handlers[action.key]?.();
              }}
              accessibilityRole="button"
              accessibilityLabel={action.label}>
              <View
                style={[
                  styles.actionIconWrap,
                  isDelete && styles.actionIconWrapDelete,
                ]}>
                <Ionicons
                  name={action.icon}
                  size={13}
                  color={isDelete ? Colors.error : Colors.secondaryDark}
                />
              </View>
              <Text
                style={[
                  styles.actionLabel,
                  isDelete && styles.actionLabelDelete,
                ]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: '#9AA0A6',
    fontWeight: '500',
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  routeCol: {
    flex: 1,
    paddingRight: 12,
  },
  city: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  vehiclePill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F3F4F6',
  },
  vehicleText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  pricingNote: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  priceCol: {
    alignItems: 'flex-end',
    paddingTop: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28A745',
    marginBottom: 8,
  },
  tripPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EEEEEE',
  },
  tripText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  actions: {
    flexDirection: 'row',
    gap: 5,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 46,
  },
  actionBtnDelete: {
    backgroundColor: Colors.errorSoft,
    borderColor: '#FFCDD2',
  },
  actionIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  actionIconWrapDelete: {
    backgroundColor: '#FFCDD2',
  },
  actionLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  actionLabelDelete: {
    color: Colors.error,
  },
});

export default MyBookingCard;
