import React, {useMemo, useState} from 'react';
import {
  FlatList,
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

/**
 * Chats tab — Posted / Received chat list → Chat Details.
 */
const AgentMessagesScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('posted');

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

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>Chats</Text>
        <TouchableOpacity style={styles.helpBtn} activeOpacity={0.85}>
          <Text style={styles.helpText}>Help</Text>
          <Text style={styles.helpIcon}>🎧</Text>
        </TouchableOpacity>
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
    color: Colors.textInverse,
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
