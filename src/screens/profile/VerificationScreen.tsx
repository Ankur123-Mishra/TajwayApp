import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types as documentTypes,
} from '@react-native-documents/picker';
import BannerHeader from '../../components/common/BannerHeader';
import CitySelectModal from '../../components/profile/CitySelectModal';
import {USER_ROLES} from '../../constants/AppConstants';
import {Images} from '../../constants/Images';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const STEPS = [
  {id: 'profile', label: 'Profile'},
  {id: 'aadhaar', label: 'Aadhaar / GST'},
  {id: 'bank', label: 'Bank'},
  {id: 'vehicle', label: 'Vehicle & Driver'},
];

const ROLES = [
  {id: USER_ROLES.DRIVER, label: 'Driver', icon: 'car-outline'},
  {id: USER_ROLES.AGENT, label: 'Agent', icon: 'person-outline'},
  {id: USER_ROLES.OWNER, label: 'Owner', icon: 'briefcase-outline'},
];

const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'Yes Bank',
  'IDFC First Bank',
];

const VEHICLE_OPTIONS = [
  'Hatchback',
  'Sedan',
  'SUV',
  'Ertiga',
  'Innova',
  'Innova Crysta',
  'Tempo Traveller',
  'Bus',
];

const DOCUMENT_TYPES = [
  'Insurance',
  'Permit',
  'PUC Certificate',
  'Fitness Certificate',
  'Road Tax',
];

const INK = '#1A1A1B';
const MUTED = '#8B93A3';
const FIELD_ICON = '#9AA3B2';
const PLACEHOLDER = '#B0B7C3';
const AADHAAR_ICON = '#E25B4A';
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const EMPTY_FORM = {
  photo: null,
  role: USER_ROLES.DRIVER,
  fullName: '',
  company: '',
  city: '',
  email: '',
  aadhaar: '',
  otpSent: false,
  gstNumber: '',
  gstCertificate: null,
  accountName: '',
  accountNumber: '',
  ifsc: '',
  bankName: '',
  vehicleType: '',
  registration: '',
  license: '',
  rcDocument: null,
  driverPhoto: null,
  extraDocumentType: '',
};

const pickImage = onPicked => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.85,
    },
    response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert(
          'Unable to open gallery',
          response.errorMessage || 'Please try again.',
        );
        return;
      }
      const asset = response.assets?.[0];
      if (!asset?.uri) {
        return;
      }
      if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
        Alert.alert('File too large', 'Please choose a photo up to 5MB.');
        return;
      }
      onPicked({
        name: asset.fileName || 'Photo',
        uri: asset.uri,
      });
    },
  );
};

const pickDocument = async onPicked => {
  try {
    const [file] = await pick({
      type: [documentTypes.pdf, documentTypes.images],
      allowMultiSelection: false,
    });
    if (!file?.uri) {
      return;
    }
    if (file.size && file.size > MAX_FILE_BYTES) {
      Alert.alert('File too large', 'Please choose a PDF, JPG or PNG up to 5MB.');
      return;
    }
    onPicked({
      name: file.name || 'Document',
      uri: file.uri,
    });
  } catch (err) {
    if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
      return;
    }
    Alert.alert('Unable to choose file', err?.message || 'Please try again.');
  }
};

const ContinueButton = ({title = 'Continue', onPress}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <TouchableOpacity
      style={styles.continueBtn}
      activeOpacity={0.88}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <Text style={styles.continueText}>{title}</Text>
      <Text style={styles.continueArrow}>→</Text>
    </TouchableOpacity>
  );
};

const FieldLabel = ({children, optional = false}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <Text style={styles.label}>
      {children}
      {optional ? <Text style={styles.optional}> (Optional)</Text> : null}
    </Text>
  );
};

const TextField = ({
  icon,
  iconColor = FIELD_ICON,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'sentences',
  maxLength,
  onPress,
  rightIcon,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const box = (
    <View style={styles.input}>
      <Ionicons name={icon} size={18} color={iconColor} />
      {onPress ? (
        <Text
          style={[styles.inputValue, !value && styles.placeholder]}
          numberOfLines={1}>
          {value || placeholder}
        </Text>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER}
          style={styles.inputValue}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
        />
      )}
      {rightIcon ? (
        <Ionicons name={rightIcon} size={18} color={FIELD_ICON} />
      ) : null}
    </View>
  );

  if (!onPress) {
    return box;
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      {box}
    </TouchableOpacity>
  );
};

const UploadZone = ({actionLabel, file, onPress}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <TouchableOpacity
      style={[styles.upload, file && styles.uploadOn]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={actionLabel}>
      <Ionicons name="cloud-upload-outline" size={26} color={FIELD_ICON} />
      <Text style={styles.uploadTitle}>
        <Text style={styles.uploadStrong}>
          {file?.name || actionLabel}
        </Text>
        {file ? '' : ' or drag and drop'}
      </Text>
      <Text style={styles.uploadHint}>PDF, JPG, PNG (Max 5MB)</Text>
    </TouchableOpacity>
  );
};

const OptionSheet = ({visible, title, options, onClose, onSelect}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const {height} = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.sheetOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 12)}]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{title}</Text>
          <ScrollView
            style={{maxHeight: height * 0.5}}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.sheetOption}
                activeOpacity={0.75}
                onPress={() => onSelect(option)}>
                <Text style={styles.sheetOptionText}>{option}</Text>
                <Ionicons name="chevron-forward" size={16} color={FIELD_ICON} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const Stepper = ({step}) => {
  const styles = useResponsiveStyles(baseStyles);

  return (
    <View style={styles.stepper}>
      {STEPS.map((item, index) => {
        const active = index === step;
        const done = index < step;
        return (
          <View key={item.id} style={styles.stepItem}>
            <View style={styles.stepTrack}>
              {index > 0 ? (
                <View
                  style={[styles.stepLine, index <= step && styles.stepLineOn]}
                />
              ) : (
                <View style={styles.stepLineSpacer} />
              )}
              <View
                style={[
                  styles.stepCircle,
                  active && styles.stepCircleOn,
                  done && styles.stepCircleDone,
                ]}>
                {done ? (
                  <Ionicons name="checkmark" size={16} color={INK} />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      active && styles.stepNumberOn,
                    ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              {index < STEPS.length - 1 ? (
                <View
                  style={[styles.stepLine, index < step && styles.stepLineOn]}
                />
              ) : (
                <View style={styles.stepLineSpacer} />
              )}
            </View>
            <Text
              style={[styles.stepLabel, (active || done) && styles.stepLabelOn]}
              numberOfLines={2}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

/**
 * Four-step partner verification opened from Verify Now.
 * Header uses the same yellow banner as My Bookings.
 */
const VerificationScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [cityOpen, setCityOpen] = useState(false);
  const [picker, setPicker] = useState(null);

  const setField = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({y: 0, animated: false});
  }, [step]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (cityOpen) {
          setCityOpen(false);
          return true;
        }
        if (picker) {
          setPicker(null);
          return true;
        }
        if (step > 0) {
          setStep(current => current - 1);
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [cityOpen, picker, step]);

  const handleBack = () => {
    if (step > 0) {
      setStep(current => current - 1);
      return;
    }
    navigation.goBack();
  };

  const openOptions = (title, options, key) => {
    setPicker({title, options, key});
  };

  const onSendOtp = () => {
    if (form.aadhaar.length !== 12) {
      Alert.alert(
        'Aadhaar number',
        'Enter a 12 digit Aadhaar number to send OTP.',
      );
      return;
    }
    setField('otpSent', true);
  };

  const onContinue = () => {
    if (step === 0) {
      if (!form.fullName.trim()) {
        Alert.alert('Full name', 'Enter your full name to continue.');
        return;
      }
      if (!form.city) {
        Alert.alert('City', 'Select your city to continue.');
        return;
      }
      if (
        form.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
      ) {
        Alert.alert('Email', 'Enter a valid email address.');
        return;
      }
      setStep(1);
      return;
    }

    if (step === 1) {
      if (form.aadhaar.length !== 12) {
        Alert.alert(
          'Aadhaar number',
          'Enter a 12 digit Aadhaar number to continue.',
        );
        return;
      }
      if (!form.otpSent) {
        Alert.alert(
          'Send OTP',
          'Send OTP to your Aadhaar linked mobile number before continuing.',
        );
        return;
      }
      const gst = form.gstNumber.trim();
      if (gst && !/^[0-9A-Z]{15}$/.test(gst)) {
        Alert.alert('GST number', 'Enter a valid 15 character GST number.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!form.accountName.trim()) {
        Alert.alert('Account holder', 'Enter the account holder name.');
        return;
      }
      if (!/^\d{9,18}$/.test(form.accountNumber)) {
        Alert.alert('Account number', 'Enter a valid account number.');
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim())) {
        Alert.alert('IFSC code', 'Enter a valid 11 character IFSC code.');
        return;
      }
      if (!form.bankName) {
        Alert.alert('Bank', 'Select your bank to continue.');
        return;
      }
      setStep(3);
      return;
    }

    if (!form.vehicleType) {
      Alert.alert('Vehicle type', 'Select a vehicle type to continue.');
      return;
    }
    if (form.registration.trim().length < 4) {
      Alert.alert(
        'Registration number',
        'Enter the vehicle registration number.',
      );
      return;
    }
    if (form.license.trim().length < 6) {
      Alert.alert('Driver license', 'Enter the driver license number.');
      return;
    }

    Alert.alert(
      'Verification submitted',
      'Your profile, Aadhaar, bank and vehicle details have been submitted for verification.',
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <View style={styles.container}>
      <BannerHeader>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerSide}
            activeOpacity={0.8}
            onPress={handleBack}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Image
              source={Images.backIcon}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verification</Text>
          <View style={styles.headerSide} />
        </View>
      </BannerHeader>

      <Stepper step={step} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[
            styles.scroll,
            {paddingBottom: step === 0 ? 12 : insets.bottom + 28},
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {step === 0 ? (
            <View style={styles.profileBody}>
              <Text style={styles.sectionTitle}>Profile Information</Text>
              <Text style={styles.sectionSub}>
                Please provide your basic details to get verified and start
                receiving bookings.
              </Text>

              <Text style={styles.label}>Profile Photo</Text>
              <TouchableOpacity
                style={styles.photoWrap}
                activeOpacity={0.85}
                onPress={() => pickImage(file => setField('photo', file))}
                accessibilityRole="button"
                accessibilityLabel="Add profile photo">
                <View style={styles.photoCircle}>
                  {form.photo?.uri ? (
                    <Image
                      source={{uri: form.photo.uri}}
                      style={styles.photoImage}
                    />
                  ) : (
                    <Ionicons
                      name="camera-outline"
                      size={26}
                      color={FIELD_ICON}
                    />
                  )}
                </View>
                <View style={styles.photoPlus}>
                  <Ionicons name="add" size={14} color={INK} />
                </View>
              </TouchableOpacity>

              <Text style={[styles.label, styles.roleLabel]}>I am a</Text>
              <View style={styles.roleRow}>
                {ROLES.map(role => {
                  const selected = form.role === role.id;
                  return (
                    <TouchableOpacity
                      key={role.id}
                      style={[styles.roleChip, selected && styles.roleChipOn]}
                      activeOpacity={0.85}
                      onPress={() => setField('role', role.id)}
                      accessibilityRole="button"
                      accessibilityState={{selected}}>
                      {selected ? (
                        <View style={styles.roleCheck}>
                          <Ionicons name="checkmark" size={11} color={INK} />
                        </View>
                      ) : null}
                      <Ionicons
                        name={role.icon}
                        size={16}
                        color={selected ? INK : '#6B7280'}
                      />
                      <Text
                        style={[
                          styles.roleText,
                          selected && styles.roleTextOn,
                        ]}>
                        {role.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <FieldLabel>Full Name</FieldLabel>
              <TextField
                icon="person-outline"
                value={form.fullName}
                onChangeText={value => setField('fullName', value)}
                placeholder="Enter full name"
                autoCapitalize="words"
              />

              <FieldLabel>Company Name</FieldLabel>
              <TextField
                icon="business-outline"
                value={form.company}
                onChangeText={value => setField('company', value)}
                placeholder="Enter company name"
                autoCapitalize="words"
              />

              <FieldLabel>City</FieldLabel>
              <TextField
                icon="location-outline"
                value={form.city}
                placeholder="Select city"
                onPress={() => setCityOpen(true)}
              />

              <FieldLabel>Email</FieldLabel>
              <TextField
                icon="mail-outline"
                value={form.email}
                onChangeText={value => setField('email', value)}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          ) : null}

          {step === 1 ? (
            <View>
              <View style={styles.card}>
                <View style={styles.cardHead}>
                  <View style={styles.cardIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="#5B7CFF"
                    />
                  </View>
                  <View style={styles.cardCopy}>
                    <Text style={styles.cardTitle}>
                      Aadhaar / GST Verification
                    </Text>
                    <Text style={styles.cardSub}>
                      We will send OTP to your Aadhaar linked mobile number.
                    </Text>
                  </View>
                </View>

                <FieldLabel>Aadhaar Number</FieldLabel>
                <TextField
                  icon="finger-print"
                  iconColor={AADHAAR_ICON}
                  value={form.aadhaar}
                  onChangeText={value => {
                    const digits = value.replace(/\D/g, '').slice(0, 12);
                    setForm(prev => ({
                      ...prev,
                      aadhaar: digits,
                      otpSent: digits === prev.aadhaar ? prev.otpSent : false,
                    }));
                  }}
                  placeholder="Enter 12 digit Aadhaar number"
                  keyboardType="number-pad"
                  maxLength={12}
                />
                {form.otpSent ? (
                  <Text style={styles.otpNote}>
                    OTP sent to your Aadhaar linked mobile number.
                  </Text>
                ) : null}
                <ContinueButton
                  title={form.otpSent ? 'OTP Sent' : 'Send OTP'}
                  onPress={onSendOtp}
                />
              </View>

              <View style={styles.card}>
                <View style={styles.cardHead}>
                  <View style={styles.cardIcon}>
                    <Ionicons
                      name="document-outline"
                      size={18}
                      color="#5B7CFF"
                    />
                  </View>
                  <View style={styles.cardCopy}>
                    <Text style={styles.cardTitle}>GST Details</Text>
                    <Text style={styles.cardSub}>
                      Provide your GST number and upload GST certificate.
                    </Text>
                  </View>
                </View>

                <FieldLabel>GST Number</FieldLabel>
                <TextField
                  icon="document-text-outline"
                  value={form.gstNumber}
                  onChangeText={value =>
                    setField(
                      'gstNumber',
                      value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15),
                    )
                  }
                  placeholder="Enter GST number"
                  autoCapitalize="characters"
                  maxLength={15}
                />

                <FieldLabel optional>Upload GST Certificate</FieldLabel>
                <UploadZone
                  actionLabel="Choose file"
                  file={form.gstCertificate}
                  onPress={() =>
                    pickDocument(file => setField('gstCertificate', file))
                  }
                />
                <ContinueButton onPress={onContinue} />
              </View>
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.card}>
              <View style={styles.cardHead}>
                <View style={styles.cardIcon}>
                  <Ionicons name="business-outline" size={18} color="#5B7CFF" />
                </View>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>Bank Details</Text>
                  <Text style={styles.cardSub}>
                    Please provide your bank account details to receive
                    payments and complete verification.
                  </Text>
                </View>
              </View>

              <FieldLabel>Account Holder Name</FieldLabel>
              <TextField
                icon="person-outline"
                value={form.accountName}
                onChangeText={value => setField('accountName', value)}
                placeholder="Enter account holder name"
                autoCapitalize="words"
              />

              <FieldLabel>Account Number</FieldLabel>
              <TextField
                icon="card-outline"
                value={form.accountNumber}
                onChangeText={value =>
                  setField('accountNumber', value.replace(/\D/g, '').slice(0, 18))
                }
                placeholder="Enter account number"
                keyboardType="number-pad"
                maxLength={18}
              />

              <FieldLabel>IFSC Code</FieldLabel>
              <TextField
                icon="business-outline"
                value={form.ifsc}
                onChangeText={value =>
                  setField(
                    'ifsc',
                    value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11),
                  )
                }
                placeholder="Enter IFSC code"
                autoCapitalize="characters"
                maxLength={11}
              />

              <FieldLabel>Bank Name</FieldLabel>
              <TextField
                icon="business-outline"
                value={form.bankName}
                placeholder="Select bank"
                rightIcon="chevron-down"
                onPress={() => openOptions('Select bank', BANKS, 'bankName')}
              />
              <ContinueButton onPress={onContinue} />
            </View>
          ) : null}

          {step === 3 ? (
            <View style={styles.card}>
              <View style={styles.cardHead}>
                <View style={styles.cardIcon}>
                  <Ionicons name="car-outline" size={18} color="#5B7CFF" />
                </View>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>Vehicle & Driver Details</Text>
                  <Text style={styles.cardSub}>
                    Please provide your vehicle and driver details to complete
                    your verification process.
                  </Text>
                </View>
              </View>

              <FieldLabel>Vehicle Type</FieldLabel>
              <TextField
                icon="car-outline"
                value={form.vehicleType}
                placeholder="Select vehicle type"
                rightIcon="chevron-down"
                onPress={() =>
                  openOptions('Select vehicle type', VEHICLE_OPTIONS, 'vehicleType')
                }
              />

              <FieldLabel>Vehicle Registration Number</FieldLabel>
              <TextField
                icon="document-text-outline"
                value={form.registration}
                onChangeText={value =>
                  setField('registration', value.toUpperCase())
                }
                placeholder="Enter registration number"
                autoCapitalize="characters"
              />

              <FieldLabel>Driver License Number</FieldLabel>
              <TextField
                icon="card-outline"
                value={form.license}
                onChangeText={value => setField('license', value.toUpperCase())}
                placeholder="Enter driver license number"
                autoCapitalize="characters"
              />

              <FieldLabel optional>Vehicle RC</FieldLabel>
              <UploadZone
                actionLabel="Upload RC Document"
                file={form.rcDocument}
                onPress={() => pickDocument(file => setField('rcDocument', file))}
              />

              <FieldLabel>Driver Profile Photo</FieldLabel>
              <UploadZone
                actionLabel="Upload Driver Photo"
                file={form.driverPhoto}
                onPress={() => pickImage(file => setField('driverPhoto', file))}
              />

              <FieldLabel optional>Additional Documents</FieldLabel>
              <TextField
                icon="document-outline"
                value={form.extraDocumentType}
                placeholder="Select document type"
                rightIcon="chevron-down"
                onPress={() =>
                  openOptions(
                    'Select document type',
                    DOCUMENT_TYPES,
                    'extraDocumentType',
                  )
                }
              />
              <ContinueButton onPress={onContinue} />
            </View>
          ) : null}
        </ScrollView>

        {step === 0 ? (
          <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
            <ContinueButton onPress={onContinue} />
          </View>
        ) : null}
      </KeyboardAvoidingView>

      <CitySelectModal
        visible={cityOpen}
        selected={form.city}
        onClose={() => setCityOpen(false)}
        onDone={city => setField('city', city)}
      />
      <OptionSheet
        visible={Boolean(picker)}
        title={picker?.title || ''}
        options={picker?.options || []}
        onClose={() => setPicker(null)}
        onSelect={option => {
          if (picker?.key) {
            setField(picker.key, option);
          }
          setPicker(null);
        }}
      />
    </View>
  );
};

const baseStyles = {
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  headerSide: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    width: 18,
    height: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  stepper: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 6,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepTrack: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E3E7EE',
    borderRadius: 1,
  },
  stepLineOn: {
    backgroundColor: Colors.primary,
  },
  stepLineSpacer: {
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: '#D5DDE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleDone: {
    backgroundColor: Colors.surface,
    borderColor: '#D5DDE8',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.bold,
    color: '#9AA3B2',
  },
  stepNumberOn: {
    color: INK,
  },
  stepLabel: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    color: MUTED,
    fontWeight: Typography.fontWeights.medium,
    paddingHorizontal: 2,
  },
  stepLabelOn: {
    color: '#3E4A59',
    fontWeight: Typography.fontWeights.semibold,
  },
  scroll: {
    flexGrow: 1,
  },
  profileBody: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  sectionSub: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  optional: {
    fontWeight: Typography.fontWeights.medium,
    color: MUTED,
  },
  photoWrap: {
    width: 78,
    height: 78,
    marginBottom: 4,
  },
  photoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C5CDD8',
    backgroundColor: '#FAFBFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlus: {
    position: 'absolute',
    right: 0,
    bottom: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  roleLabel: {
    marginTop: 16,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 6,
  },
  roleChip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  roleChipOn: {
    backgroundColor: '#FFF6D4',
    borderColor: Colors.primary,
  },
  roleCheck: {
    position: 'absolute',
    top: -8,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  roleText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.semibold,
    color: '#4B5563',
  },
  roleTextOn: {
    color: INK,
    fontWeight: Typography.fontWeights.bold,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    gap: 10,
  },
  inputValue: {
    flex: 1,
    fontSize: 14,
    color: INK,
    padding: 0,
    margin: 0,
  },
  placeholder: {
    color: PLACEHOLDER,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7E4F4',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF3FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardCopy: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  cardSub: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: MUTED,
  },
  upload: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9D7EA',
    borderRadius: 14,
    backgroundColor: '#FBFCFE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  uploadOn: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFCF3',
  },
  uploadTitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },
  uploadStrong: {
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  uploadHint: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: '#A0A8B5',
  },
  otpNote: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: '#1FA85A',
  },
  continueBtn: {
    marginTop: 16,
    height: 50,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueText: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  continueArrow: {
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
    marginTop: -1,
  },
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    backgroundColor: Colors.surface,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E3E7EE',
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F6',
  },
  sheetOptionText: {
    flex: 1,
    fontSize: 15,
    color: INK,
    marginRight: 8,
  },
};

export default VerificationScreen;
