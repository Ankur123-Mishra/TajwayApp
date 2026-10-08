import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  AppButton,
  AppCard,
  CardSubtitle,
  CardTitle,
  EmptyState,
  ScreenHeader,
} from '../../components/common';
import {ROUTES} from '../../constants/Routes';
import {useAuth} from '../../hooks';
import {logout} from '../../redux/slices/authSlice';
import {Colors, Spacing} from '../../theme';

const DriverHomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useAuth();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Driver Hub"
        subtitle="Available jobs & active trips"
      />
      <View style={styles.content}>
        <AppCard style={styles.card}>
          <CardTitle>Hello, {user?.name || 'Driver'}</CardTitle>
          <CardSubtitle>
            Browse open agent requests and manage accepted trips. Job lists will
            be wired in a later phase.
          </CardSubtitle>
        </AppCard>
        <EmptyState
          title="No active jobs"
          description="Driver job feed and earnings screens are scaffolded next."
        />
        <AppButton
          title="Sign out"
          variant="outline"
          onPress={() => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{name: ROUTES.WELCOME}],
            });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.screenPadding,
  },
  card: {
    marginBottom: Spacing.base,
  },
});

export default DriverHomeScreen;
