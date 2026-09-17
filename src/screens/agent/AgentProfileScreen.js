import React, {useMemo, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {
  Alert,
  Image,
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
    route: ROUTES.VERIFIED_SUPPLIER,
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
  return <IconSet name={name} size={22} color={Colors.primary} />;
};

const DashedDivider = () => <View style={styles.divider} />;

const ProfileMenuRow = ({item, onPress, toggleValue, onToggle}) => {
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
          trackColor={{false: '#D0D0D0', true: Colors.primary}}
          thumbColor={Colors.surface}
        />
      ) : (
        <View style={styles.rowTrailing}>
          {item.trailing ? (
            <Text style={styles.trailingText}>{item.trailing}</Text>
          ) : null}
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.primary}
          />
        </View>
      )}
    </>
  );

  if (item.toggle) {
    return (
      <View style={styles.row}>
        {content}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.75}>
      {content}
    </TouchableOpacity>
  );
};

/**
 * Profile tab — matches production screenshot layout.
 */
const AgentProfileScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {user, phone} = useAuth();
  const [tutorialsOn, setTutorialsOn] = useState(true);
  const [language, setLanguage] = useState('en');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);

  const displayPhone = phone || user?.phone || '8920230653';
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
    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  const renderSection = (title, items) => (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.menuCard}>
        {items.map((item, index) => (
          <View key={item.id}>
            <ProfileMenuRow
              item={item}
              onPress={() => onMenuPress(item)}
              toggleValue={tutorialsOn}
              onToggle={setTutorialsOn}
            />
            {index < items.length - 1 ? <DashedDivider /> : null}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 24},
        ]}>
        <View style={[styles.hero, {paddingTop: insets.top + 12}]}>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.pillBtn}
              onPress={onLogout}
              activeOpacity={0.85}>
              <Text style={styles.pillText}>Logout</Text>
              <Ionicons
                name="log-out-outline"
                size={16}
                color={Colors.helpRed}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.pillBtn} activeOpacity={0.85}>
              <Text style={styles.pillText}>Help</Text>
              <Ionicons
                name="headset-outline"
                size={16}
                color={Colors.helpRed}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={onPickProfileImage}
            activeOpacity={0.85}>
            <View style={styles.avatar}>
              {profileImageUri ? (
                <Image
                  source={{uri: profileImageUri}}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={36}
                  color={Colors.textPlaceholder}
                />
              )}
            </View>
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={12} color={Colors.surface} />
            </View>
          </TouchableOpacity>

          <Text style={styles.phone}>{displayPhone}</Text>
        </View>

        <View style={styles.upgradeBand}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate(ROUTES.VERIFIED_SUPPLIER)}>
            <Text style={styles.upgradeText}>Upgrade Now!!</Text>
          </TouchableOpacity>
        </View>

        {renderSection('Account', accountItems)}
        {renderSection('General', GENERAL_ITEMS)}
      </ScrollView>

      <LanguageSelectModal
        visible={languageModalVisible}
        selected={language}
        onClose={() => setLanguageModalVisible(false)}
        onSave={setLanguage}
      />
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
    backgroundColor: '#E8EBF0',
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: Spacing.screenPadding,
  },
  topActions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.helpRed,
  },
  avatarWrap: {
    marginBottom: 12,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 78,
    height: 78,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  phone: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  upgradeBand: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.helpRed,
    textDecorationLine: 'underline',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
    marginBottom: 10,
    marginTop: 6,
    paddingHorizontal: Spacing.screenPadding,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    minHeight: 54,
  },
  rowIconWrap: {
    width: 28,
    alignItems: 'center',
    marginRight: 14,
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
    gap: 6,
  },
  trailingText: {
    fontSize: 14,
    color: Colors.textSlate,
    fontWeight: Typography.fontWeights.medium,
  },
  divider: {
    marginHorizontal: 14,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
  },
});

export default AgentProfileScreen;
