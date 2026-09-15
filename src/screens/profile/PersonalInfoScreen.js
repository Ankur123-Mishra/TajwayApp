import React, {useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {USER_ROLES} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {updateUser} from '../../redux/slices/authSlice';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const ROLES = [
  {id: USER_ROLES.AGENT, label: 'Agent'},
  {id: USER_ROLES.OWNER, label: 'Owner'},
  {id: USER_ROLES.DRIVER, label: 'Driver'},
];

/**
 * Personal Information + GST upload bottom sheet (screenshots 8–9).
 */
const PersonalInfoScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(USER_ROLES.AGENT);
  const [gstVisible, setGstVisible] = useState(false);

  const onUpdate = () => {
    dispatch(
      updateUser({
        name: fullName,
        city,
        company,
        email,
        role,
      }),
    );
    setGstVisible(true);
  };

  const onGstUpload = () => {
    setGstVisible(false);
    navigation.navigate(ROUTES.AADHAAR_VERIFY);
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>

        <Field label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter full name" />
        <Field
          label="Enter city name"
          value={city}
          onChangeText={setCity}
          placeholder="City"
          rightIcon="📍"
        />
        <Field
          label="Company Name"
          value={company}
          onChangeText={setCompany}
          placeholder="Enter your company name"
        />
        <Field
          label="Email (Optional)"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter valid email address"
          keyboardType="email-address"
        />

        <Text style={styles.label}>I am a</Text>
        <View style={styles.roleRow}>
          {ROLES.map(r => {
            const on = role === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleBtn, on && styles.roleBtnOn]}
                onPress={() => setRole(r.id)}>
                <Text style={[styles.roleText, on && styles.roleTextOn]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <PrimaryButton title="Update" onPress={onUpdate} />
      </View>

      <Modal visible={gstVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, {paddingBottom: insets.bottom + 16}]}>
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Upload GST Documents</Text>
              <TouchableOpacity onPress={() => setGstVisible(false)}>
                <Text style={styles.sheetClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.uploadRow}>
              {[1, 2, 3].map(i => (
                <TouchableOpacity key={i} style={styles.uploadBox}>
                  <Text style={styles.camIcon}>📷</Text>
                  <Text style={styles.clickHere}>Click here</Text>
                </TouchableOpacity>
              ))}
            </View>
            <PrimaryButton title="Upload" onPress={onGstUpload} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  rightIcon,
  keyboardType,
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textPlaceholder}
        keyboardType={keyboardType}
        style={styles.input}
      />
      {rightIcon ? <Text style={styles.rightIcon}>{rightIcon}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.base,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSlate,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 24,
  },
  avatarBox: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Dimensions.shadow.soft,
  },
  avatarIcon: {
    fontSize: 42,
    color: Colors.textSlate,
  },
  field: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSlate,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
    ...Dimensions.shadow.soft,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  rightIcon: {
    fontSize: 16,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
  },
  roleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  roleBtnOn: {
    backgroundColor: Colors.textSlate,
    borderColor: Colors.textSlate,
  },
  roleText: {
    fontWeight: '600',
    color: Colors.textMuted,
  },
  roleTextOn: {
    color: Colors.textInverse,
  },
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    backgroundColor: Colors.backgroundAlt,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.screenPadding,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textNavy,
    marginLeft: 24,
  },
  sheetClose: {
    fontSize: 18,
    color: Colors.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  uploadBox: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  clickHere: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default PersonalInfoScreen;
