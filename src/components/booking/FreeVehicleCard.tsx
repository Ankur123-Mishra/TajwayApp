import React from 'react';
import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Images} from '../../constants/Images';
import {Colors} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

/**
 * Free vehicle listing card — matches the marketplace free-vehicle screenshot.
 */
const FreeVehicleCard = ({
  vehicleName,
  vehicleType = 'Sedan',
  availableFromDate = 'Today',
  availableFromTime = '1:00 PM',
  availableTillDate = 'Tomorrow',
  availableTillTime = '10:00 PM',
  location = '',
  otherDetails = '',
  pickupNote,
  currentLocationOnly = false,
  name = 'Travel Partner',
  company,
  phone,
  avatarSource,
  onCall,
  // onMenu,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const title = vehicleName || vehicleType;
  const details =
    otherDetails && otherDetails !== '-'
      ? otherDetails
      : pickupNote ||
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
        <View style={styles.decor} />

        <View style={styles.topRow}>
          <View style={styles.typePill}>
            <Ionicons name="car" size={14} color="#1A1A1A" />
            <Text style={styles.typeText}>{vehicleType}</Text>
          </View>
          {/* <TouchableOpacity
            style={styles.menuBtn}
            activeOpacity={0.7}
            onPress={onMenu}
            disabled={!onMenu}
            accessibilityRole="button"
            accessibilityLabel="More options">
            <Ionicons name="ellipsis-vertical" size={18} color="#9AA1A9" />
          </TouchableOpacity> */}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.availRow}>
          <View style={styles.availCol}>
            <View style={styles.labelRow}>
              <Ionicons name="calendar-outline" size={16} color="#8E959E" />
              <Text style={styles.fieldLabel}>Available from</Text>
            </View>
            <Text style={styles.fieldValue}>
              {availableFromDate}, {availableFromTime}
            </Text>
          </View>
          <View style={styles.availCol}>
            <View style={styles.labelRow}>
              <Ionicons name="calendar-outline" size={16} color="#8E959E" />
              <Text style={styles.fieldLabel}>Available till</Text>
            </View>
            <Text style={styles.fieldValue}>
              {availableTillDate}, {availableTillTime}
            </Text>
          </View>
        </View>

        <View style={styles.locationBlock}>
          <View style={styles.labelRow}>
            <Image source={Images.locationIcon} style={styles.pin} />
            <Text style={styles.fieldLabel}>Location</Text>
          </View>
          <Text style={styles.fieldValue} numberOfLines={2}>
            {location}
          </Text>
        </View>

        <View style={styles.detailsBox}>
          <View style={styles.detailsTitleRow}>
            <Ionicons name="document-text-outline" size={18} color="#1A1A1A" />
            <Text style={styles.detailsTitle}>Other Details</Text>
          </View>
          <Text style={styles.detailsText} numberOfLines={3}>
            {details}
          </Text>
        </View>

        <View style={styles.footer}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}

          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName} numberOfLines={1}>
              {name}
            </Text>
            {company ? (
              <Text style={styles.company} numberOfLines={1}>
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
            <Ionicons name="call-outline" size={16} color="#1A1A1A" />
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const baseStyles = {
  card: {
    marginBottom: 14,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(236, 236, 236, 1)',
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
  },
  decor: {
    position: 'absolute',
    top: -52,
    right: -42,
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: '#FBF6E4',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F6EA',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E9A45',
  },
  menuBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  availRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  availCol: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#8B919A',
  },
  fieldValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingLeft: 22,
  },
  locationBlock: {
    marginTop: 16,
  },
  pin: {
    width: 16,
    height: 18,
    resizeMode: 'contain',
  },
  detailsBox: {
    marginTop: 16,
    backgroundColor: '#F2F6FB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  detailsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B2437',
  },
  detailsText: {
    marginTop: 6,
    marginLeft: 26,
    fontSize: 11,
    lineHeight: 16,
    color: '#3E4A59',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: '#FFF8E6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F6E8C0',
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 8,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
  partnerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1B2437',
  },
  company: {
    fontSize: 12,
    color: '#8B919A',
    marginTop: 1,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  callText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1B2437',
  },
};

export default FreeVehicleCard;
