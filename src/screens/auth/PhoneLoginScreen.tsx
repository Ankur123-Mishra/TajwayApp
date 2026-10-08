import React, {useState} from 'react';
import {Text, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import AuthHeroLayout from '../../components/brand/AuthHeroLayout';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {ROUTES} from '../../constants/Routes';
import {setPhone} from '../../redux/slices/authSlice';
import {useResponsiveStyles} from '../../hooks';

/**
 * Phone login — Welcome sheet over the driver hero.
 */
const PhoneLoginScreen = ({navigation, route}) => {
  const styles = useResponsiveStyles(baseStyles);
  const dispatch = useDispatch();
  const mode = route?.params?.mode || 'login';
  const [phone, setPhoneLocal] = useState('');

  const digits = phone.replace(/\D/g, '');

  const onNext = () => {
    if (digits.length < 10) {
      return;
    }
    dispatch(setPhone(phone));
    navigation.navigate(ROUTES.OTP, {phone: digits, mode});
  };

  return (
    <AuthHeroLayout>
      <Text style={styles.welcome}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Login/Sign up to your account and continue your journey
      </Text>
      <TextInput
        value={phone}
        onChangeText={text =>
          setPhoneLocal(text.replace(/\D/g, '').slice(0, 10))
        }
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="Enter Phone number"
        placeholderTextColor="#B0B4BC"
        style={styles.input}
      />
      <PrimaryButton
        title="Continue"
        onPress={onNext}
        showArrow
        style={styles.cta}
      />
      <Text style={styles.legal}>
        By continue, you're agreeing to our{' '}
        <Text style={styles.legalLink}>Term & Conditions</Text>
        {' & '}
        <Text style={styles.legalLink}>Privacy Policy</Text>
      </Text>
    </AuthHeroLayout>
  );
};

const baseStyles = {
  welcome: {
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 22,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: '#A3A8B0',
    paddingHorizontal: 12,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  cta: {
    marginTop: 16,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5C400',
    shadowOpacity: 0,
    elevation: 0,
  },
  legal: {
    marginTop: 18,
    textAlign: 'center',
    color: '#B0B4BA',
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 6,
  },
  legalLink: {
    color: '#1A1A1A',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
};

export default PhoneLoginScreen;
