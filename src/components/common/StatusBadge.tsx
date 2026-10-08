import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const normalize = value => String(value || '').trim().toLowerCase();

const toneFor = status => {
  const key = normalize(status);
  if (
    key.includes('verif') ||
    key.includes('confirm') ||
    key.includes('complete') ||
    key.includes('success') ||
    key === 'approved'
  ) {
    return {bg: Colors.successSoft, fg: Colors.success};
  }
  if (
    key.includes('reject') ||
    key.includes('cancel') ||
    key.includes('fail') ||
    key.includes('error')
  ) {
    return {bg: Colors.errorSoft, fg: Colors.error};
  }
  if (
    key.includes('progress') ||
    key.includes('ongoing') ||
    key.includes('looking') ||
    key.includes('open') ||
    key.includes('interest')
  ) {
    return {bg: Colors.infoSoft, fg: Colors.info};
  }
  return {bg: Colors.warningSoft, fg: Colors.textSecondary};
};

/**
 * Compact status pill used on cards and booking rows.
 */
const StatusBadge = ({status = 'Pending', style, textStyle}) => {
  const tone = toneFor(status);
  const label =
    typeof status === 'string'
      ? status
          .replace(/_/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
      : String(status);

  return (
    <View style={[styles.badge, {backgroundColor: tone.bg}, style]}>
      <Text style={[styles.text, {color: tone.fg}, textStyle]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

/**
 * Larger verification callout for success / pending screens.
 */
export const VerificationStatus = ({
  title = 'Verification Pending',
  subtitle,
  status = 'pending',
  style,
}) => {
  const tone = toneFor(status);
  const isPending = normalize(status).includes('pending');

  return (
    <View style={[styles.card, style]}>
      <View style={[styles.iconBubble, {backgroundColor: tone.bg}]}>
        <Text style={[styles.iconText, {color: tone.fg}]}>
          {isPending ? '…' : '✓'}
        </Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      <StatusBadge status={status} style={styles.cardBadge} />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 1,
    borderRadius: Dimensions.borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontWeight: Typography.fontWeights.semibold,
    fontSize: Typography.sizes.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Dimensions.shadow.soft,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  iconText: {
    fontSize: 22,
    fontWeight: Typography.fontWeights.bold,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  cardSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  cardBadge: {
    marginTop: Spacing.base,
  },
});

export default StatusBadge;
