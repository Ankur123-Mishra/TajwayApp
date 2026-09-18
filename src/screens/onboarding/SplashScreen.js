import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {
  APP_TAGLINE_HI,
  APP_VERSION,
} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {useAuth} from '../../hooks';
import BrandLogo from '../../components/brand/BrandLogo';
import {Colors, Spacing, Typography} from '../../theme';

const carInnova = require('../../assets/images/Innova.webp');

/**
 * Splash — logo, tagline, car spotlight middle, brand hill footer.
 */

const SplashScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const spin = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(20)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const {isAuthenticated, hasPreferences, role} = useAuth();

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    floatLoop.start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    glowLoop.start();

    return () => {
      floatLoop.stop();
      glowLoop.stop();
    };
  }, [fadeIn, rise, floatY, glow]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.replace(ROUTES.WELCOME);
        return;
      }
      if (!hasPreferences) {
        navigation.replace(ROUTES.PREFERENCES);
        return;
      }
      if (role === 'driver') {
        navigation.replace(ROUTES.DRIVER_ROOT);
      } else if (role === 'owner') {
        navigation.replace(ROUTES.OWNER_ROOT);
      } else {
        navigation.replace(ROUTES.AGENT_ROOT);
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [hasPreferences, isAuthenticated, navigation, role]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const carTranslateY = floatY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.85],
  });

  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topGlow} pointerEvents="none" />

      <Animated.View
        style={[
          styles.center,
          {
            paddingTop: insets.top + 40,
            opacity: fadeIn,
            transform: [{translateY: rise}],
          },
        ]}>
        <BrandLogo size="lg" stacked={false} />

        <View style={styles.tagBlock}>
          <View style={styles.line} />
          <Text style={styles.tagline}>{APP_TAGLINE_HI}</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.version}>{APP_VERSION}</Text>

        {/* Middle — car spotlight */}
        <View style={styles.midWrap}>
          <Animated.View
            style={[
              styles.glowDisc,
              {opacity: glowOpacity, transform: [{scale: glowScale}]},
            ]}
          />
          <View style={styles.discOuter} />
          <View style={styles.discInner} />

          <Animated.View
            style={[
              styles.carStage,
              {transform: [{translateY: carTranslateY}]},
            ]}>
            <Image source={carInnova} style={styles.midCar} resizeMode="contain" />
          </Animated.View>

          <View style={styles.shadowOval} />

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={13} color={Colors.success} />
              <Text style={styles.badgeText}>Verified</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="flash" size={13} color={Colors.primaryDark} />
              <Text style={styles.badgeText}>Fast Deals</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="globe-outline" size={13} color={Colors.info} />
              <Text style={styles.badgeText}>Pan India</Text>
            </View>
          </View>
        </View>

      </Animated.View>

      <View
        style={[
          styles.bottom,
          {paddingBottom: Math.max(insets.bottom + 12, 20)},
        ]}>
        <View style={styles.waveBack} />
        <View style={styles.waveFront} />

        <View style={styles.bottomContent}>
          <View style={styles.stepsCard}>
            <View style={styles.stepItem}>
              <View style={styles.stepIcon}>
                <Ionicons name="people-outline" size={16} color={Colors.textPrimary} />
              </View>
              <Text style={styles.stepLabel}>Connect</Text>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={[styles.stepIcon, styles.stepIconActive]}>
                <Ionicons name="chatbubbles-outline" size={16} color={Colors.textPrimary} />
              </View>
              <Text style={styles.stepLabel}>Quote</Text>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={styles.stepIcon}>
                <Ionicons name="checkmark-done-outline" size={16} color={Colors.textPrimary} />
              </View>
              <Text style={styles.stepLabel}>Book</Text>
            </View>
          </View>

          <View style={styles.loadingRow}>
            <Animated.View style={[styles.spinner, {transform: [{rotate}]}]} />
            <Text style={styles.loadingText}>Loading marketplace…</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  topGlow: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.primaryMuted,
    opacity: 0.65,
  },
  center: {
    alignItems: 'center',
    zIndex: 2,
  },
  tagBlock: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    width: '78%',
  },
  line: {
    alignSelf: 'stretch',
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderStrong,
  },
  tagline: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  version: {
    marginTop: Spacing.sm,
    fontSize: 13,
    color: Colors.textMuted,
  },
  midWrap: {
    marginTop: Spacing.xxl,
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowDisc: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.primaryMuted,
  },
  discOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  discInner: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  carStage: {
    zIndex: 3,
    marginTop: -18,
  },
  midCar: {
    width: 200,
    height: 104,
  },
  shadowOval: {
    position: 'absolute',
    bottom: 58,
    width: 110,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.shadow,
    opacity: 0.1,
  },
  badgeRow: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textSecondary,
  },
  spinner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: Colors.textPrimary,
    borderTopColor: 'transparent',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 188,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  waveBack: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: 0,
    height: 168,
    backgroundColor: Colors.primaryLight,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    opacity: 0.7,
  },
  waveFront: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 148,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  bottomContent: {
    zIndex: 2,
    width: '100%',
    paddingHorizontal: Spacing.screenPadding,
    alignItems: 'center',
  },
  stepsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepIconActive: {
    backgroundColor: Colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPrimary,
  },
  stepDivider: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.border,
    marginBottom: 18,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPrimary,
  },
});

export default SplashScreen;
