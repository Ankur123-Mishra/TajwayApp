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

const OwnerHomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useAuth();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Fleet Owner"
        subtitle={user?.company || 'Fleet operations'}
      />
      <View style={styles.content}>
        <AppCard style={styles.card}>
          <CardTitle>Welcome, {user?.name || 'Owner'}</CardTitle>
          <CardSubtitle>
            Oversee vehicles, assign drivers, and respond to agent demand. Fleet
            tools arrive in upcoming phases.
          </CardSubtitle>
        </AppCard>
        <EmptyState
          title="Fleet overview coming soon"
          description="Owner dashboards for vehicles, drivers, and requests are planned next."
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

export default OwnerHomeScreen;
