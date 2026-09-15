import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  APP_TAGLINE_HI,
  APP_VERSION,
} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {useAuth} from '../../hooks';
import BrandLogo from '../../components/brand/BrandLogo';
import {Colors, Spacing, Typography} from '../../theme';

/**
 * Splash — logo, Hindi tagline, version, spinner, yellow hill + drivers.
 */
const SplashScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const spin = useRef(new Animated.Value(0)).current;
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

  return (
    <View style={[styles.container, {paddingTop: insets.top + 24}]}>
      <View style={styles.mapOverlay} pointerEvents="none">
        {Array.from({length: 12}).map((_, i) => (
          <View
            key={`h-${i}`}
            style={[styles.mapH, {top: 40 + i * 55, left: (i % 3) * 40}]}
          />
        ))}
        {Array.from({length: 10}).map((_, i) => (
          <View
            key={`v-${i}`}
            style={[styles.mapV, {left: 30 + i * 38, top: (i % 4) * 30}]}
          />
        ))}
      </View>

      <BrandLogo size="lg" stacked={false} />

      <View style={styles.tagBlock}>
        <View style={styles.line} />
        <Text style={styles.tagline}>{APP_TAGLINE_HI}</Text>
        <View style={styles.line} />
        <Text style={styles.version}>{APP_VERSION}</Text>
      </View>

      <View style={styles.spinnerWrap}>
        <Animated.View style={[styles.spinner, {transform: [{rotate}]}]} />
      </View>

      <View style={styles.bottom}>
        <View style={styles.hill} />
        <View style={styles.driversRow}>
          <DriverFigure shirt="#FFFFFF" pants="#1A1A1B" />
          <DriverFigure shirt={Colors.primary} pants="#757575" highlight />
          <DriverFigure shirt="#9E9E9E" pants="#757575" />
        </View>
      </View>
    </View>
  );
};

const DriverFigure = ({shirt, pants, highlight}) => (
  <View style={[styles.figure, highlight && styles.figureHighlight]}>
    <View style={styles.head} />
    <View style={[styles.torso, {backgroundColor: shirt}]} />
    <View style={[styles.legs, {backgroundColor: pants}]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  mapH: {
    position: 'absolute',
    width: 180,
    height: 1,
    backgroundColor: Colors.mapLine,
  },
  mapV: {
    position: 'absolute',
    width: 1,
    height: 160,
    backgroundColor: Colors.mapLine,
  },
  tagBlock: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    width: '82%',
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
  spinnerWrap: {
    marginTop: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderTopColor: 'transparent',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  hill: {
    position: 'absolute',
    bottom: -80,
    width: 520,
    height: 280,
    borderRadius: 260,
    backgroundColor: Colors.yellowHill,
  },
  driversRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 0,
    zIndex: 2,
  },
  figure: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  figureHighlight: {
    marginBottom: 6,
  },
  head: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0B080',
    marginBottom: 4,
  },
  torso: {
    width: 70,
    height: 90,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  legs: {
    width: 70,
    height: 70,
  },
});

export default SplashScreen;
