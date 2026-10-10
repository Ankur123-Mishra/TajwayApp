import React, {useState} from 'react';
import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Images} from '../../constants/Images';
import {Colors} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const bannerAsset = Image.resolveAssetSource(Images.verificationBanner);
const BANNER_RATIO =
  bannerAsset?.width > 0 ? bannerAsset.width / bannerAsset.height : 512 / 245;

const TITLE_NAVY = '#1B3A6F';
const TITLE_BLUE = '#2F6CFF';
const SUBTITLE = '#8B93A3';
const LABEL = '#6B7280';

const BENEFITS = [
  {
    id: 'trust',
    label: 'Build Trust',
    icon: 'shield-checkmark',
    color: '#2F6FED',
    background: '#EAF1FF',
  },
  {
    id: 'approvals',
    label: 'Faster Approvals',
    icon: 'flash',
    color: '#1FA85A',
    background: '#E7F8EE',
  },
  {
    id: 'opportunities',
    label: 'More Opportunities',
    icon: 'lock-closed',
    color: '#7C4DFF',
    background: '#F3EEFF',
  },
];

/**
 * First-visit verification sheet on Market home.
 * Slides up from the bottom over the dimmed marketplace.
 */
const VerificationPromptSheet = ({visible, onClose, onVerify}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const [bannerWidth, setBannerWidth] = useState(0);
  const bannerHeight =
    bannerWidth > 0 ? Math.round((bannerWidth / BANNER_RATIO) * 10) / 10 : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Dismiss verification prompt">
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.sheetTouch}>
          <View
            style={[
              styles.sheet,
              {paddingBottom: Math.max(insets.bottom, 10) + 6},
            ]}>
            <View
              style={styles.bannerWrap}
              onLayout={event => {
                const nextWidth = event.nativeEvent.layout.width;
                setBannerWidth(current =>
                  Math.abs(current - nextWidth) < 0.5 ? current : nextWidth,
                );
              }}>
              {bannerWidth > 0 ? (
                <Image
                  source={Images.verificationBanner}
                  style={{width: bannerWidth, height: bannerHeight}}
                  resizeMode="contain"
                  accessibilityLabel="Verified taxi partner"
                />
              ) : null}
            </View>

            <Text style={styles.title}>
              Get Verified &{'\n'}
              <Text style={styles.titleAccent}>
                Start Earning with Confidence
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              Complete your verification to unlock bookings, build trust and
              grow your business.
            </Text>

            <View style={styles.benefits}>
              {BENEFITS.map(item => (
                <View key={item.id} style={styles.benefit}>
                  <View
                    style={[
                      styles.benefitIcon,
                      {backgroundColor: item.background},
                    ]}>
                    <Ionicons name={item.icon} size={14} color={item.color} />
                  </View>
                  <Text style={styles.benefitLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cta}
              activeOpacity={0.88}
              onPress={onVerify}
              accessibilityRole="button"
              accessibilityLabel="Verify Now">
              <Text style={styles.ctaText}>Verify Now</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const baseStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetTouch: {
    width: '100%',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
  },
  bannerWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    fontStyle: 'normal',
    color: TITLE_NAVY,
  },
  titleAccent: {
    color: TITLE_BLUE,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  subtitle: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    fontStyle: 'normal',
    color: SUBTITLE,
    paddingHorizontal: 8,
  },
  benefits: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  benefit: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  benefitLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    fontStyle: 'normal',
    color: LABEL,
    textAlign: 'center',
  },
  cta: {
    marginTop: 14,
    height: 46,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onPrimary,
  },
  ctaArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onPrimary,
    marginTop: -1,
  },
};

export default VerificationPromptSheet;
