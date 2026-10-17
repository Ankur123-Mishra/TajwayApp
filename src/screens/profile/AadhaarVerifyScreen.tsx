import React, {useEffect, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PrimaryButton from '../../components/brand/PrimaryButton';
import BannerHeader from '../../components/common/BannerHeader';
import OTPInput from '../../components/common/OTPInput';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 51;

/**
 * Verify with Aadhaar — enter 12-digit number, then OTP.
 */
const AadhaarVerifyScreen = ({navigation, route}) => {
  const styles = useResponsiveStyles(baseStyles);
  const returnRoute = route?.params?.returnRoute;
  const [aadhaar, setAadhaar] = useState('');
  const [phase, setPhase] = useState('number');
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      return undefined;
    }
    const timer = setInterval(() => {
      setSeconds(current => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const onSendOtp = () => {
    const digits = aadhaar.replace(/\D/g, '');
    if (digits.length !== 12) {
      Alert.alert(
        'Aadhaar number',
        'Enter a 12 digit Aadhaar number to send OTP.',
      );
      return;
    }
    setOtp('');
    setInvalid(false);
    setPhase('otp');
    setSeconds(RESEND_SECONDS);
  };

  const finishVerification = () => {
    if (returnRoute) {
      navigation.navigate({
        name: returnRoute,
        params: {
          aadhaarVerified: true,
          aadhaarNumber: aadhaar.replace(/\D/g, ''),
        },
        merge: true,
      });
      return;
    }
    navigation.goBack();
  };

  const onVerifyOtp = () => {
    if (otp.length < OTP_LENGTH) {
      setInvalid(true);
      return;
    }
    finishVerification();
  };

  const onResend = () => {
    if (seconds > 0) {
      return;
    }
    setOtp('');
    setInvalid(false);
    setSeconds(RESEND_SECONDS);
  };

  return (
    <View style={styles.container}>
      <BannerHeader
        title={phase === 'otp' ? 'OTP Verification' : 'Verify with Aadhaar'}
        onBack={() => {
          if (phase === 'otp') {
            setPhase('number');
            setInvalid(false);
            return;
          }
          navigation.goBack();
        }}
        style={styles.headerGap}
      />

      <View style={styles.content}>
        {phase === 'number' ? (
          <>
            <Text style={styles.heading}>Enter your 12 digit Aadhaar Number</Text>
            <Text style={styles.sub}>
              Please verify your identity this is done to reduce frauds and make
              the platform safer
            </Text>

            <View style={styles.inputBox}>
              <TextInput
                value={aadhaar}
                onChangeText={value =>
                  setAadhaar(value.replace(/\D/g, '').slice(0, 12))
                }
                keyboardType="number-pad"
                maxLength={12}
                placeholder="Enter Aadhaar Number"
                placeholderTextColor={Colors.textPlaceholder}
                style={styles.input}
              />
            </View>

            <PrimaryButton
              title="Verify Now"
              onPress={onSendOtp}
              disabled={aadhaar.replace(/\D/g, '').length < 12}
              style={styles.cta}
            />
          </>
        ) : (
          <>
            <Text style={styles.heading}>Enter OTP</Text>
            <Text style={styles.sub}>
              We have sent a verification OTP to your Aadhaar linked mobile
              number.
            </Text>

            <OTPInput
              length={OTP_LENGTH}
              value={otp}
              onChangeText={text => {
                setOtp(text);
                if (invalid) {
                  setInvalid(false);
                }
              }}
              style={styles.otp}
            />

            {invalid ? <Text style={styles.error}>Invalid OTP</Text> : null}

            <PrimaryButton
              title="Verify"
              onPress={onVerifyOtp}
              disabled={otp.length < OTP_LENGTH}
              style={styles.cta}
            />

            <TouchableOpacity
              activeOpacity={seconds > 0 ? 1 : 0.8}
              onPress={onResend}
              style={styles.resend}>
              <Text style={styles.resendText}>
                {seconds > 0
                  ? `Resend OTP in ${String(seconds).padStart(2, '0')}s`
                  : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  headerGap: {
    marginBottom: Spacing.xl,
  },
  content: {
    paddingHorizontal: Spacing.screenPadding,
  },
  heading: {
    fontSize: 20,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
    marginBottom: Spacing.sm,
  },
  sub: {
    fontSize: 14,
    color: Colors.textNavy,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  inputBox: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    color: Colors.textPrimary,
    padding: 0,
  },
  otp: {
    marginBottom: 8,
  },
  error: {
    textAlign: 'center',
    fontSize: 13,
    color: '#E25B4A',
    marginBottom: 4,
  },
  cta: {
    marginTop: Spacing.xl,
  },
  resend: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textMuted,
  },
};

export default AadhaarVerifyScreen;
