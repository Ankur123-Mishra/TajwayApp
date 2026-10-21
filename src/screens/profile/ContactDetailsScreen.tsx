import React, {useMemo, useState} from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import BannerHeader from '../../components/common/BannerHeader';
import Images from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

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
    display: roundTrip ? 'Round Trip' : 'One Way',
    roundTrip,
  };
};

const InfoRow = ({icon, iconBg, label, value, valueColor}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconWrap, {backgroundColor: iconBg}]}>
        {icon}
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text
          style={[styles.infoValue, valueColor ? {color: valueColor} : null]}
          numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const PreferenceRow = ({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  isLast,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={[styles.prefRow, !isLast && styles.prefRowBorder]}>
      <View style={styles.prefLeft}>
        <View style={[styles.prefIconWrap, {backgroundColor: iconBg}]}>
          {icon}
        </View>
        <Text style={styles.prefLabel}>{label}</Text>
      </View>
      <Text
        style={[styles.prefValue, valueColor ? {color: valueColor} : null]}
        numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};

/**
 * Contact Details — opened from My Network list (screenshot match).
 */
const ContactDetailsScreen = ({navigation, route}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const contact = route?.params?.contact || {};
  const [query, setQuery] = useState('');

  const phone = formatPhone(contact.phones?.[0] || contact.phone);
  const badge = tripBadge(contact.tripType);
  const vehicle = String(contact.vehicleType || '').trim() || 'Sedan';
  const rating = contact.rating ?? 4.8;
  const location = contact.location || 'Delhi NCR';
  const networkSince = contact.networkSince || '12 March 2024';
  const company = contact.company || '—';
  const statusLabel = contact.activeStatus || 'Active network contact';
  const recentActivity = useMemo(
    () =>
      contact.recentActivity || [
        {id: 'act-1', title: 'Completed a trip', time: 'Today, 8:30 AM', tone: 'success'},
        {id: 'act-2', title: 'Joined your network', time: '12 Mar 2024', tone: 'muted'},
      ],
    [contact.recentActivity],
  );

  const dialPhone = () => {
    const digits = String(contact.phones?.[0] || contact.phone || '').replace(
      /\D/g,
      '',
    );
    if (!digits) {
      return;
    }
    Linking.openURL(`tel:${digits}`).catch(() => {});
  };

  const openChat = () => {
    navigation.navigate(ROUTES.CHAT, {
      chatId: contact.chatId || 'chat-001',
      contactName: contact.name,
    });
  };

  return (
    <View style={styles.container}>
      <BannerHeader
        title="Contact Details"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="rgba(110, 107, 104, 1)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Network Contacts..."
            placeholderTextColor="rgba(110, 107, 104, 1)"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={styles.searchFilter}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Apply filters">
          <Image
            source={Images.filterIcon}
            style={styles.filterIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 24},
        ]}>
        {/* Profile summary */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <Image source={Images.profile} style={styles.avatar} />
            <View style={styles.profileCopy}>
              <Text style={styles.name} numberOfLines={1}>
                {contact.name || 'Network Contact'}
              </Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>{rating}</Text>
                <Ionicons name="star" size={13} color={Colors.star} />
              </View>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText} numberOfLines={1}>
                  {statusLabel}
                </Text>
              </View>
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
                      badge.roundTrip
                        ? styles.badgeTextRound
                        : styles.badgeTextOneWay,
                    ]}>
                    {badge.label}
                  </Text>
                </View>
              ) : (
                <View style={styles.badgeSpacer} />
              )}
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
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, styles.sectionIconPerson]}>
              <Ionicons name="person" size={14} color="#5B6B7C" />
            </View>
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          <InfoRow
            icon={
              <Ionicons name="call" size={16} color="#E53935" />
            }
            iconBg="#FDECEC"
            label="Phone Number"
            value={phone || '—'}
          />
          <InfoRow
            icon={
              <Ionicons name="business" size={16} color="#1A73E8" />
            }
            iconBg="#E8F0FE"
            label="Company / Network"
            value={company}
          />
          <InfoRow
            icon={
              <Ionicons name="location" size={16} color="#C9A227" />
            }
            iconBg="#F8F0D8"
            label="Location"
            value={location}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.callBtn}
              activeOpacity={0.9}
              onPress={dialPhone}
              accessibilityRole="button"
              accessibilityLabel="Call contact">
              <Ionicons name="call" size={18} color={Colors.onPrimary} />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chatBtn}
              activeOpacity={0.9}
              onPress={openChat}
              accessibilityRole="button"
              accessibilityLabel="Chat with contact">
              <Ionicons
                name="mail-outline"
                size={18}
                color={Colors.textSecondary}
              />
              <Text style={styles.chatBtnText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Preferences */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, styles.sectionIconCar]}>
              <Ionicons name="car" size={14} color="#5B6B7C" />
            </View>
            <Text style={styles.sectionTitle}>Trip Preferences</Text>
          </View>

          <PreferenceRow
            icon={
              <MaterialDesignIcons
                name="map-marker-path"
                size={16}
                color="#3EAE62"
              />
            }
            iconBg="#E5F6EA"
            label="Preferred Trip"
            value={badge?.display || 'One Way'}
            valueColor="#3EAE62"
          />
          <PreferenceRow
            icon={<Ionicons name="car-sport" size={16} color="#1A73E8" />}
            iconBg="#E8F0FE"
            label="Vehicle Type"
            value={vehicle}
          />
          <PreferenceRow
            icon={<Ionicons name="calendar" size={16} color="#7C3AED" />}
            iconBg="#F3E8FF"
            label="Network Since"
            value={networkSince}
            isLast
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, styles.sectionIconClock]}>
              <Ionicons name="time" size={14} color="#5B6B7C" />
            </View>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <View style={styles.timeline}>
            {recentActivity.map((item, index) => {
              const isLast = index === recentActivity.length - 1;
              const isSuccess = item.tone === 'success';
              return (
                <View key={item.id || index} style={styles.timelineItem}>
                  <View style={styles.timelineRail}>
                    <View
                      style={[
                        styles.timelineDot,
                        isSuccess
                          ? styles.timelineDotSuccess
                          : styles.timelineDotMuted,
                      ]}
                    />
                    {!isLast ? <View style={styles.timelineLine} /> : null}
                  </View>
                  <View style={styles.timelineCopy}>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineTime}>{item.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: Spacing.screenPadding,
    marginTop: 12,
    marginBottom: 4,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  searchFilter: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
    paddingTop: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3EAE62',
  },
  statusText: {
    flex: 1,
    fontSize: 12,
    fontWeight: Typography.fontWeights.medium,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconPerson: {
    backgroundColor: '#EEF1F5',
  },
  sectionIconCar: {
    backgroundColor: '#EEF1F5',
  },
  sectionIconClock: {
    backgroundColor: '#EEF1F5',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCopy: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  callBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callBtnText: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.onPrimary,
  },
  chatBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chatBtnText: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  prefRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  prefIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textSecondary,
  },
  prefValue: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  timeline: {
    paddingLeft: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 52,
  },
  timelineRail: {
    width: 18,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineDotSuccess: {
    backgroundColor: '#3EAE62',
  },
  timelineDotMuted: {
    backgroundColor: '#C5CAD3',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E6E8EC',
    marginTop: 4,
    marginBottom: 2,
  },
  timelineCopy: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  timelineTime: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textMuted,
  },
};

export default ContactDetailsScreen;
