import React, {useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../../components/brand/BackButton';
import PrimaryButton from '../../components/brand/PrimaryButton';
import {ROUTES} from '../../constants/Routes';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

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
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({});

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Manage Drivers</Text>
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.85}
          onPress={() => setSheetOpen(true)}>
          <Text style={styles.addText}>Add New</Text>
          <View style={styles.plusCircle}>
            <Text style={styles.plus}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.empty} />

      <Modal visible={sheetOpen} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={[styles.sheet, {paddingBottom: insets.bottom + 12}]}>
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Add Driver</Text>
              <TouchableOpacity onPress={() => setSheetOpen(false)}>
                <Text style={styles.sheetClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
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
              onPress={() => {
                setSheetOpen(false);
                navigation.navigate(ROUTES.AGENT_TABS);
              }}
              style={{marginTop: 12}}
            />
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.base,
    maxHeight: '92%',
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  sheetTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textNavy,
    marginLeft: 24,
  },
  sheetClose: {
    fontSize: 18,
    color: Colors.textMuted,
    width: 24,
    textAlign: 'center',
  },
  avatar: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8EAED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarIcon: {
    fontSize: 40,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textNavy,
    marginBottom: 6,
  },
  inputWrap: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 24,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
});

export default ManageDriversScreen;
