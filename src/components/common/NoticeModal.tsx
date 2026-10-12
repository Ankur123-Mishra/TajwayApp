import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {useResponsiveStyles} from '../../hooks';
import {Colors, Spacing} from '../../theme';

/**
 * Centered notice card matching the profile logout / coming-soon popup.
 */
const NoticeModal = ({visible, title, message, onClose}) => {
  const styles = useResponsiveStyles(baseStyles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity
              style={styles.okBtn}
              activeOpacity={0.85}
              onPress={onClose}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const baseStyles = {
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  okBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 11,
    borderRadius: 22,
    minWidth: 120,
    alignItems: 'center',
  },
  okText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onPrimary,
  },
};

export default NoticeModal;
