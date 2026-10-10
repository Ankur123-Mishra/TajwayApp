import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import Images from '../../constants/Images';
import {Colors} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const STATUS_STYLES = {
  Ended: {bg: '#E1F5E3', color: '#489053'},
  Assigned: {bg: '#E7F0FF', color: '#3B7DFF'},
  Pending: {bg: '#FFF6D6', color: '#C4922A'},
};

const FRAME_COLOR = '#F6D04F';
const FRAME_RADIUS = 20;
const EDGE = 1.5;
const LEFT_EDGE = 4;

const formatAmount = value => Number(value || 0).toLocaleString('en-IN');

/**
 * Chat list card — yellow frame with a thicker left edge and a white inner card.
 */
const ChatListCard = ({
  contactName,
  avatarSource,
  lastMessage,
  lastMessageAt,
  from,
  to,
  amount,
  status,
  onPress,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const preview = String(lastMessage || '')
    .replace(/\n/g, ' ')
    .trim();
  const statusStyle = STATUS_STYLES[status] || {
    bg: '#F3F4F6',
    color: '#6B7280',
  };

  return (
    <TouchableOpacity
      style={styles.shell}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${contactName}`}>
      <View style={styles.card}>
        <View style={styles.top}>
          <Image
            source={avatarSource || Images.profile}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.copy}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {contactName}
              </Text>
              <View style={styles.timeWrap}>
                <Ionicons name="time-outline" size={14} color="#9AA1AA" />
                <Text style={styles.time}>{lastMessageAt}</Text>
              </View>
            </View>
            <Text style={styles.preview} numberOfLines={1}>
              {preview}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.routeWrap}>
            <Ionicons name="location" size={16} color={FRAME_COLOR} />
            <Text style={styles.route} numberOfLines={1}>
              {from} <Text style={styles.routeArrow}>→ </Text>
              <Text style={styles.routeTo}>{to}</Text>
            </Text>
          </View>
          <View style={styles.metaRight}>
            {amount != null ? (
              <Text style={styles.amount}>₹{formatAmount(amount)}</Text>
            ) : null}
            {status ? (
              <>
                <View style={styles.divider} />
                <View
                  style={[
                    styles.statusPill,
                    {backgroundColor: statusStyle.bg},
                  ]}>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={statusStyle.color}
                  />
                  <Text style={[styles.statusText, {color: statusStyle.color}]}>
                    {status}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const baseStyles = {
  shell: {
    backgroundColor: FRAME_COLOR,
    borderRadius: FRAME_RADIUS,
    marginBottom: 12,
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
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 13,
    color: '#9AA1AA',
    fontWeight: '500',
  },
  preview: {
    marginTop: 2,
    fontSize: 14,
    color: '#6B7280',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
  },
  routeWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 0,
  },
  route: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3A3A',
  },
  routeArrow: {
    fontSize: 14,
    color: '#B0B6BE',
    fontWeight: '600',
  },
  routeTo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  metaRight: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#E5E7EB',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
};

export default ChatListCard;
