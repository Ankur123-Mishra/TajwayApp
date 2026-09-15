import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * My Bookings — posted/received toggle + empty state (screenshot 16).
 */
const MyBookingsScreen = () => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('posted');

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>My Bookings</Text>
        <TouchableOpacity style={styles.helpBtn} activeOpacity={0.85}>
          <Text style={styles.helpText}>Help</Text>
          <Text style={styles.helpIcon}>🎧</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.segment}>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'posted' && styles.segBtnOn]}
          onPress={() => setTab('posted')}>
          <Text style={[styles.segText, tab === 'posted' && styles.segTextOn]}>
            Booking Posted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'received' && styles.segBtnOn]}
          onPress={() => setTab('received')}>
          <Text
            style={[styles.segText, tab === 'received' && styles.segTextOn]}>
            Booking Received
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            placeholder="Search by booking Id..."
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.empty}>
        <Text style={styles.emptyText}>No Records found</Text>
      </View>

      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Text style={styles.fabIcon}>🤖</Text>
        <View style={styles.fabClose}>
          <Text style={styles.fabCloseX}>×</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  headerSpacer: {
    width: 72,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEFF3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  helpText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textNavy,
    marginRight: 4,
  },
  helpIcon: {
    fontSize: 12,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 4,
    marginBottom: Spacing.md,
    ...Dimensions.shadow.soft,
  },
  segBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnOn: {
    backgroundColor: Colors.primary,
  },
  segText: {
    fontWeight: '700',
    color: Colors.textNavy,
    fontSize: 13,
  },
  segTextOn: {
    color: Colors.textInverse,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    marginRight: 10,
    ...Dimensions.shadow.soft,
  },
  searchIcon: {
    fontSize: 16,
    color: Colors.textMuted,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Dimensions.shadow.soft,
  },
  filterIcon: {
    color: Colors.filterRed,
    fontSize: 18,
    fontWeight: '700',
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
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Dimensions.shadow.medium,
  },
  fabIcon: {
    fontSize: 28,
  },
  fabClose: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.filterRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabCloseX: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
});

export default MyBookingsScreen;
