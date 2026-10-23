import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
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

const DL_SIDES = [
  {key: 'front', label: 'Front'},
  {key: 'back', label: 'Back'},
];

/**
 * Manage Drivers + Add Driver bottom sheet (screenshots 13–14).
 */

const ManageDriversScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({});
  const [dlImages, setDlImages] = useState({front: null, back: null});

  const closeSheet = () => {
    setSheetOpen(false);
  };

  const resetForm = () => {
    setForm({});
    setDlImages({front: null, back: null});
  };

  const pickDlImage = side => {
    const openPicker = () => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          selectionLimit: 1,
          quality: 0.85,
        },
        response => {
          if (Platform.OS === 'ios') {
            setSheetOpen(true);
          }
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
          if (!uri) {
            return;
          }
          setDlImages(prev => ({...prev, [side]: uri}));
        },
      );
    };

    if (Platform.OS === 'ios') {
      setSheetOpen(false);
      setTimeout(openPicker, 350);
      return;
    }

    openPicker();
  };

  const clearDlImage = side => {
    setDlImages(prev => ({...prev, [side]: null}));
  };

  const onAdd = () => {
    closeSheet();
    resetForm();
    navigation.navigate(ROUTES.AGENT_TABS);
  };

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

      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen">
        <View style={styles.overlay}>
          <View style={[styles.sheet, {paddingBottom: insets.bottom + 12}]}>
            <View style={styles.sheetHead}>
              <View style={styles.headSide} />
              <Text style={styles.sheetTitle}>Add Driver</Text>
              <TouchableOpacity
                style={styles.headSide}
                activeOpacity={0.7}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                onPress={closeSheet}>
                <Ionicons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarRing}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}>
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

              <View style={styles.dlSection}>
                <Text style={styles.label}>Upload Driver License Images</Text>
                <View style={styles.dlRow}>
                  {DL_SIDES.map(({key, label}) => {
                    const uri = dlImages[key];
                    return (
                      <View key={key} style={styles.dlCol}>
                        <View style={styles.dlBox}>
                          {uri ? (
                            <Image
                              source={{uri}}
                              style={styles.dlPreview}
                              resizeMode="cover"
                            />
                          ) : null}
                          <TouchableOpacity
                            style={styles.dlInner}
                            onPress={() => pickDlImage(key)}
                            activeOpacity={0.85}
                            accessibilityLabel={`Upload DL ${label}`}>
                            {uri ? null : (
                              <Ionicons
                                name="add"
                                size={32}
                                color="#A0A8B5"
                              />
                            )}
                          </TouchableOpacity>
                          {uri ? (
                            <TouchableOpacity
                              style={styles.dlClear}
                              onPress={() => clearDlImage(key)}
                              hitSlop={{top: 8, right: 8, bottom: 8, left: 8}}
                              accessibilityLabel={`Remove DL ${label}`}>
                              <Ionicons
                                name="close-circle"
                                size={22}
                                color={Colors.textNavy}
                              />
                            </TouchableOpacity>
                          ) : null}
                        </View>
                        <Text style={styles.dlSideLabel}>{label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <PrimaryButton
              title="Add"
              darkText
              onPress={onAdd}
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
  scrollContent: {
    paddingBottom: 8,
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
  dlSection: {
    marginBottom: 8,
  },
  dlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  dlCol: {
    flex: 1,
    alignItems: 'center',
  },
  dlBox: {
    width: '100%',
    aspectRatio: 1.35,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9CED6',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dlInner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dlPreview: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  dlClear: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
    backgroundColor: Colors.surface,
    borderRadius: 11,
  },
  dlSideLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
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
