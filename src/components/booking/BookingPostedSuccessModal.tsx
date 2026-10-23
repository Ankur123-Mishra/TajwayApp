import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {Images} from '../../constants/Images';
import {Colors} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const CREAM = '#FFF8E8';
const CREAM_SOFT = '#FFFBF3';
const SECTION_GRAY = '#F3F3F3';
const CALL_BTN_CREAM = '#FFF9E8';
const BORDER_MUTED = '#E6E8EC';
const TEXT = '#1A1A1B';

const APPROACH_OPTIONS = [
  {
    id: 'drivers_approach',
    label: 'Provide this booking to first driver who pays commission',
  },
  {
    id: 'self_select',
    label: 'I will choose and select driver by myself and ask for commission.',
  },
];

/**
 * Bottom sheet for post-booking preferences (driver approach + call preference).
 * Confirming a contact option submits those choices with the create-booking API.
 */

const BookingPostedSuccessModal = ({visible, onClose, onConfirm, loading}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const [approach, setApproach] = useState('drivers_approach');

  useEffect(() => {
    if (visible) {
      setApproach('drivers_approach');
    }
  }, [visible]);

  const confirm = contactPreference => {
    if (loading) {
      return;
    }
    onConfirm?.({approach, contactPreference});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={loading ? undefined : onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={loading ? undefined : onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          disabled={Boolean(loading)}
        />
        <View
          style={[
            styles.sheet,
            {paddingBottom: Math.max(insets.bottom, 12) + 8},
          ]}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Image
              source={Images.bookingPostSuccessful}
              style={styles.hero}
              resizeMode="contain"
              accessibilityLabel="Booking posted successfully"
            />

            <Text style={styles.title}>Booking Posted Successfully!</Text>

            <View style={styles.approachSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Ionicons name="paw" size={14} color={TEXT} />
                </View>
                <Text style={styles.sectionTitle}>
                  Please select how drivers will approach you for this booking.
                </Text>
              </View>

              {APPROACH_OPTIONS.map(option => {
                const selected = approach === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      selected && styles.optionCardSelected,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setApproach(option.id)}
                    accessibilityRole="radio"
                    accessibilityState={{selected}}>
                    {selected ? (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={styles.radioEmpty} />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.callSection}>
              <View style={styles.callHeader}>
                <View style={styles.callHeaderIcon}>
                  <MaterialDesignIcons
                    name="phone-in-talk"
                    size={15}
                    color={TEXT}
                  />
                </View>
                <Text style={styles.callHeaderTitle}>
                  Do you want people to call you?
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.callPrimaryBtn,
                  loading && styles.callBtnDisabled,
                ]}
                activeOpacity={0.88}
                disabled={Boolean(loading)}
                onPress={() => confirm('message_and_call')}
                accessibilityRole="button"
                accessibilityLabel="Get message and call"
                accessibilityState={{disabled: Boolean(loading)}}>
                <MaterialDesignIcons
                  name="phone-message"
                  size={20}
                  color={TEXT}
                />
                <Text style={styles.callPrimaryText}>
                  {loading ? 'Posting...' : 'Get message and call'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.callSecondaryBtn,
                  loading && styles.callBtnDisabled,
                ]}
                activeOpacity={0.88}
                disabled={Boolean(loading)}
                onPress={() => confirm('message_only')}
                accessibilityRole="button"
                accessibilityLabel="Get message only"
                accessibilityState={{disabled: Boolean(loading)}}>
                <MaterialDesignIcons
                  name="message-processing-outline"
                  size={20}
                  color={TEXT}
                />
                <Text style={styles.callSecondaryText}>
                  {loading ? 'Posting...' : 'Get message only'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const baseStyles = {
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  hero: {
    width: '100%',
    height: 150,
    alignSelf: 'center',
  },
  title: {
    marginTop: 4,
    marginBottom: 14,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: TEXT,
  },
  approachSection: {
    backgroundColor: CREAM,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 12,
  },
  callSection: {
    backgroundColor: SECTION_GRAY,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: TEXT,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER_MUTED,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 10,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: CREAM_SOFT,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C5CAD3',
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: TEXT,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  callHeaderIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callHeaderTitle: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: TEXT,
  },
  callPrimaryBtn: {
    height: 52,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  callPrimaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT,
  },
  callSecondaryBtn: {
    height: 52,
    borderRadius: 30,
    backgroundColor: CALL_BTN_CREAM,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  callSecondaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT,
  },
  callBtnDisabled: {
    opacity: 0.65,
  },
};

export default BookingPostedSuccessModal;
