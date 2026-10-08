import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {Images} from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {useResponsiveStyles} from '../../hooks';
import {Colors, Spacing, Typography} from '../../theme';

const CREAM = '#FDF7E3';
const AUTO_SCROLL_MS = 3200;

/** Source art is a phone mock. Hide only its status bar and home indicator. */
const SRC_W = 512;
const SRC_H = 1110;
const ART_TOP = 36;
const ART_BOTTOM = 1068;

const SLIDES = [
  {key: 'verified', image: Images.introDriver1},
  {key: 'earnings', image: Images.introDriver2},
  {key: 'requests', image: Images.introDriver3},
];

/**
 * Intro carousel after splash. Artwork swipes on its own.
 * Get Started opens login / sign up.
 */
const OnboardingScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const listRef = useRef(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const [index, setIndex] = useState(0);

  const sliceH = ART_BOTTOM - ART_TOP;
  const scale = Math.min(width / SRC_W, height / sliceH);
  const imageWidth = SRC_W * scale;
  const imageHeight = SRC_H * scale;
  const imageTop = -ART_TOP * scale + 22;
  const imageLeft = (width - imageWidth) / 2;
  const artY = sourceY => imageTop + (sourceY / SRC_H) * imageHeight;

  useEffect(() => {
    if (!width) {
      return undefined;
    }
    const timer = setInterval(() => {
      if (pausedRef.current) {
        return;
      }
      const next = (indexRef.current + 1) % SLIDES.length;
      listRef.current?.scrollToOffset({
        offset: next * width,
        animated: true,
      });
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [width]);

  const onScroll = event => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== indexRef.current && next >= 0 && next < SLIDES.length) {
      indexRef.current = next;
      setIndex(next);
    }
  };

  const finish = () => {
    navigation.replace(ROUTES.WELCOME);
  };

  const renderSlide = ({item}) => (
    <View style={[styles.slide, {width, height}]}>
      <Image
        source={item.image}
        resizeMode="contain"
        style={{
          position: 'absolute',
          width: imageWidth,
          height: imageHeight,
          top: imageTop,
          left: imageLeft,
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.key}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          pausedRef.current = true;
        }}
        onScrollEndDrag={() => {
          pausedRef.current = false;
        }}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        style={styles.list}
      />

      <View pointerEvents="none" style={[styles.copy, {top: insets.top + 16}]}>
        <Text style={styles.title}>
          Drive More. Earn More. With{'\n'}Tajway Cabs.
        </Text>
        <Text style={styles.subtitle}>
          Get customer bookings, manage your rides, and{'\n'}
          grow your earnings — all in one app.
        </Text>
      </View>

      <View pointerEvents="none" style={[styles.dots, {top: artY(918)}]}>
        {SLIDES.map((slide, i) => (
          <View
            key={slide.key}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>

      <View
        pointerEvents="box-none"
        style={[
          styles.bottom,
          {paddingBottom: Math.max(insets.bottom, 12) + 36},
        ]}>
        <PrimaryButton
          title="Get Started"
          onPress={finish}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  list: {
    flex: 1,
    backgroundColor: CREAM,
  },
  slide: {
    overflow: 'hidden',
    backgroundColor: CREAM,
  },
  copy: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
  },
  title: {
    textAlign: 'center',
    fontSize: 23,
    lineHeight: 34,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: Spacing.md,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.screenPadding,
  },
  button: {
    backgroundColor: Colors.primary,
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#C8C8C8',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 22,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.textPrimary,
  },
};

export default OnboardingScreen;
