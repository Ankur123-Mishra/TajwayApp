import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import PrimaryButton from '../../components/brand/PrimaryButton';
import BannerHeader from '../../components/common/BannerHeader';
import CitySelectModal from '../../components/profile/CitySelectModal';
import {USER_ROLES} from '../../constants/AppConstants';
import {Images} from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const EMPTY_GST_DOCS = [null, null, null];

const VERIFY_ITEMS = [
  {id: 'gst', title: 'GST ID', status: 'Document unverified'},
  {id: 'aadhaar', title: 'Aadhaar', status: 'Document unverified'},
];

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

const INK = '#1A1A1B';
const MUTED = '#8B93A3';
const FIELD_ICON = '#9AA3B2';
const PLACEHOLDER = '#B0B7C3';
const MAX_FILE_BYTES = 5 * 1024 * 1024;
/** Keep focused inputs a bit above the keyboard. */
const FIELD_KEYBOARD_GAP = 24;

const EMPTY_FORM = {
  photo: null,
  role: USER_ROLES.DRIVER,
  fullName: '',
  company: '',
  city: '',
  email: '',
  aadhaar: '',
  aadhaarVerified: false,
  gstSubmitted: false,
  gstNumber: '',
  gstCertificate: null,
  accountName: '',
  accountNumber: '',
  ifsc: '',
  bankName: '',
  vehicleType: '',
  registration: '',
  vehicleAdded: false,
  license: '',
  rcDocument: null,
  driverPhoto: null,
  driverFullName: '',
  driverContact: '',
  driverAddress1: '',
  driverAddress2: '',
  driverCity: '',
  licenseFront: null,
  licenseBack: null,
  driverAdded: false,
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
    </TouchableOpacity>
  );
};

const PlainField = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'sentences',
  maxLength,
  onFocus,
  right,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.plainInput}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER}
        style={styles.plainInputValue}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        maxLength={maxLength}
        onFocus={onFocus}
      />
      {right}
    </View>
  );
};

const VerifyActionRow = ({title, subtitle, done, onAdd}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.vdRow}>
      <View style={styles.vdCopy}>
        <Text style={styles.vdTitle}>{title}</Text>
        <Text style={styles.vdSub}>{subtitle}</Text>
      </View>
      {done ? (
        <View
          style={styles.verifyTick}
          accessibilityRole="image"
          accessibilityLabel={`${title} added`}>
          <Ionicons name="checkmark" size={16} color={Colors.surface} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.vdAddBtn}
          onPress={onAdd}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Add ${title}`}>
          <Text style={styles.vdAddBtnText}>Add</Text>
        </TouchableOpacity>
      )}
    </View>
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
  onFocus,
  rightIcon,
  containerRef,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const box = (
    <View ref={containerRef} collapsable={false} style={styles.input}>
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
          onFocus={onFocus}
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

const VerificationScreen = ({navigation, route}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const {height: windowHeight} = useWindowDimensions();
  const scrollRef = useRef(null);
  const scrollY = useRef(0);
  const keyboardTopRef = useRef(0);
  const fullHeightRef = useRef(windowHeight);
  const emailFieldRef = useRef(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [cityOpen, setCityOpen] = useState(false);
  const [picker, setPicker] = useState(null);
  const [gstVisible, setGstVisible] = useState(false);
  const [gstDocs, setGstDocs] = useState(EMPTY_GST_DOCS);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [vehicleDraft, setVehicleDraft] = useState('');
  const [vehicleFound, setVehicleFound] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  if (keyboardHeight === 0) {
    fullHeightRef.current = windowHeight;
  }
  // Android adjustResize already shrinks the window; only add leftover inset.
  const alreadyResized = Math.max(0, fullHeightRef.current - windowHeight);
  const keyboardInset = Math.max(0, keyboardHeight - alreadyResized);

  const setField = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const scrollFocusedFieldIntoView = (attempt = 0) => {
    const focused = TextInput.State.currentlyFocusedInput?.();
    const target = focused?.measureInWindow
      ? focused
      : emailFieldRef.current?.measureInWindow
        ? emailFieldRef.current
        : null;

    if (!target?.measureInWindow) {
      if (attempt < 8) {
        setTimeout(() => scrollFocusedFieldIntoView(attempt + 1), 50);
      }
      return;
    }

    target.measureInWindow((_x, y, _w, h) => {
      if (!h) {
        return;
      }

      const visibleBottom =
        keyboardTopRef.current > 0
          ? keyboardTopRef.current
          : Dimensions.get('window').height;
      const overlap = y + h + FIELD_KEYBOARD_GAP - visibleBottom;
      if (overlap <= 4) {
        return;
      }

      const nextY = Math.max(0, scrollY.current + overlap);
      scrollY.current = nextY;
      scrollRef.current?.scrollTo({y: nextY, animated: true});
    });
  };

  const onFieldFocus = (scrollToEnd = false) => {
    // Wait for keyboard animation / window resize, then lift the field.
    setTimeout(() => {
      if (scrollToEnd) {
        scrollRef.current?.scrollToEnd({animated: true});
      }
      scrollFocusedFieldIntoView();
    }, Platform.OS === 'ios' ? 80 : 120);
    setTimeout(() => scrollFocusedFieldIntoView(), Platform.OS === 'ios' ? 280 : 350);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({y: 0, animated: false});
    scrollY.current = 0;
  }, [step]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, event => {
      const coords = event?.endCoordinates || {};
      const winH = Dimensions.get('window').height;
      keyboardTopRef.current =
        typeof coords.screenY === 'number' && coords.screenY > 0
          ? coords.screenY
          : winH - (coords.height || 0);
      setKeyboardHeight(coords.height || 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardTopRef.current = 0;
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardHeight <= 0) {
      return undefined;
    }

    let cancelled = false;
    const run = delay =>
      setTimeout(() => {
        if (!cancelled) {
          scrollFocusedFieldIntoView();
        }
      }, delay);

    const t1 = run(80);
    const t2 = run(250);
    const t3 = run(420);

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [keyboardHeight, keyboardInset]);

  useEffect(() => {
    if (!route?.params?.aadhaarVerified) {
      return;
    }
    setStep(1);
    setForm(prev => ({
      ...prev,
      aadhaarVerified: true,
      aadhaar: route.params.aadhaarNumber || prev.aadhaar,
    }));
    navigation.setParams({
      aadhaarVerified: undefined,
      aadhaarNumber: undefined,
    });
  }, [
    navigation,
    route?.params?.aadhaarNumber,
    route?.params?.aadhaarVerified,
  ]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (vehicleModalOpen) {
          setVehicleModalOpen(false);
          return true;
        }
        if (driverModalOpen) {
          setDriverModalOpen(false);
          return true;
        }
        if (gstVisible) {
          setGstVisible(false);
          return true;
        }
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
  }, [cityOpen, driverModalOpen, gstVisible, picker, step, vehicleModalOpen]);

  const handleBack = () => {
    if (vehicleModalOpen) {
      setVehicleModalOpen(false);
      return;
    }
    if (driverModalOpen) {
      setDriverModalOpen(false);
      return;
    }
    if (gstVisible) {
      setGstVisible(false);
      return;
    }
    if (step > 0) {
      setStep(current => current - 1);
      return;
    }
    navigation.goBack();
  };

  const openVehicleModal = () => {
    setVehicleDraft(form.registration || '');
    setVehicleFound(Boolean(form.vehicleAdded && form.registration));
    setVehicleModalOpen(true);
  };

  const openDriverModal = () => {
    setDriverModalOpen(true);
  };

  const onSearchVehicle = () => {
    const reg = vehicleDraft.replace(/\s+/g, '').toUpperCase();
    if (reg.length < 6) {
      Alert.alert(
        'Vehicle number',
        'Enter a valid vehicle registration number without spaces.',
      );
      setVehicleFound(false);
      return;
    }
    setVehicleDraft(reg);
    setVehicleFound(true);
    Alert.alert('Vehicle found', `Details loaded for ${reg}.`);
  };

  const onAddVehicle = () => {
    const reg = vehicleDraft.replace(/\s+/g, '').toUpperCase();
    if (!vehicleFound || reg.length < 6) {
      Alert.alert(
        'Search vehicle',
        "Please enter your vehicle number and click 'Search' first.",
      );
      return;
    }
    setForm(prev => ({
      ...prev,
      registration: reg,
      vehicleAdded: true,
      vehicleType: prev.vehicleType || 'Sedan',
    }));
    setVehicleModalOpen(false);
  };

  const onAddDriver = () => {
    if (!form.driverFullName.trim()) {
      Alert.alert('Driver name', 'Enter the driver full name.');
      return;
    }
    if (!/^\d{10}$/.test(form.driverContact.replace(/\D/g, ''))) {
      Alert.alert('Contact number', 'Enter a valid 10 digit contact number.');
      return;
    }
    if (form.license.trim().length < 6) {
      Alert.alert('License number', 'Enter a valid driver license number.');
      return;
    }
    if (!form.driverAddress1.trim()) {
      Alert.alert('Address', 'Enter address line 1.');
      return;
    }
    if (!form.driverCity.trim()) {
      Alert.alert('City', 'Enter the city.');
      return;
    }
    setForm(prev => ({...prev, driverAdded: true}));
    setDriverModalOpen(false);
  };

  const pickLicenseImage = side => {
    const apply = file => {
      setField(side === 'front' ? 'licenseFront' : 'licenseBack', file);
    };
    if (Platform.OS === 'ios') {
      setDriverModalOpen(false);
      setTimeout(() => {
        pickImage(file => {
          apply(file);
          setDriverModalOpen(true);
        });
      }, 350);
      return;
    }
    pickImage(apply);
  };

  const openOptions = (title, options, key) => {
    setPicker({title, options, key});
  };

  const onVerifyItem = itemId => {
    if (itemId === 'gst') {
      setGstVisible(true);
      return;
    }
    navigation.navigate(ROUTES.AADHAAR_VERIFY, {
      returnRoute: ROUTES.VERIFICATION,
    });
  };

  const pickGstDocument = index => {
    const openPicker = () => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          selectionLimit: 1,
          quality: 0.8,
        },
        response => {
          if (Platform.OS === 'ios') {
            setGstVisible(true);
          }
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
          const uri = response.assets?.[0]?.uri;
          if (!uri) {
            return;
          }
          setGstDocs(prev => {
            const next = [...prev];
            next[index] = uri;
            return next;
          });
        },
      );
    };

    if (Platform.OS === 'ios') {
      setGstVisible(false);
      setTimeout(openPicker, 350);
      return;
    }

    openPicker();
  };

  const clearGstDocument = index => {
    setGstDocs(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const onGstUpload = () => {
    const selected = gstDocs.filter(Boolean);
    if (!selected.length) {
      Alert.alert(
        'Select documents',
        'Please upload at least one GST document from gallery.',
      );
      return;
    }
    setForm(prev => ({
      ...prev,
      gstSubmitted: true,
      gstCertificate: {name: 'GST Document', uri: selected[0]},
    }));
    setGstVisible(false);
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
      if (!form.aadhaarVerified) {
        Alert.alert(
          'Aadhaar verification',
          'Verify your Aadhaar with OTP before continuing.',
        );
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

    if (!form.vehicleAdded || form.registration.trim().length < 6) {
      Alert.alert('Vehicle', 'Add and verify your vehicle to continue.');
      return;
    }
    if (!form.driverAdded) {
      Alert.alert('Driver', 'Add and verify your driver to continue.');
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

      <View style={styles.flex}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[
            styles.scroll,
            {
              paddingBottom:
                insets.bottom +
                28 +
                (keyboardHeight > 0
                  ? Math.max(
                      keyboardInset,
                      Platform.OS === 'android' ? 180 : 48,
                    ) + FIELD_KEYBOARD_GAP
                  : 16),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          scrollEventThrottle={16}
          onScroll={event => {
            scrollY.current = event.nativeEvent.contentOffset.y;
          }}
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
                onFocus={() => onFieldFocus(false)}
              />

              <FieldLabel>Company Name</FieldLabel>
              <TextField
                icon="business-outline"
                value={form.company}
                onChangeText={value => setField('company', value)}
                placeholder="Enter company name"
                autoCapitalize="words"
                onFocus={() => onFieldFocus(false)}
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
                containerRef={emailFieldRef}
                icon="mail-outline"
                value={form.email}
                onChangeText={value => setField('email', value)}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => onFieldFocus(true)}
              />

              <ContinueButton onPress={onContinue} />
            </View>
          ) : null}

          {step === 1 ? (
            <View style={styles.verifyBody}>
              <Text style={styles.sectionTitle}>Aadhaar / GST Verification</Text>
              <Text style={styles.sectionSub}>
                Complete GST and Aadhaar verification to continue.
              </Text>

              <Text style={styles.verifyHeading}>Verification</Text>
              {VERIFY_ITEMS.map(item => {
                const isGst = item.id === 'gst';
                const isDone = isGst
                  ? form.gstSubmitted
                  : form.aadhaarVerified;
                const status = isDone
                  ? isGst
                    ? 'Verification pending'
                    : 'Verified'
                  : item.status;
                return (
                  <View key={item.id} style={styles.verifyCard}>
                    <View style={styles.verifyCopy}>
                      <Text style={styles.verifyTitle}>{item.title}</Text>
                      <Text
                        style={[
                          styles.verifyStatus,
                          isDone && styles.verifyStatusDone,
                        ]}>
                        {status}
                      </Text>
                    </View>
                    {isDone ? (
                      <View
                        style={styles.verifyTick}
                        accessibilityRole="image"
                        accessibilityLabel={`${item.title} verified`}>
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={Colors.surface}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.verifyBtn}
                        onPress={() => onVerifyItem(item.id)}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel={`Verify ${item.title}`}>
                        <Text style={styles.verifyBtnText}>Verify Now</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}

              <ContinueButton onPress={onContinue} />
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
                onFocus={() => onFieldFocus(false)}
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
                onFocus={() => onFieldFocus(false)}
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
                onFocus={() => onFieldFocus(false)}
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
                  <Text style={styles.cardTitle}>
                    Vehicle & Driver Verifications
                  </Text>
                  <Text style={styles.cardSub}>
                    Upload your vehicle and driver details
                  </Text>
                </View>
              </View>

              <View style={styles.vdList}>
                <VerifyActionRow
                  title="Vehicle"
                  subtitle="Add and verify your vehicle"
                  done={form.vehicleAdded}
                  onAdd={openVehicleModal}
                />
                <VerifyActionRow
                  title="Driver"
                  subtitle="Add and verify your driver"
                  done={form.driverAdded}
                  onAdd={openDriverModal}
                />
              </View>

              <ContinueButton onPress={onContinue} />
            </View>
          ) : null}
        </ScrollView>
      </View>

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

      <Modal
        visible={gstVisible}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setGstVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.verifySheet, {paddingBottom: insets.bottom + 16}]}>
            <View style={styles.verifySheetHead}>
              <Text style={styles.verifySheetTitle}>Upload GST Documents</Text>
              <TouchableOpacity onPress={() => setGstVisible(false)}>
                <Text style={styles.verifySheetClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gstUploadRow}>
              {gstDocs.map((uri, index) => (
                <View key={index} style={styles.gstUploadBox}>
                  {uri ? (
                    <Image
                      source={{uri}}
                      style={styles.gstUploadPreview}
                      resizeMode="cover"
                    />
                  ) : null}
                  <TouchableOpacity
                    style={styles.gstUploadInner}
                    onPress={() => pickGstDocument(index)}
                    activeOpacity={0.85}
                    accessibilityLabel={`Upload GST document ${index + 1}`}>
                    {uri ? null : (
                      <>
                        <Ionicons
                          name="camera-outline"
                          size={28}
                          color={Colors.primary}
                        />
                        <Text style={styles.gstClickHere}>Click here</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {uri ? (
                    <TouchableOpacity
                      style={styles.gstUploadClear}
                      onPress={() => clearGstDocument(index)}
                      hitSlop={{top: 8, right: 8, bottom: 8, left: 8}}
                      accessibilityLabel={`Remove GST document ${index + 1}`}>
                      <Ionicons
                        name="close-circle"
                        size={22}
                        color={Colors.textNavy}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
            <PrimaryButton title="Upload" onPress={onGstUpload} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={vehicleModalOpen}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setVehicleModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.vdSheet,
              {
                minHeight: Math.round(windowHeight * 0.52),
                paddingBottom: Math.max(insets.bottom, 16) + 8,
              },
            ]}>
            <View style={styles.verifySheetHead}>
              <Text style={styles.verifySheetTitle}>Add Vehicle</Text>
              <TouchableOpacity
                onPress={() => setVehicleModalOpen(false)}
                hitSlop={{top: 8, right: 8, bottom: 8, left: 8}}
                accessibilityRole="button"
                accessibilityLabel="Close">
                <Text style={styles.verifySheetClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.vdSheetLabel}>Vehicle Registration Number</Text>
            <PlainField
              value={vehicleDraft}
              onChangeText={value => {
                setVehicleFound(false);
                setVehicleDraft(
                  value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12),
                );
              }}
              placeholder="UKXXPAXXXX"
              autoCapitalize="characters"
              maxLength={12}
              right={
                <TouchableOpacity
                  style={styles.vdSearchBtn}
                  onPress={onSearchVehicle}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Search vehicle">
                  <Text style={styles.vdSearchBtnText}>Search</Text>
                </TouchableOpacity>
              }
            />
            <Text style={styles.vdHelper}>
              Please enter your vehicle number without space and click 'Search'
            </Text>

            <View style={styles.vdSheetSpacer} />
            <PrimaryButton title="Add" onPress={onAddVehicle} darkText />
          </View>
        </View>
      </Modal>

      <Modal
        visible={driverModalOpen}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setDriverModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.vdSheet,
              {
                maxHeight: Math.round(windowHeight * 0.92),
                paddingBottom: Math.max(insets.bottom, 16) + 8,
              },
            ]}>
            <View style={styles.verifySheetHead}>
              <Text style={styles.verifySheetTitle}>Add Driver</Text>
              <TouchableOpacity
                onPress={() => setDriverModalOpen(false)}
                hitSlop={{top: 8, right: 8, bottom: 8, left: 8}}
                accessibilityRole="button"
                accessibilityLabel="Close">
                <Text style={styles.verifySheetClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.vdDriverScroll}
              bounces={false}>
              <TouchableOpacity
                style={styles.driverPhotoWrap}
                activeOpacity={0.85}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    setDriverModalOpen(false);
                    setTimeout(() => {
                      pickImage(file => {
                        setField('driverPhoto', file);
                        setDriverModalOpen(true);
                      });
                    }, 350);
                    return;
                  }
                  pickImage(file => setField('driverPhoto', file));
                }}
                accessibilityRole="button"
                accessibilityLabel="Upload driver photo">
                <View style={styles.driverPhotoOuter}>
                  <View style={styles.driverPhotoInner}>
                    {form.driverPhoto?.uri ? (
                      <Image
                        source={{uri: form.driverPhoto.uri}}
                        style={styles.driverPhotoImage}
                      />
                    ) : (
                      <Ionicons name="person" size={36} color={Colors.primary} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={styles.vdSheetLabel}>Driver Full Name</Text>
              <PlainField
                value={form.driverFullName}
                onChangeText={value => setField('driverFullName', value)}
                placeholder="Driver Full Name"
                autoCapitalize="words"
              />

              <Text style={styles.vdSheetLabel}>Contact Number</Text>
              <PlainField
                value={form.driverContact}
                onChangeText={value =>
                  setField(
                    'driverContact',
                    value.replace(/\D/g, '').slice(0, 10),
                  )
                }
                placeholder="Contact Number"
                keyboardType="number-pad"
                maxLength={10}
              />

              <Text style={styles.vdSheetLabel}>License Number</Text>
              <PlainField
                value={form.license}
                onChangeText={value =>
                  setField(
                    'license',
                    value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                  )
                }
                placeholder="License Number"
                autoCapitalize="characters"
              />

              <Text style={styles.vdSheetLabel}>Address Line 1</Text>
              <PlainField
                value={form.driverAddress1}
                onChangeText={value => setField('driverAddress1', value)}
                placeholder="Address Line 1"
              />

              <Text style={styles.vdSheetLabel}>Address Line 2</Text>
              <PlainField
                value={form.driverAddress2}
                onChangeText={value => setField('driverAddress2', value)}
                placeholder="Address Line 2"
              />

              <Text style={styles.vdSheetLabel}>City</Text>
              <PlainField
                value={form.driverCity}
                onChangeText={value => setField('driverCity', value)}
                placeholder="City"
                autoCapitalize="words"
              />

              <Text style={styles.vdSheetLabel}>Upload Driver License Images</Text>
              <View style={styles.licenseUploadRow}>
                {['front', 'back'].map(side => {
                  const file =
                    side === 'front' ? form.licenseFront : form.licenseBack;
                  return (
                    <View key={side} style={styles.licenseUploadCol}>
                      <TouchableOpacity
                        style={[
                          styles.licenseUploadBox,
                          file && styles.licenseUploadBoxOn,
                        ]}
                        activeOpacity={0.85}
                        onPress={() => pickLicenseImage(side)}
                        accessibilityRole="button"
                        accessibilityLabel={`Upload license ${side}`}>
                        {file?.uri ? (
                          <Image
                            source={{uri: file.uri}}
                            style={styles.licenseUploadPreview}
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons name="add" size={28} color="#9AA3B2" />
                        )}
                      </TouchableOpacity>
                      <Text style={styles.licenseUploadCaption}>
                        {side === 'front' ? 'Front' : 'Back'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            <PrimaryButton title="Add" onPress={onAddDriver} darkText />
          </View>
        </View>
      </Modal>
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
    fontSize: 20,
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
  vdList: {
    marginTop: 18,
    gap: 12,
  },
  vdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E8EE',
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  vdCopy: {
    flex: 1,
    paddingRight: 12,
  },
  vdTitle: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
    marginBottom: 2,
  },
  vdSub: {
    fontSize: 12,
    lineHeight: 16,
    color: MUTED,
  },
  vdAddBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    minWidth: 64,
    alignItems: 'center',
  },
  vdAddBtnText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  vdSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 18,
  },
  vdDriverScroll: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  vdSheetLabel: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  plainInput: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    gap: 8,
  },
  plainInputValue: {
    flex: 1,
    fontSize: 14,
    color: INK,
    paddingVertical: 12,
    padding: 0,
    margin: 0,
  },
  vdSearchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  vdSearchBtnText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
  },
  vdHelper: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: MUTED,
  },
  vdSheetSpacer: {
    flexGrow: 1,
    minHeight: 120,
  },
  driverPhotoWrap: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  driverPhotoOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverPhotoInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  driverPhotoImage: {
    width: '100%',
    height: '100%',
  },
  licenseUploadRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  licenseUploadCol: {
    flex: 1,
    alignItems: 'center',
  },
  licenseUploadBox: {
    width: '100%',
    aspectRatio: 1.35,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9D0DB',
    borderRadius: 12,
    backgroundColor: '#FAFBFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  licenseUploadBoxOn: {
    borderStyle: 'solid',
    borderColor: Colors.primary,
  },
  licenseUploadPreview: {
    width: '100%',
    height: '100%',
  },
  licenseUploadCaption: {
    marginTop: 6,
    fontSize: 12,
    color: MUTED,
  },
  verifyBody: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
  },
  verifyHeading: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  verifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  verifyCopy: {
    flex: 1,
    paddingRight: 12,
  },
  verifyTitle: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  verifyStatus: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  verifyStatusDone: {
    color: '#1FA85A',
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.onPrimary,
  },
  verifyTick: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1FA85A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  verifySheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.screenPadding,
  },
  verifySheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  verifySheetTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
    marginLeft: 24,
  },
  verifySheetClose: {
    fontSize: 18,
    color: Colors.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  gstUploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  gstUploadBox: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceAlt,
  },
  gstUploadInner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
  },
  gstUploadPreview: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gstUploadClear: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
    backgroundColor: Colors.surface,
    borderRadius: 11,
  },
  gstClickHere: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  continueBtn: {
    marginTop: 16,
    height: 50,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: Typography.fontWeights.bold,
    color: INK,
    textAlignVertical: 'center',
    includeFontPadding: false,
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
