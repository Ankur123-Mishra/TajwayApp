import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Spacing} from '../../theme';

/**
 * Bottom sheet shown when tapping the + tab — "Post" with New Booking / Free Vehicle.
 */
const PostActionSheet = ({
  visible,
  onClose,
  onNewBooking,
  onFreeVehicle,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={[styles.sheet, {paddingBottom: insets.bottom + 20}]}>
            <View style={styles.head}>
              <Text style={styles.title}>Post</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                accessibilityRole="button"
                accessibilityLabel="Close">
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.newBookingBtn]}
                activeOpacity={0.85}
                onPress={onNewBooking}>
                <Text style={[styles.actionLabel, styles.newBookingLabel]}>
                  New Booking
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.freeVehicleBtn]}
                activeOpacity={0.85}
                onPress={onFreeVehicle}>
                <Text style={styles.actionLabel}>Free Vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textNavy,
    marginLeft: 24,
  },
  close: {
    fontSize: 18,
    color: Colors.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBookingBtn: {
    backgroundColor: Colors.primary,
  },
  freeVehicleBtn: {
    backgroundColor: Colors.secondary,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  newBookingLabel: {
    color: Colors.onPrimary,
  },
});

export default PostActionSheet;
