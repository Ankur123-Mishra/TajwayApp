import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ChatListCard} from '../../components/chat';
import {ROUTES} from '../../constants/Routes';
import {mockChats} from '../../mockData';
import {Colors, Spacing, Typography} from '../../theme';

const SAMPLE_PHONES = [
  '9876543210',
  '9123456780',
  '9988776655',
  '9170337201',
];

const getRandomPhone = () =>
  SAMPLE_PHONES[Math.floor(Math.random() * SAMPLE_PHONES.length)];

const openDialer = (phone = getRandomPhone()) => {
  const digits = String(phone).replace(/[^\d+]/g, '');
  if (!digits) {
    return;
  }
  Linking.openURL(`tel:${digits}`).catch(() => {});
};

/**
 * Chats tab — Posted / Received chat list → Chat Details.
 */
const AgentMessagesScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('posted');
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);

  const chats = useMemo(
    () => mockChats.filter(item => item.tab === tab),
    [tab],
  );

  const openChat = chat => {
    const parent = navigation.getParent?.();
    if (parent) {
      parent.navigate(ROUTES.CHAT, {chatId: chat.id});
      return;
    }
    navigation.navigate(ROUTES.CHAT, {chatId: chat.id});
  };

  const handleHelpPress = () => {
    setHelpMenuOpen(prev => !prev);
  };

  const handleHelpCall = () => {
    setHelpMenuOpen(false);
    openDialer();
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      {helpMenuOpen ? (
        <TouchableOpacity
          style={styles.helpBackdrop}
          activeOpacity={1}
          onPress={() => setHelpMenuOpen(false)}
        />
      ) : null}

      <View style={[styles.header, helpMenuOpen && styles.headerRaised]}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>Chats</Text>
        <View style={styles.helpWrap}>
          <TouchableOpacity
            style={styles.helpBtn}
            activeOpacity={0.85}
            onPress={handleHelpPress}
            accessibilityRole="button"
            accessibilityLabel="Help">
            <Text style={styles.helpText}>Help</Text>
            <Text style={styles.helpIcon}>🎧</Text>
          </TouchableOpacity>
          {helpMenuOpen ? (
            <View style={styles.helpPopup}>
              <TouchableOpacity
                style={styles.helpPopupItem}
                activeOpacity={0.85}
                onPress={handleHelpCall}
                accessibilityRole="button"
                accessibilityLabel="Call support">
                <View style={styles.helpPopupCallBadge}>
                  <Text style={styles.helpPopupCallIcon}>📞</Text>
                </View>
                <Text style={styles.helpPopupText}>Call</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.segment}>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'posted' && styles.segBtnOn]}
          onPress={() => setTab('posted')}>
          <Text style={[styles.segText, tab === 'posted' && styles.segTextOn]}>
            Posted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'received' && styles.segBtnOn]}
          onPress={() => setTab('received')}>
          <Text
            style={[styles.segText, tab === 'received' && styles.segTextOn]}>
            Received
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          chats.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No Chats Found</Text>
          </View>
        }
        renderItem={({item}) => (
          <ChatListCard
            contactName={item.contactName}
            avatarInitials={item.avatarInitials}
            lastMessage={item.lastMessage}
            lastMessageAt={item.lastMessageAt}
            unreadCount={item.unreadCount}
            from={item.booking?.from}
            to={item.booking?.to}
            amount={item.booking?.amount}
            status={item.booking?.status}
            onPress={() => openChat(item)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  headerRaised: {
    zIndex: 30,
  },
  headerSpacer: {
    width: 72,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
  },
  helpWrap: {
    position: 'relative',
    zIndex: 30,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEFF3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  helpText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textNavy,
    marginRight: 4,
  },
  helpIcon: {
    fontSize: 12,
  },
  helpBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
  },
  helpPopup: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: -10,
    minWidth: 128,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    shadowColor: Colors.secondaryDark,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 40,
  },
  helpPopupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  helpPopupCallBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  helpPopupCallIcon: {
    fontSize: 12,
  },
  helpPopupText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textNavy,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 4,
    marginBottom: Spacing.md,
  },
  segBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnOn: {
    backgroundColor: Colors.primary,
  },
  segText: {
    fontWeight: '700',
    color: Colors.textNavy,
    fontSize: 13,
  },
  segTextOn: {
    color: Colors.onPrimary,
  },
  list: {
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
});

export default AgentMessagesScreen;
