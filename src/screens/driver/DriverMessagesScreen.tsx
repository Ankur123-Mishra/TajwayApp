import React from 'react';
import {StyleSheet, View} from 'react-native';
import {EmptyState, ScreenHeader} from '../../components/common';
import {Colors} from '../../theme';

/**
 * Driver messages — placeholder until chat is wired.
 */
const DriverMessagesScreen = () => {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Messages"
        subtitle="Chats with agents"
        showBack={false}
      />
      <EmptyState
        title="No messages yet"
        description="Conversations with agents will appear here after you express interest or accept a trip."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default DriverMessagesScreen;
