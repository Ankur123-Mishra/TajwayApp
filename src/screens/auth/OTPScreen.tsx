import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import AuthHeroLayout from '../../components/brand/AuthHeroLayout';
import PrimaryButton from '../../components/brand/PrimaryButton';
import NoticeModal from '../../components/common/NoticeModal';
import OTPInput from '../../components/common/OTPInput';
import {USER_ROLES} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {loginSuccess} from '../../redux/slices/authSlice';
import {AuthService} from '../../services';
import {Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const RESEND_SECONDS = 51;
const OTP_LENGTH = 6;

const maskPhone = phone => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 5) {
    return '98912*****';
  }
  return `${digits.slice(0, 5)}${'*'.repeat(digits.length - 5)}`;
};

const resolveHomeRoute = role => {
  if (role === USER_ROLES.DRIVER) {
    return ROUTES.DRIVER_ROOT;
  }
  if (role === USER_ROLES.OWNER) {
    return ROUTES.OWNER_ROOT;
  }
  return ROUTES.AGENT_ROOT;
};

/**
 * OTP verification — boxed code, resend timer, invalid state.
 * Verify → verify-otp API → store tokens → home / onboarding.
 */

const OTPScreen = ({navigation, route}) => {
  const styles = useResponsiveStyles(baseStyles);
  const dispatch = useDispatch();
  const phone = route?.params?.phone || '';
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('OTP');
  const [noticeMessage, setNoticeMessage] = useState(
    'Please enter a 6 digit OTP.',
  );

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const showNotice = (title, message) => {
    setNoticeTitle(title);
    setNoticeMessage(message);
    setNoticeVisible(true);
  };

  const onVerify = async () => {
    if (otp.length < OTP_LENGTH) {
      setInvalid(true);
      showNotice('OTP', 'Please enter a 6 digit OTP.');
      return;
    }

    try {
      setLoading(true);
      setInvalid(false);
      const result = await AuthService.verifyOtp({mobile: phone, otp});
      console.log('OTP verify result:', JSON.stringify(result, null, 2));

      dispatch(
        loginSuccess({
          user: result.user,
          token: result.token || result.accessToken,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          role: result.role,
          phone: result.mobile || phone,
          mobile: result.mobile || phone,
          isNewUser: result.isNewUser,
          nextStep: result.nextStep,
          isOnboardingComplete: result.isOnboardingComplete,
          onboardingCompleted: result.onboardingCompleted,
        }),
      );

      const homeRoute = resolveHomeRoute(result.role);
      navigation.reset({
        index: 0,
        routes: [{name: homeRoute}],
      });
    } catch (error) {
      setInvalid(true);
      showNotice(
        'OTP',
        error?.message || 'Invalid OTP. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (seconds > 0 || resending) {
      return;
    }

    try {
      setResending(true);
      await AuthService.sendOtp(phone);
      setOtp('');
      setInvalid(false);
      setSeconds(RESEND_SECONDS);
      showNotice('OTP', 'OTP resent successfully.');
    } catch (error) {
      showNotice(
        'OTP',
        error?.message || 'Failed to resend OTP. Please try again.',
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <AuthHeroLayout>
        <Text style={styles.title}>OTP Verification</Text>
        <Text
          style={styles.sent}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}>
          We have sent a verification OTP to {maskPhone(phone)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.changeNumberWrap}
          disabled={loading}>
          <Text style={styles.changeNumber}>Change number</Text>
        </TouchableOpacity>

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
          title="Verify OTP"
          onPress={onVerify}
          loading={loading}
          style={[styles.verify, invalid && styles.verifyInvalid]}
          textStyle={invalid ? styles.verifyInvalidText : undefined}
        />

        <TouchableOpacity
          activeOpacity={seconds > 0 || resending ? 1 : 0.8}
          onPress={onResend}
          disabled={seconds > 0 || resending}
          style={[styles.resend, seconds === 0 && styles.resendReady]}>
          <Text style={styles.resendText}>
            {resending
              ? 'Sending...'
              : seconds > 0
                ? `Resend OTP in ${seconds}`
                : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </AuthHeroLayout>
      <NoticeModal
        visible={noticeVisible}
        title={noticeTitle}
        message={noticeMessage}
        onClose={() => setNoticeVisible(false)}
      />
    </>
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
  changeNumberWrap: {
    marginTop: 4,
    alignItems: 'center',
  },
  changeNumber: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(13, 81, 160, 1)',
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
