import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BrandHeader from '../../components/brand/BrandHeader';
import PrimaryButton from '../../components/brand/PrimaryButton';
import LanguageSelectModal from '../../components/profile/LanguageSelectModal';
import {ROUTES} from '../../constants/Routes';
import {setOnboarded} from '../../redux/slices/authSlice';
import {Colors, Spacing, Typography} from '../../theme';

/**
 * Welcome — Login / Sign Up / Change Language.
 * Top (BrandHeader) + bottom actions stay standard; only center visual varies.
 */
const WelcomeScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [language, setLanguage] = useState('en');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [fadeIn, rise, pulse]);

  const goPhone = mode => {
    dispatch(setOnboarded(true));
    navigation.navigate(ROUTES.PHONE_LOGIN, {mode});
  };

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.07],
  });
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.8],
  });

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top + 20, paddingBottom: insets.bottom + 16},
      ]}>
      <BrandHeader />

      <Animated.View
        style={[
          styles.heroWrap,
          {opacity: fadeIn, transform: [{translateY: rise}]},
        ]}>
        <View style={styles.visual}>
          <Animated.View
            style={[
              styles.glow,
              {opacity: glowOpacity, transform: [{scale: glowScale}]},
            ]}
          />

          <View style={styles.ring} />

          <View style={styles.hub}>
            <View style={styles.hubCore}>
              <Ionicons name="car-sport" size={32} color={Colors.textPrimary} />
            </View>
          </View>

          <View style={[styles.node, styles.nodeTop]}>
            <Ionicons name="briefcase" size={16} color={Colors.textInverse} />
          </View>
          <View style={[styles.node, styles.nodeLeft]}>
            <Ionicons name="person" size={16} color={Colors.textInverse} />
          </View>
          <View style={[styles.node, styles.nodeRight]}>
            <Ionicons name="business" size={16} color={Colors.textInverse} />
          </View>
        </View>

        <Text style={styles.heroCaption}>Trusted B2B partners</Text>
      </Animated.View>

      <View style={styles.actions}>
        <View style={styles.row}>
          <PrimaryButton
            title="Log in"
            variant="secondary"
            fullWidth={false}
            style={styles.halfBtn}
            onPress={() => goPhone('login')}
          />
          <PrimaryButton
            title="Sign Up"
            fullWidth={false}
            style={styles.halfBtn}
            onPress={() => goPhone('signup')}
          />
        </View>
        <PrimaryButton
          title="Change Language"
          onPress={() => setLanguageModalVisible(true)}
          style={styles.langBtn}
        />
      </View>

      <LanguageSelectModal
        visible={languageModalVisible}
        selected={language}
        onClose={() => setLanguageModalVisible(false)}
        onSave={setLanguage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visual: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryMuted,
  },
  ring: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    borderStyle: 'dashed',
  },
  hub: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  hubCore: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeTop: {
    top: 8,
    backgroundColor: Colors.secondary,
  },
  nodeLeft: {
    left: 10,
    bottom: 42,
    backgroundColor: Colors.roleDriver,
  },
  nodeRight: {
    right: 10,
    bottom: 42,
    backgroundColor: Colors.roleOwner,
  },
  heroCaption: {
    marginTop: Spacing.base,
    color: Colors.textMuted,
    fontSize: 13,
  },
  actions: {
    paddingHorizontal: Spacing.screenPadding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  halfBtn: {
    width: '48%',
  },
  langBtn: {
    marginTop: 0,
  },
});

export default WelcomeScreen;
