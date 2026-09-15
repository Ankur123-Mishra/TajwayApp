import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  AppButton,
  AppCard,
  ScreenHeader,
  StatusBadge,
} from '../../components/common';
import {ROUTES} from '../../constants/Routes';
import {useAuth} from '../../hooks';
import {mockDrivers, mockUsers} from '../../mockData';
import {logout} from '../../redux/slices/authSlice';
import {AuthService} from '../../services';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const SectionRow = ({label, onPress, value}) => (
  <TouchableOpacity
    style={styles.row}
    onPress={onPress}
    activeOpacity={onPress ? 0.75 : 1}
    disabled={!onPress}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || '›'}</Text>
  </TouchableOpacity>
);

/**
 * Driver profile — personal / driving / vehicle / docs / bank / availability.
 */
const DriverProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const driver = user || mockUsers.driver;
  const profile = mockDrivers[0];

  const onLogout = async () => {
    await AuthService.clearSession();
    dispatch(logout());
    let rootNav = navigation;
    while (rootNav.getParent?.()) {
      rootNav = rootNav.getParent();
    }
    rootNav.reset({
      index: 0,
      routes: [{name: ROUTES.WELCOME}],
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Profile"
        subtitle="Driver account"
        showBack={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(driver?.name || 'D')
                .split(' ')
                .map(p => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{driver?.name || 'Driver'}</Text>
          <Text style={styles.phone}>{driver?.phone || profile?.phone}</Text>
          <StatusBadge status="Verified" style={styles.badge} />
        </AppCard>

        <AppCard style={styles.card} padded={false}>
          <Text style={styles.sectionTitle}>Personal</Text>
          <SectionRow label="Full name" value={driver?.name} />
          <SectionRow label="Email" value={driver?.email || '—'} />
          <SectionRow label="Phone" value={driver?.phone} />
        </AppCard>

        <AppCard style={styles.card} padded={false}>
          <Text style={styles.sectionTitle}>Driving</Text>
          <SectionRow
            label="License"
            value={driver?.licenseNumber || profile?.licenseNumber}
          />
          <SectionRow
            label="Trips completed"
            value={String(profile?.tripsCompleted ?? '—')}
          />
          <SectionRow
            label="Rating"
            value={profile?.rating ? `★ ${profile.rating}` : '—'}
          />
        </AppCard>

        <AppCard style={styles.card} padded={false}>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          <SectionRow
            label="Type"
            value={profile?.vehicle?.type?.toUpperCase()}
          />
          <SectionRow label="Model" value={profile?.vehicle?.model} />
          <SectionRow label="Number" value={profile?.vehicle?.number} />
        </AppCard>

        <AppCard style={styles.card} padded={false}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <SectionRow label="Aadhaar" value="Verified" />
          <SectionRow label="Driving license" value="Verified" />
          <SectionRow label="Vehicle RC" value="Under Review" />
        </AppCard>

        <AppCard style={styles.card} padded={false}>
          <Text style={styles.sectionTitle}>Bank</Text>
          <SectionRow label="Account" value="•••• 4821" />
          <SectionRow label="IFSC" value="HDFC0001234" />
          <SectionRow label="UPI" value="ravi@okhdfc" />
        </AppCard>

        <AppCard style={styles.card} padded={false}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <SectionRow
            label="Set availability"
            onPress={() => navigation.navigate(ROUTES.DRIVER_AVAILABILITY)}
          />
        </AppCard>

        <AppButton
          title="Log out"
          variant="outline"
          onPress={onLogout}
          style={styles.logout}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.xxxl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  avatar: {
    width: Dimensions.avatarSize.lg,
    height: Dimensions.avatarSize.lg,
    borderRadius: Dimensions.avatarSize.lg / 2,
    backgroundColor: Colors.plusButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.textInverse,
  },
  name: {
    ...Typography.h3,
    color: Colors.textNavy,
  },
  phone: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    marginTop: Spacing.md,
    alignSelf: 'center',
  },
  card: {
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.primary,
    paddingHorizontal: Spacing.cardPadding,
    paddingTop: Spacing.cardPadding,
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.cardPadding,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  rowLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  rowValue: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginLeft: Spacing.md,
    flexShrink: 1,
    textAlign: 'right',
  },
  logout: {
    marginTop: Spacing.md,
  },
});

export default DriverProfileScreen;
