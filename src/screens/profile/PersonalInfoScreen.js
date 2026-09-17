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
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import CitySelectModal from '../../components/profile/CitySelectModal';
import {USER_ROLES} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {updateUser} from '../../redux/slices/authSlice';
import {Colors, Spacing, Typography} from '../../theme';

const ROLES = [
  {id: USER_ROLES.AGENT, label: 'Agent'},
  {id: USER_ROLES.OWNER, label: 'Owner'},
  {id: USER_ROLES.DRIVER, label: 'Driver'},
];

const VERIFICATION_ITEMS = [
  {id: 'gst', title: 'GST ID', status: 'Document unverified'},
  {id: 'aadhaar', title: 'Aadhaar', status: 'Document unverified'},
];

/**
 * Personal Information — profile edit (screenshot match).
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
  const [cityModalVisible, setCityModalVisible] = useState(false);

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
    navigation.goBack();
  };

  const onVerify = itemId => {
    if (itemId === 'gst') {
      setGstVisible(true);
      return;
    }
    navigation.navigate(ROUTES.AADHAAR_VERIFY);
  };

  const onGstUpload = () => {
    setGstVisible(false);
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
          <Ionicons
            name="person"
            size={48}
            color={Colors.textSlate}
          />
        </View>

        <Field
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
        />
        <Field
          label="Enter city name"
          value={city}
          placeholder="Select City"
          rightIcon="location-sharp"
          editable={false}
          onPress={() => setCityModalVisible(true)}
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
          autoCapitalize="none"
        />

        <Text style={styles.label}>I am a</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r, index) => {
            const on = role === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.roleBtn,
                  on && styles.roleBtnOn,
                  index === ROLES.length - 1 && styles.roleBtnLast,
                ]}
                onPress={() => setRole(r.id)}
                activeOpacity={0.85}>
                <Text style={[styles.roleText, on && styles.roleTextOn]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.verifyHeading}>VERIFICATION</Text>
        {VERIFICATION_ITEMS.map(item => (
          <View key={item.id} style={styles.verifyCard}>
            <View style={styles.verifyCopy}>
              <Text style={styles.verifyTitle}>{item.title}</Text>
              <Text style={styles.verifyStatus}>{item.status}</Text>
            </View>
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={() => onVerify(item.id)}
              activeOpacity={0.85}>
              <Text style={styles.verifyBtnText}>Verify Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <PrimaryButton
          title="Update"
          onPress={onUpdate}
          style={styles.updateBtn}
        />
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
                  <Ionicons
                    name="camera-outline"
                    size={28}
                    color={Colors.primary}
                  />
                  <Text style={styles.clickHere}>Click here</Text>
                </TouchableOpacity>
              ))}
            </View>
            <PrimaryButton title="Upload" onPress={onGstUpload} />
          </View>
        </View>
      </Modal>

      <CitySelectModal
        visible={cityModalVisible}
        selected={city}
        onClose={() => setCityModalVisible(false)}
        onDone={setCity}
      />
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
  autoCapitalize,
  editable = true,
  onPress,
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity
      style={styles.inputWrap}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textPlaceholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable && !onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
        style={styles.input}
      />
      {rightIcon ? (
        <Ionicons name={rightIcon} size={18} color={Colors.primary} />
      ) : null}
    </TouchableOpacity>
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
    fontWeight: Typography.fontWeights.semibold,
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
    width: 110,
    height: 110,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  field: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.bold,
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
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  roleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  roleBtnLast: {
    marginRight: 0,
  },
  roleBtnOn: {
    backgroundColor: Colors.secondary,
  },
  roleText: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textMuted,
  },
  roleTextOn: {
    color: Colors.textInverse,
  },
  verifyHeading: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPlaceholder,
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  verifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
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
    color: Colors.textSlate,
    marginBottom: 2,
  },
  verifyStatus: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textInverse,
  },
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    backgroundColor: Colors.backgroundAlt,
  },
  updateBtn: {
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
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
    fontWeight: Typography.fontWeights.bold,
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
    gap: 6,
  },
  clickHere: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default PersonalInfoScreen;
