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
  isValidIndianMobile,
  isValidPincode,
  required,
} from '../../utils/validation';

const STEPS = [
  'Owner',
  'Business',
  'Fleet',
  'Vehicles',
  'Documents',
  'Bank',
  'Review',
];

const emptyVehicleForm = () => ({
  number: '',
  type: '',
  model: '',
  year: '',
  seats: '',
  driverName: '',
  driverMobile: '',
});

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
 * Multi-step Taxi Owner registration with fleet & vehicle list.
 */
const OwnerRegistrationScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const mobilePrefill = route?.params?.mobile || '';

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const [owner, setOwner] = useState({
    fullName: '',
    email: '',
    mobile: mobilePrefill,
    profilePhoto: null,
  });

  const [business, setBusiness] = useState({
    fleetName: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst: '',
  });

  const [fleet, setFleet] = useState({
    totalVehicles: '',
    vehicleTypes: [],
  });

  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm());
  const [vehicles, setVehicles] = useState([]);

  const [documents, setDocuments] = useState({
    ownerId: null,
    businessProof: null,
    rc: null,
    insurance: null,
    permit: null,
    puc: null,
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

  const toggleFleetType = type => {
    setFleet(prev => {
      const exists = prev.vehicleTypes.includes(type);
      return {
        ...prev,
        vehicleTypes: exists
          ? prev.vehicleTypes.filter(t => t !== type)
          : [...prev.vehicleTypes, type],
      };
    });
    clearError('vehicleTypes');
  };

  const validateVehicleForm = () => {
    const nextErrors = {};
    if (!required(vehicleForm.number)) {
      nextErrors.vNumber = 'Vehicle number is required';
    }
    if (!required(vehicleForm.type)) {
      nextErrors.vType = 'Select type';
    }
    if (!required(vehicleForm.model)) {
      nextErrors.vModel = 'Model is required';
    }
    if (!required(vehicleForm.year)) {
      nextErrors.vYear = 'Year is required';
    }
    if (!required(vehicleForm.seats)) {
      nextErrors.vSeats = 'Seats is required';
    }
    if (!required(vehicleForm.driverName)) {
      nextErrors.vDriverName = 'Driver name is required';
    }
    if (!isValidIndianMobile(vehicleForm.driverMobile)) {
      nextErrors.vDriverMobile = 'Valid driver mobile required';
    }
    setErrors(prev => ({...prev, ...nextErrors}));
    return Object.keys(nextErrors).length === 0;
  };

  const addOrUpdateVehicle = () => {
    if (!validateVehicleForm()) {
      return;
    }
    const entry = {...vehicleForm};
    if (editingIndex !== null) {
      setVehicles(list =>
        list.map((v, i) => (i === editingIndex ? entry : v)),
      );
      setEditingIndex(null);
    } else {
      setVehicles(list => [...list, entry]);
    }
    setVehicleForm(emptyVehicleForm());
    clearError('vehicles');
  };

  const editVehicle = index => {
    setVehicleForm({...vehicles[index]});
    setEditingIndex(index);
  };

  const deleteVehicle = index => {
    setVehicles(list => list.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setVehicleForm(emptyVehicleForm());
    }
  };

  const validateStep = () => {
    const nextErrors = {};

    if (step === 0) {
      if (!required(owner.fullName)) {
        nextErrors.fullName = 'Full name is required';
      }
      if (!required(owner.email) || !isValidEmail(owner.email)) {
        nextErrors.email = 'Enter a valid email';
      }
      if (!isValidIndianMobile(owner.mobile)) {
        nextErrors.mobile = 'Enter a valid 10-digit mobile';
      }
    }

    if (step === 1) {
      if (!required(business.fleetName)) {
        nextErrors.fleetName = 'Fleet name is required';
      }
      if (!required(business.businessType)) {
        nextErrors.businessType = 'Business type is required';
      }
      if (!required(business.address)) {
        nextErrors.address = 'Address is required';
      }
      if (!required(business.city)) {
        nextErrors.city = 'City is required';
      }
      if (!required(business.state)) {
        nextErrors.state = 'State is required';
      }
      if (!isValidPincode(business.pincode)) {
        nextErrors.pincode = 'Enter a valid 6-digit pincode';
      }
    }

    if (step === 2) {
      if (!required(fleet.totalVehicles) || Number(fleet.totalVehicles) < 1) {
        nextErrors.totalVehicles = 'Enter total vehicles';
      }
      if (!fleet.vehicleTypes.length) {
        nextErrors.vehicleTypes = 'Select at least one vehicle type';
      }
    }

    if (step === 3) {
      if (!vehicles.length) {
        nextErrors.vehicles = 'Add at least one vehicle';
      }
    }

    if (step === 4) {
      [
        'ownerId',
        'businessProof',
        'rc',
        'insurance',
        'permit',
        'puc',
      ].forEach(key => {
        if (!documents[key]) {
          nextErrors[key] = 'Required';
        }
      });
    }

    if (step === 5) {
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
      ...owner,
      business,
      fleet,
      vehicles,
      documents,
      bank: {
        ...bank,
        ifsc: String(bank.ifsc || '').toUpperCase(),
      },
    }),
    [owner, business, fleet, vehicles, documents, bank],
  );

  const onSubmit = async () => {
    try {
      setLoading(true);
      const result = await registrationService.submitOwnerRegistration(payload);
      navigation.replace(ROUTES.REGISTRATION_SUCCESS, {
        role: USER_ROLES.OWNER,
        mobile: owner.mobile,
        registrationData: result.data,
      });
    } catch (e) {
      Alert.alert('Error', e.message || 'Unable to submit registration');
    } finally {
      setLoading(false);
    }
  };

  const renderOwner = () => (
    <View>
      <SectionTitle>Owner Details</SectionTitle>
      <AppTextInput
        label="Full Name *"
        value={owner.fullName}
        onChangeText={t => {
          setOwner(o => ({...o, fullName: t}));
          clearError('fullName');
        }}
        placeholder="Enter full name"
        error={errors.fullName}
      />
      <AppTextInput
        label="Email *"
        value={owner.email}
        onChangeText={t => {
          setOwner(o => ({...o, email: t}));
          clearError('email');
        }}
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <AppTextInput
        label="Mobile *"
        value={owner.mobile}
        onChangeText={t => {
          setOwner(o => ({
            ...o,
            mobile: t.replace(/\D/g, '').slice(0, 10),
          }));
          clearError('mobile');
        }}
        placeholder="10-digit mobile"
        keyboardType="number-pad"
        maxLength={10}
        error={errors.mobile}
      />
      <PhotoPlaceholder
        uri={owner.profilePhoto}
        onPress={() =>
          setOwner(o => ({
            ...o,
            profilePhoto: mockUploadUri('owner-photo'),
          }))
        }
      />
    </View>
  );

  const renderBusiness = () => (
    <View>
      <SectionTitle>Business Details</SectionTitle>
      <AppTextInput
        label="Fleet Name *"
        value={business.fleetName}
        onChangeText={t => {
          setBusiness(b => ({...b, fleetName: t}));
          clearError('fleetName');
        }}
        placeholder="Fleet / company name"
        error={errors.fleetName}
      />
      <AppTextInput
        label="Business Type *"
        value={business.businessType}
        onChangeText={t => {
          setBusiness(b => ({...b, businessType: t}));
          clearError('businessType');
        }}
        placeholder="e.g. Fleet Operator"
        error={errors.businessType}
      />
      <AppTextInput
        label="Address *"
        value={business.address}
        onChangeText={t => {
          setBusiness(b => ({...b, address: t}));
          clearError('address');
        }}
        placeholder="Office address"
        error={errors.address}
      />
      <AppTextInput
        label="City *"
        value={business.city}
        onChangeText={t => {
          setBusiness(b => ({...b, city: t}));
          clearError('city');
        }}
        placeholder="City"
        error={errors.city}
      />
      <AppTextInput
        label="State *"
        value={business.state}
        onChangeText={t => {
          setBusiness(b => ({...b, state: t}));
          clearError('state');
        }}
        placeholder="State"
        error={errors.state}
      />
      <AppTextInput
        label="Pincode *"
        value={business.pincode}
        onChangeText={t => {
          setBusiness(b => ({
            ...b,
            pincode: t.replace(/\D/g, '').slice(0, 6),
          }));
          clearError('pincode');
        }}
        placeholder="6-digit pincode"
        keyboardType="number-pad"
        maxLength={6}
        error={errors.pincode}
      />
      <AppTextInput
        label="GST (optional)"
        value={business.gst}
        onChangeText={t => setBusiness(b => ({...b, gst: t}))}
        placeholder="GSTIN"
        autoCapitalize="characters"
      />
    </View>
  );

  const renderFleet = () => (
    <View>
      <SectionTitle>Fleet Overview</SectionTitle>
      <AppTextInput
        label="Total Vehicles *"
        value={fleet.totalVehicles}
        onChangeText={t => {
          setFleet(f => ({
            ...f,
            totalVehicles: t.replace(/\D/g, '').slice(0, 4),
          }));
          clearError('totalVehicles');
        }}
        placeholder="e.g. 10"
        keyboardType="number-pad"
        error={errors.totalVehicles}
      />
      <Text style={styles.fieldLabel}>Vehicle Types *</Text>
      <View style={styles.chipRow}>
        {VEHICLE_TYPES.map(type => (
          <Chip
            key={type}
            label={type}
            selected={fleet.vehicleTypes.includes(type)}
            onPress={() => toggleFleetType(type)}
          />
        ))}
      </View>
      {errors.vehicleTypes ? (
        <Text style={styles.fieldError}>{errors.vehicleTypes}</Text>
      ) : null}
    </View>
  );

  const renderVehicles = () => (
    <View>
      <SectionTitle>Add Vehicles</SectionTitle>
      <AppTextInput
        label="Vehicle Number *"
        value={vehicleForm.number}
        onChangeText={t => {
          setVehicleForm(v => ({...v, number: t.toUpperCase()}));
          clearError('vNumber');
        }}
        placeholder="e.g. DL01AB1234"
        autoCapitalize="characters"
        error={errors.vNumber}
      />
      <Text style={styles.fieldLabel}>Type *</Text>
      <View style={styles.chipRow}>
        {VEHICLE_TYPES.map(type => (
          <Chip
            key={type}
            label={type}
            selected={vehicleForm.type === type}
            onPress={() => {
              setVehicleForm(v => ({...v, type}));
              clearError('vType');
            }}
          />
        ))}
      </View>
      {errors.vType ? <Text style={styles.fieldError}>{errors.vType}</Text> : null}

      <AppTextInput
        label="Model *"
        value={vehicleForm.model}
        onChangeText={t => {
          setVehicleForm(v => ({...v, model: t}));
          clearError('vModel');
        }}
        placeholder="Model"
        error={errors.vModel}
      />
      <AppTextInput
        label="Year *"
        value={vehicleForm.year}
        onChangeText={t => {
          setVehicleForm(v => ({
            ...v,
            year: t.replace(/\D/g, '').slice(0, 4),
          }));
          clearError('vYear');
        }}
        placeholder="YYYY"
        keyboardType="number-pad"
        maxLength={4}
        error={errors.vYear}
      />
      <AppTextInput
        label="Seats *"
        value={vehicleForm.seats}
        onChangeText={t => {
          setVehicleForm(v => ({
            ...v,
            seats: t.replace(/\D/g, '').slice(0, 2),
          }));
          clearError('vSeats');
        }}
        placeholder="e.g. 4"
        keyboardType="number-pad"
        error={errors.vSeats}
      />
      <AppTextInput
        label="Driver Name *"
        value={vehicleForm.driverName}
        onChangeText={t => {
          setVehicleForm(v => ({...v, driverName: t}));
          clearError('vDriverName');
        }}
        placeholder="Assigned driver"
        error={errors.vDriverName}
      />
      <AppTextInput
        label="Driver Mobile *"
        value={vehicleForm.driverMobile}
        onChangeText={t => {
          setVehicleForm(v => ({
            ...v,
            driverMobile: t.replace(/\D/g, '').slice(0, 10),
          }));
          clearError('vDriverMobile');
        }}
        placeholder="10-digit mobile"
        keyboardType="number-pad"
        maxLength={10}
        error={errors.vDriverMobile}
      />

      <AppButton
        title={editingIndex !== null ? 'Update Vehicle' : 'Add Another'}
        onPress={addOrUpdateVehicle}
        variant="secondary"
        style={styles.addBtn}
      />

      {errors.vehicles ? (
        <Text style={styles.fieldError}>{errors.vehicles}</Text>
      ) : null}

      {vehicles.map((v, index) => (
        <View key={`${v.number}-${index}`} style={styles.vehicleCard}>
          <View style={styles.vehicleCardTop}>
            <Text style={styles.vehicleTitle}>
              {v.number} · {v.type}
            </Text>
            <View style={styles.vehicleActions}>
              <TouchableOpacity onPress={() => editVehicle(index)}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteVehicle(index)}>
                <Text style={styles.deleteLink}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.vehicleMeta}>
            {v.model} · {v.year} · {v.seats} seats
          </Text>
          <Text style={styles.vehicleMeta}>
            Driver: {v.driverName} ({v.driverMobile})
          </Text>
        </View>
      ))}
    </View>
  );

  const docCards = [
    {key: 'ownerId', title: 'Owner ID Proof *'},
    {key: 'businessProof', title: 'Business Proof *'},
    {key: 'rc', title: 'RC *'},
    {key: 'insurance', title: 'Insurance *'},
    {key: 'permit', title: 'Permit *'},
    {key: 'puc', title: 'PUC *'},
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
        <Text style={styles.reviewHeading}>Owner</Text>
        <ReviewRow label="Name" value={owner.fullName} />
        <ReviewRow label="Email" value={owner.email} />
        <ReviewRow label="Mobile" value={owner.mobile} />
      </View>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewHeading}>Business</Text>
        <ReviewRow label="Fleet" value={business.fleetName} />
        <ReviewRow label="Type" value={business.businessType} />
        <ReviewRow
          label="Location"
          value={`${business.city}, ${business.state} ${business.pincode}`}
        />
        <ReviewRow label="GST" value={business.gst || '—'} />
      </View>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewHeading}>Fleet</Text>
        <ReviewRow label="Total" value={fleet.totalVehicles} />
        <ReviewRow label="Types" value={fleet.vehicleTypes.join(', ')} />
        <ReviewRow label="Listed" value={`${vehicles.length} vehicle(s)`} />
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
    renderOwner,
    renderBusiness,
    renderFleet,
    renderVehicles,
    renderDocuments,
    renderBank,
    renderReview,
  ][step];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Owner Registration" onBack={onBack} />
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
  addBtn: {
    marginBottom: Spacing.base,
  },
  vehicleCard: {
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Dimensions.shadow.soft,
  },
  vehicleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleTitle: {
    fontWeight: '700',
    color: Colors.textNavy,
    flex: 1,
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  editLink: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  deleteLink: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 13,
  },
  vehicleMeta: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
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

export default OwnerRegistrationScreen;
