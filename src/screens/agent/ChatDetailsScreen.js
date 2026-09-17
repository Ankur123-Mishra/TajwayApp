import React, {useEffect, useMemo, useState} from 'react';
import {
  Image,
  Keyboard,
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
import {getChatById} from '../../mockData';
import {Colors, Spacing, Typography} from '../../theme';

const partnerAvatar = require('../../assets/images/partner_deepesh.png');
const carSedan = require('../../assets/images/car_sedan.png');
const carInnova = require('../../assets/images/car_innova.png');
const carErtiga = require('../../assets/images/car_ertiga.png');

const formatInr = value => `₹${Number(value).toLocaleString('en-IN')}*`;

const GRID_IMAGES = [partnerAvatar, carSedan, carInnova, carErtiga];

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

const MessageBubble = ({message, showAvatar}) => {
  const isMe = message.sender === 'me';

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

      <View style={[styles.bubble, isMe && styles.bubbleMe]}>
        {message.type === 'images' ? (
          <View style={styles.imageGrid}>
            {GRID_IMAGES.map((source, index) => (
              <View key={`${message.id}-img-${index}`} style={styles.gridCell}>
                <Image source={source} style={styles.gridImage} />
              </View>
            ))}
          </View>
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

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setMessages(prev => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        type: 'text',
        sender: 'me',
        time: 'Now',
        text,
      },
    ]);
    setDraft('');
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
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Say something..."
            placeholderTextColor="#B0B6BE"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
        </View>
      </View>
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
    backgroundColor: Colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  input: {
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 10,
  },
});

export default ChatDetailsScreen;
