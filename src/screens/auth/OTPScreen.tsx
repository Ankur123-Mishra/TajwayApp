import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import AuthHeroLayout from '../../components/brand/AuthHeroLayout';
import PrimaryButton from '../../components/brand/PrimaryButton';
import OTPInput from '../../components/common/OTPInput';
import {ROUTES} from '../../constants/Routes';
import {loginSuccess} from '../../redux/slices/authSlice';
import {Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const RESEND_SECONDS = 51;

const maskPhone = phone => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 5) {
    return '98912*****';
  }
  return `${digits.slice(0, 5)}${'*'.repeat(digits.length - 5)}`;
};

/**
 * OTP verification — boxed code, resend timer, invalid state.
 */

const OTPScreen = ({navigation, route}) => {
  const styles = useResponsiveStyles(baseStyles);
  const dispatch = useDispatch();
  const phone = route?.params?.phone || '';
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const onVerify = () => {
    if (otp.length < 4) {
      setInvalid(true);
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
    // Preferences (location + booking type) skipped — go straight to bottom tabs
    navigation.reset({
      index: 0,
      routes: [{name: ROUTES.AGENT_ROOT}],
    });
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
    <AuthHeroLayout>
      <Text style={styles.title}>OTP Verification</Text>
      <Text
        style={styles.sent}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}>
        We have sent a verification OTP to {maskPhone(phone)}{' '}
        <Text style={styles.edit} onPress={() => navigation.goBack()}>
          Edit
        </Text>
      </Text>

      <OTPInput
        length={4}
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
        title="Verify OTP"
        onPress={onVerify}
        style={[styles.verify, invalid && styles.verifyInvalid]}
        textStyle={invalid ? styles.verifyInvalidText : undefined}
      />

      <TouchableOpacity
        activeOpacity={seconds > 0 ? 1 : 0.8}
        onPress={onResend}
        style={[styles.resend, seconds === 0 && styles.resendReady]}>
        <Text style={styles.resendText}>
          {seconds > 0 ? `Resend OTP in ${seconds}` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </AuthHeroLayout>
  );
};

const baseStyles = {
  title: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: Typography.fontWeights.bold,
    color: '#1A1A1A',
  },
  sent: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: '#9AA0A8',
  },
  edit: {
    color: '#2F6BFF',
    fontWeight: Typography.fontWeights.bold,
  },
  otp: {
    marginTop: 22,
  },
  error: {
    marginTop: 10,
    textAlign: 'center',
    color: '#F04343',
    fontSize: 13,
    fontWeight: Typography.fontWeights.medium,
  },
  verify: {
    marginTop: 22,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F5C400',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyInvalid: {
    backgroundColor: '#2C2C2C',
  },
  verifyInvalidText: {
    color: '#FFFFFF',
  },
  resend: {
    marginTop: 12,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendReady: {
    backgroundColor: '#F1F1F1',
  },
  resendText: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: '#A3A3A3',
  },
};

export default OTPScreen;
