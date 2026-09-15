import React from 'react';
import {CommonActions} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import BrandLogo from '../../components/brand/BrandLogo';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {ROUTES} from '../../constants/Routes';
import {useAuth} from '../../hooks';
import {logout} from '../../redux/slices/authSlice';
import {Colors, Spacing, Typography} from '../../theme';

const LINKS = [
  {label: 'Personal Information', route: ROUTES.PERSONAL_INFO},
  {label: 'Verify with Aadhaar', route: ROUTES.AADHAAR_VERIFY},
  {label: 'Manage Vehicles', route: ROUTES.MANAGE_VEHICLES},
  {label: 'Manage Drivers', route: ROUTES.MANAGE_DRIVERS},
];

/**
 * Profile tab — links into setup flows.
 */
const AgentProfileScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {user, phone} = useAuth();

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

  return (
    <View style={[styles.container, {paddingTop: insets.top + 16}]}>
      <BrandLogo size="md" style={styles.logo} />
      <Text style={styles.name}>{user?.name || 'Complete your profile'}</Text>
      <Text style={styles.phone}>{phone || user?.phone || ''}</Text>

      <View style={styles.list}>
        {LINKS.map(item => (
          <TouchableOpacity
            key={item.route}
            style={styles.row}
            onPress={() => navigation.navigate(item.route)}>
            <Text style={styles.rowText}>{item.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton
        title="Sign out"
        variant="secondary"
        onPress={onLogout}
        style={styles.logout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screenPadding,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  name: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
  },
  phone: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: Spacing.xl,
  },
  list: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textNavy,
  },
  chevron: {
    fontSize: 22,
    color: Colors.textMuted,
  },
  logout: {
    marginTop: Spacing.xl,
  },
});

export default AgentProfileScreen;
