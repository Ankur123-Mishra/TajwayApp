import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {Colors, Spacing, Typography} from '../../theme';

/**
 * Payment Methods — bank account details for commission payouts.
 */
const PaymentMethodsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [accountNumber, setAccountNumber] = useState('');
  const [reAccountNumber, setReAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [holderName, setHolderName] = useState('');

  const onUpdate = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Field
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Account Number"
            keyboardType="number-pad"
          />
          <Field
            value={reAccountNumber}
            onChangeText={setReAccountNumber}
            placeholder="Re-enter Account Number"
            keyboardType="number-pad"
          />
          <Field
            value={bankName}
            onChangeText={setBankName}
            placeholder="Bank Name"
          />
          <Field
            value={ifscCode}
            onChangeText={setIfscCode}
            placeholder="Bank IFSC Code"
            autoCapitalize="characters"
          />
          <Field
            value={holderName}
            onChangeText={setHolderName}
            placeholder="Account Holder Name"
          />

          <Text style={styles.hint}>
            Please enter required details. You will receive your commission in
            the same once booking has been ended.
          </Text>
        </ScrollView>

        <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
          <PrimaryButton title="Update" onPress={onUpdate} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const Field = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => (
  <View style={styles.inputWrap}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textPlaceholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      style={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textNavy,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 24,
  },
  inputWrap: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    height: 54,
    paddingHorizontal: 18,
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  input: {
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  hint: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textNavy,
  },
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    backgroundColor: Colors.backgroundAlt,
  },
});

export default PaymentMethodsScreen;
