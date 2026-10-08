import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {speak, stopSpeech} from '../../services/speech';
import {MARKET_TOUR_STEPS} from './marketTourSteps';

const OVERLAY = 'rgba(62, 70, 86, 0.58)';
const GOLD = '#F5B942';

const ArrowHead = ({up}) => (
  <View style={up ? styles.arrowHeadUp : styles.arrowHeadDown} />
);

const Skyline = () => (
  <View style={styles.skyline}>
    {[22, 36, 18, 44, 28, 38, 16, 30].map((height, index) => (
      <View
        key={height + index}
        style={[styles.building, {height, opacity: 0.35 + (index % 3) * 0.12}]}
      />
    ))}
  </View>
);

const TaxiFront = () => (
  <View style={styles.taxiWrap}>
    <View style={styles.taxiRoof} />
    <View style={styles.taxiBody}>
      <View style={styles.taxiGlass} />
      <View style={styles.taxiGlass} />
    </View>
    <View style={styles.taxiBumper} />
    <View style={styles.wheelRow}>
      <View style={styles.wheel} />
      <View style={styles.wheel} />
    </View>
  </View>
);

const PhoneFrame = ({children}) => (
  <View style={styles.phone}>
    <View style={styles.phoneNotch} />
    <View style={styles.phoneScreen}>{children}</View>
  </View>
);

const TourArt = ({type, caption}) => {
  let graphic = null;
  if (type === 'welcome') {
    graphic = (
      <View style={styles.artScene}>
        <Skyline />
        <TaxiFront />
        <View style={styles.mapPin}>
          <View style={styles.mapPinDot} />
        </View>
      </View>
    );
  } else if (type === 'bookings') {
    graphic = (
      <View style={styles.artRow}>
        <PhoneFrame>
          <View style={styles.fakeLine} />
          <View style={[styles.fakeLine, styles.fakeLineShort]} />
          <View style={styles.fakeRoute} />
        </PhoneFrame>
        <TaxiFront />
      </View>
    );
  } else if (type === 'profile') {
    graphic = (
      <View style={styles.artRow}>
        <PhoneFrame>
          <View style={styles.checkBubble}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <View style={styles.fakeLine} />
          <View style={[styles.fakeLine, styles.fakeLineShort]} />
        </PhoneFrame>
        <TaxiFront />
      </View>
    );
  } else if (type === 'videos') {
    graphic = (
      <View style={styles.laptop}>
        <Skyline />
        <View style={styles.playBubble}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
    );
  } else if (type === 'alerts') {
    graphic = (
      <PhoneFrame>
        <Text style={styles.bellArt}>🔔</Text>
        <View style={styles.fakeLine} />
        <View style={[styles.fakeLine, styles.fakeLineShort]} />
      </PhoneFrame>
    );
  } else if (type === 'filter') {
    graphic = (
      <View style={styles.artRow}>
        <PhoneFrame>
          {[0, 1, 2].map(row => (
            <View key={row} style={styles.filterRowArt}>
              <View style={styles.filterDot} />
              <View style={styles.fakeLine} />
            </View>
          ))}
        </PhoneFrame>
        <TaxiFront />
      </View>
    );
  } else if (type === 'post') {
    graphic = (
      <PhoneFrame>
        <View style={styles.checkBubble}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.miniTaxi}>🚕</Text>
        <View style={[styles.fakeLine, styles.fakeLineShort]} />
      </PhoneFrame>
    );
  } else {
    graphic = (
      <View style={styles.helpArt}>
        <View style={styles.supportBadge}>
          <Text style={styles.supportBadgeText}>24×7</Text>
        </View>
        <Text style={styles.helpPerson}>👩‍💻</Text>
      </View>
    );
  }

  return (
    <View style={styles.artBox}>
      {graphic}
      {caption ? <Text style={styles.artCaption}>{caption}</Text> : null}
    </View>
  );
};

const Spotlight = ({rect, shape, cornerRadius = 18}) => {
  const {width: screenW, height: screenH} = useWindowDimensions();

  if (!rect) {
    return <View style={[StyleSheet.absoluteFill, styles.dim]} />;
  }

  const pad = shape === 'circle' ? 6 : 0;
  const x = Math.max(0, rect.x - pad);
  const y = Math.max(0, rect.y - pad);
  const width = rect.width + pad * 2;
  const height = rect.height + pad * 2;
  const radius = Math.min(
    shape === 'circle' || shape === 'pill' ? height / 2 : cornerRadius,
    width / 2,
    height / 2,
  );
  // One rounded hole. A thick border with a matching radius clips the dim
  // overlay to the card edge, so corners stay a normal border radius.
  const border = Math.ceil(Math.max(screenW, screenH));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: y - border,
          left: x - border,
          width: width + border * 2,
          height: height + border * 2,
          borderWidth: border,
          borderColor: OVERLAY,
          borderRadius: radius + border,
          backgroundColor: 'transparent',
        }}
      />
      <View
        pointerEvents="none"
        style={[
          styles.holeRing,
          {top: y, left: x, width, height, borderRadius: radius},
        ]}
      />
    </View>
  );
};

/**
 * Market coach tour — dim overlay, highlighted section, Next, and spoken guide.
 */

const MarketAppTour = ({visible, spotlight, onStepChange, onFinish}) => {
  const insets = useSafeAreaInsets();
  const {width: screenW, height: screenH} = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [cardBox, setCardBox] = useState(null);
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  const step = MARKET_TOUR_STEPS[index];
  const isLast = index === MARKET_TOUR_STEPS.length - 1;

  useEffect(() => {
    if (!visible) {
      stopSpeech();
      return undefined;
    }
    const current = MARKET_TOUR_STEPS[index];
    onStepChangeRef.current?.(current);
    const timer = setTimeout(() => speak(current.speech), 280);
    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [visible, index]);

  const handleNext = () => {
    if (isLast) {
      stopSpeech();
      onFinish?.();
      return;
    }

    setCardBox(null);
    setIndex(prev => prev + 1);
  };

  if (!visible || !step) {
    return null;
  } 

  const cardWidth = screenW - 28;
  const cardHeight = cardBox?.height || 390;
  let cardTop = (screenH - cardHeight) / 2;
  if (spotlight && step.placement === 'below') {
    cardTop = spotlight.y + spotlight.height + 34;
  } else if (spotlight && step.placement === 'above') {
    cardTop = spotlight.y - cardHeight - 34;
  }
  const minTop = insets.top + 8;
  const maxTop =
    screenH - cardHeight - (step.showVolume ? 78 : 12) - insets.bottom;
  cardTop = Math.max(minTop, Math.min(cardTop, Math.max(minTop, maxTop)));

  let connector = null;
  if (spotlight && cardBox && step.placement) {
    const anchorX = spotlight.x + spotlight.width / 2;
    const lineX = Math.min(
      cardBox.x + cardBox.width - 28,
      Math.max(cardBox.x + 28, anchorX),
    );
    const pointsUp = step.placement === 'below';
    const fromY = pointsUp
      ? spotlight.y + spotlight.height + 4
      : cardBox.y + cardBox.height;
    const toY = pointsUp ? cardBox.y : spotlight.y - 4;
    const top = Math.min(fromY, toY);
    const height = Math.abs(toY - fromY);
    if (height > 14) {
      connector = (
        <View
          pointerEvents="none"
          style={[styles.connector, {top, left: lineX - 8, height}]}
        >
          {pointsUp ? <ArrowHead up /> : null}
          <View style={styles.connectorLine} />
          {pointsUp ? null : <ArrowHead />}
        </View>
      );
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleNext}
    >
      <View style={styles.root}>
        <Spotlight
          rect={spotlight}
          shape={step.shape}
          cornerRadius={step.radius}
        />
        {connector}
        <View
          style={[styles.card, {top: cardTop, width: cardWidth}]}
          onLayout={event => {
            const {x, y, width, height} = event.nativeEvent.layout;
            setCardBox(prev => {
              if (
                prev &&
                Math.abs(prev.y - y) < 1 &&
                Math.abs(prev.height - height) < 1 &&
                Math.abs(prev.x - x) < 1
              ) {
                return prev;
              }
              return {x, y, width, height};
            });
          }}
        >
          <TourArt type={step.art} caption={step.artCaption} />
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.body}>{step.body}</Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.88}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel={step.cta}
          >
            <Text style={styles.buttonText}>{step.cta}</Text>
          </TouchableOpacity>
        </View>
        {step.showVolume ? (
          <View style={[styles.volumeBar, {paddingBottom: insets.bottom + 14}]}>
            <Text style={styles.volumeText}>
              Please raise your phone volume in order to learn how to use the
              application
            </Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  dim: {
    position: 'absolute',
    backgroundColor: OVERLAY,
  },
  holeRing: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  connector: {
    position: 'absolute',
    width: 16,
    alignItems: 'center',
    zIndex: 3,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  arrowHeadUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: '#FFFFFF',
  },
  arrowHeadDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: '#FFFFFF',
  },
  card: {
    position: 'absolute',
    alignSelf: 'center',
    left: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    zIndex: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  artBox: {
    minHeight: 132,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  artCaption: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#F5A623',
  },
  artScene: {
    width: 210,
    height: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  artRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skyline: {
    position: 'absolute',
    top: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  building: {
    width: 14,
    borderRadius: 2,
    backgroundColor: '#C5CED8',
  },
  taxiWrap: {
    alignItems: 'center',
    marginLeft: 8,
  },
  taxiRoof: {
    width: 46,
    height: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#F5C400',
  },
  taxiBody: {
    width: 78,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F5C400',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  taxiGlass: {
    width: 22,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#243044',
  },
  taxiBumper: {
    width: 86,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0B000',
    marginTop: -2,
  },
  wheelRow: {
    width: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  wheel: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2C3440',
    borderWidth: 2,
    borderColor: '#D9D9D9',
  },
  mapPin: {
    position: 'absolute',
    right: 28,
    top: 18,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF5A4F',
    alignItems: 'center',
  },
  mapPinDot: {
    marginTop: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  phone: {
    width: 78,
    height: 112,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#1E2430',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingHorizontal: 6,
    marginRight: 10,
  },
  phoneNotch: {
    alignSelf: 'center',
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E2430',
    marginBottom: 8,
  },
  phoneScreen: {
    flex: 1,
    alignItems: 'center',
  },
  fakeLine: {
    alignSelf: 'stretch',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E6EAF0',
    marginBottom: 6,
  },
  fakeLineShort: {
    width: '68%',
    alignSelf: 'flex-start',
  },
  fakeRoute: {
    marginTop: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3C4',
    borderWidth: 2,
    borderColor: '#F5C400',
  },
  checkBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  checkMark: {
    color: '#1F9D55',
    fontWeight: '800',
    fontSize: 14,
  },
  laptop: {
    width: 168,
    height: 104,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#2C3440',
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 2,
  },
  bellArt: {
    fontSize: 22,
    marginBottom: 6,
  },
  filterRowArt: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 4,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GOLD,
    marginRight: 4,
  },
  miniTaxi: {
    fontSize: 18,
    marginVertical: 4,
  },
  helpArt: {
    alignItems: 'center',
  },
  supportBadge: {
    backgroundColor: '#FFF6D6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  supportBadgeText: {
    color: '#C89200',
    fontWeight: '800',
    fontSize: 12,
  },
  helpPerson: {
    fontSize: 42,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: '#1A1A1B',
    textAlign: 'center',
  },
  body: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    color: '#5C6770',
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    marginTop: 18,
    height: 52,
    borderRadius: 14,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  volumeBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2B2B2E',
    paddingHorizontal: 16,
    paddingTop: 14,
    zIndex: 5,
  },
  volumeText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
  },
});

export default MarketAppTour;
