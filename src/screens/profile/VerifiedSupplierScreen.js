import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BackButton from '../../components/brand/BackButton';
import {Colors, Spacing, Typography} from '../../theme';

const FEATURES = ['All bookings', '24x7 Support', 'Cancel anytime'];

const RocketHero = () => (
  <View style={styles.heroWrap}>
    <View style={styles.glowOuter} />
    <View style={styles.glowMid} />

    <View style={[styles.speck, styles.speckPink]} />
    <View style={[styles.speck, styles.speckBlue]} />
    <View style={[styles.speck, styles.speckGreen]} />
    <View style={[styles.speck, styles.speckGold]} />
    <View style={[styles.speck, styles.speckGoldSm]} />

    <View style={styles.rocketDisc}>
      <View style={styles.rocketDiscInner}>
        <View style={styles.rocketArt}>
          <View style={styles.nose} />
          <View style={styles.rocketBody}>
            <View style={styles.rocketWindow} />
            <View style={styles.rocketShine} />
          </View>
          <View style={styles.finRow}>
            <View style={[styles.fin, styles.finLeft]} />
            <View style={[styles.fin, styles.finRight]} />
          </View>
          <View style={styles.flame} />
        </View>
      </View>
    </View>
  </View>
);

const FeatureItem = ({label}) => (
  <View style={styles.featureItem}>
    <Ionicons name="checkmark" size={15} color="#B7B3A8" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

/**
 * Upgrade Now — monthly subscribe + verified supplier upsell.
 */
const VerifiedSupplierScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const onSubscribe = () => {
    Alert.alert(
      'Subscribe',
      'Monthly plan of ₹389/month (Inc. GST) will be charged. Auto-renews every 28 days.',
    );
  };

  const onVerifiedUpgrade = () => {
    Alert.alert(
      'Verified Supplier',
      'Upgrade to Verified Supplier for ₹999/month to unlock badge, 10 vehicles and a dedicated manager.',
    );
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 6}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Upgrade Now</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 24},
        ]}>
        <RocketHero />

        <Text style={styles.title}>Start your journey</Text>
        <Text style={styles.subtitle}>
          Subscribe to unlock all bookings and grow your{'\n'}taxi business.
        </Text>

        <View style={styles.planCard}>
          <View style={styles.startBadge}>
            <Text style={styles.startBadgePlus}>+</Text>
            <Text style={styles.startBadgeText}>START HERE</Text>
          </View>

          <View style={styles.planTop}>
            <View style={styles.planCopy}>
              <Text style={styles.planName}>Monthly</Text>
              <Text style={styles.planMeta}>28 days · auto-renews</Text>
            </View>
            <View style={styles.planPriceCol}>
              <Text style={styles.planPrice}>₹389</Text>
              <Text style={styles.planGst}>/month · Inc. GST</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            {FEATURES.map(item => (
              <FeatureItem key={item} label={item} />
            ))}
          </View>

          <TouchableOpacity
            style={styles.subscribeBtn}
            activeOpacity={0.88}
            onPress={onSubscribe}
            accessibilityRole="button"
            accessibilityLabel="Subscribe for 389 rupees per month">
            <Text style={styles.subscribeBtnText}>
              Subscribe for ₹389/month
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR UPGRADE</Text>
          <View style={styles.orLine} />
        </View>

        <TouchableOpacity
          style={styles.verifiedCard}
          activeOpacity={0.85}
          onPress={onVerifiedUpgrade}
          accessibilityRole="button"
          accessibilityLabel="Upgrade to verified supplier">
          <View style={styles.verifiedIcon}>
            <Ionicons name="checkmark" size={20} color={Colors.primary} />
          </View>
          <View style={styles.verifiedCopy}>
            <Text style={styles.verifiedEyebrow}>VERIFIED SUPPLIER</Text>
            <Text style={styles.verifiedTitle}>Want more? Get verified.</Text>
            <Text style={styles.verifiedMeta}>
              Badge + 10 vehicles + dedicated manager
            </Text>
            <Text style={styles.verifiedPrice}>
              ₹999 /month · Tap to upgrade →
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.textPlaceholder}
          />
        </TouchableOpacity>

        <View style={styles.secureRow}>
          <Ionicons
            name="lock-closed"
            size={13}
            color={Colors.textPlaceholder}
          />
          <Text style={styles.secureText}>
            Secure payment via UPI / Card. Cancel anytime, no{'\n'}questions
            asked.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.semibold,
    color: '#C9A227',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    alignItems: 'center',
  },
  heroWrap: {
    width: 180,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  glowOuter: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: 'rgba(246, 204, 84, 0.16)',
  },
  glowMid: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(246, 204, 84, 0.28)',
  },
  speck: {
    position: 'absolute',
    borderRadius: 8,
  },
  speckPink: {
    width: 9,
    height: 9,
    backgroundColor: '#F4A4B0',
    top: 28,
    left: 22,
  },
  speckBlue: {
    width: 8,
    height: 8,
    backgroundColor: '#7EC8F5',
    top: 78,
    left: 10,
  },
  speckGreen: {
    width: 8,
    height: 8,
    backgroundColor: '#8FDC9B',
    top: 48,
    right: 18,
  },
  speckGold: {
    width: 7,
    height: 7,
    backgroundColor: '#F6CC54',
    bottom: 32,
    right: 28,
  },
  speckGoldSm: {
    width: 5,
    height: 5,
    backgroundColor: '#E8C04A',
    top: 22,
    right: 54,
  },
  rocketDisc: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F6CC54',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  rocketDiscInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#F7D56A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rocketArt: {
    alignItems: 'center',
    marginTop: -4,
  },
  nose: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F07870',
    zIndex: 2,
  },
  rocketBody: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F6CC54',
    marginTop: -6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5B83A',
    zIndex: 1,
    overflow: 'hidden',
  },
  rocketWindow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5C4638',
  },
  rocketShine: {
    position: 'absolute',
    top: 5,
    left: 7,
    width: 8,
    height: 5,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  finRow: {
    flexDirection: 'row',
    width: 46,
    justifyContent: 'space-between',
    marginTop: -10,
    zIndex: 0,
  },
  fin: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 12,
    borderBottomWidth: 4,
    borderTopColor: '#E86B63',
    borderBottomColor: 'transparent',
  },
  finLeft: {
    borderRightWidth: 12,
    borderRightColor: 'transparent',
  },
  finRight: {
    borderLeftWidth: 12,
    borderLeftColor: 'transparent',
  },
  flame: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFB347',
    marginTop: -2,
  },
  title: {
    fontSize: 26,
    fontWeight: Typography.fontWeights.bold,
    color: '#2C3548',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: Typography.fontWeights.regular,
  },
  planCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 16,
    shadowColor: '#F6CC54',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 3,
  },
  startBadge: {
    position: 'absolute',
    top: -12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  startBadgePlus: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textInverse,
    marginTop: -1,
  },
  startBadgeText: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textInverse,
    letterSpacing: 0.6,
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planCopy: {
    flex: 1,
    paddingTop: 2,
  },
  planName: {
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: '#2C3548',
    marginBottom: 2,
  },
  planMeta: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeights.medium,
  },
  planPriceCol: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: Typography.fontWeights.bold,
    color: '#E0A317',
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  planGst: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSlate,
    fontWeight: Typography.fontWeights.medium,
  },
  subscribeBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeBtnText: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: '#2C3548',
  },
  orRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 18,
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D5D8DE',
  },
  orText: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.semibold,
    color: '#C0C4CC',
    letterSpacing: 1.4,
  },
  verifiedCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  verifiedIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCopy: {
    flex: 1,
  },
  verifiedEyebrow: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPlaceholder,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  verifiedTitle: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: '#2C3548',
    marginBottom: 3,
  },
  verifiedMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  verifiedPrice: {
    fontSize: 12,
    color: Colors.textSlate,
    fontWeight: Typography.fontWeights.medium,
  },
  secureRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  secureText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textPlaceholder,
  },
});

export default VerifiedSupplierScreen;
