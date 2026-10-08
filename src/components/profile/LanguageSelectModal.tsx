import React, {useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PrimaryButton from '../brand/PrimaryButton';
import {Colors, Spacing, Typography} from '../../theme';

export const LANGUAGES = [
  {id: 'en', label: 'English'},
  {id: 'hi', label: 'Hindi - हिंदी'},
];

/**
 * Bottom sheet to pick app language (English / Hindi).
 */
const LanguageSelectModal = ({
  visible,
  selected = 'en',
  onClose,
  onSave,
}) => {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(selected);

  useEffect(() => {
    if (visible) {
      setDraft(selected);
    }
  }, [visible, selected]);

  const handleSave = () => {
    onSave?.(draft);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={[styles.sheet, {paddingBottom: insets.bottom + 20}]}>
            <View style={styles.head}>
              <Text style={styles.title}>Select Language</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                accessibilityRole="button"
                accessibilityLabel="Close">
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.list}>
              {LANGUAGES.map((lang, index) => {
                const isSelected = draft === lang.id;
                return (
                  <View key={lang.id}>
                    <TouchableOpacity
                      style={styles.option}
                      activeOpacity={0.75}
                      onPress={() => setDraft(lang.id)}
                      accessibilityRole="radio"
                      accessibilityState={{selected: isSelected}}>
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}>
                        {isSelected ? <View style={styles.radioInner} /> : null}
                      </View>
                      <Text style={styles.optionLabel}>{lang.label}</Text>
                    </TouchableOpacity>
                    {index < LANGUAGES.length - 1 ? (
                      <View style={styles.divider} />
                    ) : null}
                  </View>
                );
              })}
            </View>

            <PrimaryButton title="Save" onPress={handleSave} />
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
    marginBottom: Spacing.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
    marginLeft: 24,
  },
  close: {
    fontSize: 18,
    color: Colors.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  list: {
    marginBottom: Spacing.xl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textSlate,
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
  },
});

export default LanguageSelectModal;
