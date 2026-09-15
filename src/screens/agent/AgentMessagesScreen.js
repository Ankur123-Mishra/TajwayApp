import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Spacing} from '../../theme';

/**
 * Chat tab placeholder.
 */
const AgentMessagesScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop: insets.top + 24}]}>
      <Text style={styles.title}>Chat</Text>
      <Text style={styles.sub}>No conversations yet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textNavy,
  },
  sub: {
    marginTop: Spacing.xl,
    color: Colors.textMuted,
  },
});

export default AgentMessagesScreen;
