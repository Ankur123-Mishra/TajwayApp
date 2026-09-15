import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Spacing, Typography} from '../../theme';

export {default as AppButton} from './AppButton';
export {default as AppCard, CardTitle, CardSubtitle} from './AppCard';
export {default as AppTextInput} from './AppTextInput';
export {default as BrandLogo} from '../brand/BrandLogo';
export {default as DocumentUploadCard} from './DocumentUploadCard';
export {default as EmptyState} from './EmptyState';
export {default as Loader} from './Loader';
export {default as LoadingView} from './LoadingView';
export {default as OTPInput} from './OTPInput';
export {default as ScreenHeader} from './ScreenHeader';
export {default as StatusBadge, VerificationStatus} from './StatusBadge';
export {default as StepIndicator} from './StepIndicator';

/** Small helper text toast bar matching OTP screenshot */
export const ToastBar = ({message, logo = true}) => (
  <View style={toastStyles.bar}>
    {logo ? (
      <View style={toastStyles.logo}>
        <View style={toastStyles.logoTop} />
        <View style={toastStyles.logoBottom} />
      </View>
    ) : null}
    <Text style={toastStyles.text}>{message}</Text>
  </View>
);

const toastStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 24,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginHorizontal: Spacing.screenPadding,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  logoTop: {
    height: 4,
    width: 16,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginBottom: 3,
  },
  logoBottom: {
    height: 4,
    width: 12,
    borderRadius: 2,
    backgroundColor: Colors.surface,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.textInverse,
    flex: 1,
  },
});
