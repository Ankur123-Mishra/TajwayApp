import React, {useMemo, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import LanguageSelectModal, {
  LANGUAGES,
} from '../../components/profile/LanguageSelectModal';
import {ROUTES} from '../../constants/Routes';
import {useAuth} from '../../hooks';
import {logout} from '../../redux/slices/authSlice';
import {Colors, Spacing, Typography} from '../../theme';

const SAMPLE_PHONES = [
  '9876543210',
  '9123456780',
  '9988776655',
  '9170337201',
  '9414653454',
  '7390995460',
  '9897219634',
  '9389173930',
];

const getRandomPhone = () =>
  SAMPLE_PHONES[Math.floor(Math.random() * SAMPLE_PHONES.length)];

const openDialer = (phone = getRandomPhone()) => {
  const digits = String(phone).replace(/[^\d+]/g, '');
  if (!digits) {
    return;
  }
  Linking.openURL(`tel:${digits}`).catch(() => {});
};

const ACCOUNT_ITEMS_BASE = [
  {
    id: 'personal',
    label: 'Personal Information',
    icon: 'account-details-outline',
    library: 'mdi',
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
    icon: 'chatbubbles-outline',
    library: 'ion',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: 'sync-circle-outline',
    library: 'ion',
    route: ROUTES.TRANSACTIONS,
  },
];

const GENERAL_ITEMS = [
  {
    id: 'about',
    label: 'About us',
    icon: 'information-circle-outline',
    library: 'ion',
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    icon: 'shield-checkmark-outline',
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
    id: 'tutorials',
    label: 'App Tutorials',
    icon: 'document-text-outline',
    library: 'ion',
    toggle: true,
  },
];

const MenuIcon = ({library, name}) => {
  const IconSet = library === 'mdi' ? MaterialDesignIcons : Ionicons;
  return <IconSet name={name} size={20} color={Colors.secondaryDark} />;
};

const ProfileMenuRow = ({item, onPress, toggleValue, onToggle, isLast}) => {
  const content = (
    <>
      <View style={styles.rowIconWrap}>
        <MenuIcon library={item.library} name={item.icon} />
      </View>
      <Text style={styles.rowLabel}>{item.label}</Text>
      {item.toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{false: '#D8DCE3', true: Colors.primary}}
          thumbColor={Colors.surface}
        />
      ) : (
        <View style={styles.rowTrailing}>
          {item.trailing ? (
            <Text style={styles.trailingText}>{item.trailing}</Text>
          ) : null}
          <Ionicons name="chevron-forward" size={16} color={Colors.textPlaceholder} />
        </View>
      )}
    </>
  );

  if (item.toggle) {
    return (
      <View style={[styles.row, !isLast && styles.rowBorder]}>{content}</View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
};

/**
 * Profile tab — refined professional layout (no elevation).
 */
const AgentProfileScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {user, phone, role} = useAuth();
  const [tutorialsOn, setTutorialsOn] = useState(true);
  const [language, setLanguage] = useState('en');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [comingSoonVisible, setComingSoonVisible] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState(
    'This feature is coming soon.',
  );

  const showComingSoon = (message = 'This feature is coming soon.') => {
    setComingSoonMessage(message);
    setComingSoonVisible(true);
  };

  const handleHelpPress = () => {
    setHelpMenuOpen(prev => !prev);
  };

  const handleHelpCall = () => {
    setHelpMenuOpen(false);
    openDialer();
  };

  const displayPhone = phone || user?.phone || '8920230653';
  const displayName = user?.name || user?.fullName || 'Tajway Partner';
  const displayRole = (role || user?.role || 'Agent').toString();
  const roleLabel =
    displayRole.charAt(0).toUpperCase() + displayRole.slice(1).toLowerCase();

  const languageLabel =
    LANGUAGES.find(lang => lang.id === language)?.label.split(' - ')[0] ||
    'English';

  const accountItems = useMemo(
    () =>
      ACCOUNT_ITEMS_BASE.map(item =>
        item.id === 'language' ? {...item, trailing: languageLabel} : item,
      ),
    [languageLabel],
  );

  const onLogout = () => {
    dispatch(logout());
    const root =
      navigation.getParent()?.getParent() || navigation.getParent() || navigation;
    root.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: ROUTES.WELCOME}],
      }),
    );
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

  const renderSection = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuCard}>
        {items.map((item, index) => (
          <ProfileMenuRow
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
            onPress={() => onMenuPress(item)}
            toggleValue={tutorialsOn}
            onToggle={setTutorialsOn}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {helpMenuOpen ? (
        <TouchableOpacity
          style={styles.helpBackdrop}
          activeOpacity={1}
          onPress={() => setHelpMenuOpen(false)}
        />
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 32},
        ]}>
        <View
          style={[
            styles.hero,
            {paddingTop: insets.top + 10},
            helpMenuOpen && styles.heroRaised,
          ]}>
          <View style={styles.heroAccent} />
          <View style={styles.heroAccentSoft} />

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.pillBtn}
              onPress={onLogout}
              activeOpacity={0.85}>
              <Ionicons
                name="log-out-outline"
                size={15}
                color={Colors.helpRed}
              />
              <Text style={styles.pillText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.helpWrap}>
              <TouchableOpacity
                style={styles.pillBtn}
                onPress={handleHelpPress}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Help">
                <Ionicons
                  name="headset-outline"
                  size={15}
                  color={Colors.secondaryDark}
                />
                <Text style={[styles.pillText, styles.pillTextNeutral]}>
                  Help
                </Text>
              </TouchableOpacity>
              {helpMenuOpen ? (
                <View style={styles.helpPopup}>
                  <TouchableOpacity
                    style={styles.helpPopupItem}
                    activeOpacity={0.85}
                    onPress={handleHelpCall}
                    accessibilityRole="button"
                    accessibilityLabel="Call support">
                    <View style={styles.helpPopupCallBadge}>
                      <Text style={styles.helpPopupCallIcon}>📞</Text>
                    </View>
                    <Text style={styles.helpPopupText}>Call</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={onPickProfileImage}
            activeOpacity={0.85}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                {profileImageUri ? (
                  <Image
                    source={{uri: profileImageUri}}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={40}
                    color={Colors.textSlate}
                  />
                )}
              </View>
            </View>
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={12} color={Colors.textInverse} />
            </View>
          </TouchableOpacity>

          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.phone}>{displayPhone}</Text>

          <View style={styles.roleChip}>
            <View style={styles.roleDot} />
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <TouchableOpacity
            style={styles.upgradeCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(ROUTES.VERIFIED_SUPPLIER)}>
            <View style={styles.upgradeIconWrap}>
              <Ionicons name="ribbon" size={20} color={Colors.secondaryDark} />
            </View>
            <View style={styles.upgradeCopy}>
              <Text style={styles.upgradeTitle}>Upgrade to Verified</Text>
              <Text style={styles.upgradeSub}>
                Unlock supplier badge & more bookings
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.secondaryDark}
            />
          </TouchableOpacity>

          {renderSection('Account', accountItems)}
          {renderSection('General', GENERAL_ITEMS)}
        </View>
      </ScrollView>

      <LanguageSelectModal
        visible={languageModalVisible}
        selected={language}
        onClose={() => setLanguageModalVisible(false)}
        onSave={setLanguage}
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: '#EEF1F6',
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: Spacing.screenPadding,
    overflow: 'hidden',
  },
  heroAccent: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.primaryMuted,
    opacity: 0.7,
  },
  heroAccentSoft: {
    position: 'absolute',
    bottom: -30,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(62, 74, 89, 0.06)',
  },
  heroRaised: {
    zIndex: 30,
    elevation: 30,
  },
  topActions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    zIndex: 20,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pillText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.helpRed,
  },
  pillTextNeutral: {
    color: Colors.secondaryDark,
  },
  helpWrap: {
    position: 'relative',
    zIndex: 30,
  },
  helpBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
  },
  helpPopup: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 6,
    minWidth: 128,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    shadowColor: Colors.secondaryDark,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 40,
  },
  helpPopupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  helpPopupCallBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  helpPopupCallIcon: {
    fontSize: 12,
  },
  helpPopupText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textNavy,
  },
  avatarWrap: {
    marginBottom: 14,
    zIndex: 1,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 86,
    height: 86,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  displayName: {
    fontSize: 20,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
    letterSpacing: 0.2,
    marginBottom: 4,
    zIndex: 1,
  },
  phone: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textMuted,
    letterSpacing: 0.3,
    marginBottom: 12,
    zIndex: 1,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    zIndex: 1,
  },
  roleDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primaryDark,
  },
  roleText: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textSlate,
    letterSpacing: 0.3,
  },
  body: {
    paddingHorizontal: Spacing.screenPadding,
    marginTop: -8,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    gap: 12,
  },
  upgradeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  upgradeCopy: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
    marginBottom: 2,
  },
  upgradeSub: {
    fontSize: 12,
    color: Colors.textSlate,
    fontWeight: Typography.fontWeights.medium,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textMuted,
    marginBottom: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 15,
    minHeight: 56,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textPrimary,
  },
  rowTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trailingText: {
    fontSize: 13,
    color: Colors.textSlate,
    fontWeight: Typography.fontWeights.medium,
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
});

export default AgentProfileScreen;
