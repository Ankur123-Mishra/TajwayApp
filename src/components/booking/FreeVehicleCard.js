import React from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors} from '../../theme';

const DateTimeValue = ({date, time, alignRight}) => (
  <Text
    style={[styles.availValue, alignRight && styles.alignRight]}
    allowFontScaling={false}>
    {date} @ {time}
  </Text>
);

/**
 * Free vehicle listing card — matches Taxi Sanchalak marketplace screenshots.
 */
const FreeVehicleCard = ({
  vehicleType = 'Sedan',
  availableFromDate = 'Today',
  availableFromTime = '12:00 PM',
  availableTillDate = 'Today',
  availableTillTime = '12:00 PM',
  location = '',
  otherDetails = '-',
  pickupNote,
  currentLocationOnly = false,
  name = 'Travel Partner',
  company,
  verified = true,
  phone,
  avatarSource,
  onCall,
}) => {
  const note =
    pickupNote ||
    (currentLocationOnly
      ? 'Ready to pick booking from current location only'
      : 'Ready to pick booking from any location');

  const initials = String(name)
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const handleCall = () => {
    if (onCall) {
      onCall();
      return;
    }
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch(() => {});
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.typeRow}>
        <Text style={styles.typeLabel}>Vehicle Type</Text>
        <Text style={styles.typeValue}>{vehicleType}</Text>
      </View>

      <View style={styles.availRow}>
        <View style={[styles.availCol, styles.availColFrom]}>
          <Text style={styles.availLabel}>Available From</Text>
          <DateTimeValue date={availableFromDate} time={availableFromTime} />
        </View>
        <View style={[styles.availCol, styles.availColTill]}>
          <Text style={[styles.availLabel, styles.alignRight]}>
            Available Till
          </Text>
          <DateTimeValue
            date={availableTillDate}
            time={availableTillTime}
            alignRight
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Vehicle Location</Text>
      <Text style={styles.location}>{location}</Text>

      <Text style={styles.sectionLabel}>Other Details</Text>
      <Text style={styles.details}>{otherDetails || '-'}</Text>

      <Text style={styles.note}>* {note}</Text>

      <View style={styles.footer}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}

        <View style={styles.partnerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.partnerName} numberOfLines={1}>
              {name}
            </Text>
            {verified ? (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={Colors.secured}
                style={styles.verified}
              />
            ) : null}
          </View>
          {company ? (
            <Text style={styles.company} numberOfLines={2}>
              {company}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.callBtn}
          onPress={handleCall}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Call ${name}`}>
          <Ionicons name="call-outline" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeLabel: {
    fontSize: 12,
    color: '#B0B3B8',
    fontWeight: '400',
    marginRight: 10,
  },
  typeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  availRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  availCol: {
    flex: 1,
  },
  availColFrom: {
    paddingRight: 10,
  },
  availColTill: {
    paddingLeft: 10,
  },
  availLabel: {
    fontSize: 11,
    color: '#B0B3B8',
    fontWeight: '400',
    marginBottom: 3,
  },
  availValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
    width: '100%',
  },
  alignRight: {
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  sectionLabel: {
    fontSize: 11,
    color: '#B0B3B8',
    fontWeight: '400',
    marginBottom: 3,
  },
  location: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 10,
  },
  details: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  note: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#E57373',
    lineHeight: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3E4A40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  verified: {
    marginLeft: 4,
  },
  company: {
    fontSize: 11,
    color: '#9AA0A6',
    marginTop: 1,
    lineHeight: 15,
  },
  callBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF8EB',
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FreeVehicleCard;
