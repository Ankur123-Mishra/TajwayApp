import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types as documentTypes,
} from '@react-native-documents/picker';
import {getChatById} from '../../mockData';
import {Colors, Spacing, Typography} from '../../theme';

const partnerAvatar = require('../../assets/images/partner_deepesh.png');
const carSedan = require('../../assets/images/car_sedan.png');
const carInnova = require('../../assets/images/car_innova.png');
const carErtiga = require('../../assets/images/car_ertiga.png');

const formatInr = value => `₹${Number(value).toLocaleString('en-IN')}*`;

const GRID_IMAGES = [partnerAvatar, carSedan, carInnova, carErtiga];

const openDialer = phone => {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  if (!digits) {
    return;
  }
  Linking.openURL(`tel:${digits}`).catch(() => {});
};

const getBaseName = (name, uri) => {
  const raw = String(name || uri || 'Document');
  const cleaned = raw.split('?')[0];
  const parts = cleaned.split(/[/\\]/);
  return parts[parts.length - 1] || 'Document';
};

const isImageMime = mimeType =>
  typeof mimeType === 'string' && mimeType.toLowerCase().startsWith('image/');

const isImageFileName = name =>
  /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(String(name || ''));

const normalizeMediaUri = uri => {
  if (!uri || typeof uri !== 'string') {
    return '';
  }
  if (
    uri.startsWith('content://') ||
    uri.startsWith('file://') ||
    uri.startsWith('http://') ||
    uri.startsWith('https://') ||
    uri.startsWith('data:')
  ) {
    return uri;
  }
  return `file://${uri}`;
};

const formatFileSize = bytes => {
  const size = Number(bytes);
  if (!size || Number.isNaN(size)) {
    return '';
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const BookingSummaryCard = ({booking}) => {
  if (!booking) {
    return null;
  }

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTop}>
        <Text style={styles.summaryMeta}>{booking.dateTime}</Text>
        <Text style={styles.summaryMeta}>
          ID:{booking.id} [{booking.status}]
        </Text>
      </View>

      <View style={styles.summaryBody}>
        <View style={styles.routeCol}>
          <Text style={styles.city}>{booking.from}</Text>
          <Text style={styles.city}>{booking.to}</Text>
        </View>

        <View style={styles.summaryRight}>
          <Text style={styles.price}>{formatInr(booking.amount)}</Text>
          {booking.network ? (
            <View style={styles.networkBadge}>
              <Ionicons name="location" size={11} color={Colors.textMuted} />
              <Text style={styles.networkText}>{booking.network}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.pillRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{booking.vehicle}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {String(booking.tripType).toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ImagePreview = ({uri, fileName}) => {
  const [failed, setFailed] = useState(false);
  const sourceUri = normalizeMediaUri(uri);

  if (!sourceUri || failed) {
    return (
      <View style={styles.imageFallback}>
        <Ionicons name="image-outline" size={28} color="#FFF" />
        <Text style={styles.imageFallbackText} numberOfLines={2}>
          {getBaseName(fileName, uri)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.attachedImageWrap}>
      <Image
        source={{uri: sourceUri}}
        style={styles.attachedImage}
        resizeMode="cover"
        onError={() => setFailed(true)}
      />
    </View>
  );
};

const FilePreview = ({fileName, fileSize, mimeType, uri}) => {
  const name = getBaseName(fileName, uri);
  const showAsImage = isImageMime(mimeType) || isImageFileName(name);

  if (showAsImage && uri) {
    return <ImagePreview uri={uri} fileName={name} />;
  }

  return (
    <View style={styles.fileCard}>
      <View style={styles.filePreviewBanner}>
        <Ionicons name="document-text" size={32} color="#FFF" />
      </View>
      <View style={styles.fileRow}>
        <View style={styles.fileIconWrap}>
          <Ionicons name="document-attach-outline" size={18} color="#FFF" />
        </View>
        <View style={styles.fileMeta}>
          <Text style={styles.fileName} numberOfLines={2}>
            {name}
          </Text>
          {fileSize ? <Text style={styles.fileSize}>{fileSize}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const MessageBubble = ({message, showAvatar}) => {
  const isMe = message.sender === 'me';
  const isImage =
    message.type === 'image' ||
    (message.type === 'file' &&
      (isImageMime(message.mimeType) || isImageFileName(message.fileName)));

  return (
    <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
      {!isMe ? (
        showAvatar ? (
          <View style={styles.msgAvatar}>
            <Image source={partnerAvatar} style={styles.msgAvatarImg} />
          </View>
        ) : (
          <View style={styles.msgAvatarSpacer} />
        )
      ) : null}

      <View
        style={[
          styles.bubble,
          isMe && styles.bubbleMe,
          (isImage || message.type === 'file' || message.type === 'images') &&
            styles.bubbleMedia,
        ]}>
        {message.type === 'images' ? (
          <View style={styles.imageGrid}>
            {GRID_IMAGES.map((source, index) => (
              <View key={`${message.id}-img-${index}`} style={styles.gridCell}>
                <Image source={source} style={styles.gridImage} />
              </View>
            ))}
          </View>
        ) : isImage && message.uri ? (
          <ImagePreview uri={message.uri} fileName={message.fileName} />
        ) : message.type === 'file' ? (
          <FilePreview
            uri={message.uri}
            fileName={message.fileName}
            fileSize={message.fileSize}
            mimeType={message.mimeType}
          />
        ) : (
          <Text style={styles.bubbleText}>{message.text}</Text>
        )}
        <Text style={styles.bubbleTime}>{message.time}</Text>
      </View>

      {!isMe ? (
        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
          <Ionicons name="share-social-outline" size={16} color="#9AA0A6" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const AttachSheet = ({visible, onClose, onPickImage, onPickDocument}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.sheetOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={[styles.sheet, {paddingBottom: insets.bottom + 16}]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Upload attachment</Text>

            <TouchableOpacity
              style={styles.sheetOption}
              activeOpacity={0.85}
              onPress={onPickImage}
              accessibilityRole="button"
              accessibilityLabel="Upload image">
              <View style={[styles.sheetOptionIcon, styles.sheetOptionIconImage]}>
                <Ionicons name="image-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.sheetOptionTextWrap}>
                <Text style={styles.sheetOptionTitle}>Image</Text>
                <Text style={styles.sheetOptionSub}>Photo from gallery</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetOption}
              activeOpacity={0.85}
              onPress={onPickDocument}
              accessibilityRole="button"
              accessibilityLabel="Upload document">
              <View style={[styles.sheetOptionIcon, styles.sheetOptionIconDoc]}>
                <Ionicons
                  name="document-attach-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.sheetOptionTextWrap}>
                <Text style={styles.sheetOptionTitle}>Document</Text>
                <Text style={styles.sheetOptionSub}>PDF, DOC, and more</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCancel}
              activeOpacity={0.85}
              onPress={onClose}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/**
 * Chat details — booking summary + message thread matching product screenshot.
 */
const ChatDetailsScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const chatId = route?.params?.chatId;
  const chat = useMemo(
    () => getChatById(chatId) || getChatById('chat-001'),
    [chatId],
  );
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(chat?.messages || []);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [attachSheetOpen, setAttachSheetOpen] = useState(false);

  useEffect(() => {
    setMessages(chat?.messages || []);
    setDraft('');
  }, [chat]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = e => {
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    };
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const dateLabel = chat?.lastMessageAt || 'Today';
  const composerBottom =
    keyboardHeight > 0
      ? keyboardHeight + 24
      : Math.max(insets.bottom, 10);

  const appendMessage = message => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    appendMessage({
      id: `local-${Date.now()}`,
      type: 'text',
      sender: 'me',
      time: 'Now',
      text,
    });
    setDraft('');
  };

  const handleCallPress = () => {
    openDialer(chat?.contactPhone);
  };

  const pickImage = () => {
    setAttachSheetOpen(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.85,
        includeBase64: false,
      },
      response => {
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
        const asset = response.assets?.[0];
        const imageUri =
          asset?.uri ||
          (asset?.originalPath ? `file://${asset.originalPath}` : '');
        if (!imageUri) {
          return;
        }
        appendMessage({
          id: `local-img-${Date.now()}`,
          type: 'image',
          sender: 'me',
          time: 'Now',
          uri: imageUri,
          fileName: getBaseName(asset.fileName, imageUri),
          mimeType: asset.type || 'image/jpeg',
        });
      },
    );
  };

  const pickDocument = async () => {
    setAttachSheetOpen(false);
    try {
      const [file] = await pick({
        type: [
          documentTypes.pdf,
          documentTypes.doc,
          documentTypes.docx,
          documentTypes.plainText,
          documentTypes.csv,
          documentTypes.xls,
          documentTypes.xlsx,
          documentTypes.ppt,
          documentTypes.pptx,
          documentTypes.images,
        ],
        allowMultiSelection: false,
      });
      if (!file?.uri) {
        return;
      }

      const displayName = getBaseName(file.name, file.uri);
      let previewUri = file.uri;

      try {
        const [local] = await keepLocalCopy({
          files: [
            {
              uri: file.uri,
              fileName: displayName || 'attachment',
            },
          ],
          destination: 'cachesDirectory',
        });
        if (local?.status === 'success' && local.localUri) {
          previewUri = local.localUri;
        }
      } catch (_) {
        // Keep original uri if local copy fails.
      }

      const mimeType = file.type || '';
      const asImage = isImageMime(mimeType) || isImageFileName(displayName);

      appendMessage({
        id: `local-file-${Date.now()}`,
        type: asImage ? 'image' : 'file',
        sender: 'me',
        time: 'Now',
        uri: previewUri,
        fileName: displayName,
        fileSize: formatFileSize(file.size),
        mimeType,
      });
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert(
        'Unable to pick document',
        err?.message || 'Please try again.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 6}]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color={Colors.textNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {chat?.contactName || 'Chat'}
        </Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={handleCallPress}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Call contact">
          <MaterialDesignIcons name="phone" size={20} color={Colors.textNavy} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryWrap}>
        <BookingSummaryCard booking={chat?.booking} />
      </View>

      <ScrollView
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <Text style={styles.dateDivider}>{dateLabel}</Text>

        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const showAvatar = !prev || prev.sender !== message.sender;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              showAvatar={showAvatar}
            />
          );
        })}

        {chat?.booking?.completedBy ? (
          <Text style={styles.completedNote}>
            * This booking is completed by {chat.booking.completedBy}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.composerWrap, {paddingBottom: composerBottom}]}>
        <View style={styles.composer}>
          <TouchableOpacity
            style={styles.attachBtn}
            activeOpacity={0.85}
            onPress={() => {
              Keyboard.dismiss();
              setAttachSheetOpen(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Attach image or document">
            <Ionicons name="attach" size={22} color={Colors.textNavy} />
          </TouchableOpacity>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Say something..."
            placeholderTextColor="#B0B6BE"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !draft.trim() && styles.sendBtnDisabled,
            ]}
            activeOpacity={0.85}
            onPress={sendMessage}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message">
            <Ionicons
              name="send"
              size={18}
              color={draft.trim() ? Colors.primary : '#B0B6BE'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <AttachSheet
        visible={attachSheetOpen}
        onClose={() => setAttachSheetOpen(false)}
        onPickImage={pickImage}
        onPickDocument={pickDocument}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
  },
  summaryWrap: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 12,
    paddingBottom: 4,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryMeta: {
    fontSize: 12,
    color: '#9AA0A6',
    fontWeight: '500',
  },
  summaryBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  routeCol: {
    flex: 1,
    paddingRight: 10,
  },
  city: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28A745',
    marginBottom: 6,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  networkText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EEEEEE',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  thread: {
    flex: 1,
  },
  threadContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    paddingBottom: 16,
  },
  dateDivider: {
    alignSelf: 'center',
    marginVertical: 12,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    maxWidth: '92%',
  },
  msgRowMe: {
    alignSelf: 'flex-end',
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 8,
    backgroundColor: '#2C3A4B',
  },
  msgAvatarImg: {
    width: '100%',
    height: '100%',
  },
  msgAvatarSpacer: {
    width: 36,
  },
  bubble: {
    flexShrink: 1,
    backgroundColor: '#3A3F46',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    maxWidth: '78%',
  },
  bubbleMe: {
    backgroundColor: '#2C3A4B',
    marginLeft: 'auto',
  },
  bubbleMedia: {
    paddingHorizontal: 8,
    paddingTop: 8,
    overflow: 'hidden',
  },
  bubbleText: {
    color: Colors.textInverse,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  bubbleTime: {
    marginTop: 6,
    alignSelf: 'flex-end',
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
  imageGrid: {
    width: 168,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  gridCell: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#5B6B7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  attachedImageWrap: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#5B6B7A',
  },
  attachedImage: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#5B6B7A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  imageFallbackText: {
    marginTop: 8,
    color: Colors.textInverse,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  fileCard: {
    width: 220,
    overflow: 'hidden',
  },
  filePreviewBanner: {
    height: 110,
    borderRadius: 10,
    backgroundColor: '#4A5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fileMeta: {
    flex: 1,
  },
  fileName: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  fileSize: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
  },
  shareBtn: {
    marginLeft: 8,
    marginBottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8EAED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedNote: {
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#28A745',
  },
  composerWrap: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    backgroundColor: Colors.background,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 48,
    paddingLeft: 6,
    paddingRight: 8,
  },
  attachBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.7,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 10,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textNavy,
    marginBottom: 12,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  sheetOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sheetOptionIconImage: {
    backgroundColor: Colors.primaryMuted,
  },
  sheetOptionIconDoc: {
    backgroundColor: Colors.primaryMuted,
  },
  sheetOptionTextWrap: {
    flex: 1,
  },
  sheetOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textNavy,
  },
  sheetOptionSub: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.textMuted,
  },
  sheetCancel: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECEFF3',
  },
  sheetCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textNavy,
  },
});

export default ChatDetailsScreen;
