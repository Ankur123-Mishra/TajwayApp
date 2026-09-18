import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../../components/brand/BackButton';
import {ROUTES} from '../../constants/Routes';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * Manage Vehicles — empty state (screenshot 11).
 */
const ManageVehiclesScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Manage Vehicles</Text>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
          <Text style={styles.addText}>Add New</Text>
          <View style={styles.plusCircle}>
            <Text style={styles.plus}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Please click on plus button and add your vehicle number, details will be
        fetched automatically. You can add upto 5 vehicles. For adding more than
        5 call help & support
      </Text>

      <View style={styles.empty}>
        <Text style={styles.emptyText}>No Vehicle Found</Text>
      </View>

      <TouchableOpacity
        style={styles.nextLink}
        onPress={() => navigation.navigate(ROUTES.MANAGE_DRIVERS)}>
        <Text style={styles.nextText}>Continue to Manage Drivers →</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    color: Colors.textNavy,
    marginHorizontal: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingLeft: 12,
    paddingRight: 6,
    height: 36,
    borderRadius: 18,
    ...Dimensions.shadow.soft,
  },
  addText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textNavy,
    marginRight: 6,
  },
  plusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  hint: {
    paddingHorizontal: Spacing.screenPadding,
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 19,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  nextLink: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  nextText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default ManageVehiclesScreen;
