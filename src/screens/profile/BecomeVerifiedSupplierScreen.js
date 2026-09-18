import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {Colors, Spacing, Typography} from '../../theme';

const BENEFITS = [
  {id: 'badge', text: 'Get a verified supplier batch in your profile.', lined: true},
  {id: 'work', text: 'Do work - one way ₹1L or round trip ₹2.5L.', lined: false},
  {
    id: 'manager',
    text: 'Dedicated account Manager always available for you.',
    lined: false,
  },
  {id: 'vehicles', text: 'Add upto 10 vehicles in your profile', lined: true},
];

const DottedLine = () => (
  <View style={styles.dottedClip}>
    <View style={styles.dottedStroke} />
  </View>
);

const Sparkle = ({size = 8, style}) => (
  <View style={[{width: size, height: size}, style]}>
    <View
      style={[
        styles.sparkleBar,
        {
          width: size,
          height: Math.max(2, size * 0.28),
          top: size * 0.36,
        },
      ]}
    />
    <View
      style={[
        styles.sparkleBar,
        {
          width: Math.max(2, size * 0.28),
          height: size,
          left: size * 0.36,
        },
      ]}
    />
  </View>
);

const SupplierBadge = () => (
  <View style={styles.badgeWrap}>
    <View style={styles.badgeInner}>
      <Sparkle size={8} style={styles.sparkleTL} />
      <Sparkle size={10} style={styles.sparkleTR} />
      <Sparkle size={6} style={styles.sparkleBL} />
      <Sparkle size={7} style={styles.sparkleBR} />

      <View style={styles.ribbonLeft} />
      <View style={styles.ribbonRight} />
      <View style={styles.ribbonLeftTail} />
      <View style={styles.ribbonRightTail} />

      <View style={styles.shield}>
        <View style={styles.shieldBody}>
          <Ionicons name="checkmark" size={22} color={Colors.secondaryDark} />
        </View>
        <View style={styles.shieldPoint} />
      </View>
    </View>
  </View>
);

/**
 * Become a Taxi Sanchalak Verified Supplier — ₹999/month upsell.
 */
const BecomeVerifiedSupplierScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const onUpgrade = () => {
    Alert.alert(
      'Verified Supplier',
      'Upgrade to Verified Supplier for ₹999/month to unlock badge, 10 vehicles and a dedicated manager.',
    );
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 6}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 32},
        ]}>
        <View style={styles.cardWrap}>
          <SupplierBadge />
          <View style={styles.card}>
            <Text style={styles.title}>Become a Taxi Sanchalak</Text>
            <Text style={styles.subtitle}>Verified Supplier</Text>

            {BENEFITS.map(item => (
              <View key={item.id} style={styles.benefitBlock}>
                {item.lined ? <DottedLine /> : null}
                <Text
                  style={[
                    styles.benefitText,
                    !item.lined && styles.benefitTextPlain,
                  ]}>
                  {item.text}
                </Text>
                {item.lined ? <DottedLine /> : null}
              </View>
            ))}

            <Text style={styles.price}>
              ₹999<Text style={styles.priceSuffix}>/month</Text>
            </Text>

            <PrimaryButton
              title="Upgrade Now"
              onPress={onUpgrade}
              darkText
              style={styles.upgradeBtn}
              textStyle={styles.upgradeBtnText}
            />
          </View>
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
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: 8,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  cardWrap: {
    width: '100%',
    paddingTop: 34,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 38,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  badgeWrap: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    zIndex: 4,
    alignItems: 'center',
  },
  badgeInner: {
    width: 120,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleBar: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  sparkleTL: {
    position: 'absolute',
    top: 6,
    left: 8,
  },
  sparkleTR: {
    position: 'absolute',
    top: 2,
    right: 10,
  },
  sparkleBL: {
    position: 'absolute',
    bottom: 8,
    left: 16,
  },
  sparkleBR: {
    position: 'absolute',
    bottom: 12,
    right: 6,
  },
  ribbonLeft: {
    position: 'absolute',
    left: 4,
    top: 30,
    width: 38,
    height: 13,
    backgroundColor: Colors.secondaryDark,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    transform: [{rotate: '-20deg'}],
    zIndex: 4,
  },
  ribbonRight: {
    position: 'absolute',
    right: 4,
    top: 30,
    width: 38,
    height: 13,
    backgroundColor: Colors.secondaryDark,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    transform: [{rotate: '20deg'}],
    zIndex: 4,
  },
  ribbonLeftTail: {
    position: 'absolute',
    left: 6,
    top: 40,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderRightWidth: 12,
    borderTopColor: Colors.secondaryDark,
    borderRightColor: 'transparent',
    transform: [{rotate: '-10deg'}],
    zIndex: 1,
  },
  ribbonRightTail: {
    position: 'absolute',
    right: 6,
    top: 40,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderLeftWidth: 12,
    borderTopColor: Colors.secondaryDark,
    borderLeftColor: 'transparent',
    transform: [{rotate: '10deg'}],
    zIndex: 1,
  },
  shield: {
    alignItems: 'center',
    zIndex: 1,
  },
  shieldBody: {
    width: 42,
    height: 38,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  shieldPoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 21,
    borderRightWidth: 21,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
    marginTop: -1,
  },
  title: {
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: '#2C3548',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: Typography.fontWeights.bold,
    color: '#E0A317',
    textAlign: 'center',
    marginBottom: 10,
  },
  benefitBlock: {
    width: '100%',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4A5568',
    textAlign: 'center',
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  benefitTextPlain: {
    paddingVertical: 8,
  },
  dottedClip: {
    width: '100%',
    height: 1,
    overflow: 'hidden',
  },
  dottedStroke: {
    borderWidth: 1,
    borderColor: '#F0A8A8',
    borderStyle: 'dashed',
    margin: -1,
  },
  price: {
    fontSize: 32,
    fontWeight: Typography.fontWeights.bold,
    color: '#E0A317',
    marginTop: 6,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  priceSuffix: {
    fontSize: 22,
    fontWeight: Typography.fontWeights.bold,
  },
  upgradeBtn: {
    height: 50,
    borderRadius: 14,
    width: '100%',
    shadowOpacity: 0,
    elevation: 0,
  },
  upgradeBtnText: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: '#2C3548',
  },
});

export default BecomeVerifiedSupplierScreen;
