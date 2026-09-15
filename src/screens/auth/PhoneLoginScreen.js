import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import BrandHeader from '../../components/brand/BrandHeader';
import PhoneInputRow from '../../components/brand/PhoneInputRow';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {ROUTES} from '../../constants/Routes';
import {setPhone} from '../../redux/slices/authSlice';
import {Colors, Spacing, Typography} from '../../theme';

/**
 * Phone number entry — Enter your phone number + Next Step.
 */
const PhoneLoginScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const mode = route?.params?.mode || 'login';
  const [phone, setPhoneLocal] = useState('');

  const onNext = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      return;
    }
    dispatch(setPhone(phone));
    navigation.navigate(ROUTES.OTP, {phone, mode});
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {paddingTop: insets.top + 28}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BrandHeader />

      <View style={styles.middle}>
        <Text style={styles.heading}>Enter your phone number:</Text>
        <PhoneInputRow value={phone} onChangeText={setPhoneLocal} />
        <PrimaryButton
          title="Next Step"
          onPress={onNext}
          disabled={phone.replace(/\D/g, '').length < 10}
          style={styles.cta}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  middle: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xxxl,
  },
  heading: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  cta: {
    marginTop: Spacing.xl,
  },
});

export default PhoneLoginScreen;
