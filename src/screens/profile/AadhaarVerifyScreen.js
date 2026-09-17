import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {ROUTES} from '../../constants/Routes';
import {Colors, Spacing, Typography} from '../../theme';

/**
 * Verify with Aadhaar (screenshots 10 / 12).
 */
const AadhaarVerifyScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [aadhaar, setAadhaar] = useState('');

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Verify with Aadhaar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Enter your 12 digit Aadhaar Number</Text>
        <Text style={styles.sub}>
          Please verify your identity this is done to reduce frauds and make the
          platform safer
        </Text>

        <View style={styles.inputBox}>
          <TextInput
            value={aadhaar}
            onChangeText={setAadhaar}
            keyboardType="number-pad"
            maxLength={12}
            placeholder="Enter Aadhaar Number"
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.input}
          />
        </View>

        <PrimaryButton
          title="Verify with OTP"
          onPress={() => navigation.navigate(ROUTES.MANAGE_VEHICLES)}
          disabled={aadhaar.replace(/\D/g, '').length < 12}
          style={styles.cta}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textNavy,
  },
  headerSpacer: {
    width: 40,
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
  cta: {
    marginTop: Spacing.xl,
  },
});

export default AadhaarVerifyScreen;
