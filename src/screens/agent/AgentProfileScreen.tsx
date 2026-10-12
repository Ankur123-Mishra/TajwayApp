import React, {useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import BannerHeader from '../../components/common/BannerHeader';
import LanguageSelectModal from '../../components/profile/LanguageSelectModal';
import Images from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {useAuth, useResponsiveStyles} from '../../hooks';
import {logout} from '../../redux/slices/authSlice';
import {Colors, Spacing, Typography} from '../../theme';

const ACCOUNT_ITEMS = [
  {
    id: 'personal',
    label: 'Personal Information',
    icon: 'person-outline',
    library: 'ion',
    route: ROUTES.PERSONAL_INFO,
  },
  {
    id: 'network',
    label: 'My Network',
    icon: 'star-outline',
    library: 'ion',
    route: ROUTES.MY_NETWORK,
  },
  {
    id: 'offers',
    label: 'Offers & Contest',
    icon: 'sale-outline',
    library: 'mdi',
  },
  {
    id: 'drivers',
    label: 'Manage Drivers',
    icon: 'account-tie-hat-outline',
    library: 'mdi',
    route: ROUTES.MANAGE_DRIVERS,
  },
  {
    id: 'vehicles',
    label: 'Manage Vehicles',
    icon: 'car-outline',
    library: 'mdi',
    route: ROUTES.MANAGE_VEHICLES,
  },
  {
    id: 'payment',
    label: 'Payment Methods',
    icon: 'card-outline',
    library: 'ion',
    route: ROUTES.PAYMENT_METHODS,
  },
  {
    id: 'language',
    label: 'Language',
    icon: 'language-outline',
    library: 'ion',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: 'receipt-outline',
    library: 'ion',
    route: ROUTES.TRANSACTIONS,
  },
];

const GENERAL_ITEMS = [
  {
    id: 'about',
    label: 'About us',
    icon: 'person-outline',
    library: 'ion',
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    icon: 'star-outline',
    library: 'ion',
  },
  {
    id: 'verified',
    label: 'Become a verified supplier',
    icon: 'ribbon-outline',
    library: 'ion',
    route: ROUTES.BECOME_VERIFIED_SUPPLIER,
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'log-out-outline',
    library: 'ion',
  },
];

const formatPhone = raw => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`;
  }
  if (digits.length > 10) {
    return `+${digits}`;
  }
  return raw || '';
};

const MenuIcon = ({library, name}) => {
  const IconSet = library === 'mdi' ? MaterialDesignIcons : Ionicons;
  return <IconSet name={name} size={18} color={Colors.textPrimary} />;
};

const ProfileMenuRow = ({item, onPress}) => {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <TouchableOpacity
      style={styles.menuCard}
      onPress={onPress}
      activeOpacity={0.75}>
      <View style={styles.rowIconWrap}>
        <MenuIcon library={item.library} name={item.icon} />
      </View>
      <Text style={styles.rowLabel}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#C5C9D0" />
    </TouchableOpacity>
  );
};

/**
 * Profile tab — banner header and card list matching the profile design.
 */

const AgentProfileScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {user, phone} = useAuth();
  const [language, setLanguage] = useState('en');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [comingSoonVisible, setComingSoonVisible] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState(
    'This feature is coming soon.',
  );
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const showComingSoon = (message = 'This feature is coming soon.') => {
    setComingSoonMessage(message);
    setComingSoonVisible(true);
  };

  const displayPhone = formatPhone(phone || user?.phone || '9555786532');
  const displayName = user?.name || user?.fullName || 'Tajway Partner';

  const onLogout = () => {
    dispatch(logout());
    const root =
      navigation.getParent()?.getParent() || navigation.getParent() || navigation;
    root.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: ROUTES.PHONE_LOGIN}],
      }),
    );
  };

  const onBack = () => {
    navigation.navigate(ROUTES.AGENT_HOME);
  };

  const onPickProfileImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
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
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setProfileImageUri(uri);
        }
      },
    );
  };

  const onMenuPress = item => {
    if (item.id === 'logout') {
      setLogoutConfirmVisible(true);
      return;
    }
    if (item.id === 'language') {
      setLanguageModalVisible(true);
      return;
    }
    if (item.id === 'offers') {
      showComingSoon('Offers & Contest will be available soon.');
      return;
    }
    if (item.id === 'about') {
      showComingSoon('About us will be available soon.');
      return;
    }
    if (item.id === 'privacy') {
      showComingSoon('Privacy Policy will be available soon.');
      return;
    }
    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <View style={styles.container}>
      <BannerHeader>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={onBack}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Image
              source={Images.backIcon}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            My Profile
          </Text>
          <View style={styles.headerBtn} />
        </View>
      </BannerHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={onPickProfileImage}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo">
            <View style={styles.avatarRing}>
              <Image
                source={
                  profileImageUri ? {uri: profileImageUri} : Images.profile
                }
                style={styles.avatar}
              />
            </View>
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={11} color={Colors.textInverse} />
            </View>
          </TouchableOpacity>

          <View style={styles.profileCopy}>
            <Text style={styles.displayName} numberOfLines={1}>
              {displayName}
            </Text>
            <View style={styles.phoneRow}>
              <Image
                source={Images.phoneIcon}
                style={styles.phoneIcon}
                resizeMode="contain"
              />
              <Text style={styles.phone} numberOfLines={1}>
                {displayPhone}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.upgradeBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(ROUTES.VERIFIED_SUPPLIER)}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={Colors.primaryDark}
            />
            
            <View style={styles.upgradeCopy}>
              <Text style={styles.upgradeTitle}>Upgrade</Text>
              <Text style={styles.upgradeSub}>To Get Verified</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#9AA1AA" />
          </TouchableOpacity>
        </View>

        <View style={[styles.menuSection, {paddingBottom: insets.bottom + 28}]}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          {ACCOUNT_ITEMS.map(item => (
            <ProfileMenuRow
              key={item.id}
              item={item}
              onPress={() => onMenuPress(item)}
            />
          ))}

          <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
            GENERAL
          </Text>
          {GENERAL_ITEMS.map(item => (
            <ProfileMenuRow
              key={item.id}
              item={item}
              onPress={() => onMenuPress(item)}
            />
          ))}
        </View>
      </ScrollView>

      <LanguageSelectModal
        visible={languageModalVisible}
        selected={language}
        onClose={() => setLanguageModalVisible(false)}
        onSave={setLanguage}
      />

      <Modal
        visible={logoutConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutConfirmVisible(false)}>
        <TouchableOpacity
          style={styles.comingSoonOverlay}
          activeOpacity={1}
          onPress={() => setLogoutConfirmVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.comingSoonCard}>
              <Text style={styles.comingSoonTitle}>Logout</Text>
              <Text style={styles.comingSoonMsg}>
                Are you sure you want to logout?
              </Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={styles.confirmNoBtn}
                  activeOpacity={0.85}
                  onPress={() => setLogoutConfirmVisible(false)}>
                  <Text style={styles.confirmNoText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.comingSoonBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    setLogoutConfirmVisible(false);
                    onLogout();
                  }}>
                  <Text style={styles.comingSoonBtnText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={comingSoonVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setComingSoonVisible(false)}>
        <TouchableOpacity
          style={styles.comingSoonOverlay}
          activeOpacity={1}
          onPress={() => setComingSoonVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.comingSoonCard}>
              <Text style={styles.comingSoonTitle}>Coming Soon</Text>
              <Text style={styles.comingSoonMsg}>{comingSoonMessage}</Text>
              <TouchableOpacity
                style={styles.comingSoonBtn}
                activeOpacity={0.85}
                onPress={() => setComingSoonVisible(false)}>
                <Text style={styles.comingSoonBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
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
    color: Colors.textPrimary,
  },
  scroll: {
    flexGrow: 1,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 4,
    marginBottom: 16,
  },
  avatarWrap: {
    width: 64,
    height: 64,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1A1A1B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F7F8FA',
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    marginRight: 8,
  },
  displayName: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneIcon: {
    width: 13,
    height: 13,
  },
  phone: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.medium,
    color: '#8B919A',
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6D4',
    borderRadius: 14,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 8,
    gap: 4,
  },
  upgradeCopy: {
    alignItems: 'flex-start',
  },
  upgradeTitle: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    lineHeight: 15,
  },
  upgradeSub: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.medium,
    color: '#6E747C',
    lineHeight: 12,
  },
  menuSection: {
    flexGrow: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3A3F47',
    letterSpacing: 0.4,
    marginBottom: 12,
    marginLeft: 2,
  },
  sectionTitleSpaced: {
    marginTop: 8,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    minHeight: 58,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF6D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textPrimary,
  },
  comingSoonOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  comingSoonCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  comingSoonMsg: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confirmNoBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#E2E5EA',
    paddingHorizontal: 36,
    paddingVertical: 11,
    borderRadius: 22,
    minWidth: 120,
    alignItems: 'center',
  },
  confirmNoText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  comingSoonBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 11,
    borderRadius: 22,
    minWidth: 120,
    alignItems: 'center',
  },
  comingSoonBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onPrimary,
  },
};

export default AgentProfileScreen;
