import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import BannerHeader from '../../components/common/BannerHeader';
import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types as documentTypes,
} from '@react-native-documents/picker';
import {getChatById} from '../../mockData';
import {Images} from '../../constants/Images';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const formatInr = value => `₹${Number(value).toLocaleString('en-IN')}`;

const STATUS_STYLES = {
  Ended: {bg: '#E8F8EF', color: '#1FA971'},
  Assigned: {bg: '#E7F0FF', color: '#3B7DFF'},
  Pending: {bg: '#FFF6D6', color: '#C4922A'},
};

const formatContactName = name => {
  const text = String(name || '').trim();
  if (!text) {
    return 'Chat';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const GRID_IMAGES = [
  Images.partnerDeepesh,
  Images.carSedan,
  Images.carInnova,
  Images.carErtiga,
];

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
  const styles = useResponsiveStyles(baseStyles);
  if (!booking) {
    return null;
  }

  const statusStyle = STATUS_STYLES[booking.status] || {
    bg: '#F3F4F6',
    color: '#6B7280',
  };

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryLeft}>
        <View style={styles.routeRow}>
          <Ionicons name="location" size={16} color={Colors.primaryDark} />
          <Text style={styles.routeText} numberOfLines={1}>
            {booking.from} → {booking.to}
          </Text>
        </View>
        <Text style={styles.price}>{formatInr(booking.amount)}</Text>
      </View>
      <View style={styles.summaryDivider} />
      {booking.status ? (
        <View style={[styles.statusPill, {backgroundColor: statusStyle.bg}]}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={statusStyle.color}
          />
          <Text style={[styles.statusText, {color: statusStyle.color}]}>
            {booking.status}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const ImagePreview = ({uri, fileName}) => {
  const styles = useResponsiveStyles(baseStyles);
  const [failed, setFailed] = useState(false);
  const sourceUri = normalizeMediaUri(uri);

  if (!sourceUri || failed) {
    return (
      <View style={styles.imageFallback}>
        <Ionicons name="image-outline" size={28} color="#6B7280" />
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
  const styles = useResponsiveStyles(baseStyles);
  const name = getBaseName(fileName, uri);
  const showAsImage = isImageMime(mimeType) || isImageFileName(name);

  if (showAsImage && uri) {
    return <ImagePreview uri={uri} fileName={name} />;
  }

  return (
    <View style={styles.fileCard}>
      <View style={styles.filePreviewBanner}>
        <Ionicons name="document-text" size={32} color="#6B7280" />
      </View>
      <View style={styles.fileRow}>
        <View style={styles.fileIconWrap}>
          <Ionicons name="document-attach-outline" size={18} color="#3E4A59" />
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

const MessageBubble = ({message}) => {
  const styles = useResponsiveStyles(baseStyles);
  const isMe = message.sender === 'me';
  const isImage =
    message.type === 'image' ||
    (message.type === 'file' &&
      (isImageMime(message.mimeType) || isImageFileName(message.fileName)));
  const isMedia =
    isImage || message.type === 'file' || message.type === 'images';

  return (
    <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleThem,
          isMedia && styles.bubbleMedia,
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
      </View>
      {!isMe ? (
        <View style={styles.msgAvatar}>
          <Image source={Images.profile} style={styles.msgAvatarImg} />
        </View>
      ) : null}
    </View>
  );
};

const AttachSheet = ({visible, onClose, onPickImage, onPickDocument}) => {
  const styles = useResponsiveStyles(baseStyles);
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
  const styles = useResponsiveStyles(baseStyles);
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
      <BannerHeader>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Image
              source={Images.backIcon}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {formatContactName(chat?.contactName)}
          </Text>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleCallPress}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Call contact">
            <Ionicons name="call-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </BannerHeader>

      <View style={styles.summaryWrap}>
        <BookingSummaryCard booking={chat?.booking} />
      </View>

      <ScrollView
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ScrollView>

      <View style={[styles.composerWrap, {paddingBottom: composerBottom}]}>
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write your message"
            placeholderTextColor="#B0B6BE"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={styles.galleryBtn}
            activeOpacity={0.85}
            onPress={() => {
              Keyboard.dismiss();
              setAttachSheetOpen(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Upload from gallery">
            <Ionicons name="images-outline" size={22} color="#8E949C" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
            activeOpacity={0.85}
            onPress={sendMessage}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message">
            <Ionicons name="paper-plane" size={16} color={Colors.textPrimary} />
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

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 18,
    height: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  summaryWrap: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 14,
    paddingBottom: 6,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0E2B0',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  summaryLeft: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  summaryDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#E7DDB8',
    marginRight: 14,
  },
  price: {
    marginTop: 6,
    marginLeft: 22,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  thread: {
    flex: 1,
  },
  threadContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 16,
  },
  msgRow: {
    alignSelf: 'flex-start',
    maxWidth: '78%',
    marginBottom: 22,
  },
  msgRowMe: {
    alignSelf: 'flex-end',
  },
  msgAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 6,
    backgroundColor: '#E5E7EB',
  },
  msgAvatarImg: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  bubbleMe: {
    backgroundColor: '#F8E59A',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#E8E8EA',
    marginLeft: 36,
    marginTop: 18,
    marginBottom: -8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 4,
  },
  bubbleMedia: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  bubbleText: {
    color: '#1C1C1E',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
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
    borderRadius: 16,
    backgroundColor: '#E8EAED',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  imageFallbackText: {
    marginTop: 8,
    color: Colors.textPrimary,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  fileCard: {
    width: 220,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 8,
  },
  filePreviewBanner: {
    height: 110,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fileMeta: {
    flex: 1,
  },
  fileName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  fileSize: {
    marginTop: 2,
    color: Colors.textMuted,
    fontSize: 11,
  },
  composerWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#F7F8FA',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 28,
    minHeight: 52,
    paddingLeft: 18,
    paddingRight: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 12,
    paddingRight: 8,
  },
  galleryBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.55,
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
};

export default ChatDetailsScreen;
