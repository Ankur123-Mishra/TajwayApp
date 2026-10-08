import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Images} from '../../constants';
import {useResponsiveStyles} from '../../hooks';

const CREAM = '#FCF8EB';
const YELLOW = '#F5C400';
const SHIELD = '#F7D04F';
const NAVY = '#1B2744';
const WAVE_RATIO = 165 / 1200;
const FOOTER_RATIO = 87 / 1200;

/**
 * Space to keep the footer above the system back / gesture bar.
 * Some Android phones report a bottom inset, others draw the nav bar
 * over the screen and report 0. Use whichever clearance is larger.
 */
const bottomClearance = insetBottom => {
  const screenHeight = Dimensions.get('screen').height;
  const windowHeight = Dimensions.get('window').height;
  const statusHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  const reservedBySystem = screenHeight - windowHeight - statusHeight > 24;
  const fallback = Platform.OS === 'android' && !reservedBySystem ? 48 : 0;
  return Math.max(insetBottom, fallback) + 12;
};

const TRUST = [
  {label: 'Safe & Secure\nPlatform'},
  {label: '24/7\nSupport'},
  {label: "Trusted by\n1000's of Drivers"},
];

/**
 * Shared login / OTP hero: driver photo, wordmark, curved sheet, trust row.
 */
const FIELD_GAP = 12;

const AuthHeroLayout = ({children}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const scrollRef = useRef(null);
  const scrollY = useRef(0);
  const keyboardTopRef = useRef(0);
  const fullHeightRef = useRef(height);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const imageHeight = width * (912 / 512);
  const heroHeight = Math.min(
    Math.round(imageHeight * 0.63),
    Math.round(height * 0.56),
  );
  const waveHeight = Math.round(width * WAVE_RATIO);
  const footerHeight = Math.round(width * FOOTER_RATIO);

  if (keyboardHeight === 0) {
    fullHeightRef.current = height;
  }
  const alreadyResized = Math.max(0, fullHeightRef.current - height);
  const keyboardInset = Math.max(0, keyboardHeight - alreadyResized);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, event => {
      const coords = event?.endCoordinates || {};
      const windowHeight = Dimensions.get('window').height;
      keyboardTopRef.current =
        typeof coords.screenY === 'number' && coords.screenY > 0
          ? coords.screenY
          : windowHeight - (coords.height || 0);
      setKeyboardHeight(coords.height || 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardTopRef.current = 0;
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardHeight <= 0) {
      scrollY.current = 0;
      scrollRef.current?.scrollTo({y: 0, animated: true});
      return undefined;
    }

    let cancelled = false;
    const scrollFieldIntoView = attempt => {
      if (cancelled) {
        return;
      }
      const focused = TextInput.State.currentlyFocusedInput?.();
      if (!focused?.measureInWindow) {
        if (attempt < 6) {
          setTimeout(() => scrollFieldIntoView(attempt + 1), 40);
        }
        return;
      }
      focused.measureInWindow((x, y, w, h) => {
        if (cancelled || !h) {
          return;
        }
        const overlap = y + h + FIELD_GAP - keyboardTopRef.current;
        if (overlap <= 4) {
          return;
        }
        const nextY = scrollY.current + overlap;
        scrollY.current = nextY;
        scrollRef.current?.scrollTo({y: nextY, animated: true});
      });
    };

    const timer = setTimeout(() => scrollFieldIntoView(0), 60);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [keyboardHeight]);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        scrollsChildToFocus={false}
        scrollEventThrottle={16}
        onScroll={event => {
          scrollY.current = event.nativeEvent.contentOffset.y;
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          keyboardInset > 0 && {minHeight: height + keyboardInset},
        ]}>
        <View style={[styles.hero, {height: heroHeight}]}>
          <Image
            source={Images.loginImage}
            style={[styles.heroImage, {width, height: imageHeight}]}
            resizeMode="cover"
          />
          <View style={[styles.heroCopy, {paddingTop: insets.top + 10}]}>
            <View style={styles.brandRow}>
              <MaterialDesignIcons name="taxi" size={42} color={YELLOW} />
              <View>
                <Text style={styles.brandTaj}>Tajway</Text>
                <Text style={styles.brandCabs}>Cabs</Text>
              </View>
            </View>
            <Text style={styles.headline}>
              Your Journey{'\n'}
              Our <Text style={styles.headlineGold}>Priority</Text>
            </Text>
            <Text style={styles.heroSub}>
              Get more bookings, earn better and be a part of a trusted
              driver community
            </Text>
          </View>
        </View>

          <View style={[styles.sheet, {marginTop: -waveHeight}]}>
            <Image
              source={Images.authSheetWave}
              style={{width, height: waveHeight}}
              resizeMode="stretch"
            />
            <View style={[styles.card, {paddingBottom: footerHeight + 8}]}>
              {children}
            </View>
            <View style={[styles.footer, {marginTop: -footerHeight}]}>
              <Image
                source={Images.authSheetFooter}
                style={{width, height: footerHeight}}
                resizeMode="stretch"
              />
              <View
                style={[
                  styles.trust,
                  {paddingBottom: bottomClearance(insets.bottom)},
                ]}>
                {TRUST.map((item, index) => (
                  <React.Fragment key={item.label}>
                    {index > 0 ? <View style={styles.trustDivider} /> : null}
                    <View style={styles.trustItem}>
                      <View style={styles.badge}>
                        <Ionicons name="shield" size={28} color={SHIELD} />
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={13}
                          color="#1A1A1A"
                          style={styles.badgeCheck}
                        />
                      </View>
                      <Text style={styles.trustLabel}>{item.label}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
        </View>
      </ScrollView>
    </View>
  );
};

const baseStyles = {
  root: {
    flex: 1,
    backgroundColor: CREAM,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    overflow: 'hidden',
    backgroundColor: '#F3E2B0',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroCopy: {
    paddingHorizontal: 20,
    width: '66%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTaj: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
    color: NAVY,
  },
  brandCabs: {
    marginTop: -1,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
    color: YELLOW,
  },
  headline: {
    marginTop: 16,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: NAVY,
  },
  headlineGold: {
    color: YELLOW,
  },
  heroSub: {
    marginTop: 10,
    maxWidth: 230,
    fontSize: 13,
    lineHeight: 18,
    color: '#8B909A',
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  card: {
    flexGrow: 1,
    marginTop: -1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 8,
    overflow: 'visible',
  },
  footer: {
    backgroundColor: 'transparent',
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: CREAM,
    paddingTop: 2,
    paddingHorizontal: 10,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badge: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCheck: {
    position: 'absolute',
  },
  trustDivider: {
    width: 1,
    height: 42,
    marginTop: 2,
    backgroundColor: '#D5D0C4',
  },
  trustLabel: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: '#2A2A2A',
  },
};

export default AuthHeroLayout;
