import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {ScreenHeader} from '../../components/common';
import {
  APP_NAME,
  ROLE_LABELS,
  USER_ROLES,
} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {setRole} from '../../redux/slices/authSlice';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const ROLES = [
  {
    key: USER_ROLES.AGENT,
    title: ROLE_LABELS[USER_ROLES.AGENT],
    description: 'Post trip requirements and manage corporate bookings.',
    color: Colors.roleAgent,
  },
  {
    key: USER_ROLES.DRIVER,
    title: ROLE_LABELS[USER_ROLES.DRIVER],
    description: 'Discover open jobs and accept suitable trips.',
    color: Colors.roleDriver,
  },
  {
    key: USER_ROLES.OWNER,
    title: ROLE_LABELS[USER_ROLES.OWNER],
    description: 'Manage fleet, drivers, and incoming agent requests.',
    color: Colors.roleOwner,
  },
];

const RoleSelectScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const onSelect = role => {
    dispatch(setRole(role));
    navigation.navigate(ROUTES.LOGIN, {role});
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Choose your role"
        subtitle={`Continue as a ${APP_NAME} partner`}
      />
      <View style={styles.content}>
        {ROLES.map(role => (
          <Pressable
            key={role.key}
            onPress={() => onSelect(role.key)}
            style={({pressed}) => [
              styles.card,
              pressed && styles.cardPressed,
              {borderLeftColor: role.color},
            ]}>
            <Text style={[styles.cardTitle, {color: role.color}]}>
              {role.title}
            </Text>
            <Text style={styles.cardBody}>{role.description}</Text>
          </Pressable>
        ))}
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
    padding: Spacing.screenPadding,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Dimensions.borderRadius.lg,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    ...Dimensions.shadow.soft,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceAlt,
  },
  cardTitle: {
    ...Typography.h4,
  },
  cardBody: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});

export default RoleSelectScreen;
