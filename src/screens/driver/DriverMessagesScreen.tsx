import React from 'react';
import {View} from 'react-native';
import {EmptyState, ScreenHeader} from '../../components/common';
import {Colors} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

/**
 * Driver messages — placeholder until chat is wired.
 */
const DriverMessagesScreen = () => {
  const styles = useResponsiveStyles(baseStyles);
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

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
};

export default DriverMessagesScreen;
