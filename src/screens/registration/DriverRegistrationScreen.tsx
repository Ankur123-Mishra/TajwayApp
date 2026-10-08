import React, {useMemo, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AppButton,
  AppTextInput,
  DocumentUploadCard,
  ScreenHeader,
  StepIndicator,
} from '../../components/common';
import {
  USER_ROLES,
  VEHICLE_TYPES,
  VERIFICATION_STATUS,
} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {registrationService} from '../../services/registrationService';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';
import {
  isValidEmail,
  isValidIFSC,
  required,
} from '../../utils/validation';

const STEPS = [
  'Personal',
  'Driving',
  'Vehicle',
  'Documents',
  'Bank',
  'Review',
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];

const mockUploadUri = key =>
  `https://picsum.photos/seed/${key}-${Date.now()}/400/240`;

const SectionTitle = ({children}) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

const ReviewRow = ({label, value}) => (
  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>{value || '—'}</Text>
  </View>
);

const Chip = ({label, selected, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[styles.chip, selected && styles.chipOn]}>
    <Text style={[styles.chipText, selected && styles.chipTextOn]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const PhotoPlaceholder = ({uri, onPress}) => (
  <TouchableOpacity style={styles.photoBtn} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.photoIcon}>{uri ? '✓' : '📷'}</Text>
    <Text style={styles.photoLabel}>
      {uri ? 'Photo added — tap to replace' : 'Add Profile Photo'}
    </Text>
  </TouchableOpacity>
);

/**
 * Multi-step Driver registration.
 */
const DriverRegistrationScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const mobilePrefill = route?.params?.mobile || '';

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [personal, setPersonal] = useState({
    fullName: '',
    email: '',
    mobile: mobilePrefill,
    profilePhoto: null,
  });

  const [driving, setDriving] = useState({
    licenceNumber: '',
    licenceExpiry: '',
    experience: '',
    currentCity: '',
  });

  const [vehicle, setVehicle] = useState({
    type: '',
    number: '',
    model: '',
    year: '',
    seats: '',
    fuelType: '',
  });

  const [documents, setDocuments] = useState({
    dl: null,
    rc: null,
    insurance: null,
    puc: null,
    permit: null,
    idProof: null,
  });

  const [bank, setBank] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
  });

  const setDoc = (key, uri) =>
    setDocuments(prev => ({...prev, [key]: uri}));

  const clearError = key =>
    setErrors(prev => {
      if (!prev[key]) {
        return prev;
      }
      const next = {...prev};
      delete next[key];
      return next;
    });

  const validateStep = () => {
    const nextErrors = {};

    if (step === 0) {
      if (!required(personal.fullName)) {
        nextErrors.fullName = 'Full name is required';
      }
      if (!required(personal.email) || !isValidEmail(personal.email)) {
        nextErrors.email = 'Enter a valid email';
      }
    }

    if (step === 1) {
      if (!required(driving.licenceNumber)) {
        nextErrors.licenceNumber = 'Licence number is required';
      }
      if (!required(driving.licenceExpiry)) {
        nextErrors.licenceExpiry = 'Licence expiry is required';
      }
      if (!required(driving.experience)) {
        nextErrors.experience = 'Experience is required';
      }
      if (!required(driving.currentCity)) {
        nextErrors.currentCity = 'Current city is required';
      }
    }

    if (step === 2) {
      if (!required(vehicle.type)) {
        nextErrors.type = 'Select vehicle type';
      }
      if (!required(vehicle.number)) {
        nextErrors.number = 'Vehicle number is required';
      }
      if (!required(vehicle.model)) {
        nextErrors.model = 'Model is required';
      }
      if (!required(vehicle.year)) {
        nextErrors.year = 'Year is required';
      }
      if (!required(vehicle.seats)) {
        nextErrors.seats = 'Seats is required';
      }
      if (!required(vehicle.fuelType)) {
        nextErrors.fuelType = 'Select fuel type';
      }
    }

    if (step === 3) {
      ['dl', 'rc', 'insurance', 'puc', 'permit', 'idProof'].forEach(key => {
        if (!documents[key]) {
          nextErrors[key] = 'Required';
        }
      });
    }

    if (step === 4) {
      if (!required(bank.accountHolder)) {
        nextErrors.accountHolder = 'Account holder is required';
      }
      if (!required(bank.bankName)) {
        nextErrors.bankName = 'Bank name is required';
      }
      if (!required(bank.accountNumber)) {
        nextErrors.accountNumber = 'Account number is required';
      }
      if (!isValidIFSC(bank.ifsc)) {
        nextErrors.ifsc = 'Enter a valid IFSC code';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setErrors({});
    setStep(s => s - 1);
  };

  const onNext = () => {
    if (!validateStep()) {
      return;
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const payload = useMemo(
    () => ({
      ...personal,
      driving,
      vehicle,
      documents,
      bank: {
        ...bank,
        ifsc: String(bank.ifsc || '').toUpperCase(),
      },
    }),
    [personal, driving, vehicle, documents, bank],
  );

  const onSubmit = async () => {
    try {
      setLoading(true);
      const result = await registrationService.submitDriverRegistration(payload);
      navigation.replace(ROUTES.REGISTRATION_SUCCESS, {
        role: USER_ROLES.DRIVER,
        mobile: personal.mobile || mobilePrefill,
        registrationData: result.data,
      });
    } catch (e) {
      Alert.alert('Error', e.message || 'Unable to submit registration');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonal = () => (
    <View>
      <SectionTitle>Personal Details</SectionTitle>
      <AppTextInput
        label="Full Name *"
        value={personal.fullName}
        onChangeText={t => {
          setPersonal(p => ({...p, fullName: t}));
          clearError('fullName');
        }}
        placeholder="Enter full name"
        error={errors.fullName}
      />
      <AppTextInput
        label="Email *"
        value={personal.email}
        onChangeText={t => {
          setPersonal(p => ({...p, email: t}));
          clearError('email');
        }}
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <AppTextInput
        label="Mobile"
        value={personal.mobile}
        onChangeText={t =>
          setPersonal(p => ({
            ...p,
            mobile: t.replace(/\D/g, '').slice(0, 10),
          }))
        }
        placeholder="10-digit mobile"
        keyboardType="number-pad"
        maxLength={10}
        editable={!mobilePrefill}
      />
      <PhotoPlaceholder
        uri={personal.profilePhoto}
        onPress={() =>
          setPersonal(p => ({
            ...p,
            profilePhoto: mockUploadUri('driver-photo'),
          }))
        }
      />
    </View>
  );

  const renderDriving = () => (
    <View>
      <SectionTitle>Driving Details</SectionTitle>
      <AppTextInput
        label="Licence Number *"
        value={driving.licenceNumber}
        onChangeText={t => {
          setDriving(d => ({...d, licenceNumber: t.toUpperCase()}));
          clearError('licenceNumber');
        }}
        placeholder="DL number"
        autoCapitalize="characters"
        error={errors.licenceNumber}
      />
      <AppTextInput
        label="Licence Expiry *"
        value={driving.licenceExpiry}
        onChangeText={t => {
          setDriving(d => ({...d, licenceExpiry: t}));
          clearError('licenceExpiry');
        }}
        placeholder="DD/MM/YYYY"
        error={errors.licenceExpiry}
      />
      <AppTextInput
        label="Experience (years) *"
        value={driving.experience}
        onChangeText={t => {
          setDriving(d => ({...d, experience: t.replace(/\D/g, '').slice(0, 2)}));
          clearError('experience');
        }}
        placeholder="e.g. 5"
        keyboardType="number-pad"
        error={errors.experience}
      />
      <AppTextInput
        label="Current City *"
        value={driving.currentCity}
        onChangeText={t => {
          setDriving(d => ({...d, currentCity: t}));
          clearError('currentCity');
        }}
        placeholder="City"
        error={errors.currentCity}
      />
    </View>
  );

  const renderVehicle = () => (
    <View>
      <SectionTitle>Vehicle Details</SectionTitle>
      <Text style={styles.fieldLabel}>Vehicle Type *</Text>
      <View style={styles.chipRow}>
        {VEHICLE_TYPES.map(type => (
          <Chip
            key={type}
            label={type}
            selected={vehicle.type === type}
            onPress={() => {
              setVehicle(v => ({...v, type}));
              clearError('type');
            }}
          />
        ))}
      </View>
      {errors.type ? <Text style={styles.fieldError}>{errors.type}</Text> : null}

      <AppTextInput
        label="Vehicle Number *"
        value={vehicle.number}
        onChangeText={t => {
          setVehicle(v => ({...v, number: t.toUpperCase()}));
          clearError('number');
        }}
        placeholder="e.g. DL01AB1234"
        autoCapitalize="characters"
        error={errors.number}
      />
      <AppTextInput
        label="Model *"
        value={vehicle.model}
        onChangeText={t => {
          setVehicle(v => ({...v, model: t}));
          clearError('model');
        }}
        placeholder="Model name"
        error={errors.model}
      />
      <AppTextInput
        label="Year *"
        value={vehicle.year}
        onChangeText={t => {
          setVehicle(v => ({...v, year: t.replace(/\D/g, '').slice(0, 4)}));
          clearError('year');
        }}
        placeholder="YYYY"
        keyboardType="number-pad"
        maxLength={4}
        error={errors.year}
      />
      <AppTextInput
        label="Seats *"
        value={vehicle.seats}
        onChangeText={t => {
          setVehicle(v => ({...v, seats: t.replace(/\D/g, '').slice(0, 2)}));
          clearError('seats');
        }}
        placeholder="e.g. 4"
        keyboardType="number-pad"
        error={errors.seats}
      />

      <Text style={styles.fieldLabel}>Fuel Type *</Text>
      <View style={styles.chipRow}>
        {FUEL_TYPES.map(fuel => (
          <Chip
            key={fuel}
            label={fuel}
            selected={vehicle.fuelType === fuel}
            onPress={() => {
              setVehicle(v => ({...v, fuelType: fuel}));
              clearError('fuelType');
            }}
          />
        ))}
      </View>
      {errors.fuelType ? (
        <Text style={styles.fieldError}>{errors.fuelType}</Text>
      ) : null}
    </View>
  );

  const docCards = [
    {key: 'dl', title: 'Driving Licence *'},
    {key: 'rc', title: 'RC *'},
    {key: 'insurance', title: 'Insurance *'},
    {key: 'puc', title: 'PUC *'},
    {key: 'permit', title: 'Permit *'},
    {key: 'idProof', title: 'ID Proof *'},
  ];

  const renderDocuments = () => (
    <View>
      <SectionTitle>Upload Documents</SectionTitle>
      {docCards.map(doc => (
        <View key={doc.key}>
          <DocumentUploadCard
            title={doc.title}
            status={
              documents[doc.key] ? VERIFICATION_STATUS.PENDING : 'Pending'
            }
            previewUri={documents[doc.key]}
            onUpload={() => {
              setDoc(doc.key, mockUploadUri(doc.key));
              clearError(doc.key);
            }}
            onReplace={() => setDoc(doc.key, mockUploadUri(doc.key))}
            onRemove={() => setDoc(doc.key, null)}
          />
          {errors[doc.key] ? (
            <Text style={styles.fieldError}>{errors[doc.key]}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );

  const renderBank = () => (
    <View>
      <SectionTitle>Bank Details</SectionTitle>
      <AppTextInput
        label="Account Holder *"
        value={bank.accountHolder}
        onChangeText={t => {
          setBank(b => ({...b, accountHolder: t}));
          clearError('accountHolder');
        }}
        placeholder="Name as per bank"
        error={errors.accountHolder}
      />
      <AppTextInput
        label="Bank Name *"
        value={bank.bankName}
        onChangeText={t => {
          setBank(b => ({...b, bankName: t}));
          clearError('bankName');
        }}
        placeholder="Bank name"
        error={errors.bankName}
      />
      <AppTextInput
        label="Account Number *"
        value={bank.accountNumber}
        onChangeText={t => {
          setBank(b => ({...b, accountNumber: t.replace(/\D/g, '')}));
          clearError('accountNumber');
        }}
        placeholder="Account number"
        keyboardType="number-pad"
        error={errors.accountNumber}
      />
      <AppTextInput
        label="IFSC *"
        value={bank.ifsc}
        onChangeText={t => {
          setBank(b => ({...b, ifsc: t.toUpperCase().slice(0, 11)}));
          clearError('ifsc');
        }}
        placeholder="e.g. SBIN0001234"
        autoCapitalize="characters"
        maxLength={11}
        error={errors.ifsc}
      />
    </View>
  );

  const renderReview = () => (
    <View>
      <SectionTitle>Review & Submit</SectionTitle>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewHeading}>Personal</Text>
        <ReviewRow label="Name" value={personal.fullName} />
        <ReviewRow label="Email" value={personal.email} />
        <ReviewRow label="Mobile" value={personal.mobile || mobilePrefill} />
      </View>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewHeading}>Driving</Text>
        <ReviewRow label="Licence" value={driving.licenceNumber} />
        <ReviewRow label="Expiry" value={driving.licenceExpiry} />
        <ReviewRow label="Experience" value={`${driving.experience} yrs`} />
        <ReviewRow label="City" value={driving.currentCity} />
      </View>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewHeading}>Vehicle</Text>
        <ReviewRow label="Type" value={vehicle.type} />
        <ReviewRow label="Number" value={vehicle.number} />
        <ReviewRow label="Model" value={vehicle.model} />
        <ReviewRow label="Year / Seats" value={`${vehicle.year} · ${vehicle.seats}`} />
        <ReviewRow label="Fuel" value={vehicle.fuelType} />
      </View>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewHeading}>Bank</Text>
        <ReviewRow label="Holder" value={bank.accountHolder} />
        <ReviewRow label="Bank" value={bank.bankName} />
        <ReviewRow label="Account" value={bank.accountNumber} />
        <ReviewRow label="IFSC" value={bank.ifsc} />
      </View>
    </View>
  );

  const stepContent = [
    renderPersonal,
    renderDriving,
    renderVehicle,
    renderDocuments,
    renderBank,
    renderReview,
  ][step];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Driver Registration" onBack={onBack} />
      <StepIndicator steps={STEPS} current={step} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {paddingBottom: insets.bottom + 100},
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {stepContent()}
      </ScrollView>
      <View style={[styles.footer, {paddingBottom: insets.bottom + Spacing.md}]}>
        {step < STEPS.length - 1 ? (
          <AppButton title="Next" onPress={onNext} />
        ) : (
          <AppButton
            title="Submit Registration"
            onPress={onSubmit}
            loading={loading}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textNavy,
    marginBottom: Spacing.base,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textNavy,
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Dimensions.borderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipOn: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextOn: {
    color: Colors.primaryDark,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.md,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    marginBottom: Spacing.base,
  },
  photoIcon: {fontSize: 22, marginRight: Spacing.md},
  photoLabel: {
    flex: 1,
    color: Colors.textNavy,
    fontWeight: '600',
    fontSize: 14,
  },
  fieldError: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Dimensions.shadow.soft,
  },
  reviewHeading: {
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
    fontSize: 14,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  reviewLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  reviewValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1.4,
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
});

export default DriverRegistrationScreen;
