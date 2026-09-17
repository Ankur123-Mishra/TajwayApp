import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../theme';

/**
 * Chat inbox row — contact preview + booking route snippet.
 */
const ChatListCard = ({
  contactName,
  avatarInitials,
  lastMessage,
  lastMessageAt,
  unreadCount = 0,
  from,
  to,
  amount,
  status,
  onPress,
}) => {
  const preview = String(lastMessage || '')
    .replace(/\n/g, ' ')
    .trim();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${contactName}`}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatarInitials || '??'}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {contactName}
          </Text>
          <Text style={styles.time}>{lastMessageAt}</Text>
        </View>

        <Text style={styles.preview} numberOfLines={1}>
          {preview}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.route} numberOfLines={1}>
            {from} → {to}
          </Text>
          <View style={styles.metaRight}>
            {amount != null ? (
              <Text style={styles.amount}>
                ₹{Number(amount).toLocaleString('en-IN')}
              </Text>
            ) : null}
            {status ? (
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{status}</Text>
              </View>
            ) : null}
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2C3A4B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textNavy,
    marginRight: 8,
  },
  time: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  preview: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  route: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
    marginRight: 8,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#28A745',
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#EEEEEE',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});

export default ChatListCard;
