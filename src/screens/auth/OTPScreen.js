import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import BackButton from '../../components/brand/BackButton';
import BrandHeader from '../../components/brand/BrandHeader';
import PhoneInputRow from '../../components/brand/PhoneInputRow';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {ROUTES} from '../../constants/Routes';
import {loginSuccess} from '../../redux/slices/authSlice';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * OTP verification — timer, terms, Verify CTA, toast.
 */
const OTPScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const phone = route?.params?.phone || '';
  const [otp, setOtp] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [seconds, setSeconds] = useState(28);
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const hide = setTimeout(() => setShowToast(false), 3500);
    return () => clearTimeout(hide);
  }, []);

  const onVerify = () => {
    if (!accepted || otp.length < 4) {
      return;
    }
    dispatch(
      loginSuccess({
        token: 'mock-token',
        phone,
        role: 'agent',
        user: {
          id: '1',
          name: '',
          phone,
          role: 'agent',
        },
      }),
    );
    navigation.replace(ROUTES.PREFERENCES);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {paddingTop: insets.top + 8}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.topBar}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <BrandHeader />

      <View style={styles.form}>
        <Text style={styles.title}>Verify with OTP</Text>
        <PhoneInputRow value={phone} editable={false} />

        <View style={styles.otpBox}>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter OTP"
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.otpInput}
          />
        </View>

        <Text style={styles.timer}>Expire In {seconds}s</Text>

        <TouchableOpacity
          style={styles.termsRow}
          activeOpacity={0.8}
          onPress={() => setAccepted(v => !v)}>
          <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
            {accepted ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.termsText}>
            By clicking here accept{' '}
            <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Verify"
          onPress={onVerify}
          disabled={!accepted || otp.length < 4}
          style={styles.verifyBtn}
        />

        <TouchableOpacity>
          <Text style={styles.privacy}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      {showToast ? (
        <View style={[styles.toast, {bottom: insets.bottom + 24}]}>
          <View style={styles.toastDot} />
          <Text style={styles.toastText}>OTP Sent to your mobile number</Text>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  form: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSlate,
    marginBottom: Spacing.base,
  },
  otpBox: {
    marginTop: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
  },
  otpInput: {
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  timer: {
    textAlign: 'center',
    marginTop: Spacing.md,
    color: Colors.timer,
    fontWeight: Typography.fontWeights.semibold,
    fontSize: 14,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkMark: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 13,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: Typography.fontWeights.semibold,
  },
  verifyBtn: {
    marginTop: Spacing.lg,
  },
  privacy: {
    textAlign: 'center',
    marginTop: Spacing.base,
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: Typography.fontWeights.semibold,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40,40,40,0.92)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    maxWidth: '90%',
  },
  toastDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  toastText: {
    color: '#F0F0F0',
    fontSize: 13,
  },
});

export default OTPScreen;
