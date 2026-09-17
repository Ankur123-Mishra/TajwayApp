import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {Colors, Spacing, Typography} from '../../theme';

const BENEFITS = [
  'Get a verified supplier batch in your profile.',
  'Do work - one way ₹1L or round trip ₹2.5L.',
  'Dedicated account Manager always available for you.',
  'Add upto 10 vehicles in your profile',
];

const VerifiedBadge = () => (
  <View style={styles.badgeWrap}>
    <MaterialDesignIcons
      name="star-four-points"
      size={14}
      color={Colors.primary}
      style={[styles.sparkle, styles.sparkleTL]}
    />
    <MaterialDesignIcons
      name="star-four-points"
      size={10}
      color={Colors.primary}
      style={[styles.sparkle, styles.sparkleTR]}
    />
    <MaterialDesignIcons
      name="star-four-points"
      size={12}
      color={Colors.primary}
      style={[styles.sparkle, styles.sparkleBL]}
    />
    <MaterialDesignIcons
      name="star-four-points"
      size={11}
      color={Colors.primary}
      style={[styles.sparkle, styles.sparkleBR]}
    />

    <View style={styles.ribbon} />
    <View style={styles.shield}>
      <Ionicons name="checkmark" size={36} color={Colors.textPrimary} />
    </View>
  </View>
);

/**
 * Become a Taxi Sanchalak / Verified Supplier upgrade screen.
 */
const VerifiedSupplierScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const onUpgrade = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16},
      ]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <VerifiedBadge />

          <Text style={styles.title}>Become a Taxi Sanchalak</Text>
          <Text style={styles.subtitle}>Verified Supplier</Text>

          <View style={styles.benefits}>
            {BENEFITS.map((item, index) => (
              <View key={item}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.price}>
            <Text style={styles.priceAmount}>₹999</Text>
            <Text style={styles.pricePeriod}>/month</Text>
          </Text>

          <PrimaryButton
            title="Upgrade Now"
            onPress={onUpgrade}
            style={styles.cta}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screenPadding,
  },
  header: {
    zIndex: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  badgeWrap: {
    position: 'absolute',
    top: -36,
    width: 96,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbon: {
    position: 'absolute',
    width: 84,
    height: 16,
    borderRadius: 3,
    backgroundColor: Colors.textPrimary,
    top: 36,
  },
  shield: {
    width: 56,
    height: 62,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
    zIndex: 1,
  },
  sparkle: {
    position: 'absolute',
    zIndex: 2,
  },
  sparkleTL: {
    top: 2,
    left: 4,
  },
  sparkleTR: {
    top: 8,
    right: 6,
  },
  sparkleBL: {
    bottom: 10,
    left: 0,
  },
  sparkleBR: {
    bottom: 4,
    right: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textNavy,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 18,
  },
  benefits: {
    width: '100%',
    marginBottom: 18,
  },
  benefitText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.dashedRed,
    opacity: 0.55,
  },
  price: {
    marginBottom: 18,
    textAlign: 'center',
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary,
  },
  pricePeriod: {
    fontSize: 22,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primary,
  },
  cta: {
    borderRadius: 14,
  },
});

export default VerifiedSupplierScreen;
