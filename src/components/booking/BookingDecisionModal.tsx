import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Spacing} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const VARIANTS = {
  accept: {
    title: 'Booking Accepted',
    badge: 'Accepted',
    accent: '#1E9B55',
    accentSoft: '#E5F8EE',
    message: 'This booking has been accepted successfully.',
  },
  reject: {
    title: 'Booking Rejected',
    badge: 'Rejected',
    accent: '#E11D48',
    accentSoft: '#FFF1F2',
    message: 'This booking has been rejected.',
  },
};

const formatAmount = value => Number(value || 0).toLocaleString('en-IN');

/**
 * Result popup shown after a booking is accepted or rejected.
 */
const BookingDecisionModal = ({visible, variant = 'accept', booking, onClose}) => {
  const styles = useResponsiveStyles(baseStyles);
  const tone = VARIANTS[variant] || VARIANTS.accept;
  const code = String(booking?.code || booking?.id || '').replace(/^#/, '');
  const route = [booking?.from, booking?.to].filter(Boolean).join('  →  ');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.card}>
            <View style={[styles.accentBar, {backgroundColor: tone.accent}]} />
            <View style={styles.body}>
              <View style={[styles.badge, {backgroundColor: tone.accentSoft}]}>
                <Text style={[styles.badgeText, {color: tone.accent}]}>
                  {tone.badge}
                </Text>
              </View>
              <Text style={styles.title}>{tone.title}</Text>
              <Text style={styles.message}>{tone.message}</Text>

              {booking ? (
                <View style={styles.details}>
                  {code ? (
                    <Text style={styles.code}>#{code}</Text>
                  ) : null}
                  {route ? (
                    <Text style={styles.route} numberOfLines={2}>
                      {route}
                    </Text>
                  ) : null}
                  <Text style={styles.meta} numberOfLines={1}>
                    {[
                      booking.vehicle,
                      booking.amount != null
                        ? `₹${formatAmount(booking.amount)}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join('  ·  ')}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.okBtn}
                activeOpacity={0.85}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close">
                <Text style={styles.okText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const baseStyles = {
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: Colors.secondaryDark,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
  accentBar: {
    height: 6,
    width: '100%',
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
    alignItems: 'center',
  },
  badge: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  details: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#F7F8FA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  code: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  route: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  okBtn: {
    marginTop: 18,
    backgroundColor: Colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 22,
    minWidth: 140,
    alignItems: 'center',
  },
  okText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.onPrimary,
  },
};

export default BookingDecisionModal;
