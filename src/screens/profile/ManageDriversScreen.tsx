import React, {useState} from 'react';
import {Modal, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PrimaryButton from '../../components/brand/PrimaryButton';
import BannerHeader from '../../components/common/BannerHeader';
import {ROUTES} from '../../constants/Routes';
import {Colors, Dimensions, Spacing} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const DRIVER_FIELDS = [
  'Driver Full Name',
  'Contact Number',
  'License Number',
  'Address Line 1',
  'Address Line 2',
  'City',
];

/**
 * Manage Drivers + Add Driver bottom sheet (screenshots 13–14).
 */

const ManageDriversScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({});

  return (
    <View style={styles.container}>
      <BannerHeader
        title="Manage Drivers"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.85}
            onPress={() => setSheetOpen(true)}>
            <Text style={styles.addText}>Add New</Text>
            <View style={styles.plusCircle}>
              <Text style={styles.plus}>+</Text>
            </View>
          </TouchableOpacity>
        }
      />

      <View style={styles.empty} />

      <Modal visible={sheetOpen} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={[styles.sheet, {paddingBottom: insets.bottom + 12}]}>
            <View style={styles.sheetHead}>
              <View style={styles.headSide} />
              <Text style={styles.sheetTitle}>Add Driver</Text>
              <TouchableOpacity
                style={styles.headSide}
                activeOpacity={0.7}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                onPress={() => setSheetOpen(false)}>
                <Ionicons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarRing}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              {DRIVER_FIELDS.map(field => (
                <View key={field} style={styles.field}>
                  <Text style={styles.label}>{field}</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={form[field] || ''}
                      onChangeText={t =>
                        setForm(prev => ({...prev, [field]: t}))
                      }
                      placeholder={field}
                      placeholderTextColor={Colors.textPlaceholder}
                      style={styles.input}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

            <PrimaryButton
              title="Add"
              darkText
              onPress={() => {
                setSheetOpen(false);
                navigation.navigate(ROUTES.AGENT_TABS);
              }}
              style={styles.addButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
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
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  empty: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.lg,
    paddingTop: 18,
    maxHeight: '92%',
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headSide: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  avatarRing: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#E2E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  avatarHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
  },
  avatarBody: {
    width: 46,
    height: 24,
    marginTop: 5,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputWrap: {
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF1F4',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
  addButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 12,
    shadowOpacity: 0,
    elevation: 0,
  },
};

export default ManageDriversScreen;
